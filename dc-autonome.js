// Un petit moteur pour faire tourner la planche de la régie hors de Claude Design, sur une simple page.
//
// La planche est écrite pour l'éditeur : du balisage avec des trous {{ nom }}, et une classe Component
// (extends DCLogic) dont renderVals() donne la valeur de chaque trou. Ce fichier refait le strict
// nécessaire : il repère les trous, les remplit, branche les gestionnaires (onClick) et les « ref »,
// et refait le rendu à chaque setState. Pas de dépendance.

class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }
  setState(maj, ensuite) {
    Object.assign(this.state, typeof maj === 'function' ? maj(this.state) : maj);
    if (this.__rendre) this.__rendre();
    if (ensuite) ensuite();
  }
  forceUpdate() {
    if (this.__rendre) this.__rendre();
  }
}

function monterPlanche(racine, Classe) {
  const TROU = /\{\{\s*([\w.$]+)\s*\}\}/g;
  const SEUL = /^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/;
  const liens = [];
  const parcourir = (n) => {
    if (n.nodeType === 3) {
      if (n.nodeValue.includes('{{')) liens.push({ noeud: n, modele: n.nodeValue });
      return;
    }
    if (n.nodeType !== 1) return;
    for (const a of Array.from(n.attributes)) {
      if (a.value.includes('{{')) liens.push({ el: n, attr: a.name, modele: a.value });
    }
    for (const c of Array.from(n.childNodes)) parcourir(c);
  };
  parcourir(racine);
  // les gestionnaires et les ref ne doivent pas rester dans le balisage (le navigateur les prendrait pour du code)
  for (const l of liens) if (l.attr && (l.attr === 'ref' || l.attr.startsWith('on'))) l.el.removeAttribute(l.attr);

  const comp = new Classe({});
  const valeur = (vals, chemin) => chemin.split('.').reduce((o, k) => (o == null ? o : o[k]), vals);
  const texte = (vals, modele) => modele.replace(TROU, (_, p) => {
    const x = valeur(vals, p);
    return x == null ? '' : String(x);
  });
  const refsPosees = new Set();
  comp.__rendre = () => {
    const v = comp.renderVals();
    for (const l of liens) {
      if (l.noeud) {
        const t = texte(v, l.modele);
        if (l.noeud.nodeValue !== t) l.noeud.nodeValue = t;
        continue;
      }
      const seul = l.modele.match(SEUL);
      if (l.attr === 'ref') {
        if (seul && !refsPosees.has(l.el)) {
          refsPosees.add(l.el);
          const f = valeur(v, seul[1]);
          if (typeof f === 'function') f(l.el);
        }
        continue;
      }
      if (l.attr.startsWith('on')) {
        const f = seul ? valeur(v, seul[1]) : null;
        l.el['on' + l.attr.slice(2)] = typeof f === 'function' ? f : null;
        continue;
      }
      const t = texte(v, l.modele);
      if (l.el.getAttribute(l.attr) !== t) l.el.setAttribute(l.attr, t);
    }
  };
  comp.__rendre();
  if (comp.componentDidMount) comp.componentDidMount();
  return comp;
}
