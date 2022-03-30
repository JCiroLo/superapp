import axios from 'axios'
import store from '../store'

axios.defaults.headers.common[
  'Authorization'
] = `Bearer ${store.getters.user.access_token}`

const API_URL = process.env.VUE_APP_API_URL

const Projects = {}

Projects.getSchema = () => ({
  nombre: null,
  resumen: null,
  descripcion: null,
  objetivos: null,
  principalItos: null,
  cronograma: [],
  palabrasClave: [],
  localizacionLong: null,
  localizacionLat: null,
  presupuesto: null,
  fecha: null,
  enabled: true,
  estadoProyecto: 1,
  proyectoDesarrollo: [1],
  creador: null
})

Projects.getUserProjects = async () => {
  try {
    if (!store.getters.isAuthenticated) {
      return {
        status: false,
        data: 'Sesión expirada. Cierre sesión e inicie de nuevo'
      }
    }
    const { data } = await axios.get(`${API_URL}/proyectos/proyectos/listar/`)
    return { status: true, data }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.getProjectImage = async projectName => {
  try {
    const { data } = await axios.get(
      `${API_URL}/proyectos/proyectos/imagen/binary/${projectName}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

Projects.createProject = async projectData => {
  try {
    const { data } = await axios.post(
      `${API_URL}/proyectos/proyectos/crear/`,
      projectData
    )
    return { status: true, data }
  } catch (e) {
    if (e.response.status === 400) {
      return {
        status: false,
        data: 'Nombre de proyecto no disponible.'
      }
    }
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.insertImage = async (projectName, image) => {
  const formData = new FormData()
  formData.append('image', image)
  try {
    const { data } = await axios.put(
      `${API_URL}/proyectos/proyectos/imagen/poner/${projectName}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${store.getters.user.access_token}`
        }
      }
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

Projects.requestDeleteProject = async projectName => {
  try {
    await axios.put(
      `${API_URL}/proyectos/proyectos/eliminarAdmin/${projectName}`
    )
    return {
      status: true,
      data: 'Se ha enviado petición para eliminar el proyecto'
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error. Intnéntelo de nuevo más tarde'
    }
  }
}

Projects.switchProjectStatus = async projectName => {
  try {
    await axios.put(`${API_URL}/proyectos/proyectos/editEnabled/${projectName}`)
    return {
      status: true,
      data: 'Se ha cambiado el estado satisfactoriamente.'
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.getProjectQuestions = async projectName => {
  try {
    const { data } = await axios.get(
      `${API_URL}/preguntasrespuestas/preguntasrespuestas/preguntas/ver/${projectName}`
    )
    return { status: true, data: data || [] }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.addQuestion = async (projectName, questionData) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/preguntasrespuestas/preguntasrespuestas/preguntas/crear/${projectName}`,
      questionData
    )
    return { status: true, data }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.getComments = async projectName => {
  try {
    const { data } = await axios.get(
      `${API_URL}/suscripciones/suscripciones/comentarios/ver/${projectName}`
    )
    return { status: true, data }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.insertComment = async (projectName, comment) => {
  try {
    console.log(store.getters.user.username)
    const { data } = await axios.put(
      `${API_URL}/suscripciones/suscripciones/comentarios/${projectName}`,
      { username: store.getters.user.username, comentario: comment }
    )
    return {
      status: true,
      data: { username: store.getters.user.username, comentario: comment }
    }
  } catch (e) {
    return {
      status: false,
      data: 'Error'
    }
  }
}

Projects.getInterventorProjects = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/interventor/interventor/listarProyectos`
    )
    return {
      status: true,
      data
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error. Intnéntelo de nuevo más tarde'
    }
  }
}

Projects.deleteProject = async projectName => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/interventor/interventor/eliminarProyectoDefinitivamente/`,
      { data: { nombre: projectName } }
    )
    console.log(data)
    return {
      status: true,
      data: 'Proyecto eliminado satisfactoriamente'
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error. Intnéntelo de nuevo más tarde'
    }
  }
}

export default Projects
