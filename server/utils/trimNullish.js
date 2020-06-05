export default function trimNullish (obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null || obj[key] === undefined) delete obj[key]
    }
  }
  return obj
}
