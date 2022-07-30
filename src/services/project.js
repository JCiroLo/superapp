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
  objetivos: [],
  hitos: [],
  cronograma: [],
  palabrasClave: [],
  ubicacion: [null, null],
  presupuesto: null,
  fechaLanzamiento: null,
  activo: true,
  estadoProyecto: 1,
  proyectoDesarrollo: [1],
  creador: [],
  gamificacion: false,
  mensajeParticipacion: ''
})

Projects.getProjects = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/proyectos/proyectos/listar/`)
    return { status: true, data }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.getProject = async projectId => {
  try {
    const { data } = await axios.get(
      `${API_URL}/proyectos/proyectos/ver/proyecto/${projectId}`
    )
    return { status: true, data }
  } catch (e) {
    if (e.response.status === 302) {
      return { status: true, data: e.response.data }
    }
    return { status: false, data: 'Error' }
  }
}

Projects.getProjectImage = async projectId => {
  try {
    const { data } = await axios.get(
      `${API_URL}/proyectos/proyectos/imagen/binary/${projectId}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

Projects.createProject = async (projectData, userData) => {
  projectData.creador.push(userData.username)
  projectData.fechaLanzamiento = new Date(projectData.fechaLanzamiento)

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

Projects.updateProject = async projectData => {
  // ELIMINAR PROPIEDADES EXTRA
  delete projectData.thumbnail

  try {
    const { data } = await axios.put(
      `${API_URL}/proyectos/proyectos/editarProyectos/${projectData.codigoProyecto}/`,
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

Projects.insertImage = async (projectId, image) => {
  const formData = new FormData()
  formData.append('image', image)
  try {
    const { data } = await axios.put(
      `${API_URL}/proyectos/proyectos/imagen/poner/${projectId}`,
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

Projects.requestDeleteProject = async projectId => {
  try {
    await axios.put(`${API_URL}/proyectos/proyectos/eliminarAdmin/${projectId}`)
    return {
      status: true,
      data: 'Se ha enviado petición para eliminar el proyecto'
    }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un error. Inténtelo de nuevo más tarde'
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

Projects.getProjectQuestions = async (projectId, formId) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/preguntas/preguntas/todas/${projectId}/${formId}/`
    )
    return { status: true, data: data || [] }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.getComments = async projectId => {
  try {
    const { data } = await axios.get(
      `${API_URL}/suscripciones/suscripciones/ver/comentarios/${projectId}`
    )
    return { status: true, data }
  } catch (error) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Projects.insertComment = async (projectId, commentData) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/suscripciones/suscripciones/crear/comentarios/${projectId}`,
      commentData
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

Projects.deleteComment = async (projectId, commentId) => {
  try {
    const formData = Utils.generateFormData({ id: commentId })
    const { data } = await axios.delete(
      `${API_URL}/suscripciones/suscripciones/eliminar/comentarios/${projectId}`,
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

Projects.deleteProject = async projectId => {
  const formData = new FormData()
  formData.append('codigoProyecto', projectId)
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

Projects.getProjectStatistics = async (projectId, formId) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadistica/estadisticas/proyecto/${projectId}/formulario/${formId}/`
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

Projects.searchProject = async searchQuery => {
  try {
    const { data } = await axios.get(
      `${API_URL}/busqueda/busqueda/proyectos/buscar/${searchQuery}`
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
