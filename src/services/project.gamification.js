import axios from 'axios'
import $Utils from './utils'

const API_URL = process.env.VUE_APP_API_URL

export default {
  getCreateSchema: () => ({
    titulo: '',
    tyc: '',
    fechaTerminacion: null,
    habilitado: true,
    mensajeParticipacion: '',
    mensajeGanador: '',
    premios: [],
    patrocinadores: [],
    ganadores: []
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

  insertGamification: async (projectName, gamificationData) => {
    gamificationData.fechaTerminacion = new Date(
      gamificationData.fechaTerminacion
    ).toLocaleDateString()

    const formData = $Utils.generateFormData(gamificationData)

    try {
      const { data } = await axios.post(
        `${API_URL}/gamificacion/gamificacion/proyectos/crear/${projectName}`,
        formData
      )
      return { status: true, data }
    } catch (e) {
      return { status: false, data: 'Error' }
    }
  },

  updateGamification: async (projectName, gamificationData) => {
    const formData = $Utils.generateFormData({
      ...gamificationData,
      fechaTerminacion: new Date(
        gamificationData.fechaTerminacion
      ).toLocaleDateString()
    })

    try {
      const { data } = await axios.put(
        `${API_URL}/gamificacion/gamificacion/proyectos/editar/${projectName}`,
        formData
      )
      return { status: true, data }
    } catch (e) {
      return { status: false, data: 'Error' }
    }
  },

  getGamification: async projectName => {
    try {
      const { data } = await axios.get(
        `${API_URL}/gamificacion/gamificacion/proyectos/ver/${projectName}`
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
