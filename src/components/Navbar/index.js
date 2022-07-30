import { mapGetters, mapMutations } from 'vuex'
import { ROLES } from '../../store/types'

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'hasRole',
      'navbarState',
      'getSearch'
    ])
  },
  data () {
    return {
      ROLES
    }
  },
  methods: {
    ...mapMutations(['switchNavbar', 'switchSidebar', 'setSearch']),
    logoutUser () {
      this.$store.commit('logoutUser')
      sessionStorage.removeItem('userData')
      this.$router.push({ name: 'Login' })
    }
  }
}
