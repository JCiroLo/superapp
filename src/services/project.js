import axios from 'axios'
import store from '../store'
import Utils from './utils'

/* axios.defaults.headers.common[
  'Authorization'
] = `Bearer ${store.getters.user.access_token}` */

const API_URL = process.env.VUE_APP_API_URL

const Projects = {}

Projects.getSchema = () => ({
  nombre: '',
  resumen: '',
  descripcion: '',
  objetivos: '',
  principalItos: '',
  cronograma: [],
  palabrasClave: [],
  localizacion: [null, null],
  presupuesto: null,
  fecha: null,
  enabled: true,
  estadoProyecto: 1,
  proyectoDesarrollo: [1],
  creador: null,
  gamificacion: false
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

Projects.getProject = async projectName => {
  try {
    const { data } = await axios.get(
      `${API_URL}/proyectos/proyectos/ver/proyecto/${projectName}`
    )
    return { status: true, data }
  } catch (e) {
    if (e.response.status === 302) {
      return { status: true, data: e.response.data }
    }
    return { status: false, data: 'Error' }
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

Projects.createProject = async (projectData, userData) => {
  projectData.creador = userData.username
  projectData.fecha = new Date(projectData.fecha).toLocaleDateString('en-CA')

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

Projects.updateProject = async (projectData, userData) => {
  // ELIMINAR PROPIEDADES EXTRA
  delete projectData.thumbnail

  try {
    const { data } = await axios.post(
      `${API_URL}/proyectos/proyectos/editarProyectos/${userData.username}/`,
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

Projects.deleteRequestDeleteProject = async projectName => {
  try {
    await axios.put(
      `${API_URL}/proyectos/proyectos/eliminarPeticionAdmin/${projectName}`
    )
    return {
      status: true,
      data: 'Petición eliminada correctamente.'
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
      `${API_URL}/suscripciones/suscripciones/ver/comentarios/${projectName}`
    )
    return { status: true, data }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.insertComment = async (projectName, commentData) => {
  try {
    const formData = Utils.generateFormData(commentData)
    const { data } = await axios.post(
      `${API_URL}/suscripciones/suscripciones/crear/comentarios/${projectName}`,
      formData
    )
    return {
      status: true,
      data
    }
  } catch (e) {
    return {
      status: false,
      data: 'Error'
    }
  }
}

Projects.deleteComment = async (projectName, commentId) => {
  try {
    const formData = Utils.generateFormData({ id: commentId })
    const { data } = await axios.delete(
      `${API_URL}/suscripciones/suscripciones/eliminar/comentarios/${projectName}`,
      { data: formData }
    )
    return {
      status: true,
      data
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

Projects.getInterventorUsers = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/interventor/interventor/listarUsuarios`
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
  const formData = new FormData()
  formData.append('nombre', projectName)
  try {
    const { data } = await axios.delete(
      `${API_URL}/interventor/interventor/eliminarProyectoDefinitivamente/`,
      { data: formData }
    )
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

Projects.getProjectViews = async projectName => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadistica/estadistica/visualizacion/ver/${projectName}`
    )
    return {
      status: true,
      data
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error.'
    }
  }
}

Projects.getProjectLikes = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadistica/estadistica/likes/ver/${projectName}`
    )
    return {
      status: true,
      data
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error.'
    }
  }
}

Projects.getProjectDislikes = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadistica/estadistica/dislikes/ver/${projectName}`
    )
    return {
      status: true,
      data
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error.'
    }
  }
}

export default Projects
