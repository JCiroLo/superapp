import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const Analytics = {}

Analytics.getUserInteractions = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadisticadashboard/estadisticas/dashboard/interacciones-proyectos/`
    )
    return { status: true, data }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

Analytics.getNumberProjects = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL}/estadisticadashboard/estadisticas/dashboard/numero-proyectos/`
    )
    return { status: true, data }
  } catch (e) {
    return {
      status: false,
      data: 'Ha ocurrido un problema, inténtelo de nuevo'
    }
  }
}

export default Analytics
