// Mechanical HTML -> JSX converter for web/index.html.
// Deliberately dumb and total: it does not re-derive the design, it only
// re-spells the markup so React accepts it. Inline styles survive verbatim.
import fs from 'node:fs';

const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

// attribute name -> JSX prop name. Anything with a dash that isn't data-/aria-
// must be listed here or it silently becomes an invalid prop.
const ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly',
  maxlength: 'maxLength', minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', autoplay: 'autoPlay',
  srcset: 'srcSet', crossorigin: 'crossOrigin', usemap: 'useMap', novalidate: 'noValidate',
  enctype: 'encType', formaction: 'formAction', accesskey: 'accessKey',
  contenteditable: 'contentEditable', spellcheck: 'spellCheck', datetime: 'dateTime',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin', 'stroke-dasharray': 'strokeDasharray',
  'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'clip-path': 'clipPath',
  'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity',
  'fill-opacity': 'fillOpacity', 'stroke-opacity': 'strokeOpacity',
  viewbox: 'viewBox', preserveaspectratio: 'preserveAspectRatio',
  'xlink:href': 'xlinkHref', 'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline', 'font-family': 'fontFamily',
  'font-size': 'fontSize', 'font-weight': 'fontWeight',
};

// Booleans that appear bare in the source and must become {true}.
const BOOL = new Set(['hidden','disabled','checked','selected','readonly','required','multiple','autofocus','autoplay','controls','loop','muted','novalidate','open','defer','async']);

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&middot;/g, '·').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–');

const camel = (p) => p.startsWith('--') ? p : p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// "a:b;c:d" -> "{{a:'b',c:'d'}}". Splits on ';' and the FIRST ':' only, so
// values containing colons (url(), color-mix(), clamp()) stay intact.
function styleToObject(css) {
  const out = [];
  let depth = 0, buf = '';
  const decls = [];
  for (const ch of css) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { decls.push(buf); buf = ''; } else buf += ch;
  }
  if (buf.trim()) decls.push(buf);

  for (const d of decls) {
    const t = d.trim();
    if (!t) continue;
    const i = t.indexOf(':');
    if (i < 0) continue;
    const prop = camel(t.slice(0, i).trim());
    const val = t.slice(i + 1).trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(prop) ? prop : `'${prop}'`;
    out.push(`${key}: '${val}'`);
  }
  return `{{ ${out.join(', ')} }}`;
}

function convertAttrs(raw) {
  const parts = [];
  // name="value" | name='value' | name
  const re = /([:\w-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) {
    const name = m[1];
    const hasVal = m[2] !== undefined;
    const value = m[3] ?? m[4] ?? m[5] ?? '';
    const lower = name.toLowerCase();

    if (lower === 'tabindex') { parts.push(`tabIndex={${Number(value)}}`); continue; }
    if (lower === 'style') { parts.push(`style=${styleToObject(decode(value))}`); continue; }
    if (lower.startsWith('on')) { parts.push(`/* dropped inline handler: ${lower} */`); continue; }

    let prop = ATTR[lower] ?? (lower.startsWith('data-') || lower.startsWith('aria-') ? lower : ATTR[name] ?? name);
    if (!hasVal) { parts.push(BOOL.has(lower) ? `${prop}={true}` : `${prop}=""`); continue; }

    const v = decode(value);
    parts.push(v.includes('"') ? `${prop}={${JSON.stringify(v)}}` : `${prop}="${v}"`);
  }
  return parts.length ? ' ' + parts.join(' ') : '';
}

export function htmlToJsx(html) {
  let out = '';
  let i = 0;
  while (i < html.length) {
    // comments
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i);
      const body = html.slice(i + 4, end === -1 ? html.length : end);
      out += `{/*${body.replace(/\*\//g, '* /')}*/}`;
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    // tags
    const m = /^<(\/?)([A-Za-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/.exec(html.slice(i));
    if (m) {
      const [full, close, tag, attrs, selfClose] = m;
      if (close) out += `</${tag}>`;
      else {
        const a = convertAttrs(attrs);
        out += VOID.has(tag.toLowerCase()) || selfClose ? `<${tag}${a} />` : `<${tag}${a}>`;
      }
      i += full.length;
      continue;
    }
    // text: escape the two characters JSX treats as syntax
    const next = html.indexOf('<', i + 1);
    const chunk = html.slice(i, next === -1 ? html.length : next);
    out += decode(chunk).replace(/[{}]/g, (c) => `{'${c}'}`);
    i += chunk.length;
  }
  return out;
}

if (process.argv[2]) {
  const src = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);
  const from = Number(process.argv[3] || 1) - 1;
  const to = Number(process.argv[4] || src.length);
  process.stdout.write(htmlToJsx(src.slice(from, to).join('\n')));
}
