import { mapGetters, mapMutations } from 'vuex'
import $Project from '../../services/project'
import $Gamification from '../../services/project.gamification'
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
      sidebarItems: [
        { title: 'Dashboard', icon: 'fa-th-large', route: 'Home' },
        { title: 'Estadísitcas', icon: 'fa-analytics', route: 'Analytics' }
      ],
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
      newGamification: $Gamification.getCreateSchema(),
      action: null,
      projectToDelete: null, // ID
      thumbnail: null
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
        console.log(payload)
        return
      }
      if (action === 'close') {
        this.currentProject = $Project.getSchema()
      }
    },
    nextTab (action, goto = false) {
      if (goto) {
        this.currentTab = action
        return
      }

      if (action === 'next') {
        if (this.currentTab === 0 && !this.currentProject.gamificacion) {
          this.currentTab += 2
        }
        if (this.currentTab !== 2) {
          this.currentTab++
        }
      } else if (action === 'prev') {
        if (this.currentTab === 2 && !this.currentProject.gamificacion) {
          this.currentTab -= 2
        }
        if (this.currentTab !== 0) {
          this.currentTab--
        }
      }
    },
    handleChangeImage (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.thumbnail = files[0]
    },
    renderThumbnail () {
      return this.thumbnail ? URL.createObjectURL(this.thumbnail) : null
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
        !this.currentProject.localizacion[0] ||
        !this.currentProject.localizacion[1] ||
        !this.currentProject.presupuesto ||
        !this.currentProject.fecha ||
        !this.currentProject.mensajeParticipacion ||
        !this.thumbnail
      ) {
        this.$swal({
          ...swal2Config.error,
          title: 'No pueden haber campos vacíos.'
        })
        this.setLoading(false)
        return
      }

      if (this.action === 'create') {
        // PROJECT

        const {
          status: statusProject,
          data: dataProject
        } = await $Project.createProject(this.currentProject, this.user)

        if (!statusProject) {
          this.$swal({
            ...swal2Config.error,
            title: dataProject
          })
          this.setLoading(false)
          return
        }

        // GAMIFICATION

        if (this.currentProject.gamificacion) {
          console.log(this.newGamification)

          const {
            status: statusGamification
          } = await $Gamification.insertGamification(
            this.currentProject.nombre,
            this.newGamification
          )

          if (!statusGamification) {
            this.$swal({
              ...swal2Config.warning,
              title: 'No se pudo crear la gamificación.'
            })
          }
        }

        // THUMBNAIL

        const {
          status: statusThumnb,
          data: dataThumb
        } = await $Project.insertImage(
          this.currentProject.nombre,
          this.thumbnail
        )

        if (!statusThumnb) {
          this.$swal({
            ...swal2Config.warning,
            title: 'No se pudo subir la imagen.'
          })
        } else {
          this.$swal({
            ...swal2Config.success,
            title: 'Proyecto creado exitosamente.'
          })
          this.projects.push(this.currentProject)
          this.toggleModalVisibility('close')
        }
      } else if (this.action === 'edit') {
        const {
          status: statusProject,
          data: dataProject
        } = await $Project.updateProject(this.currentProject, this.user)

        if (!statusProject) {
          this.$swal({
            ...swal2Config.error,
            title: dataProject
          })
          this.setLoading(false)
          return
        }

        this.$swal({
          ...swal2Config.success,
          title: 'Proyecto actualizado exitosamente.'
        })

        // ACTUALIZAR EL PROYECTO EN LA LISTA

        this.toggleModalVisibility('close')
      }

      this.setLoading(false)
    },
    async getThumbnail (projectName) {
      const { status, data } = await $Project.getProjectImage(projectName)
      if (status) {
        return `data:image/jpeg;base64,${data}`
      }
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYMZt8DcAt94DmfTzFV7BGzcm3FLFr3XqnY4-0hKSC9h1n11jFKp-Nqo59cjKXLS8V8qY&usqp=CAU'
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
        this.projects = await Promise.all(
          data.map(async p => {
            const img = await this.getThumbnail(p.nombre)
            return { ...p, thumbnail: img }
          })
        )
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
