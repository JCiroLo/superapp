import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    ...mapGetters(['isAuthenticated', 'hasRole', 'navbarState'])
  },
  props: {
    items: Array
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    ...mapMutations(['switchNavbar'])
  }
}
