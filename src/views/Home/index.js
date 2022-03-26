import { mapGetters, mapMutations } from 'vuex'
import $Project from '../../services/project'
import swal2Config from '../../../swal2.config.json'

import ToggleButton from '@vueform/toggle'

export default {
  name: 'Home',
  title: 'Proyectos',
  components: {
    ToggleButton
  },
  data () {
    return {
      projects: [],
      errorProjects: {
        status: false,
        message: ''
      },
      errorModal: {
        status: false,
        message: ''
      },
      modalVisibility: false,
      currentTab: 0,
      currentProject: $Project.getSchema(),
      action: null,
      projectToDelete: null // ID
    }
  },
  filters: {
    toCurrency (value) {
      if (typeof value !== 'number') {
        return value
      }
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })
      return formatter.format(value)
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapMutations(['setLoading']),
    async deleteProject () {
      this.setLoading(true)
      await $Project.requestDeleteProject(this.projectToDelete.nombre)
      this.projectToDelete = null
      this.setLoading(false)
    },
    toggleModalVisibility (action, payload) {
      this.action = action
      this.modalVisibility = !this.modalVisibility
      if (payload) {
        this.currentProject = payload
        return
      }
      if (action === 'close') {
        this.currentProject = $Project.getSchema()
      }
    },
    nextTab (action, goto = false) {
      if (
        (this.currentTab === 0 && action === -1) ||
        (this.currentTab === 1 && action === 1)
      ) {
        return
      }
      if (goto) {
        this.currentTab = action
        return
      }
      this.currentTab += action
    },
    handleAddCronograma (element) {
      this.currentProject.cronograma.push(element)
    },
    handleRemoveCronograma (index) {
      this.currentProject.cronograma.splice(index, 1)
    },
    handleAddPalabraClave (element) {
      this.currentProject.palabrasClave.push(element)
    },
    handleRemovePalabraClave (index) {
      this.currentProject.palabrasClave.splice(index, 1)
    },
    async switchProjectStatus (project) {
      const { status, data } = await $Project.switchProjectStatus(
        project.nombre
      )
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
    },
    async handleSubmitProjectForm () {
      this.setLoading(true)
      // Validations
      if (
        !this.currentProject.nombre ||
        !this.currentProject.resumen ||
        !this.currentProject.descripcion ||
        !this.currentProject.objetivos ||
        !this.currentProject.principalItos ||
        this.currentProject.cronograma.length === 0 ||
        this.currentProject.palabrasClave.length === 0 ||
        !this.currentProject.localizacionLong ||
        !this.currentProject.localizacionLat ||
        !this.currentProject.presupuesto ||
        !this.currentProject.fecha
      ) {
        this.$swal({
          ...swal2Config.error,
          title: 'No pueden haber campos vacíos.'
        })
        this.setLoading(false)
        return
      }

      this.currentProject.creador = this.user.username
      this.currentProject.fecha = new Date(
        this.currentProject.fecha
      ).toLocaleDateString('en-CA')

      const {
        localizacionLong,
        localizacionLat,
        ...newProject
      } = this.currentProject
      newProject.localizacion = [localizacionLong, localizacionLat]

      const { status, data } = await $Project.createProject(newProject)

      if (!status) {
        this.$swal({
          ...swal2Config.error,
          title: data
        })
      } else {
        this.$swal({
          ...swal2Config.success,
          title: 'Proyecto creado exitosamente.'
        })
        this.projects.push(newProject)
        this.toggleModalVisibility('close')
      }

      this.setLoading(false)
    }
  },
  async beforeMount () {
    this.setLoading(true)

    const { status, data } = await $Project.getUserProjects()

    if (status) {
      if (data.length === 0) {
        this.errorProjects = {
          status: true,
          message: 'No existe ningún proyecto, crea uno primero'
        }
      } else {
        this.projects = data
      }
    } else {
      this.errorProjects = {
        status: true,
        message: data
      }
    }

    this.setLoading(false)
  }
}
