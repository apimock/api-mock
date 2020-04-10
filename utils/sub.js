export const sub = (s, o) => {
  const SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g
  return s.replace
    ? s.replace(SUBREGEX, function(m, k) {
        return typeof o[k] === 'undefined' ? m : o[k]
      })
    : s
}
