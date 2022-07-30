export default {
  objectIsValid: (data, exceptions = []) => {
    const isValid = Object.keys(data).every(k => {
      if (exceptions.includes(k)) {
        return true
      }
      const v = data[k]
      if (
        typeof v === 'boolean' ||
        typeof v === 'number' ||
        v instanceof Date
      ) {
        return true
      } else if (typeof v === 'string' && v) {
        return true
      } else if (typeof v === 'object' && v) {
        if (Array.isArray(v)) {
          if (v.length > 0) {
            return v.every(e => e !== null && e !== '')
          }
        }
      }
      return false
    })
    return isValid
  }
}
