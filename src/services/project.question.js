import axios from 'axios'
import $Utils from './utils'

const API_URL = process.env.VUE_APP_API_URL

export default {
  getSchema: () => ({
    tipoConsulta: 1,
    pregunta: null,
    informacion: null,
    opciones: [],
    obligatorio: true
  }),

  updateQuestion: async (projectName, questionData) => {
    const formData = $Utils.generateFormData(questionData)
    try {
      const { data } = await axios.put(
        `${API_URL}/preguntasrespuestas/preguntasrespuestas/preguntas/editar/${projectName}`,
        formData
      )
      return { status: true, data }
    } catch (error) {
      return {
        status: false,
        data: 'Ha ocurrido un problema, inténtelo de nuevo'
      }
    }
  }
}
