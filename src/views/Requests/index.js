import $Project from '../../services/project'
import { mapMutations } from 'vuex'
import swal2Config from '../../../swal2.config.json'

export default {
  name: 'Peticiones',
  data () {
    return {
      requests: []
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    async confirmRequest (project) {
      this.setLoading(true)
      const { status, data } = await $Project.deleteProject(project.nombre)
      if (status) {
        this.$swal({
          ...swal2Config.success,
          title: data
        })
      } else {
        this.$swal({
          ...swal2Config.error,
          title: data
        })
      }
      this.setLoading(false)
    },
    cancelRequest (project) {
      this.$swal({
        ...swal2Config.warning,
        title: 'Funcionalidad no disponible'
      })
    }
  },
  async beforeMount () {
    this.setLoading(true)
    const { status, data } = await $Project.getInterventorProjects()
    if (status) {
      this.requests = data
    }
    console.log(data)
    this.setLoading(false)
  }
}
