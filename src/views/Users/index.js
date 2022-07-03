import $User from '../../services/user'
import { mapMutations } from 'vuex'
import ToggleButton from '@vueform/toggle'
import swal2Config from '../../../swal2.config.json'

export default {
  name: 'Usuarios',
  title: 'Usuarios',
  components: {
    ToggleButton
  },
  data () {
    return {
      users: [],
      sidebarItems: [
        { title: 'Usuarios', icon: 'fa-th-large', route: 'Usuarios' }
      ],
      selectedUserRoles: [],
      selectedUser: null,
      creatingUser: false,
      userToCreate: {
        gender: -1,
        location: [],
        economicData: [],
        interests: [],
        stakeHolders: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    async requestDeleteUser () {
      this.setLoading(true)
      const { status, data } = await $User.requestDeleteUser(
        this.selectedUser.username
      )

      if (status) {
        this.selectedUser = null
        this.$swal({
          ...swal2Config.success,
          title: 'Petición para eliminar usuario creada.'
        })
      } else {
        this.$swal({
          ...swal2Config.error,
          title: 'Hubo un problema creando la petición.'
        })
      }

      this.setLoading(false)
    },
    async selectUser (user) {
      this.setLoading(true)

      this.selectedUser = user

      console.log(user)

      const { status, data } = await $User.getUserRoles(user.username)

      if (!status) {
        this.$swal({
          ...swal2Config.error,
          title: 'Hubo un problema al cargar los roles.'
        })

        this.selectedUserRoles = []
        this.setLoading(false)
        return
      }

      this.selectedUserRoles = data

      this.setLoading(false)
    },
    async editUser () {
      this.setLoading(true)

      const { status, data } = await $User.updateUser(
        this.selectedUser.username,
        {
          cellPhone: this.selectedUser.cellPhone,
          email: this.selectedUser.email,
          location: this.selectedUser.location
        }
      )

      if (!status) {
        this.$swal({
          ...swal2Config.error,
          title:
            'Hubo un error intentando crear el comentario. Inténtalo de nuevo más tarde.'
        })
        this.setLoading(false)
        return
      }

      this.selectedUser = null

      this.setLoading(false)
    },
    async createUser () {
      this.setLoading(true)
      console.log(this.userToCreate)
      const { status, data } = await $User.createUser(this.userToCreate)
      console.log(data)
      this.setLoading(false)
    }
  },
  async beforeMount () {
    this.setLoading(true)
    const { status, data } = await $User.getAllUsers()
    if (status) {
      this.users = data
    }
    this.setLoading(false)
  }
}
