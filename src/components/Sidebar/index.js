import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    ...mapGetters(['isAuthenticated', 'hasRole', 'navbarState', 'siderbarState'])
  },
  props: {
    items: Array
  },
  methods: {
    ...mapMutations(['switchNavbar'])
  }
}
