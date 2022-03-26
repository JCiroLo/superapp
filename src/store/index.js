import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: null,
    loading: false
  },
  getters: {
    isAuthenticated: state => (state.user ? true : false),
    user: state => state.user,
    loading: state => state.loading,
    hasRole: state => payload => state.user.userRoles.find(e => e === payload)
  },
  mutations: {
    loginUser: (state, payload) => {
      state.user = payload
    },
    logoutUser: state => {
      state.user = null
    },
    setLoading: (state, payload) => {
      state.loading = payload
    }
  }
})

export default store
