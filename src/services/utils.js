export default {
  generateFormData: obj => {
    const formData = new FormData()
    Object.keys(obj).forEach(d => {
      formData.append(d, obj[d])
    })
    return formData
  }
}
