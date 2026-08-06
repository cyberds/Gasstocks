/* gs-scene — Gasstocks 3D world, built as a photoreal site model.

   One continuous site: open sea -> LNG carrier at anchorage -> feeder/supply
   vessel -> trailing suction dredger -> product jetty with loading arms ->
   accommodation modules -> onshore tank farm -> access roads. Scroll dollies a
   camera through it; the final stop lifts the model apart into a labelled
   capability diagram.

   Realism comes from four things: a generated sky used both as background and
   as the environment map (so steel and water reflect something), a sun with
   shadows, a rippled reflective sea, and geometry with real-world colour
   separation — red boot topping, black topsides, white houses, safety-yellow
   machinery, concrete decks, asphalt roads.

   Each discipline still merges to ONE mesh per material bucket, the world is
   built across animation frames, and any GL failure falls back to the flat
   layout owned by [data-gs-flat]. */
(() => {
  if (window.customElements && customElements.get('gs-scene')) return;

  // three.js is vendored at web/vendor/ so the site has no third-party runtime
  // dependency; the CDN stays as a fallback for the case where the vendored
  // copy is missing from a deploy. Resolved against this script's own URL, not
  // the document's, so the page works from any route depth.
  const HERE = (document.currentScript && document.currentScript.src) || location.href;
  const SRC = window.GS_THREE_URL || new URL('../vendor/three.module.js', HERE).href;
  const SRC_FALLBACK = 'https://unpkg.com/three@0.160.0/build/three.module.js';
  const ACCENT = 0x28166f; // Gasstocks brand indigo
  const HAZE = 0xc6c6d8; // haze pulled toward the brand hue
  const YARD_Y = 9.6; // hire-yard pad level: clears the shore surface (4.7–9.1) across the footprint
  const KEYS = ['vessel', 'logistics', 'dredging', 'jetty', 'security', 'catering', 'civil', 'roads', 'leasing'];

  // camera keyframes: [posX,posY,posZ, targetX,targetY,targetZ]
  const CAM = [
    [-104, 40, 86, -86, 9, -9], // aimed off the carrier's beam: it frames right of the hero plate
    [-92, 12, 44, -60, 6, 2],
    [-81, 34, -87, -47, 2, -1], // solved to frame the whole dredger at NDC x -0.95..0.10, left of the copy
    [-26, 12, 44, -2, 7, 0],
    [40, 34, 82, 92, 8, 24], // takes in the terminal, the road corridor and the plant yard
    [184, 36, 80, 132, 10, 24], // three-quarter view down the bay rows: plant reads machine by machine
    [38, 148, 236, 40, 6, 10], // solved: all nine exploded anchors inside |ndc.x| < 0.86 down to 1.3 aspect
  ];
  const FOCUS = [['vessel'], ['vessel', 'logistics'], ['dredging'], ['jetty', 'security', 'catering'], ['civil', 'roads'], ['leasing'], null];

  const isFlat = () => document.documentElement.hasAttribute('data-gs-flat');
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smooth = (t) => t * t * (3 - 2 * t);
  // rAF, but never a dead end: a hidden or throttled tab suspends rAF, and the
  // build must still finish so the page is ready when it comes forward.
  const frame = () => new Promise((r) => {
    let done = false;
    const go = () => { if (!done) { done = true; r(); } };
    requestAnimationFrame(go);
    setTimeout(go, 120);
  });

  function glSupported() {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  class GsScene extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.style.cssText = 'position:absolute;inset:0;display:block;overflow:hidden';
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isFlat()) { this.fail('flat mode'); return; }
      if (!glSupported()) { this.fail('no webgl'); return; }
      import(SRC)
        .catch(() => import(SRC_FALLBACK))
        .then((T) => this.boot(T))
        .catch((e) => this.fail(e));
    }

    disconnectedCallback() {
      this.dead = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('scroll', this._onScroll, { capture: true });
      if (this.renderer) { try { this.renderer.dispose(); } catch (e) {} }
    }

    fail(why) {
      if (why) console.warn('[gs-scene] 3D unavailable —', why);
      this.dead = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      document.documentElement.setAttribute('data-gs-flat', '');
      this.innerHTML = '';
      if (this.renderer) { try { this.renderer.dispose(); } catch (e) {} }
    }

    async boot(THREE) {
      if (this.dead) return;
      this.T = THREE;
      this.setAttribute('data-booting', '');
      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true, alpha: false, preserveDrawingBuffer: true,
        });
      } catch (e) { this.fail(e); return; }

      const renderer = this.renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(renderer.domElement);

      try {
        const scene = new THREE.Scene();
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera(38, 1, 0.8, 1400);
        this.target = new THREE.Vector3();
        this.groups = {};

        this.buildTextures();
        this.buildSky();
        this.buildMaterials();

        scene.fog = new THREE.Fog(HAZE, 150, 640);
        scene.add(new THREE.HemisphereLight(0xdfeaf4, 0x6b7a80, 0.75));
        const sun = new THREE.DirectionalLight(0xfff2e0, 2.4);
        sun.position.set(132, 148, -96);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        const sc = sun.shadow.camera;
        sc.left = -170; sc.right = 170; sc.top = 130; sc.bottom = -130;
        sc.near = 20; sc.far = 480;
        sc.updateProjectionMatrix();
        sun.shadow.bias = -0.0005;
        sun.shadow.normalBias = 0.05;
        sun.target.position.set(10, 2, 0);
        scene.add(sun.target);
        scene.add(sun);
        const bounce = new THREE.DirectionalLight(0xbcd4e6, 0.5);
        bounce.position.set(-110, 40, 95);
        scene.add(bounce);

        const steps = [
          () => this.buildWater(), () => this.buildLand(), () => this.buildVessel(),
          () => this.buildLogistics(), () => this.buildDredging(), () => this.buildJetty(),
          () => this.buildSecurity(), () => this.buildCatering(), () => this.buildCivil(),
          () => this.buildRoads(), () => this.buildLeasing(), () => this.buildDredgeAction(), () => this.buildCrew(), () => this.buildLeaders(),
        ];
        // Build on a generous time slice: the per-frame yield, not the geometry,
        // was the cost — a 14ms budget spent most of the build waiting on rAF.
        let mark = performance.now();
        for (const s of steps) {
          if (this.dead) return;
          s();
          if (performance.now() - mark > 110) { await frame(); mark = performance.now(); }
        }
      } catch (e) { this.fail(e); return; }

      this.stop = 0; this.progress = 0; this.orbit = 0; this.orbitV = 0;
      this.px = 0; this.py = 0; this.hover = null;
      this.scroller = document.querySelector('[data-gs-scroller]');
      this.panels = Array.from(document.querySelectorAll('[data-gs-panel]')).map((el) => ({
        el: el,
        idx: parseFloat(el.getAttribute('data-gs-panel')),
        hits: Array.from(el.querySelectorAll('[data-gs-hit]')),
      }));
      this.labels = {};
      KEYS.forEach((k) => { this.labels[k] = document.querySelector('[data-gs-node="' + k + '"]'); });
      this.wireLabels();

      this._onResize = () => this.resize();
      this._onScroll = () => { this.progress = this.readProgress(); };
      window.addEventListener('resize', this._onResize);
      window.addEventListener('scroll', this._onScroll, { passive: true, capture: true });
      window.addEventListener('pointermove', (e) => {
        this.px = e.clientX / window.innerWidth - 0.5;
        this.py = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
      this.addEventListener('pointerdown', (e) => { this.drag = e.clientX; });
      this.addEventListener('pointermove', (e) => {
        if (this.drag == null) return;
        this.orbitV += (e.clientX - this.drag) * 0.00035;
        this.drag = e.clientX;
      });
      const end = () => { this.drag = null; };
      this.addEventListener('pointerup', end);
      this.addEventListener('pointerleave', end);

      if (isFlat()) { this.fail(); return; }
      this.resize();
      this.progress = this.readProgress();
      this.t0 = performance.now();
      this.loop();
      this.setAttribute('data-ready', '');
    }

    /* ---------- generated maps: no asset fetches ---------- */
    tex(w, h, draw, rx, ry, srgb) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      const t = new this.T.CanvasTexture(c);
      t.wrapS = t.wrapT = this.T.RepeatWrapping;
      t.repeat.set(rx || 1, ry || 1);
      t.anisotropy = 4;
      if (srgb !== false) t.colorSpace = this.T.SRGBColorSpace;
      return t;
    }
    grain(ctx, w, h, amt) {
      const img = ctx.getImageData(0, 0, w, h), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * amt;
        d[i] += n; d[i + 1] += n; d[i + 2] += n;
      }
      ctx.putImageData(img, 0, 0);
    }
    buildTextures() {
      // painted steel plate: seams, weld lines, brush direction, rivet rows
      this.texSteel = this.tex(256, 256, (c, w, h) => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 700; i++) {
          c.strokeStyle = 'rgba(0,0,0,' + (Math.random() * 0.05) + ')';
          const x = Math.random() * w;
          c.beginPath(); c.moveTo(x, Math.random() * h); c.lineTo(x + (Math.random() - 0.5) * 3, Math.random() * h); c.stroke();
        }
        c.strokeStyle = 'rgba(0,0,0,0.13)'; c.lineWidth = 2;
        for (const y of [0, 128]) { c.beginPath(); c.moveTo(0, y + 1); c.lineTo(w, y + 1); c.stroke(); }
        for (const x of [0, 128]) { c.beginPath(); c.moveTo(x + 1, 0); c.lineTo(x + 1, h); c.stroke(); }
        c.fillStyle = 'rgba(0,0,0,0.12)';
        for (const y of [10, 118, 138, 246]) for (let x = 10; x < w; x += 18) { c.beginPath(); c.arc(x, y, 1.5, 0, 7); c.fill(); }
        this.grain(c, w, h, 12);
      });
      // concrete: shutter boards, blotching, aggregate
      this.texConc = this.tex(256, 256, (c, w, h) => {
        c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 70; i++) {
          c.fillStyle = 'rgba(0,0,0,' + (Math.random() * 0.06) + ')';
          c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 14 + Math.random() * 60, 0, 7); c.fill();
        }
        c.strokeStyle = 'rgba(0,0,0,0.11)'; c.lineWidth = 1.6;
        for (let y = 0; y < h; y += 34) { c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(w, y + 0.5); c.stroke(); }
        c.fillStyle = 'rgba(0,0,0,0.13)';
        for (let i = 0; i < 2600; i++) { c.beginPath(); c.arc(Math.random() * w, Math.random() * h, Math.random() * 1.1, 0, 7); c.fill(); }
        this.grain(c, w, h, 16);
      });
      // made ground / dredged sand, with plant tracks
      this.texSand = this.tex(256, 256, (c, w, h) => {
        c.fillStyle = '#b9ae98'; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 60; i++) {
          c.fillStyle = 'rgba(' + (150 + Math.random() * 40 | 0) + ',' + (140 + Math.random() * 40 | 0) + ',110,' + (Math.random() * 0.45) + ')';
          c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 14 + Math.random() * 54, 0, 7); c.fill();
        }
        this.grain(c, w, h, 26);
      }, 26, 26);
      // Sea surface relief. Pure sine trains tile as a visible waffle, so the
      // height field is tileable value noise (wrapping lattice, several octaves)
      // domain-warped by a lower octave of itself — no straight crests, no
      // readable period. Two copies of the map are sampled at very different
      // scales and scroll speeds: a long swell and fine chop.
      const waveHeight = (w, h) => {
        const rnd = (() => { let s = 20260801; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
        const lat = (n) => { const a = new Float32Array(n * n); for (let i = 0; i < a.length; i++) a[i] = rnd(); return a; };
        const L = {}; [4, 8, 16, 32, 64].forEach((n) => { L[n] = lat(n); });
        const sm = (t) => t * t * (3 - 2 * t);
        const val = (n, u, v) => {
          const g = L[n], fx = u * n, fy = v * n;
          const x0 = Math.floor(fx) % n, y0 = Math.floor(fy) % n;
          const x1 = (x0 + 1) % n, y1 = (y0 + 1) % n;
          const tx = sm(fx - Math.floor(fx)), ty = sm(fy - Math.floor(fy));
          const a = g[y0 * n + x0], b = g[y0 * n + x1], c2 = g[y1 * n + x0], d2 = g[y1 * n + x1];
          return (a + (b - a) * tx) + ((c2 + (d2 - c2) * tx) - (a + (b - a) * tx)) * ty;
        };
        const H = new Float32Array(w * h);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const u = x / w, v = y / h;
          const wu = u + (val(4, u, v) - 0.5) * 0.28, wv = v + (val(4, v, u) - 0.5) * 0.28;
          H[y * w + x] = val(8, wu, wv) * 0.5 + val(16, wu, wv) * 0.27 +
            val(32, wu, wv) * 0.15 + val(64, u, v) * 0.08;
        }
        return H;
      };
      const toNormal = (H, w, h, k) => (c) => {
        const img = c.createImageData(w, h), d = img.data;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const dx = H[y * w + ((x + 1) % w)] - H[y * w + ((x - 1 + w) % w)];
          const dy = H[((y + 1) % h) * w + x] - H[((y - 1 + h) % h) * w + x];
          let nx = -dx * k, ny = -dy * k, nz = 1;
          const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
          d[i] = (nx * 0.5 + 0.5) * 255; d[i + 1] = (ny * 0.5 + 0.5) * 255;
          d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
        }
        c.putImageData(img, 0, 0);
      };
      const HF = waveHeight(256, 256);
      this.texWaveN = this.tex(256, 256, toNormal(HF, 256, 256, 26), 4.5, 4.5, false);
      this.texWaveB = this.tex(256, 256, toNormal(HF, 256, 256, 40), 19, 19, false);
    }

    // A painted sky: it is the background AND, through PMREM, the environment
    // every metal surface reflects.
    buildSky() {
      const T = this.T;
      const sky = this.tex(1024, 512, (c, w, h) => {
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#2f6ea6');
        g.addColorStop(0.34, '#6fa2c9');
        g.addColorStop(0.5, '#cfdce6');
        g.addColorStop(0.52, '#8fa4b0');
        g.addColorStop(1, '#4f5b62');
        c.fillStyle = g; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 70; i++) {
          const x = Math.random() * w, y = Math.random() * h * 0.4;
          const r = 18 + Math.random() * 66;
          const rg = c.createRadialGradient(x, y, 0, x, y, r);
          rg.addColorStop(0, 'rgba(255,255,255,' + (0.35 + Math.random() * 0.4) + ')');
          rg.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = rg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        }
      }, 1, 1);
      sky.mapping = T.EquirectangularReflectionMapping;
      this.scene.background = sky;
      try {
        const pm = new T.PMREMGenerator(this.renderer);
        this.scene.environment = pm.fromEquirectangular(sky).texture;
        pm.dispose();
      } catch (e) { this.scene.environment = sky; }
    }

    buildMaterials() {
      const T = this.T, S = this.texSteel, C = this.texConc;
      const std = (o) => () => new T.MeshStandardMaterial(o);
      this.lib = {
        boot: std({ color: 0x7d2a1e, roughness: 0.62, metalness: 0.2, map: S, envMapIntensity: 0.6 }),
        topside: std({ color: 0x1a1f25, roughness: 0.46, metalness: 0.4, map: S, envMapIntensity: 0.9 }),
        white: std({ color: 0xd8dbd9, roughness: 0.48, metalness: 0.14, map: S, envMapIntensity: 0.7 }),
        tank: std({ color: 0xe4e7e6, roughness: 0.36, metalness: 0.3, map: S, envMapIntensity: 1.0 }),
        steel: std({ color: 0x99a2aa, roughness: 0.38, metalness: 0.82, map: S, envMapIntensity: 1.1 }),
        dark: std({ color: 0x2a3036, roughness: 0.55, metalness: 0.55, map: S }),
        yellow: std({ color: 0xc59318, roughness: 0.5, metalness: 0.28, map: S }),
        orange: std({ color: 0xb2551b, roughness: 0.58, metalness: 0.18, map: S }),
        glass: std({ color: 0x16232b, roughness: 0.08, metalness: 0.9, envMapIntensity: 1.4 }),
        concrete: std({ color: 0xa6a49f, roughness: 0.94, metalness: 0.03, map: C }),
        asphalt: std({ color: 0x34373a, roughness: 0.82, metalness: 0.02, map: C }),
        paint: std({ color: 0xe9e8e2, roughness: 0.6, metalness: 0.05 }),
        rubber: std({ color: 0x141618, roughness: 0.95, metalness: 0.02 }),
        deckcoat: std({ color: 0x46584f, roughness: 0.78, metalness: 0.1, map: S }),
        rust: std({ color: 0x76472e, roughness: 0.92, metalness: 0.15, map: S }),
        rope: std({ color: 0x4a4842, roughness: 0.96, metalness: 0.04, map: S }),
        sandpile: std({ color: 0x9c8b6b, roughness: 0.99, metalness: 0.02, map: this.texSand }),
        boxA: std({ color: 0x8b3a2b, roughness: 0.62, metalness: 0.22, map: S }),
        boxB: std({ color: 0x24506b, roughness: 0.62, metalness: 0.22, map: S }),
        boxC: std({ color: 0x3d6b4c, roughness: 0.62, metalness: 0.22, map: S }),
      };
    }

    /* ---------- model building ---------- */
    mk(key, x, z, labelY) {
      const THREE = this.T;
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.userData = {
        key: key, buckets: {}, rig: [],
        mats: [],
        rigMat: new THREE.LineBasicMaterial({ color: 0x3c444c, transparent: true, opacity: 0.5 }),
        base: new THREE.Vector3(x, 0, z),
        label: new THREE.Vector3(0, labelY || 8, 0),
        lit: 0,
      };
      this.scene.add(g);
      this.groups[key] = g;
      this._g = g;
      this.use('steel');
      return g;
    }
    use(name) {
      const b = this._g.userData.buckets;
      if (!b[name]) b[name] = { pos: [], nor: [], uv: [] };
      this._b = b[name];
      return this;
    }
    bake(geo) {
      const g = geo.index ? geo.toNonIndexed() : geo;
      const p = g.attributes.position.array, n = g.attributes.normal.array;
      const P = this._b.pos, N = this._b.nor, U = this._b.uv;
      for (let i = 0; i < p.length; i++) { P.push(p[i]); N.push(n[i]); }
      const S = 0.16; // box projection: texture from the two axes the face faces across
      for (let i = 0; i < p.length; i += 3) {
        const ax = Math.abs(n[i]), ay = Math.abs(n[i + 1]), az = Math.abs(n[i + 2]);
        if (ax >= ay && ax >= az) U.push(p[i + 2] * S, p[i + 1] * S);
        else if (ay >= az) U.push(p[i] * S, p[i + 2] * S);
        else U.push(p[i] * S, p[i + 1] * S);
      }
      if (g !== geo) g.dispose();
      geo.dispose();
    }
    box(w, h, d, x, y, z, ry, rz) {
      const b = new this.T.BoxGeometry(w, h, d);
      if (rz) b.rotateZ(rz);
      if (ry) b.rotateY(ry);
      b.translate(x, y, z); this.bake(b);
    }
    cyl(r, h, x, y, z, seg, rz, rx, r2) {
      const c = new this.T.CylinderGeometry(r, r2 == null ? r : r2, h, seg || 10, 1);
      if (rz) c.rotateZ(rz);
      if (rx) c.rotateX(rx);
      c.translate(x, y, z); this.bake(c);
    }
    cone(r, h, x, y, z, seg) {
      const c = new this.T.ConeGeometry(r, h, seg || 16);
      c.translate(x, y, z); this.bake(c);
    }
    sphere(r, x, y, z, seg) {
      const s = new this.T.SphereGeometry(r, seg || 18, (seg || 18) / 2);
      s.translate(x, y, z); this.bake(s);
    }
    dome(r, x, y, z) {
      const s = new this.T.SphereGeometry(r, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      s.translate(x, y, z); this.bake(s);
    }
    ring(R, r, x, y, z) {
      const t = new this.T.TorusGeometry(R, r, 6, 20);
      t.rotateX(Math.PI / 2); t.translate(x, y, z); this.bake(t);
    }
    poly(pts) {
      const S = this._g.userData.rig;
      for (let i = 0; i < pts.length - 1; i++) {
        S.push(pts[i][0], pts[i][1], pts[i][2], pts[i + 1][0], pts[i + 1][1], pts[i + 1][2]);
      }
    }
    /* One straight cylinder between two arbitrary points. Solves the two
       rotations cyl() applies (rotateZ then rotateX) for the direction, so
       booms, braces and rope segments meet their neighbours exactly. */
    tube(p, q, r, seg) {
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      const L = Math.hypot(dx, dy, dz);
      if (L < 1e-4) return;
      const u = clamp(dx / L, -1, 1);
      const h = Math.sqrt(Math.max(1e-6, 1 - u * u));
      this.cyl(r, L, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2,
        seg || 5, -Math.asin(u), Math.atan2(dz / L / h, dy / L / h));
    }
    /* A rope with real body and real sag: short cylinders along a catenary,
       spheres at the joints so the run never breaks. Wires used to be single
       hairlines, which read as ink scratches rather than rigging. */
    cable(a, b, sag, r, segs) {
      const n = segs || 7, S = sag || 0, rr = r || 0.08;
      const at = (t) => [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t - Math.sin(Math.PI * t) * S,
        a[2] + (b[2] - a[2]) * t,
      ];
      const prev = this._b;
      this.use('rope');
      for (let i = 0; i < n; i++) this.tube(at(i / n), at((i + 1) / n), rr, 5);
      for (let i = 1; i < n; i++) { const p = at(i / n); this.sphere(rr * 1.05, p[0], p[1], p[2], 6); }
      this._b = prev;
    }
    // stanchions + two wire rails: what makes a deck read as a deck
    railing(x0, z0, x1, z1, y, h) {
      const n = Math.max(2, Math.round(Math.hypot(x1 - x0, z1 - z0) / 3));
      const prev = this._b;
      this.use('steel');
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        this.cyl(0.09, h, x0 + (x1 - x0) * t, y + h / 2, z0 + (z1 - z0) * t, 5);
      }
      this._b = prev;
      for (const f of [0.5, 1]) this.poly([[x0, y + h * f, z0], [x1, y + h * f, z1]]);
    }
    stair(x, z, y0, y1, len, ry) {
      const prev = this._b;
      this.use('steel');
      const dy = y1 - y0, a = Math.atan2(dy, len);
      this.box(Math.hypot(len, dy), 0.35, 1.5, x, (y0 + y1) / 2, z, ry, a);
      this._b = prev;
      const cs = Math.cos(ry || 0), sn = Math.sin(ry || 0);
      this.poly([[x - (len / 2) * cs, y0 + 1.1, z + (len / 2) * sn], [x + (len / 2) * cs, y1 + 1.1, z - (len / 2) * sn]]);
    }
    hull(len, beam, depth, bowFrac) {
      const THREE = this.T, bf = bowFrac == null ? 0.3 : bowFrac;
      const s = new THREE.Shape();
      s.moveTo(-len * 0.5, -beam * 0.38);
      s.quadraticCurveTo(-len * 0.5 - 1, 0, -len * 0.5, beam * 0.38);
      s.lineTo(-len * 0.34, beam * 0.5);
      s.lineTo(len * bf, beam * 0.5);
      s.quadraticCurveTo(len * 0.46, beam * 0.34, len * 0.5, 0);
      s.quadraticCurveTo(len * 0.46, -beam * 0.34, len * bf, -beam * 0.5);
      s.lineTo(-len * 0.34, -beam * 0.5);
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, curveSegments: 4 });
      g.rotateX(-Math.PI / 2);
      return g;
    }
    // red boot topping below the line, dark topsides above, coated deck on top
    shipBody(len, beam, draft, freeboard) {
      this.use('boot');
      const a = this.hull(len, beam, draft + 0.3, 0.3); a.translate(0, -draft, 0); this.bake(a);
      this.use('topside');
      const b = this.hull(len, beam, freeboard, 0.3); b.translate(0, 0.2, 0); this.bake(b);
      this.use('deckcoat');
      this.box(len * 0.96, 0.3, beam * 0.94, 0, freeboard + 0.3, 0);
    }
    windows(w, h, d, x, y, z, rows, ry) {
      this.use('glass');
      for (let i = 0; i < rows; i++) {
        this.box(w, h, d, x, y + i * (h * 2.6), z, ry);
      }
    }
    finish(g) {
      const THREE = this.T, u = g.userData;
      Object.keys(u.buckets).forEach((name) => {
        const b = u.buckets[name];
        if (!b.pos.length) return;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(b.pos), 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(b.nor), 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(b.uv), 2));
        const mat = (this.lib[name] || this.lib.steel)();
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = true; m.receiveShadow = true;
        g.add(m);
        u.mats.push(mat);
      });
      if (u.rig.length) {
        const rg = new THREE.BufferGeometry();
        rg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(u.rig), 3));
        g.add(new THREE.LineSegments(rg, u.rigMat));
      }
      u.buckets = null; u.rig = null;
    }

    /* ---------- sea and shore ---------- */
    buildWater() {
      const THREE = this.T;
      const geo = new THREE.PlaneGeometry(560, 460, 90, 74);
      geo.rotateX(-Math.PI / 2);
      geo.translate(-120, 0, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x1d3c4e, roughness: 0.14, metalness: 0.36,
        normalMap: this.texWaveN, bumpMap: this.texWaveB, bumpScale: 0.09,
        envMapIntensity: 1.2, flatShading: false,
      });
      mat.normalScale.set(0.42, 0.42);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.water = {
        mat: mat, attr: geo.attributes.position,
        base: Float32Array.from(geo.attributes.position.array),
      };
    }

    buildLand() {
      const THREE = this.T;
      const geo = new THREE.PlaneGeometry(300, 460, 60, 60);
      geo.rotateX(-Math.PI / 2);
      geo.translate(150, 0, 0);
      const a = geo.attributes.position;
      for (let i = 0; i < a.count; i++) {
        const x = a.getX(i), z = a.getZ(i);
        const base = Math.min(6, Math.max(-2.2, (x - 22) * 0.36));
        a.setY(i, base + (base > 4 ? Math.sin(x * 0.05) * 1.4 + Math.cos(z * 0.043) * 1.8 : 0));
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        map: this.texSand, color: 0xffffff, roughness: 0.96, metalness: 0,
      }));
      m.receiveShadow = true;
      this.scene.add(m);

      // distant headland so the horizon is not an empty line
      const h = new THREE.PlaneGeometry(420, 40, 40, 1);
      const ha = h.attributes.position;
      for (let i = 0; i < ha.count; i++) if (ha.getY(i) > 0) ha.setY(i, 10 + Math.sin(ha.getX(i) * 0.06) * 7 + Math.cos(ha.getX(i) * 0.021) * 6);
      h.computeVertexNormals();
      const hm = new THREE.Mesh(h, new THREE.MeshStandardMaterial({ color: 0x6d7c82, roughness: 1, metalness: 0 }));
      hm.position.set(-140, 0, -215);
      this.scene.add(hm);
    }

    /* ---------- 01 · LNG carrier at anchorage ---------- */
    buildVessel() {
      const g = this.mk('vessel', -62, 4, 26);
      this.shipBody(52, 15, 5.2, 7.4);
      const D = 7.7; // deck level

      // four Moss-type spherical cargo tanks in their skirts
      for (const x of [-13, -2.5, 8, 18]) {
        this.use('tank'); this.sphere(4.6, x, D + 4.4, 0, 20);
        this.use('steel'); this.cyl(4.1, 3.2, x, D + 1.4, 0, 18);
        this.use('white'); this.ring(4.7, 0.22, x, D + 4.2, 0);
        this.use('steel'); this.cyl(0.4, 1.6, x, D + 9.6, 0, 8);
        this.poly([[x, D + 9, -4.4], [x, D + 9, 4.4]]);
      }
      // trunk deck walkway and pipe crossover
      this.use('steel');
      this.box(46, 0.5, 2.4, 1, D + 0.6, 0);
      for (const dz of [-1.1, 1.1]) this.cyl(0.42, 44, 1, D + 1.4, dz * 3.4, 8, Math.PI / 2);
      this.use('yellow');
      this.box(3.2, 3.4, 5.6, -19.5, D + 2, 0); // manifold house
      for (const dz of [-4.6, 4.6]) this.cyl(0.5, 3.4, -19.5, D + 3.4, dz, 8, 0, Math.PI / 2);

      // accommodation block aft, five decks, bridge wings, funnel, mast
      this.use('white');
      this.box(9, 10.5, 12.5, -21.5, D + 5.2, 0);
      this.box(13.5, 2.6, 13.4, -21.5, D + 11.6, 0); // bridge
      this.windows(0.4, 0.7, 12.6, -26.1, D + 3.4, 0, 4);
      this.use('glass');
      this.box(0.4, 1.5, 13.2, -28.3, D + 11.7, 0);
      this.box(13.6, 1.5, 0.4, -21.5, D + 11.7, 6.7);
      this.use('white');
      this.box(2.6, 4.6, 5, -15.6, D + 14.6, 0); // funnel casing
      this.use('topside'); this.box(2.8, 1.2, 5.2, -15.6, D + 17.2, 0);
      this.use('steel');
      this.cyl(0.28, 8, -21.5, D + 17, 0, 6);
      this.cyl(1.5, 0.2, -21.5, D + 20.4, 0, 12);
      this.use('orange');
      for (const dz of [-6.9, 6.9]) { this.box(4.2, 1.5, 1.8, -20, D + 8.6, dz); this.cyl(0.9, 4.2, -20, D + 8.6, dz, 10, Math.PI / 2); }
      this.poly([[-21.5, D + 21, 0], [-21.5, D + 25, 0]]);
      this.cable([-21.5, D + 24, 0], [-14, D + 18, 0], 0.6, 0.07);
      this.cable([-21.5, D + 24, 0], [8, D + 11.6, 0], 1.9, 0.07);

      // forecastle, windlasses, anchor and cable
      this.use('white'); this.box(6, 2.6, 11, 22, D + 1.6, 0);
      this.use('steel');
      for (const dz of [-3, 3]) this.cyl(0.7, 2.2, 21, D + 4.2, dz, 10, Math.PI / 2);
      this.cyl(0.22, 5, 24.5, D + 4, 0, 6);
      this.use('dark'); this.box(1.4, 2, 0.9, 26.2, -1.4, 3.4);
      this.cable([25.8, D + 1, 3.4], [26.4, -1.4, 3.4], 0.2, 0.15, 5); // anchor cable
      // railings along both sides and the bow
      this.railing(-26, -7.2, 24, -7.2, D + 0.4, 1.15);
      this.railing(-26, 7.2, 24, 7.2, D + 0.4, 1.15);
      this.railing(24, -7.2, 26, 0, D + 3, 1.15);
      this.finish(g);
    }

    /* ---------- 02 · feeder / offshore supply vessel ---------- */
    buildLogistics() {
      // Container feeder: aft house, full-length cell-guided bays, a real stack
      // of boxes above deck. The stow is what makes "marine transport" legible.
      const g = this.mk('logistics', -30, 64, 22); // clear of every CAM keyframe (z 56–72)
      this.shipBody(46, 15, 5, 6.6);
      const D = 6.9;
      this.use('deckcoat'); this.box(43, 0.3, 13.6, 1, D + 0.2, 0);

      // cell guides: the vertical steel the stacks sit between
      this.use('steel');
      for (let b = 0; b < 5; b++) {
        const bx = -8 + b * 8;
        for (const dz of [-6.2, 6.2]) {
          this.box(0.45, 5.5, 0.45, bx - 3.2, D + 3, dz);
          this.box(0.45, 5.5, 0.45, bx + 3.2, D + 3, dz);
        }
        this.box(7.4, 0.4, 13, bx, D + 0.5, 0); // hatch cover
      }
      // the stow itself: three tiers, four rows across, staggered heights
      const paint = ['boxA', 'boxB', 'boxC'];
      for (let b = 0; b < 5; b++) {
        const bx = -8 + b * 8;
        const tiers = [3, 3, 2, 3, 2][b];
        for (let t = 0; t < tiers; t++) for (let r = 0; r < 4; r++) {
          this.use(paint[(b + t + r) % 3]);
          this.box(6.1, 2.5, 2.45, bx, D + 2 + t * 2.62, -4.1 + r * 2.72);
        }
      }
      // deck stow forward of the house, lashing bridge between bays
      this.use('steel');
      this.box(0.4, 4.4, 13.4, -12.4, D + 2.6, 0);
      this.box(0.4, 4.4, 13.4, 12.4, D + 2.6, 0);

      // house and machinery casing aft
      this.use('white');
      this.box(8, 11, 13.4, -17.5, D + 5.7, 0);
      this.box(11.5, 2.4, 14.2, -17.5, D + 12.4, 0);
      this.windows(0.35, 0.65, 13.5, -21.6, D + 3.4, 0, 4);
      this.use('glass');
      this.box(0.4, 1.4, 14, -23.3, D + 12.5, 0);
      this.box(11.6, 1.4, 0.4, -17.5, D + 12.5, 7.1);
      this.use('white'); this.box(3, 5, 5.4, -13.4, D + 14.6, 0);
      this.use('topside'); this.box(3.2, 1.2, 5.6, -13.4, D + 17.4, 0);
      this.use('orange');
      for (const dz of [-7.4, 7.4]) { this.box(4, 1.5, 1.8, -16.5, D + 9.2, dz); this.cyl(0.9, 4, -16.5, D + 9.2, dz, 10, Math.PI / 2); }
      this.use('steel');
      this.cyl(0.26, 8, -17.5, D + 17.8, 0, 6);
      this.cyl(1.3, 0.18, -17.5, D + 21.2, 0, 12);
      this.poly([[-17.5, D + 21.8, 0], [-17.5, D + 25, 0]]);
      this.cable([-17.5, D + 24.4, 0], [17, D + 10.6, 0], 2.1, 0.07);
      // forecastle and gantry-style mast forward
      this.use('white'); this.box(5.5, 2.6, 11.5, 19.5, D + 1.6, 0);
      this.use('steel');
      for (const dz of [-3, 3]) this.cyl(0.7, 2.2, 18.5, D + 4.2, dz, 10, Math.PI / 2);
      this.cyl(0.22, 6, 22, D + 4.4, 0, 6);
      this.use('dark'); this.box(1.3, 1.9, 0.85, 23.4, -1.3, 3.6);
      this.cable([23.1, D + 1, 3.6], [23.5, -1.2, 3.6], 0.18, 0.14, 5);
      this.railing(-21, -7.4, 22, -7.4, D + 0.4, 1.1);
      this.railing(-21, 7.4, 22, 7.4, D + 0.4, 1.1);
      this.finish(g);
    }

    /* ---------- 03 · trailing suction hopper dredger ---------- */
    buildDredging() {
      const g = this.mk('dredging', -36, -18, 17);
      this.shipBody(34, 13, 4.4, 5.4);
      const D = 5.7;
      this.use('white');
      this.box(7.5, 8, 11, -11, D + 4.2, 0);
      this.box(9, 2.2, 11.4, -11, D + 9.3, 0);
      this.windows(0.35, 0.65, 11.1, -14.8, D + 2.8, 0, 3);
      this.use('glass'); this.box(0.4, 1.3, 11.2, -15.6, D + 9.4, 0);
      // hopper: raised coamings with an open, spoil-filled well
      this.use('steel');
      for (const dz of [-4.6, 4.6]) this.box(22, 2.6, 0.7, 5, D + 1.3, dz);
      this.box(0.7, 2.6, 9.9, -6, D + 1.3, 0);
      this.box(0.7, 2.6, 9.9, 16, D + 1.3, 0);
      this.use('rust'); this.box(21, 0.5, 8.6, 5, D + 1.4, 0);
      // Suction ladder: gantry davit, an unbroken pipe run from the deck pump
      // down through the surface, and a draghead on the bottom. Every segment
      // meets the next, so it reads as one machine rather than floating tubes.
      this.use('steel');
      this.cyl(1.4, 3.4, 6, D + 2.4, 8.4, 14);          // suction pump housing
      this.box(3.6, 2.2, 3.6, 6, D + 4.6, 8.4);
      this.use('yellow');
      this.cyl(0.95, 7.5, 9.4, D + 3.2, 8.4, 14, Math.PI * 0.42);  // deck run
      this.cyl(0.95, 22, 15.6, -3.4, 8.4, 14, Math.PI * 0.34);      // ladder into the water
      this.use('dark');
      this.box(4.2, 1.5, 3.6, 21.6, -12.4, 8.4, 0, Math.PI * 0.34); // draghead on the bed
      this.box(4.6, 0.5, 3.9, 21.9, -13.2, 8.4);
      this.use('steel');
      this.cyl(0.55, 12, 4, D + 6.2, 8.4, 8);           // davit A-frame
      this.cyl(0.55, 12, 12, D + 6.2, 8.4, 8);
      this.box(9.6, 0.9, 1.4, 8, D + 12.2, 8.4);
      this.cable([8, D + 12.1, 8.4], [13.8, 0.8, 8.4], 0.4, 0.11); // hoist wire to the ladder
      this.cable([4, D + 12.1, 8.4], [9.4, D + 4, 8.4], 0.3, 0.11);
      // discharge line: leaves the hopper, lands on shore — never mid-air
      this.use('yellow');
      this.cyl(0.85, 12, 20, D + 2.4, -4, 12, Math.PI / 2);
      this.cyl(0.85, 9, 27, D - 1.2, -4, 12, Math.PI * 0.36);
      this.use('steel'); this.box(1.6, 2.6, 1.6, 21.5, D + 0.6, -4);
      this.railing(-16, -6.7, 17, -6.7, D + 0.3, 1.05);
      this.railing(-16, 6.7, 8, 6.7, D + 0.3, 1.05);
      this.finish(g);
    }

    /* ---------- 04 · product jetty, loading arms, mooring dolphins ---------- */
    buildJetty() {
      const g = this.mk('jetty', -2, 0, 26);
      const T = 7.2; // deck top
      this.use('concrete');
      this.box(52, 1.6, 15, 0, T - 0.8, 0);
      for (let i = 0; i < 11; i++) {
        const x = -25 + i * 5;
        for (const z of [-6, 0, 6]) this.cyl(0.85, 20, x, -3, z, 10);
      }
      // fendering along the berthing face
      this.use('rubber');
      for (let i = 0; i < 9; i++) {
        const fx = -22 + i * 5.5;
        this.cyl(0.9, 2.4, fx, 3.9, -8, 10, 0, Math.PI / 2);
        const prev = this._b;
        this.use('steel'); this.box(0.7, 4.4, 2.4, fx, 4.6, -7.2); // bracket back to the deck edge
        this._b = prev;
      }
      // breasting and mooring dolphins with catwalks back to the deck
      for (const z of [-24, -16, 16, 24]) {
        this.use('concrete');
        this.box(7, 1.4, 7, -8, T - 0.7, z);
        for (const dx of [-2, 2]) for (const dz of [-2, 2]) this.cyl(0.6, 19, -8 + dx, -2.6, z + dz, 8);
        this.use('steel');
        for (const dz2 of [-1, 1]) this.box(1.6, 0.4, 0.4, -10.9, 4.6, z + dz2);
        this.box(0.5, 3.4, 2.6, -11.2, 5, z);
        this.use('rubber'); this.cyl(0.85, 2.2, -11.9, 4, z, 10, Math.PI / 2);
        this.use('steel');
        for (const dx of [-1.5, 1.5]) this.cyl(0.4, 0.9, -8 + dx, T + 0.4, z, 8);
        const near = z > 0 ? 7.5 : -7.5, far = z > 0 ? z - 3.5 : z + 3.5;
        this.box(1.6, 0.3, Math.abs(far - near), -8, T + 0.1, (near + far) / 2);
        this.railing(-8.8, near, -8.8, far, T + 0.25, 1.05);
        this.railing(-7.2, near, -7.2, far, T + 0.25, 1.05);
        // hawsers made up on the bollards: coiled down, tails to the deck ring
        this.use('rope');
        this.ring(0.82, 0.15, -9.5, T + 0.12, z);
        this.cable([-9.5, T + 0.3, z], [-8 - 1.5, T + 0.85, z], 0.22, 0.11, 5);
        this.cable([-8 + 1.5, T + 0.85, z], [-8 - 1.5, T + 0.85, z], 0.5, 0.11, 6);
      }
      // Marine loading arms, built joint to joint so they read as one machine:
      // base riser on the deck, swivel, inboard leg up, elbow, outboard leg
      // reaching over the berth, then the vertical drop and coupler. A short
      // cylinder is placed at every hinge so no two legs meet in thin air.
      const armLeg = (x0, y0, z0, x1, y1, z1, r) => {
        const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
        const len = Math.hypot(dx, dy, dz);
        const geo = new this.T.CylinderGeometry(r, r, len, 12, 1);
        const q = new this.T.Quaternion().setFromUnitVectors(
          new this.T.Vector3(0, 1, 0), new this.T.Vector3(dx, dy, dz).normalize());
        const m = new this.T.Matrix4().compose(
          new this.T.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), q, new this.T.Vector3(1, 1, 1));
        geo.applyMatrix4(m);
        this.bake(geo);
      };
      for (const x of [-14, -6, 2]) {
        this.use('steel');
        this.cyl(1.9, 4.4, x, T + 2.2, 2, 16);            // pedestal
        this.cyl(1.35, 2.2, x, T + 5.4, 2, 16);           // slewing swivel
        this.use('yellow');
        const A = [x, T + 6.2, 2];                        // base joint
        const B = [x - 1.2, T + 17.4, 0.4];               // knuckle at the top
        const C = [x - 5.4, T + 14.2, -6.6];              // outboard elbow
        const Dp = [x - 5.4, T + 9.6, -6.6];              // drop to the coupler
        armLeg(A[0], A[1], A[2], B[0], B[1], B[2], 0.62);
        armLeg(B[0], B[1], B[2], C[0], C[1], C[2], 0.55);
        armLeg(C[0], C[1], C[2], Dp[0], Dp[1], Dp[2], 0.48);
        this.use('steel');
        this.sphere(0.85, A[0], A[1], A[2], 12);
        this.sphere(0.8, B[0], B[1], B[2], 12);
        this.sphere(0.72, C[0], C[1], C[2], 12);
        this.use('dark');
        this.cyl(0.78, 1.4, Dp[0], Dp[1] - 0.8, Dp[2], 12); // coupler flange
        // counterweight and its tie back to the knuckle
        this.use('dark'); this.box(1.8, 1.8, 1.8, x + 2.4, T + 15.4, 3.6);
        this.poly([[x + 2.4, T + 15.4, 3.6], [B[0], B[1], B[2]]]);
        this.poly([[A[0], A[1] + 1, A[2]], [x + 2.4, T + 15.4, 3.6]]);
      }
      // pipe rack carrying product ashore, control room, lighting masts
      this.use('concrete');
      this.box(22, 1.3, 8, 35, T - 0.7, 0);
      for (let i = 0; i < 5; i++) this.cyl(0.7, 16, 26 + i * 5, -0.5, 0, 8);
      this.use('steel');
      for (const dz of [-2.2, 0, 2.2]) this.cyl(0.55, 62, 22, T + 1.2, dz, 10, Math.PI / 2);
      for (let i = 0; i < 7; i++) { const x = -6 + i * 9; this.box(0.4, 2.4, 6, x, T + 1.4, 0); this.box(6.4, 0.4, 0.4, x, T + 2.5, 0, Math.PI / 2); }
      this.use('white');
      this.box(7, 3.6, 6, 14, T + 1.8, 4.2);
      this.use('glass'); this.box(0.3, 1.1, 5, 10.4, T + 2.6, 4.2);
      for (const x of [-20, 8]) {
        this.use('steel'); this.cyl(0.4, 22, x, T + 11, 5.6, 8);
        this.use('dark'); this.box(2.6, 0.5, 1.2, x, T + 22.2, 5.6);
      }
      this.railing(-26, 7.4, 20, 7.4, T + 0.1, 1.1);
      this.railing(-26, -7.4, -12, -7.4, T + 0.1, 1.1);
      this.finish(g);
    }

    /* ---------- 05 · patrol boat and marked exclusion zone ---------- */
    buildSecurity() {
      const g = this.mk('security', -40, 34, 12);
      this.shipBody(17, 5.6, 2.2, 2.8);
      const D = 3;
      this.use('white');
      this.box(4.4, 3, 4.6, -1.5, D + 1.5, 0);
      this.box(5.4, 1.4, 5, -1.5, D + 3.6, 0);
      this.use('glass'); this.box(0.3, 0.9, 4.6, -3.8, D + 3.6, 0);
      this.use('steel');
      this.cyl(0.16, 5, -1.5, D + 6.6, 0, 6);
      this.box(1.6, 0.3, 0.5, -1.5, D + 9.2, 0);
      this.use('orange'); this.box(2.4, 0.9, 1.2, 4.4, D + 1.2, 0);
      this.use('dark'); this.box(1.2, 0.7, 1.2, -1.5, D + 4.6, 1.6);
      this.poly([[-1.5, D + 9, 0], [4.5, D + 3, 0]]);
      this.railing(-6, -2.9, 6, -2.9, D + 0.2, 0.85);
      this.railing(-6, 2.9, 6, 2.9, D + 0.2, 0.85);
      this.finish(g);
    }

    /* ---------- 06 · accommodation modules ---------- */
    buildCatering() {
      const g = this.mk('catering', 8, -18, 14);
      const T = 6.9;
      this.use('concrete');
      this.box(13, 1.2, 24, 0, T - 0.6, 0);
      for (const z of [-10, 0, 10]) for (const x of [-4.5, 4.5]) this.cyl(0.6, 15, x, -0.6, z, 8);
      // two storeys of cabin modules with window strips and a canteen block
      for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
        this.use('white');
        this.box(9.4, 3.3, 6.8, 0, T + 1.7 + i * 3.5, -7.6 + j * 7.6);
        this.use('glass');
        this.box(0.3, 0.85, 5.4, -4.8, T + 2 + i * 3.5, -7.6 + j * 7.6);
        this.box(0.3, 0.85, 5.4, 4.8, T + 2 + i * 3.5, -7.6 + j * 7.6);
        this.use('steel');
        this.box(9.6, 0.22, 7, 0, T + 3.45 + i * 3.5, -7.6 + j * 7.6);
      }
      this.use('steel');
      this.box(2, 0.3, 23, 6.2, T + 3.5, 0); // upper walkway
      this.box(1.4, 0.35, 12, 0, T + 7.2, 0);  // roof gantry, bearing on the module tops
      this.railing(5.3, -11.5, 5.3, 11.5, T + 3.6, 1.05);
      this.railing(7.1, -11.5, 7.1, 11.5, T + 3.6, 1.05);
      this.stair(8.6, 11.6, T + 0.6, T + 3.7, 5.2, Math.PI / 2);
      this.use('white'); this.box(2.4, 10.4, 2.4, -5.6, T + 5.8, 11.4); // stair tower off the platform
      // roof plant
      this.use('steel');
      for (const z of [-7, 0, 7]) { this.box(2.6, 1.1, 2, -2, T + 7.5, z); this.cyl(0.9, 0.4, 2.4, T + 7.2, z, 12); }
      this.use('white'); this.cyl(0.9, 5, 4.6, T + 9.4, -10, 10); // vent stack off the roof
      this.finish(g);
    }

    /* ---------- 07 · tank farm, pipe rack, flare ---------- */
    buildCivil() {
      const g = this.mk('civil', 58, 6, 30);
      const y = 5;
      for (let i = 0; i < 3; i++) {
        const cx = -15 + i * 19;
        this.use('tank');
        this.cyl(7.4, 12, cx, y + 6, 0, 28);
        this.cone(7.6, 2.6, cx, y + 13.3, 0, 28);
        this.use('steel');
        for (const yy of [4.5, 9]) this.ring(7.55, 0.17, cx, y + yy, 0);
        this.cyl(0.5, 1.8, cx, y + 15.2, 0, 10);
        // spiral stair wrapping the shell, and roof handrail
        for (let s = 0; s < 12; s++) {
          const a = s * 0.42, r = 8.1;
          this.box(2.1, 0.22, 1.4, cx + Math.cos(a) * r, y + 1 + s, Math.sin(a) * r, -a);
        }
        this.poly([[cx + 8.1, y + 13.4, 0], [cx + 8.1 * Math.cos(5), y + 13.4, 8.1 * Math.sin(5)]]);
        this.use('concrete');
        for (const [bx, bz, bw, bd] of [[cx, -11, 22, 0.8], [cx, 11, 22, 0.8], [cx - 11, 0, 0.8, 22], [cx + 11, 0, 0.8, 22]])
          this.box(bw, 2.2, bd, bx, y + 1.1, bz);
        // manifold and pumps at the bund edge
        this.use('yellow');
        this.cyl(0.45, 12, cx, y + 2.6, -12.5, 8, Math.PI / 2);
        this.use('steel'); this.box(2.4, 1.6, 1.4, cx + 3, y + 1.4, -13.4);
      }
      // pipe rack on trestles, running back to the jetty line
      this.use('steel');
      for (const dz of [-1.6, 0, 1.6]) this.cyl(0.5, 74, -12, y + 8.4, -25 + dz * 1.2, 10, Math.PI / 2);
      for (let i = 0; i < 8; i++) {
        const x = -44 + i * 10;
        this.box(0.7, 8, 0.7, x, y + 4, -27.6);
        this.box(0.7, 8, 0.7, x, y + 4, -22.4);
        this.box(0.7, 0.7, 6, x, y + 8, -25);
      }
      // process building
      this.use('white'); this.box(20, 8, 13, 6, y + 4, -40);
      this.use('steel'); this.box(20.4, 0.4, 13.4, 6, y + 8.2, -40);
      this.use('glass'); this.box(19, 1.2, 0.3, 6, y + 5.6, -46.6);
      this.use('steel');
      for (const x of [-2, 6, 14]) this.cyl(0.9, 9, x, y + 12.6, -40, 12);
      // flare stack with tip and guy wires
      this.use('steel');
      this.cyl(0.9, 38, 30, y + 19, -34, 12);
      for (let s = 0; s < 9; s++) this.ring(1.5, 0.1, 30, y + 4 + s * 4, -34);
      this.use('rust'); this.cyl(1.3, 3, 30, y + 39.5, -34, 12);
      this.use('orange'); this.cone(1.1, 3.4, 30, y + 42.4, -34, 10);
      for (const [gx, gz] of [[46, -34], [16, -34], [30, -20]]) this.cable([30, y + 33.4, -34], [gx, y + 0.5, gz], 2.4, 0.09, 8);
      this.finish(g);
    }

    /* ---------- 08 · access roads and haulage ---------- */
    buildRoads() {
      const g = this.mk('roads', 46, 46, 12);
      const y0 = 5.2, N = 24;
      let prev = null;
      for (let i = 0; i <= N; i++) {
        const t = i / N, x = -13 + t * 78, z = Math.sin(t * 2.2) * 17;
        if (prev) {
          const dx = x - prev[0], dz = z - prev[1];
          const len = Math.hypot(dx, dz), ry = -Math.atan2(dz, dx);
          const mx = (x + prev[0]) / 2, mz = (z + prev[1]) / 2;
          this.use('asphalt'); this.box(len + 0.5, 0.5, 11, mx, y0, mz, ry);
          this.use('sand' in this.lib ? 'sand' : 'concrete'); this.box(len + 0.5, 3.6, 17, mx, y0 - 2.1, mz, ry);
          this.use('paint');
          this.box(len * 0.55, 0.06, 0.45, mx, y0 + 0.28, mz, ry);
          for (const sd of [-1, 1]) this.box(len + 0.5, 0.06, 0.28,
            mx - Math.sin(ry) * sd * 5, y0 + 0.28, mz - Math.cos(ry) * sd * 5, ry); // edge lines
          // guardrail on the seaward shoulder
          if (i % 2 === 0) {
            this.use('steel');
            this.box(0.3, 1.1, 0.3, mx - Math.sin(ry) * 5.9, y0 + 0.8, mz - Math.cos(ry) * 5.9, ry);
            this.box(len + 1, 0.35, 0.16, mx - Math.sin(ry) * 5.9, y0 + 1.25, mz - Math.cos(ry) * 5.9, ry);
          }
        }
        prev = [x, z];
      }
      // roundabout apron at the tank-farm end
      this.use('asphalt'); this.cyl(9, 0.5, -6, y0, 6, 26);
      this.use('concrete'); this.cyl(3.4, 0.9, -6, y0 + 0.4, 6, 20);
      // road tanker: cab, barrel, wheels — the scale reference
      const tx = 34, tz = Math.sin((47 / 78) * 2.2) * 17, ry = -0.35;
      this.use('white'); this.box(3.4, 3, 2.6, tx, y0 + 2.1, tz, ry);
      this.use('glass'); this.box(0.3, 1.1, 2.2, tx - 1.6, y0 + 2.8, tz - 0.6, ry);
      this.use('dark'); this.box(11, 0.7, 2.4, tx + 4.6, y0 + 1.1, tz + 1.6, ry);
      this.use('steel'); this.cyl(1.5, 9.5, tx + 5.4, y0 + 2.6, tz + 1.9, 16, Math.PI / 2, 0);
      this.use('rubber');
      for (const [ox, oz] of [[-0.6, -1.3], [-0.6, 1.3], [5, -1.1], [5, 1.5], [7.4, -1.1], [7.4, 1.5]])
        this.cyl(0.85, 0.6, tx + ox, y0 + 0.85, tz + oz, 12, 0, Math.PI / 2);
      // lighting columns
      for (let i = 0; i < 5; i++) {
        const t = 0.1 + i * 0.2, x = -13 + t * 78, z = Math.sin(t * 2.2) * 17 + 7.4;
        this.use('steel'); this.cyl(0.28, 12, x, y0 + 6, z, 8);
        this.use('dark'); this.box(2, 0.4, 0.9, x - 0.9, y0 + 12.1, z);
      }
      this.finish(g);
    }

    /* ---------- crew ----------
       Figures at work on the plant: hard hat, hi-vis, swinging arms. They are
       separate meshes (not merged into the discipline shell) so they can move,
       and children of their discipline group so they ride the exploded view. */
    person(g, x, y, z, ry, kind, opt) {
      const T = this.T, P = this.pm, o = opt || {};
      const G = this.pg; // one set of geometries shared by every figure
      const grp = new T.Group();
      grp.position.set(x, y, z);
      grp.rotation.y = ry || 0;
      const add = (geo, mat, px, py, pz, parent) => {
        const m = new T.Mesh(geo, mat);
        m.position.set(px, py, pz); m.castShadow = true;
        (parent || grp).add(m);
        return m;
      };
      const vest = o.vest === 'y' ? P.vestY : P.vest;
      add(G.legs, P.trous, 0, 0.43, 0);
      add(G.torso, vest, 0, 1.16, 0);
      add(G.head, P.skin, 0, 1.57, 0);
      add(G.hat, P.hat, 0, 1.58, 0);
      add(G.brim, P.hat, 0, 1.58, 0);
      const arms = [];
      for (const sd of [-1, 1]) {
        const a = new T.Group();
        a.position.set(sd * 0.33, 1.4, 0);
        grp.add(a);
        add(G.arm, vest, 0, -0.31, 0, a);
        arms.push(a);
      }
      const c = {
        grp: grp, arms: arms, kind: kind, base: grp.position.clone(),
        face: ry || 0, phase: Math.random() * 6.28, speed: o.speed || 1, to: o.to,
      };
      if (kind === 'weld') {
        const spark = new T.Mesh(G.spark, this.pm.arc);
        spark.position.set(0.34, 0.72, 0.42);
        grp.add(spark);
        c.spark = spark;
      }
      g.add(grp);
      this.crew.push(c);
      return c;
    }
    /* Visible dredging: silty water around the draghead, a spoil mound rising
       in the hopper, and an overflow jet at the side — the action, not the kit. */
    buildDredgeAction() {
      const T = this.T, g = this.groups.dredging;
      if (!g) return;
      const silt = new T.MeshStandardMaterial({
        color: 0x9c8b6a, roughness: 1, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false,
      });
      this.dredge = { blobs: [], jets: [] };
      // turbid plume boiling up where the draghead works
      for (let i = 0; i < 9; i++) {
        const m = new T.Mesh(new T.SphereGeometry(1, 10, 8), silt);
        m.position.set(20 + (Math.random() - 0.5) * 7, 0.15, 8.4 + (Math.random() - 0.5) * 7);
        m.scale.set(2.6, 0.18, 2.6);
        g.add(m);
        this.dredge.blobs.push({ m: m, ph: Math.random() * 6.28, r: 2 + Math.random() * 2.6 });
      }
      // spoil rising in the hopper well
      const load = new T.Mesh(new T.BoxGeometry(20.6, 2.4, 8.4),
        new T.MeshStandardMaterial({ color: 0x7d6a4c, roughness: 1, metalness: 0 }));
      load.position.set(5, 6.9, 0);
      load.castShadow = false; load.receiveShadow = true;
      g.add(load);
      this.dredge.load = load;
      // overflow / rainbow jet off the discharge line
      const jetMat = new T.MeshStandardMaterial({
        color: 0xa89577, roughness: 0.85, metalness: 0, transparent: true, opacity: 0.75,
      });
      for (let i = 0; i < 14; i++) {
        const m = new T.Mesh(new T.SphereGeometry(0.55, 8, 6), jetMat);
        g.add(m);
        this.dredge.jets.push({ m: m, t: i / 14 });
      }
    }
    animateDredge(t) {
      const d = this.dredge;
      if (!d) return;
      for (const b of d.blobs) {
        const p = t * 0.6 + b.ph;
        const k = (p % 1);
        b.m.scale.set(b.r * (0.6 + k * 1.5), 0.16, b.r * (0.6 + k * 1.5));
        b.m.material.opacity = 0.5 * (1 - k);
        b.m.position.y = 0.14 + k * 0.3;
      }
      const fill = 0.5 + 0.5 * Math.sin(t * 0.16); // hopper loads and empties
      d.load.scale.y = 0.35 + fill * 1.15;
      d.load.position.y = 6.05 + (0.35 + fill * 1.15) * 1.2;
      // ballistic arc from the discharge nozzle to the water
      for (const j of d.jets) {
        const u = (j.t + t * 0.42) % 1;
        const x = 30 + u * 16, y = 4.4 + u * 5 - u * u * 11.5, z = -4 - u * 2.5;
        j.m.position.set(x, Math.max(0.3, y), z);
        j.m.scale.setScalar(0.7 + u * 1.5);
        j.m.visible = y > 0.2;
      }
    }

    buildCrew() {
      const T = this.T;
      this.pm = {
        vest: new T.MeshStandardMaterial({ color: 0xd0641a, roughness: 0.78, metalness: 0.02 }),
        vestY: new T.MeshStandardMaterial({ color: 0xc7b21c, roughness: 0.78, metalness: 0.02 }),
        trous: new T.MeshStandardMaterial({ color: 0x2b3440, roughness: 0.86, metalness: 0.02 }),
        skin: new T.MeshStandardMaterial({ color: 0x8b6144, roughness: 0.82, metalness: 0 }),
        hat: new T.MeshStandardMaterial({ color: 0xe4e6e3, roughness: 0.46, metalness: 0.05 }),
        arc: new T.MeshStandardMaterial({ color: 0xdff0ff, emissive: 0x9fd8ff, emissiveIntensity: 4, roughness: 1 }),
      };
      this.pg = {
        legs: new T.BoxGeometry(0.42, 0.86, 0.3),
        torso: new T.BoxGeometry(0.52, 0.64, 0.34),
        arm: new T.BoxGeometry(0.14, 0.62, 0.14),
        head: new T.SphereGeometry(0.13, 10, 8),
        hat: new T.SphereGeometry(0.18, 12, 6, 0, 6.3, 0, 1.57),
        brim: new T.CylinderGeometry(0.26, 0.26, 0.04, 12),
        spark: new T.SphereGeometry(0.09, 8, 6),
      };
      this.crew = [];
      const G = this.groups;
      this.person(G.vessel, -6, 8.1, 6.4, 0, 'walk', { to: [14, 6.4], speed: 0.9 });
      this.person(G.vessel, -17.6, 8.1, 3.2, -1.9, 'work', { vest: 'y', speed: 1.1 });
      this.person(G.logistics, 16.5, 7.3, 4.4, 2.4, 'wave', { speed: 1 });
      this.person(G.logistics, -12.4, 7.3, -5.6, 0.6, 'work', { vest: 'y', speed: 1.05 });
      this.person(G.dredging, 3.5, 6.1, 5.4, -1.2, 'work', { speed: 1.2 });
      this.person(G.dredging, -7, 6.1, -5.2, 1.4, 'walk', { to: [12, -5.2], speed: 0.7, vest: 'y' });
      this.person(G.jetty, -12.2, 7.2, 3.4, -0.7, 'weld', { speed: 1 });
      this.person(G.jetty, -22, 7.2, 5.6, 0, 'walk', { to: [12, 5.6], speed: 0.55, vest: 'y' });
      this.person(G.jetty, 11.4, 7.2, -3.4, 1.7, 'work', { speed: 0.9 });
      this.person(G.catering, 6.2, 10.6, -6, 1.57, 'walk', { to: [6.2, 8], speed: 0.5 });
      this.person(G.civil, -12, 6.1, -13.6, 0.4, 'work', { vest: 'y', speed: 1.15 });
      this.person(G.civil, 8, 5.1, -20, -1.57, 'walk', { to: [8, -6], speed: 0.6 });
      this.person(G.roads, 27, 5.55, 11, -1.2, 'wave', { vest: 'y', speed: 1.2 });
      this.person(G.leasing, 9, 9.7, -9, 1.4, 'work', { vest: 'y', speed: 1.1 });
      this.person(G.leasing, 8, 9.7, 11, -1.6, 'walk', { to: [8, -10], speed: 0.6 });
      this.person(G.leasing, -16, 9.7, -6, 0.3, 'weld', { speed: 1 });
    }
    animateCrew(t) {
      if (!this.crew) return;
      for (const c of this.crew) {
        const p = t * c.speed + c.phase;
        if (c.kind === 'walk') {
          const u = Math.sin(p * 0.55) * 0.5 + 0.5, sw = Math.sin(p * 5);
          c.grp.position.set(
            c.base.x + (c.to[0] - c.base.x) * u,
            c.base.y + Math.abs(sw) * 0.04,
            c.base.z + (c.to[1] - c.base.z) * u);
          c.grp.rotation.y = c.face + (Math.cos(p * 0.55) < 0 ? Math.PI : 0);
          c.arms[0].rotation.x = sw * 0.75;
          c.arms[1].rotation.x = -sw * 0.75;
        } else if (c.kind === 'wave') {
          c.arms[1].rotation.x = -2.3 + Math.sin(p * 3.2) * 0.55;
          c.arms[0].rotation.x = Math.sin(p * 1.1) * 0.14;
        } else if (c.kind === 'weld') {
          const f = Math.max(0, (Math.sin(p * 17) + Math.sin(p * 31.4)) * 0.5);
          c.arms[0].rotation.x = -1.3 + Math.sin(p * 2) * 0.1;
          c.arms[1].rotation.x = -1.05;
          c.spark.scale.setScalar(0.5 + f * 1.5);
          c.spark.material.emissiveIntensity = 1.5 + f * 9;
        } else {
          const sw = Math.sin(p * 2.4);
          c.arms[0].rotation.x = -0.95 + sw * 0.5;
          c.arms[1].rotation.x = -0.95 - sw * 0.5;
          c.grp.position.y = c.base.y + Math.abs(sw) * 0.035;
        }
      }
    }

    /* ---------- 09 · equipment leasing yard ----------
       A hire depot that reads as one: plant parked square in painted bays on two
       rows facing the gate, workshop, fuel point and office along the back fence,
       racking and aggregate at the east end. Each machine is assembled joint to
       joint in its own frame — undercarriage, house, boom, stick, bucket — with
       tube() solving every link, so no part of a machine floats free. */
    tracks(x, y, z, len, wide, ry) {
      this.use('dark');
      for (const sd of [-1, 1]) {
        const ox = -Math.sin(ry) * sd * wide, oz = -Math.cos(ry) * sd * wide;
        this.box(len, 1.5, 1.05, x + ox, y + 0.75, z + oz, ry);
        this.cyl(0.75, 1.1, x + ox - Math.cos(ry) * len * 0.42, y + 0.75,
          z + oz + Math.sin(ry) * len * 0.42, 12, 0, Math.PI / 2);
        this.cyl(0.75, 1.1, x + ox + Math.cos(ry) * len * 0.42, y + 0.75,
          z + oz - Math.sin(ry) * len * 0.42, 12, 0, Math.PI / 2);
        const prev = this._b;
        this.use('steel');
        for (let i = 0; i < 4; i++) {
          const t = -0.3 + i * 0.2;
          this.cyl(0.34, 1.15, x + ox + Math.cos(ry) * len * t, y + 0.5,
            z + oz - Math.sin(ry) * len * t, 8, 0, Math.PI / 2);
        }
        this._b = prev;
      }
    }
    wheels(x, y, z, list, r, ry) {
      this.use('rubber');
      for (const [ox, oz] of list) {
        this.cyl(r, r * 0.7, x + Math.cos(ry) * ox - Math.sin(ry) * oz, y + r,
          z - Math.sin(ry) * ox - Math.cos(ry) * oz, 12, 0, Math.PI / 2);
      }
    }
    /* every machine below faces +x, parked square to its bay */
    excavator(x, z, boomA, stickA) {
      const y = YARD_Y;
      this.tracks(x, y, z, 7.2, 1.8, 0);
      this.use('yellow');
      this.box(4.6, 0.85, 3.3, x, y + 1.9, z);
      this.cyl(1.75, 0.65, x, y + 2.6, z, 16);
      this.box(4.8, 2.2, 3.3, x - 1, y + 3.9, z);
      this.use('dark'); this.box(1.4, 2, 3.4, x - 3.5, y + 3.8, z);
      this.use('yellow'); this.box(2, 2.7, 1.75, x + 1.5, y + 4.2, z + 0.72);
      this.use('glass');
      this.box(0.24, 2.1, 1.55, x + 2.52, y + 4.35, z + 0.72);
      this.box(1.85, 2.1, 0.24, x + 1.5, y + 4.35, z + 1.62);
      this.use('dark'); this.box(2.3, 0.22, 2, x + 1.5, y + 5.65, z + 0.72);
      const L1 = 7.6, L2 = 5.4;
      const pv = [x + 2, y + 3.5, z - 0.8];
      const el = [pv[0] + Math.cos(boomA) * L1, pv[1] + Math.sin(boomA) * L1, pv[2]];
      const en = [el[0] + Math.cos(stickA) * L2, el[1] + Math.sin(stickA) * L2, el[2]];
      this.use('yellow');
      this.tube(pv, el, 0.55, 8);
      this.tube(el, en, 0.44, 8);
      this.sphere(0.62, pv[0], pv[1], pv[2], 10);
      this.sphere(0.56, el[0], el[1], el[2], 10);
      this.use('steel');
      this.tube([pv[0] - 1, pv[1] + 0.8, pv[2] + 0.6],
        [pv[0] + Math.cos(boomA) * L1 * 0.45, pv[1] + Math.sin(boomA) * L1 * 0.45 - 0.3, pv[2] + 0.6], 0.22, 6);
      this.tube([el[0] - Math.cos(boomA) * 2.3, el[1] - Math.sin(boomA) * 2.3 + 0.8, el[2] + 0.55],
        [el[0] + Math.cos(stickA) * L2 * 0.5, el[1] + Math.sin(stickA) * L2 * 0.5 + 0.25, el[2] + 0.55], 0.2, 6);
      // bucket, hung off the stick end and curled back under it
      const bd = stickA - 1.2;
      const bt = [en[0] + Math.cos(bd) * 1.7, en[1] + Math.sin(bd) * 1.7, en[2]];
      this.use('dark');
      this.tube(en, bt, 0.34, 6);
      this.box(2.1, 1.8, 2.1, bt[0] + 0.45, bt[1] - 0.25, bt[2], 0, 0.4);
      this.use('steel');
      this.box(1.5, 0.3, 2.15, bt[0] + 1.15, bt[1] - 1.1, bt[2], 0, 0.4);
    }
    tipper(x, z, tip) {
      const y = YARD_Y;
      this.use('dark'); this.box(12.4, 0.7, 2.6, x, y + 1.75, z);
      this.use('white');
      this.box(3.4, 3.2, 2.9, x - 4.2, y + 3.4, z);
      this.box(2.6, 1.3, 2.7, x - 6.3, y + 2.2, z);
      this.use('glass');
      this.box(0.26, 1.5, 2.5, x - 5.65, y + 4.2, z);
      this.box(3, 1.4, 0.26, x - 4.2, y + 4.1, z + 1.46);
      this.use('steel'); this.box(0.5, 2.5, 2.9, x - 2, y + 3.7, z);
      const hx = x + 5, hy = y + 2.4, L = 8.6, phi = tip ? 0.32 : 0;
      const cs = Math.cos(phi), sn = Math.sin(phi);
      const cx = hx - cs * L / 2, cy = hy + sn * L / 2;
      const off = (d) => [cx + sn * d, cy + cs * d];
      const bd = off(1.15);
      this.use('orange'); this.box(L, 2.3, 3.1, bd[0], bd[1], z, 0, -phi); // tipping body
      this.use('sandpile' in this.lib ? 'sandpile' : 'concrete');
      const lid = off(2.1);
      this.box(L * 0.9, 0.5, 2.6, lid[0], lid[1], z, 0, -phi);             // spoil heaped in the body
      this.use('steel'); this.cyl(0.5, 1, hx, hy, z, 10, 0, Math.PI / 2);  // tipping hinge
      const ram = off(-0.3);
      this.tube([x + 0.8, y + 2, z], [ram[0] - cs * 1.4, ram[1] - sn * 1.4, z], 0.3, 8);
      this.wheels(x, y, z, [[-4.2, -1.6], [-4.2, 1.6], [2.4, -1.7], [2.4, 1.7], [4.9, -1.7], [4.9, 1.7]], 1.15, 0);
      if (tip) { // the load coming out of the raised bed
        this.use('sandpile' in this.lib ? 'sandpile' : 'concrete');
        this.cone(3.4, 3, x + 7.6, y + 1.4, z, 14);
      }
    }
    dozer(x, z) {
      const y = YARD_Y;
      this.tracks(x, y, z, 7, 2.15, 0);
      this.use('yellow');
      this.box(4.6, 1.6, 3.4, x - 0.2, y + 2.4, z);
      this.box(2.3, 2.3, 2.7, x - 2.6, y + 3.7, z);
      this.use('glass'); this.box(0.24, 1.6, 2.4, x - 1.42, y + 4, z);
      this.use('dark'); this.box(2.7, 0.22, 3, x - 2.6, y + 5, z);
      this.use('steel');
      this.box(0.6, 3.4, 6.2, x + 4.7, y + 2, z);
      this.box(1.1, 0.5, 6.2, x + 4.3, y + 0.45, z);
      for (const s of [-1.95, 1.95]) {
        this.tube([x + 4.4, y + 1.2, z + s], [x - 1.6, y + 1.1, z + s * 1.05], 0.26, 6);
        this.tube([x + 4.4, y + 3.3, z + s * 0.62], [x + 0.4, y + 3, z + s * 0.95], 0.2, 6);
      }
      this.use('dark'); this.box(1.7, 1.5, 3, x - 4.2, y + 2.5, z);
    }
    roller(x, z) {
      const y = YARD_Y;
      this.use('steel');
      this.cyl(1.45, 3.4, x - 2.7, y + 1.45, z, 20, 0, Math.PI / 2);
      this.cyl(1.45, 3.4, x + 2.9, y + 1.45, z, 20, 0, Math.PI / 2);
      this.box(1.6, 0.5, 3.6, x - 2.7, y + 2.9, z);
      this.box(1.6, 0.5, 3.6, x + 2.9, y + 2.9, z);
      this.use('yellow');
      this.box(3.6, 1.2, 2.5, x, y + 2.2, z);
      this.box(2.8, 1.7, 2.9, x + 2.4, y + 2.9, z);
      this.box(1.8, 1.5, 2.3, x - 0.6, y + 3.3, z);
      this.use('dark');
      for (const ox of [-1.5, 0.6]) for (const oz of [-1.05, 1.05]) this.tube([x + ox, y + 3.6, z + oz], [x + ox * 0.94, y + 5.2, z + oz * 0.94], 0.12, 5);
      this.box(3, 0.22, 2.6, x - 0.45, y + 5.3, z);
    }
    forklift(x, z, lift) {
      const y = YARD_Y;
      this.use('orange');
      this.box(3.4, 1.8, 2.1, x - 0.4, y + 1.45, z);
      this.box(1.6, 1.6, 1.9, x - 1.3, y + 3.1, z);
      this.use('dark'); this.box(1.5, 1.2, 2, x - 2.5, y + 1.35, z);
      this.use('steel');
      for (const o of [-0.62, 0.62]) this.cyl(0.16, 5, x + 1.5, y + 2.9, z + o, 6);
      this.box(1.6, 0.22, 1.9, x + 1.5, y + 5.3, z);
      this.box(0.3, 1.3, 1.9, x + 1.68, y + 1.1 + lift, z);
      for (const o of [-0.55, 0.55]) this.box(1.8, 0.18, 0.3, x + 2.7, y + 0.5 + lift, z + o);
      this.use('orange'); this.box(2.1, 0.18, 2.1, x - 0.6, y + 4.4, z);
      this.use('steel');
      for (const [ox, oz] of [[0.55, -0.95], [0.55, 0.95], [-1.9, -0.9], [-1.9, 0.9]]) this.tube([x + ox, y + 3, z + oz], [x + ox * 0.9, y + 4.3, z + oz], 0.11, 5);
      this.wheels(x, y, z, [[1.2, -1], [1.2, 1], [-1.9, -0.85], [-1.9, 0.85]], 0.55, 0);
      if (lift > 0.8) { this.use('boxB'); this.box(1.7, 1.3, 2.1, x + 2.9, y + 1.3 + lift, z); }
    }
    /* crawler crane: lattice boom of real chords and bracing, A-frame pendants
       and a hoist rope with a block on it — returns the hook point so the
       caller can land a pick under it. */
    crawlerCrane(x, z, ang) {
      const y = YARD_Y;
      this.tracks(x, y, z, 9.6, 3, 0);
      this.use('yellow');
      this.box(4.6, 1, 5.6, x, y + 2.1, z);
      this.cyl(2.1, 0.7, x, y + 2.9, z, 18);
      this.box(7.2, 3.3, 4.6, x - 0.8, y + 4.9, z);
      this.use('glass'); this.box(0.26, 1.7, 1.8, x + 2.94, y + 5.1, z + 1.2);
      this.use('dark'); this.box(2.3, 2.2, 4.6, x - 4.6, y + 4.5, z);
      const fx = x + 3, fy = y + 4.4, L = 30;
      const tx = fx + Math.cos(ang) * L, ty = fy + Math.sin(ang) * L;
      this.use('steel');
      for (const s of [-1.05, 1.05]) {
        this.tube([fx, fy - 0.9, z + s], [tx, ty - 0.9, z + s], 0.19, 6);
        this.tube([fx, fy + 0.9, z + s], [tx, ty + 0.9, z + s], 0.19, 6);
      }
      for (let i = 0; i < 10; i++) {
        const t0 = i / 10, t1 = (i + 1) / 10;
        const ax = fx + (tx - fx) * t0, ay = fy + (ty - fy) * t0;
        const bx = fx + (tx - fx) * t1, by = fy + (ty - fy) * t1;
        for (const s of [-1.05, 1.05]) this.tube([ax, ay - 0.9, z + s], [bx, by + 0.9, z + s], 0.1, 5);
        this.tube([ax, ay + 0.9, z - 1.05], [bx, by + 0.9, z + 1.05], 0.1, 5);
        this.tube([ax, ay - 0.9, z - 1.05], [ax, ay + 0.9, z + 1.05], 0.09, 5);
      }
      const apex = [x - 0.6, y + 13, z];
      this.tube([x - 1.8, y + 6.4, z - 1.5], apex, 0.24, 6);
      this.tube([x - 1.8, y + 6.4, z + 1.5], apex, 0.24, 6);
      this.cable([apex[0], apex[1], z - 0.9], [tx, ty + 0.9, z - 0.9], 0.9, 0.15, 8);
      this.cable([apex[0], apex[1], z + 0.9], [tx, ty + 0.9, z + 0.9], 0.9, 0.15, 8);
      this.use('steel'); this.cyl(0.7, 0.55, tx, ty + 1.4, z, 12, 0, Math.PI / 2);
      const hy = y + 5.4;
      this.cable([tx, ty + 1.1, z - 0.32], [tx, hy + 1.4, z - 0.32], 0, 0.15, 4);
      this.cable([tx, ty + 1.1, z + 0.32], [tx, hy + 1.4, z + 0.32], 0, 0.15, 4);
      this.use('dark'); this.box(1, 1.7, 1.3, tx, hy + 0.7, z);
      this.use('steel'); this.ring(0.45, 0.14, tx, hy - 0.25, z);
      return [tx, hy];
    }
    buildLeasing() {
      const g = this.mk('leasing', 140, 24, 16); // inland of the road end and clear of the tank farm
      const y = YARD_Y;
      // graded hardstanding, painted bays, kerb along the fence line
      this.use('asphalt'); this.box(62, 10, 42, 0, y - 5, 0); // deep fill: meets the shore at the low corner
      this.use('concrete'); // kerb round the hardstanding
      for (const [kx, kz, kw, kd] of [[0, -21.4, 62, 0.8], [0, 21.4, 62, 0.8], [-30.6, 0, 0.8, 42], [30.6, 0, 0.8, 42]])
        this.box(kw, 0.5, kd, kx, y + 0.2, kz);
      this.use('paint');
      for (const bz of [-19.4, -9.4, 0.6, 10.6, 19]) {
        this.box(17, 0.06, 0.36, 15, y + 0.05, bz);
        this.box(15, 0.06, 0.36, 0, y + 0.05, bz);
      }
      this.box(0.36, 0.06, 38, 8, y + 0.05, 0);
      // perimeter fence: posts and two tube rails, gate leaves swung open
      this.use('steel');
      for (let i = 0; i <= 12; i++) {
        const px = -30 + i * 5;
        this.cyl(0.15, 3.2, px, y + 1.6, -20.6, 6);
        if (px < -6 || px > 6) this.cyl(0.15, 3.2, px, y + 1.6, 20.6, 6);
      }
      for (let i = 0; i <= 8; i++) {
        this.cyl(0.15, 3.2, -30, y + 1.6, -20.6 + i * 5.15, 6);
        this.cyl(0.15, 3.2, 30, y + 1.6, -20.6 + i * 5.15, 6);
      }
      for (const h of [1.15, 2.95]) {
        this.tube([-30, y + h, -20.6], [30, y + h, -20.6], 0.075, 5);
        this.tube([-30, y + h, -20.6], [-30, y + h, 20.6], 0.075, 5);
        this.tube([30, y + h, -20.6], [30, y + h, 20.6], 0.075, 5);
        this.tube([-30, y + h, 20.6], [-6, y + h, 20.6], 0.075, 5);
        this.tube([6, y + h, 20.6], [30, y + h, 20.6], 0.075, 5);
      }
      for (const s of [-1, 1]) {
        this.box(6.4, 2.7, 0.22, s * 8.2, y + 1.5, 19, s * 0.55);
        for (const t of [-0.45, 0.45]) this.cyl(0.13, 2.9, s * (8.2 + t * 6), y + 1.55, 19 - t * s * 3.2, 6);
      }
      // back of yard: workshop, fuel point in its bund, site office
      this.use('white'); this.box(12, 7, 16, -23, y + 3.5, -8);
      this.use('steel'); this.box(12.6, 0.5, 16.6, -23, y + 7.3, -8);
      this.use('dark'); this.box(0.35, 5, 7, -16.9, y + 2.5, -8);
      this.use('white'); this.box(7.4, 3.2, 4.6, -24.5, y + 1.7, 12.5);
      this.use('glass'); this.box(0.26, 1.2, 3.4, -20.7, y + 2.2, 12.5);
      this.use('dark'); this.box(0.9, 2.2, 0.3, -20.85, y + 1.2, 10.6);
      this.use('concrete');
      for (const [bx, bz, bw, bd] of [[-23, -0.6, 11, 0.6], [-23, 6.4, 11, 0.6], [-28.2, 2.9, 0.6, 7], [-17.8, 2.9, 0.6, 7]])
        this.box(bw, 0.9, bd, bx, y + 0.45, bz);
      this.use('tank'); this.cyl(2.1, 7, -23, y + 2.4, 2.9, 16, 0, Math.PI / 2);
      this.use('steel');
      for (const o of [-2.2, 2.2]) this.box(1.2, 1.5, 1.2, -23 + o, y + 0.75, 2.9);
      this.cyl(0.22, 2.6, -18.6, y + 1.3, 2.9, 8);
      this.cable([-18.6, y + 2.5, 2.9], [-17.4, y + 0.4, 3.6], 0.5, 0.12, 6);
      // east end: pallet racking and aggregate stockpiles
      this.use('steel');
      for (let i = 0; i < 4; i++) for (const rx of [-12, -8.4]) this.box(0.28, 5, 0.28, rx, y + 2.5, -18 + i * 3.6);
      for (const h of [2.1, 4.2]) for (const rx of [-12, -8.4]) this.box(0.28, 0.28, 11.2, rx, y + h, -12.6);
      for (const h of [2.25, 4.35]) for (let i = 0; i < 4; i++) this.box(4.1, 0.2, 0.36, -10.2, y + h, -18 + i * 3.6);
      this.use('boxB'); this.box(2.8, 1.2, 2, -10.2, y + 2.9, -16.2); this.box(2.8, 1.2, 2, -10.2, y + 5, -9);
      this.use('boxA'); this.box(2.8, 1.2, 2, -10.2, y + 2.9, -9); this.box(2.8, 1.2, 2, -10.2, y + 5, -12.6);
      this.use('sandpile' in this.lib ? 'sandpile' : 'concrete');
      this.cone(4.4, 4.2, 25, y + 2.1, -17, 16);
      this.cone(3, 2.8, 22, y + 1.4, 16, 14);
      // the fleet, parked square in its bays
      this.excavator(15, -14, 1.02, -1.45);
      this.excavator(15, -4.5, 0.72, -1.05);
      this.dozer(15, 5.5);
      this.roller(16, 15);
      this.tipper(0, -12.5, false);
      this.tipper(-1, -3.5, true);
      this.tipper(0, 5.5, false);
      this.forklift(-4, -13.5, 0.4);
      this.forklift(-5, 13, 2.4);
      const hk = this.crawlerCrane(-19, 17.5, 0.62);
      // the pick under the hook: concrete pipe sections, slung
      this.use('concrete');
      for (const [ox, oz] of [[-1.6, -1.5], [-1.6, 1.5], [1.6, -1.5], [1.6, 1.5]])
        this.cyl(1.5, 3.2, hk[0] + ox, y + 1.5, 17.5 + oz, 14, 0, Math.PI / 2);
      this.cyl(1.5, 3.2, hk[0], y + 4.1, 17.5, 14, 0, Math.PI / 2);
      this.use('steel');
      for (const oz of [-1.4, 1.4]) this.cable([hk[0], hk[1] - 0.3, 17.5], [hk[0] + oz * 0.6, y + 4.4, 17.5 + oz], 0.1, 0.09, 5);
      // lighting tower and drum store by the gate
      this.use('steel');
      this.cyl(0.4, 16, 3, y + 8, 18.5, 8);
      this.box(3.4, 0.4, 0.4, 3, y + 15.6, 18.5);
      this.use('paint'); for (const o of [-1.2, 1.2]) this.box(1, 0.7, 0.6, 3 + o, y + 15.2, 18.5);
      this.use('orange'); for (let i = 0; i < 6; i++) this.cyl(0.6, 1.6, 8 + (i % 3) * 1.4, y + 0.8, 17.4 + Math.floor(i / 3) * 1.4, 12);
      this.finish(g);
    }

    buildLeaders() {
      const THREE = this.T;
      this.leaderMat = new THREE.LineBasicMaterial({ color: 0x0f1418, transparent: true, opacity: 0 });
      const geo = new THREE.BufferGeometry();
      this.leaderArr = new Float32Array(KEYS.length * 6);
      geo.setAttribute('position', new THREE.BufferAttribute(this.leaderArr, 3));
      this.leaderGeo = geo;
      const l = new THREE.LineSegments(geo, this.leaderMat);
      l.frustumCulled = false;
      this.scene.add(l);
    }

    wireLabels() {
      KEYS.forEach((k) => {
        const el = this.labels[k];
        if (!el) return;
        el.addEventListener('pointerenter', () => { this.hover = k; });
        el.addEventListener('pointerleave', () => { if (this.hover === k) this.hover = null; });
        el.addEventListener('focus', () => { this.hover = k; });
        el.addEventListener('blur', () => { if (this.hover === k) this.hover = null; });
      });
    }

    /* ---------- runtime ---------- */
    resize() {
      const r = this.getBoundingClientRect();
      const w = Math.max(1, r.width), h = Math.max(1, r.height);
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.rect = r;
    }

    readProgress() {
      const s = this.scroller;
      if (!s) return 0;
      const r = s.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return 0;
      return clamp(-r.top / span, 0, 1);
    }

    loop() {
      this._raf = requestAnimationFrame(() => this.loop());
      if (this.dead) return;
      if (isFlat()) { this.fail(); return; }
      try {
        this.step((performance.now() - this.t0) / 1000);
        this.renderer.render(this.scene, this.camera);
      } catch (e) { this.fail(e); }
    }

    step(t) {
      const THREE = this.T;
      this.progress = this.readProgress();
      const s = clamp(this.progress, 0, 1) * (CAM.length - 1);
      this.stop = s;
      const i = Math.min(CAM.length - 2, Math.floor(s));
      const f = smooth(clamp(s - i, 0, 1));
      const a = CAM[i], b = CAM[i + 1];
      const e = smooth(clamp(s - (CAM.length - 2), 0, 1));

      if (!this.reduced) {
        // long swell displaces the mesh; the normal map scrolls across it for chop
        const attr = this.water.attr, base = this.water.base, arr = attr.array;
        for (let k = 0; k < arr.length; k += 3) {
          arr[k + 1] = 0.42 * Math.sin(base[k] * 0.06 + t * 0.75) +
            0.3 * Math.sin(base[k + 2] * 0.09 - t * 0.55) +
            0.14 * Math.sin((base[k] + base[k + 2]) * 0.21 + t * 1.4);
        }
        attr.needsUpdate = true;
        const m = this.water.mat;
        m.normalMap.offset.set(t * 0.006, t * 0.011);
        m.bumpMap.offset.set(-t * 0.021, t * 0.034);
      }

      this.orbit += this.orbitV;
      this.orbitV *= 0.9;
      const tx = a[3] + (b[3] - a[3]) * f, ty = a[4] + (b[4] - a[4]) * f, tz = a[5] + (b[5] - a[5]) * f;
      let cx = a[0] + (b[0] - a[0]) * f, cy = a[1] + (b[1] - a[1]) * f, cz = a[2] + (b[2] - a[2]) * f;
      const ang = (this.orbit + (this.reduced ? 0 : t * 0.045)) * e;
      const dx = cx - tx, dz = cz - tz;
      cx = tx + dx * Math.cos(ang) - dz * Math.sin(ang);
      cz = tz + dx * Math.sin(ang) + dz * Math.cos(ang);
      const par = (1 - e) * 0.6;
      this.camera.position.set(cx + this.px * 14 * par, Math.max(2.5, cy - this.py * 7 * par), cz);
      this.target.set(tx, ty, tz);
      this.camera.lookAt(this.target);
      const stand = this.camera.position.distanceTo(this.target);
      this.scene.fog.near = stand * 1.4;
      this.scene.fog.far = stand * 9 + 200;

      const foc = FOCUS[Math.round(clamp(s, 0, CAM.length - 1))];
      const acc = new THREE.Color(ACCENT);
      const la = this.leaderArr;
      KEYS.forEach((k, idx) => {
        const g = this.groups[k]; if (!g) return;
        const u = g.userData;
        const on = this.hover === k ? 1 : (!foc ? 0.35 : (foc.indexOf(k) >= 0 ? 1 : 0));
        u.lit += (on - u.lit) * 0.09;
        // focus reads as a faint highlight on real paint, not a colour swap
        for (const m of u.mats) { m.emissive.copy(acc); m.emissiveIntensity = u.lit * 0.16; }
        u.rigMat.opacity = 0.3 + u.lit * 0.28;

        const nx = u.base.x + 8, nz = u.base.z;
        const len = Math.max(1, Math.hypot(nx, nz));
        g.position.set(u.base.x + (nx / len) * 20 * e, (6 + idx * 2.4) * e, u.base.z + (nz / len) * 20 * e);

        const o = idx * 6;
        la[o] = u.base.x; la[o + 1] = 0.2; la[o + 2] = u.base.z;
        la[o + 3] = g.position.x; la[o + 4] = g.position.y; la[o + 5] = g.position.z;
      });
      this.leaderGeo.attributes.position.needsUpdate = true;
      this.leaderMat.opacity = e * 0.4;

      if (!this.reduced) { this.animateCrew(t); this.animateDredge(t); }
      this.placeLabels(e);
      this.drivePanels(s);
    }

    /* Callouts are anchored in world space to their discipline, projected each
       frame, then de-collided in screen space: sorted top-to-bottom and pushed
       apart vertically so no two overlap. A label whose box lands on the fixed
       hero plate fades out rather than sitting over the headline. */
    placeLabels(e) {
      const rect = this.rect || this.getBoundingClientRect();
      if (e < 0.02) {
        KEYS.forEach((k) => {
          const el = this.labels[k];
          if (el && el.style.opacity !== '0') { el.style.opacity = '0'; el.style.pointerEvents = 'none'; }
        });
        return;
      }
      const v = new this.T.Vector3();
      const shelf = document.querySelector('[data-gs-plate]');
      // only occlude against the hero plate while the hero panel is actually up
      const plate = (shelf && (this.heroVis || 0) > 0.05) ? shelf.getBoundingClientRect() : null;
      // The visible panel's copy plate spans the full stage width, so no amount
      // of dodging can route labels around it — instead it reserves a band and
      // the labels get the clear field beneath, where both constraints can hold.
      let bandTop = 0, bandBot = rect.height;
      // Fixed page chrome owns its strip of the stage: seed the reserved band with
      // the header's bottom edge so no callout can be clamped under the nav.
      for (const n of document.querySelectorAll('header, [data-gs-chrome-fixed]')) {
        const cs = getComputedStyle(n);
        if (cs.position !== 'fixed' || cs.visibility === 'hidden') continue;
        const r = n.getBoundingClientRect();
        if (r.height) bandTop = Math.max(bandTop, r.bottom - rect.top);
      }
      for (const p of (this.panels || [])) {
        if ((p.vis || 0) <= 0.05) continue;
        for (const n of p.el.querySelectorAll('h1,h2,h3,p,form,figure,[data-gs-wrap],[data-gs-copy]')) {
          const r = n.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const t = r.top - rect.top, b = r.bottom - rect.top;
          if ((t + b) / 2 < rect.height / 2) bandTop = Math.max(bandTop, b);
          else bandBot = Math.min(bandBot, t);
        }
      }
      const items = [];
      KEYS.forEach((k) => {
        const el = this.labels[k], g = this.groups[k];
        if (!el || !g) return;
        v.copy(g.userData.label).add(g.position).project(this.camera);
        const ax = (v.x * 0.5 + 0.5) * rect.width, ay = (-v.y * 0.5 + 0.5) * rect.height;
        items.push({
          el: el, x: ax, y: ay, ax: ax, ay: ay,
          w: el.offsetWidth || 120, h: el.offsetHeight || 28,
        });
      });
      const PAD = 8, M = 10;
      // the chrome seed is a hard floor; only the copy band is subject to the cap
      const top = Math.max(bandTop, Math.min(bandTop + PAD, rect.height * 0.42));
      const rowH = (items[0] ? items[0].h : 28) + PAD;
      // Nine callouts never stack in one column, so they are placed in two.
      // Assignment is BALANCED by anchor order, not by which half the anchor
      // happens to project into: an orbit that swings every anchor to one side
      // must still use both columns, or the band cannot hold them.
      const cols = (rect.width / 2 >= Math.max.apply(null, items.map((i) => i.w)) + M * 2) ? 2 : 1;
      if (cols === 2) {
        const byX = items.slice().sort((a, b) => a.ax - b.ax);
        const half = Math.ceil(byX.length / 2);
        byX.forEach((it, i) => { it.col = i < half ? -1 : 1; });
      } else {
        items.forEach((it) => { it.col = 0; });
      }
      const side = (it) => it.col;
      // band sized from the ACTUAL per-column occupancy
      let per = 0;
      for (const c of [-1, 0, 1]) {
        const n = items.filter((it) => it.col === c).length;
        if (n > per) per = n;
      }
      const need = per * rowH + M * 2;
      let bot = Math.max(bandBot - PAD, rect.height * 0.45);
      if (bot - top < need) bot = Math.min(rect.height - M, top + need);
      const lo = (it) => top + it.h + M, hi = (it) => Math.max(lo(it), bot - M);
      const fit = (it) => {
        // clamp the box EDGE to its column, not the centre: a legal centre can
        // still push a 200px label across the midline into the other column
        const half = rect.width / 2;
        const min = it.w / 2 + M, max = Math.max(min, rect.width - it.w / 2 - M);
        let cmin = min, cmax = max;
        if (cols === 2) {
          if (side(it) < 0) cmax = Math.max(min, Math.min(max, half - PAD / 2 - it.w / 2));
          else cmin = Math.min(max, Math.max(min, half + PAD / 2 + it.w / 2));
        }
        it.x = clamp(it.x, cmin, Math.max(cmin, cmax));
        it.y = clamp(it.y, lo(it), hi(it));
      };
      items.forEach(fit);
      for (let pass = 0; pass < 24; pass++) {
        let moved = false;
        items.sort((a, b) => a.y - b.y);
        for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
          const a = items[i], b = items[j];
          // every pair is tested, including across columns
          if (Math.abs(a.x - b.x) >= (a.w + b.w) / 2 + PAD) continue;
          // it.y is the label's bottom edge, so clearance is the taller box + pad
          const gap = Math.max(a.h, b.h) + PAD - Math.abs(a.y - b.y);
          if (gap <= 0) continue;
          const up = a.y > lo(a) + 1, down = b.y < hi(b) - 1;
          if (up && down) { a.y -= gap / 2; b.y += gap / 2; }
          else if (down) b.y += gap;
          else if (up) a.y -= gap;
          fit(a); fit(b); moved = true;
        }
        if (!moved) break;
      }
      for (const it of items) {
        const el = it.el;
        let vis = e;
        if (plate) {
          const l = it.x - it.w / 2, r = it.x + it.w / 2, tp = it.y - it.h, bo = it.y;
          const px0 = plate.left - rect.left, px1 = plate.right - rect.left;
          const py0 = plate.top - rect.top, py1 = plate.bottom - rect.top;
          if (r > px0 - 8 && l < px1 + 8 && bo > py0 - 8 && tp < py1 + 8) vis = 0;
        }
        el.style.transform = 'translate3d(' + Math.round(it.x) + 'px,' + Math.round(it.y) + 'px,0) translate(-50%,-100%)';
        el.style.opacity = String(vis);
        el.style.pointerEvents = (vis > 0.6 && e > 0.6) ? 'auto' : 'none';
      }
      this.drawLeaders(items, e);
    }

    /* A hairline from each callout back to the point it names, so de-collision
       displacement never breaks the association between label and assembly. */
    drawLeaders(items, e) {
      const svg = this.leaderSvg || (this.leaderSvg = document.querySelector('[data-gs-leaders]'));
      if (!svg) return;
      svg.style.opacity = String(e * 0.75);
      if (!this._leaderEls) {
        this._leaderEls = items.map(() => {
          const l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          l.setAttribute('fill', 'none');
          l.setAttribute('stroke', 'currentColor');
          l.setAttribute('stroke-width', '1');
          svg.appendChild(l);
          return l;
        });
        svg.style.color = 'var(--color-accent-700)';
      }
      items.forEach((it, i) => {
        const el = this._leaderEls[i];
        if (!el) return;
        const dx = it.ax - it.x, dy = it.ay - it.y;
        if (Math.hypot(dx, dy) < 14) { el.setAttribute('d', ''); return; }
        // leave the label from the edge nearest its anchor
        const ex = it.x + clamp(dx, -it.w / 2, it.w / 2);
        const ey = it.y + (dy < 0 ? -it.h : 0);
        el.setAttribute('d', 'M' + ex.toFixed(1) + ',' + ey.toFixed(1) +
          ' L' + it.ax.toFixed(1) + ',' + it.ay.toFixed(1));
        el.setAttribute('opacity', String(clamp(1 - Math.hypot(dx, dy) / 900, 0.25, 1)));
      });
    }

    drivePanels(s) {
      for (const p of this.panels) {
        const o = clamp(1 - Math.abs(s - p.idx) * 1.9, 0, 1);
        p.el.style.opacity = String(o);
        if (p.idx === 0) this.heroVis = o;
        p.vis = o;
        p.el.style.transform = 'translateY(' + ((1 - o) * 26 * (s > p.idx ? -1 : 1)).toFixed(1) + 'px)';
        const hit = o > 0.55 ? 'auto' : 'none';
        for (const h of p.hits) h.style.pointerEvents = hit;
      }
    }
  }

  customElements.define('gs-scene', GsScene);
})();
