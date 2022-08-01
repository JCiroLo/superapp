import { mapGetters, mapMutations } from 'vuex'
import $Project from '../../services/project'
import $Gamification from '../../services/project.gamification'
import $Validator from '../../validations'
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
  computed: {
    ...mapGetters(['user', 'getSearch']),
    filteredProjects () {
      if (this.getSearch) {
        return this.projects.filter(p =>
          p.nombre.toLowerCase().includes(this.getSearch.toLowerCase())
        )
      }
      return this.projects
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    showAlert (status, title) {
      // status: error | success | warning
      this.$swal({
        ...swal2Config[status],
        title
      })
    },
    async deleteProject () {
      this.setLoading(true)
      const { status } = await $Project.requestDeleteProject(
        this.projectToDelete.codigoProyecto
      )
      this.projectToDelete = null
      status
        ? this.showAlert(
            'success',
            'Se ha creado una petición para eliminar proyecto'
          )
        : this.showAlert(
            'error',
            'Error al intentar eliminar proyecto. Inténtelo de nuevo más tarde'
          )
      this.setLoading(false)
    },
    async toggleModalVisibility (action, payload) {
      this.action = action
      this.modalVisibility = !this.modalVisibility
      if (payload) {
        // LOAD GAMIFICATION
        const { data, status } = await $Gamification.getGamification(
          payload.codigoProyecto
        )
        if (!status) {
          this.showAlert(
            'warning',
            'No se pudo cargar  la gamificación del proyecto'
          )
        } else {
          this.newGamification = data
        }

        this.currentProject = payload
        return
      }
      if (action === 'close') {
        this.currentProject = $Project.getSchema()
        this.newGamification = $Gamification.getCreateSchema()
        this.thumbnail = null
        this.currentTab = 0
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
    async switchProjectStatus (project) {
      const { status, data } = await $Project.switchProjectStatus(
        project.codigoProyecto
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
      const mistakes = []

      // Validations
      if (!$Validator.objectIsValid(this.currentProject, ['creador'])) {
        this.$swal({
          ...swal2Config.error,
          title: 'No pueden haber campos vacíos en el proyecto.'
        })
        this.setLoading(false)
        return
      }

      if (this.currentProject.gamificacion) {
        if (
          !$Validator.objectIsValid(this.newGamification, [
            'usuariosGanadores',
            'usuariosParticipantes'
          ])
        ) {
          this.$swal({
            ...swal2Config.error,
            title: 'No pueden haber campos vacíos en la gamificación.'
          })
          this.setLoading(false)
          return
        }
      }

      if (this.action === 'create') {
        // PROJECT
        const {
          status: statusProject,
          data: projectId
        } = await $Project.createProject(this.currentProject, this.user)

        if (!statusProject) {
          this.$swal({
            ...swal2Config.error,
            title: 'No se pudo crear el proyecto'
          })
          this.setLoading(false)
          return
        }

        // GAMIFICATION

        const {
          status: statusGamification
        } = await $Gamification.updateGamification(
          projectId,
          this.newGamification
        )

        if (!statusGamification) {
          mistakes.push('No se pudo crear la gamificación.')
        }

        // THUMBNAIL

        const {
          status: statusThumnb,
          data: dataThumb
        } = await $Project.insertImage(projectId, this.thumbnail)

        if (!statusThumnb) {
          mistakes.push('No se pudo subir la imagen.')
        }

        if (mistakes.length > 0) {
          this.$swal({
            ...swal2Config.warning,
            title: mistakes.join(' \n')
          })
          this.setLoading(false)
          this.toggleModalVisibility('close')
          return
        }

        this.$swal({
          ...swal2Config.success,
          title: 'Proyecto creado exitosamente.'
        })

        this.projects.push({
          ...this.currentProject,
          codigoProyecto: projectId,
          thumbnail: this.renderThumbnail(this.thumbnail)
        })
        this.toggleModalVisibility('close')
      } else if (this.action === 'edit') {
        // PROJECT
        const {
          status: statusProject,
          data: dataProject
        } = await $Project.updateProject(this.currentProject)

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
          const {
            status: statusGamification
          } = await $Gamification.updateGamification(
            this.currentProject.codigoProyecto,
            this.newGamification
          )

          if (!statusGamification) {
            this.$swal({
              ...swal2Config.warning,
              title: 'No se pudo actualizar la gamificación.'
            })
          }
        }

        // THUMBNAIL

        if (this.thumbnail) {
          const {
            status: statusThumnb,
            data: dataThumb
          } = await $Project.insertImage(
            this.currentProject.codigoProyecto,
            this.thumbnail
          )

          if (!statusThumnb) {
            this.$swal({
              ...swal2Config.warning,
              title: 'No se pudo subir la imagen.'
            })
          }
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

    const { status, data } = await $Project.getProjects()

    console.log(data)

    if (status) {
      if (data.length === 0) {
        this.errorProjects = {
          status: true,
          message: 'No existe ningún proyecto, crea uno primero'
        }
      } else {
        this.projects = await Promise.all(
          data.map(async p => {
            const img = await this.getThumbnail(p.codigoProyecto)
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
