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
      const { status, data } = await $User.createUser(this.userToCreate)
      this.setLoading(false)
    },
    async getThumbnail (username) {
      const { status, data } = await $User.getUserImage(username)
      if (status) {
        return `data:image/jpeg;base64,${data}`
      }
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYMZt8DcAt94DmfTzFV7BGzcm3FLFr3XqnY4-0hKSC9h1n11jFKp-Nqo59cjKXLS8V8qY&usqp=CAU'
    }
  },
  async beforeMount () {
    this.setLoading(true)
    const { status, data } = await $User.getAllUsers()
    if (status) {
      this.users = await Promise.all(
        data.map(async u => ({
          ...u,
          profileImage: await this.getThumbnail(u.username)
        }))
      )
    }
    this.setLoading(false)
  }
}
