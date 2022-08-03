import axios from 'axios'
import $Utils from './utils'

const API_URL = process.env.VUE_APP_API_URL

export default {
  getSchema: () => ({
    numeroPregunta: null,
    tipoConsulta: 1,
    pregunta: null,
    informacion: null,
    opciones: [],
    obligatorio: true,
    priorizacion: null,
    formulario: 1,
    impacto: []
  }),

  insertQuestion: async questionData => {
    try {
      const { data } = await axios.post(
        `${API_URL}/preguntas/preguntas/pregunta/`,
        questionData
      )
      return { status: true, data }
    } catch (error) {
      return {
        status: false,
        data: 'Ha ocurrido un problema, inténtelo de nuevo'
      }
    }
  },

  updateQuestion: async questionData => {
    console.log(questionData)
    const formData = $Utils.generateFormData(questionData)
    try {
      const { data } = await axios.put(
        `${API_URL}/preguntasrespuestas/preguntasrespuestas/preguntas/editar/`,
        formData
      )
      return { status: true, data }
    } catch (error) {
      return {
        status: false,
        data: 'Ha ocurrido un problema, inténtelo de nuevo'
      }
    }
  },

  deleteQuestion: async (projectId, questionId, formId) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/preguntas/preguntas/una/${projectId}/${questionId}/${formId}/`
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
