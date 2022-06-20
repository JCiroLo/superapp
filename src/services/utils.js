const Utils = {}

Utils.generateFormData = obj => {
  const formData = new FormData()
  Object.keys(obj).forEach(d => {
    formData.append(d, obj[d])
  })
  return formData
}

export default Utils
