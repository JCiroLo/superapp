import axios from 'axios'
import $Utils from './utils'

const API_URL = process.env.VUE_APP_API_URL

export default {
  getCreateSchema: () => ({
    titulo: null,
    tyc: null,
    fechaTerminacion: null,
    habilitado: true,
    mensajeParticipacion: null,
    mensajeGanador: null,
    premios: [],
    patrocinadores: [],
    ganadores: null
  }),

  getSchema: () => ({
    titulo: '',
    premios: [],
    tyc: '',
    fechaTerminacion: null,
    patrocinadores: [],
    usuariosParticipantes: [],
    usuariosGanadores: [],
    habilitado: false,
    ganadores: null,
    mensajeParticipacion: '',
    mensajeGanador: ''
  }),

  updateGamification: async (projectId, gamificationData) => {
    const formData = $Utils.generateFormData(gamificationData)

    try {
      const { data } = await axios.put(
        `${API_URL}/gamificacion/gamificacion/proyectos/editar/${projectId}`,
        formData
      )
      return { status: true, data }
    } catch (e) {
      return { status: false, data: 'Error' }
    }
  },

  getGamification: async projectId => {
    try {
      const { data } = await axios.get(
        `${API_URL}/gamificacion/gamificacion/proyectos/ver/${projectId}`
      )
      if (!data) {
        throw 'Error'
      }
      return { status: true, data }
    } catch (e) {
      return { status: false, data: 'Error' }
    }
  }
}
