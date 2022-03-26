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

    const headers = {
      Authorization: `Bearer ${auth.access_token}`
    }

    const { data: user } = await axios.get(
      `${API_URL}/usuarios/users/findUsername/${userData.username}`,
      { headers }
    )

    const { data: userRoles } = await axios.get(
      `${API_URL}/usuarios/users/verRoleUsuario/${userData.username}`,
      { headers }
    )

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
    return { status: false, data: 'Usuario o contraseña incorrectos' }
  }
}

export default User
