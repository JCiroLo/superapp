import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: null,
    loading: false,
    navbar: false,
    sidebar: window.matchMedia('(min-width: 992px)').matches,
    search: ''
  },
  getters: {
    isAuthenticated: state => (state.user ? true : false),
    user: state => state.user,
    loading: state => state.loading,
    hasRole: state => payload => state.user.userRoles.find(e => e === payload),
    navbarState: state => state.navbar,
    siderbarState: state => state.sidebar,
    getSearch: state => state.search
  },
  mutations: {
    loginUser: (state, payload) => {
      state.user = payload
      state.navbar = true
    },
    logoutUser: state => {
      state.user = null
      state.navbar = false
    },
    setLoading: (state, payload) => {
      state.loading = payload
    },
    switchSidebar: state => {
      state.sidebar = !state.sidebar
    },
    setSearch: (state, payload) => {
      state.search = payload
    }
  }
})

export default store
