import $User from '../../services/user'

export default {
  name: 'Login',
  title () {
    return 'Iniciar sesión'
  },
  data () {
    return {
      userData: {
        username: null,
        password: null
      },
      passwordState: 'password',
      error: {
        status: false,
        message: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      const { status, data } = await $User.login(this.userData)
      if (!status) {
        this.error = {
          status: true,
          message: data
        }
        this.loading = false
        return
      }
      this.$store.commit('loginUser', data)
      this.$router.push({ name: 'Home' })
      this.loading = false
    },
    removeError () {
      if (this.error.status) {
        this.error = {
          status: false,
          message: ''
        }
      }
    },
    switchPasswordState () {
      if (this.passwordState === 'password') {
        this.passwordState = 'text'
      } else {
        this.passwordState = 'password'
      }
    }
  },
  beforeMount () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push({ name: 'Home' })
    }
  }
}
