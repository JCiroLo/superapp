import $Project from '../../services/project'
import $User from '../../services/user'
import { mapMutations } from 'vuex'
import swal2Config from '../../../swal2.config.json'

export default {
  name: 'Peticiones',
  title: 'Peticiones',
  data () {
    return {
      projectRequests: [],
      userRequests: []
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    async confirmRequest (type, request) {
      this.setLoading(true)

      if (type === 'project') {
        const { status, data } = await $Project.deleteProject(request.nombre)
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: data
          })

          this.projectRequests = this.projectRequests.filter(
            p => p.id !== request.id
          )
        } else {
          this.$swal({
            ...swal2Config.error,
            title: data
          })
        }
      } else if (type === 'user') {
        const { status, data } = await $User.deleteUser(request.nombre)
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: data
          })

          this.userRequests = this.userRequests.filter(p => p.id !== request.id)
        } else {
          this.$swal({
            ...swal2Config.error,
            title: data
          })
        }
      }

      this.setLoading(false)
    },
    async cancelRequest (type, request) {
      if (type === 'project') {
        const { status, data } = await $Project.deleteRequestDeleteProject(
          request.nombre
        )
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: 'Petición eliminada correctamente.'
          })

          this.projectRequests = this.projectRequests.filter(p => p.id !== request.id)
        } else {
          this.$swal({
            ...swal2Config.error,
            title: 'Ha ocurrido un error.'
          })
        }
      } else if (type === 'user') {
        const { status, data } = await $User.deleteRequestDeleteUser(
          request.nombre
        )
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: 'Petición eliminada correctamente.'
          })

          this.userRequests = this.userRequests.filter(p => p.id !== request.id)
        } else {
          this.$swal({
            ...swal2Config.error,
            title: 'Ha ocurrido un error.'
          })
        }
      }
    }
  },
  async beforeMount () {
    this.setLoading(true)

    const {
      status: statusProjects,
      data: projects
    } = await $Project.getInterventorProjects()

    if (statusProjects) {
      this.projectRequests = projects
    }

    const {
      status: statusUsers,
      data: users
    } = await $Project.getInterventorUsers()

    if (statusUsers) {
      this.userRequests = users
    }

    this.setLoading(false)
  }
}
