/* Card/kit helper: fetches component .jsx sources, strips import/export, transpiles with Babel, returns the named exports.
   Each file runs in its own scope; exports from earlier files are visible to later ones. */
window.loadOADS = async function (files) {
  const srcs = await Promise.all(files.map(f => fetch(f).then(r => { if (!r.ok) throw new Error('Missing ' + f); return r.text(); })));
  const all = {};
  srcs.forEach((s, i) => {
    const names = [];
    const body = s
      .replace(/^\s*import[^\n]*\n/gm, '')
      .replace(/^export\s+function\s+(\w+)/gm, (m, n) => { names.push(n); return 'function ' + n; })
      .replace(/^export\s+const\s+(\w+)/gm, (m, n) => { names.push(n); return 'const ' + n; });
    const code = Babel.transform(body, { presets: ['react'], filename: files[i] }).code;
    const keys = Object.keys(all);
    const out = new Function('React', ...keys, code + '\nreturn {' + names.join(',') + '};')(React, ...keys.map(k => all[k]));
    Object.assign(all, out);
  });
  return all;
};
