import axios from 'axios'

const API_TOKEN = Buffer.from(
  `${process.env.VUE_APP_API_USER}:${process.env.VUE_APP_API_KEY}`,
  'utf8'
).toString('base64')

const API_URL = process.env.VUE_APP_API_URL

const User = {}

User.login = async userData => {
  try {
    const { data: auth } = await axios.post(
      `${API_URL}/autenticacion/oauth/token`,
      new URLSearchParams({ ...userData, grant_type: 'password' }),
      {
        headers: {
          Authorization: `Basic ${API_TOKEN} `,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${auth.access_token}`

    const { data: user } = await User.getUserByUsername(userData.username)
    const { data: userRoles } = await User.getUserRoles(userData.username)

    const mergedUser = {
      ...auth,
      ...user,
      userRoles,
      expirationTime: new Date().getTime() + auth.expires_in * 1000
    }

    window.sessionStorage.setItem(
      'userData',
      Buffer.from(JSON.stringify(mergedUser), 'utf8').toString('base64')
    )

    return { status: true, data: mergedUser }
  } catch (e) {
    console.log(e)
    return { status: false, data: 'Usuario o contraseña incorrectos' }
  }
}

User.getUserByUsername = async username => {
  try {
    const { data } = await axios.get(
      `${API_URL}/usuarios/users/findUsername/${username}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.getUserRoles = async username => {
  try {
    const { data } = await axios.get(
      `${API_URL}/usuarios/users/verRoleUsuario/${username}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.getUserImage = async username => {
  try {
    const { data } = await axios.get(
      `${API_URL}/usuarios/users/file/binary/${username}/`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/usuarios/users/listar/`)
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.updateUser = async (username, userData) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/usuarios/users/editar/${username}`,
      userData
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.createUser = async userData => {
  try {
    const { data } = await axios.post(
      `${API_URL}/usuarios/users/crearUsuarioMod/`,
      userData
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.requestDeleteUser = async username => {
  try {
    const { data } = await axios.put(
      `${API_URL}/usuarios/users/eliminarAdmin/${username}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.deleteUser = async username => {
  const formData = new FormData()
  formData.append('username', username)
  try {
    const { data } = await axios.delete(
      `${API_URL}/interventor/interventor/eliminarUsuarioDefinitivamente/`,
      { data: formData }
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

User.deleteRequestDeleteUser = async username => {
  try {
    const { data } = await axios.put(
      `${API_URL}/usuarios/users/eliminarPeticionAdmin/${username}`
    )
    return { status: true, data }
  } catch (e) {
    return { status: false, data: 'Error' }
  }
}

export default User
