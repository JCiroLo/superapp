import $User from '../../services/user'

export default {
  name: 'Login',
  data () {
    return {
      userData: {
        username: null,
        password: null
      },
      error: {
        status: false,
        message: ''
      },
      loading: false
    }
  },
  methods: {
    handleInput (e) {
      this.userData[e.target.id] = e.target.value
    },
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
    }
  },
  beforeMount () {
    if (this.$store.getters.isAuthenticated) {
      this.$router.push({ name: 'Home' })
    }
  }
}
