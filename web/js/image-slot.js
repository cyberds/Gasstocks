/* <image-slot> — fillable image placeholder.

   The design-tool original persisted dropped files through the authoring
   runtime's sidecar bridge. There is no such bridge in production, so this
   standalone version does the same job with the platform: an `src` wins if the
   page ships one, otherwise the slot renders a labelled placeholder that a
   content editor can fill by dropping or picking a file. Fills are kept in
   localStorage, keyed by the slot's id, so a preview survives a reload without
   any server.

   Attributes:
     src         — image URL. Set this once real photography exists; it makes
                   the slot read-only.
     placeholder — caption shown on the empty state.
     shape       — "rect" (default) | "square" | "circle".
     alt         — alt text for the filled image. */
(() => {
  if (window.customElements && customElements.get('image-slot')) return;

  const KEY = (id) => 'gs.image-slot.' + id;
  const RADIUS = { rect: '0', square: '0', circle: '50%' };

  class ImageSlot extends HTMLElement {
    static get observedAttributes() { return ['src', 'placeholder', 'shape', 'alt']; }

    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.cssText = 'display:block;position:relative;width:100%;height:100%;overflow:hidden';
      const shape = this.getAttribute('shape') || 'rect';
      this.style.borderRadius = RADIUS[shape] || '0';
      if (shape === 'square') this.style.aspectRatio = '1';
      this.render();
      if (!this.getAttribute('src')) this.wireEditing();
    }

    attributeChangedCallback() { if (this._built) this.render(); }

    /* The stored fill only applies to slots the page did not hard-code. */
    get value() {
      const src = this.getAttribute('src');
      if (src) return src;
      if (this._inline) return this._inline;
      if (!this.id) return '';
      try { return localStorage.getItem(KEY(this.id)) || ''; } catch (e) { return ''; }
    }

    render() {
      const src = this.value;
      if (src) {
        this.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        img.alt = this.getAttribute('alt') || this.getAttribute('placeholder') || '';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
        this.appendChild(img);
        return;
      }
      const label = this.getAttribute('placeholder') || 'Image';
      this.innerHTML =
        '<div part="empty" style="position:absolute;inset:0;display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px;' +
        'background:color-mix(in srgb, var(--color-text) 8%, transparent);' +
        'border:1px dashed color-mix(in srgb, var(--color-text) 26%, transparent)">' +
        '<span style="font-family:ui-monospace,Menlo,monospace;font-size:9.5px;letter-spacing:0.16em;' +
        'text-transform:uppercase;opacity:0.55">Image slot</span>' +
        '<span style="font-size:12px;line-height:1.4;max-width:26ch;opacity:0.75"></span></div>';
      this.querySelector('span + span').textContent = label;
    }

    wireEditing() {
      this.style.cursor = 'pointer';
      this.title = 'Click or drop an image file to fill this slot';
      const accept = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
          const data = String(reader.result);
          if (this.id) { try { localStorage.setItem(KEY(this.id), data); } catch (e) {} }
          this._inline = data;
          this.setAttribute('alt', file.name);
          this.render();
        };
        reader.readAsDataURL(file);
      };
      this.addEventListener('dragover', (e) => { e.preventDefault(); this.style.opacity = '0.7'; });
      this.addEventListener('dragleave', () => { this.style.opacity = ''; });
      this.addEventListener('drop', (e) => {
        e.preventDefault();
        this.style.opacity = '';
        accept(e.dataTransfer && e.dataTransfer.files[0]);
      });
      this.addEventListener('click', () => {
        const picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'image/*';
        picker.addEventListener('change', () => accept(picker.files[0]));
        picker.click();
      });
    }
  }

  customElements.define('image-slot', ImageSlot);
})();
