import { mapGetters } from 'vuex'
import { ROLES } from '../../store/types'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['isAuthenticated', 'hasRole'])
  },
  data () {
    return {
      ROLES
    }
  },
  methods: {
    logoutUser () {
      this.$store.commit('logoutUser')
      sessionStorage.removeItem('userData')
      this.$router.push({ name: 'Login' })
    }
  }
}
