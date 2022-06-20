import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export default {
  getSchema: () => ({
    nombre: '',
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
  })
}
