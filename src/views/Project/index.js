import $Project from '../../services/project'
import ToggleButton from '@vueform/toggle'
import { mapMutations, mapGetters } from 'vuex'
import swal2Config from '../../../swal2.config.json'
import { format, register } from 'timeago.js'

const localeFunc = (number, index, totalSec) => {
  return [
    ['Justo ahora', 'right now'],
    ['Hace %s segundos', 'En %s segundos'],
    ['Hace 1 minuto', 'En 1 minuto'],
    ['Hace %s minutos', 'En %s minutos'],
    ['Hace 1 hora', 'En 1 hora'],
    ['Hace %s horas', 'En %s horas'],
    ['Hace 1 día', 'En 1 día'],
    ['Hace %s días', 'En %s días'],
    ['Hace 1 semana', 'En 1 semana'],
    ['Hace %s semanas', 'En %s semanas'],
    ['Hace 1 mes', 'En 1 mes'],
    ['Hace %s meses', 'En %s meses'],
    ['Hace 1 año', 'En 1 año'],
    ['Hace %s años', 'En %s años']
  ][index]
}

register('es_ES', localeFunc)

const questionType = {
  1: 'rankingQuestions',
  2: 'hundredDollarsQuestions',
  6: 'kanoModelQuestions'
}

export default {
  name: 'Proyecto',
  title () {
    return `Proyecto: ${this.$route.params.projectName}`
  },
  components: {
    ToggleButton
  },
  data () {
    return {
      currentProject: $Project.getSchema(),
      currentProjectImage: null,
      currentProjectStatistics: {
        views: 0,
        likes: 0,
        dislikes: 0
      },
      modal: {
        createQuestion: false,
        createComment: false
      },
      rankingQuestions: [],
      hundredDollarsQuestions: [],
      kanoModelQuestions: [],
      newQuestion: {
        tipoConsulta: 1,
        pregunta: null,
        informacion: null,
        opciones: [],
        obligatorio: false
      },
      newComment: {},
      projectComments: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapMutations(['setLoading']),
    handleAddCronograma (element) {
      this.newQuestion.opciones.push(element)
    },
    handleRemoveCronograma (index) {
      this.newQuestion.opciones.splice(index, 1)
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
    async addQuestion () {
      this.setLoading(true)
      const { status } = await $Project.addQuestion(
        this.$route.params.projectName,
        this.newQuestion
      )
      if (status) {
        this[questionType[this.newQuestion.tipoConsulta]].push(this.newQuestion)
        this.newQuestion = {
          tipoConsulta: 1,
          pregunta: null,
          informacion: null,
          opciones: [],
          obligatorio: false
        }
        this.$swal({
          ...swal2Config.success,
          title: 'Pregunta creada correctamente.'
        })
        this.modal.createQuestion = false
      } else {
        this.$swal({
          ...swal2Config.error,
          title:
            'Hubo un error al crear pregunta. Inténtalo de nuevo más tarde.'
        })
      }
      this.setLoading(false)
    },
    async addComment () {
      if (!this.newComment.comentario) {
        this.$swal({
          ...swal2Config.error,
          title: 'Primero escribe un comentario.'
        })
        return
      }
      const commentData = {
        ...this.newComment,
        username: this.user.username,
        anonimo: false,
        fecha: new Date(),
        tiempo: ''
      }
      this.setLoading(true)
      const { status } = await $Project.insertComment(
        this.$route.params.projectName,
        commentData
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
      this.projectComments.push(commentData)
      this.newComment = {}
      this.setLoading(false)
    },
    async deleteComment (comment) {
      if (confirm('¿Estás seguro que quieres eliminar el comentario?')) {
        this.setLoading(true)
        const { status } = await $Project.deleteComment(
          this.$route.params.projectName,
          comment.id
        )
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: 'Comentario eliminado.'
          })
          this.projectComments = this.projectComments.filter(
            c => c.id !== comment.id
          )
        } else {
          this.$swal({
            ...swal2Config.error,
            title:
              'Hubo un error intentando eliminar el comentario. Inténtalo de nuevo más tarde.'
          })
        }
        this.setLoading(false)
      }
    },
    filterToCurrency (value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP'
      }).format(value)
    },
    filterFormatDate (date) {
      return format(new Date(date), 'es_ES')
    }
  },
  async beforeMount () {
    this.setLoading(true)

    const projectName = this.$route.params.projectName
    const self = this

    ;(async function () {
      const { data, status } = await $Project.getProject(projectName)
      if (status) {
        self.currentProject = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectImage(projectName)
      if (status) {
        self.currentProjectImage = `data:image/jpeg;base64,${data}`
      } else {
        self.currentProjectImage =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYMZt8DcAt94DmfTzFV7BGzcm3FLFr3XqnY4-0hKSC9h1n11jFKp-Nqo59cjKXLS8V8qY&usqp=CAU'
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectQuestions(projectName)
      if (status) {
        data.forEach(q => {
          self[questionType[q.tipoConsulta]].push(q)
        })
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getComments(projectName)
      if (status) {
        self.projectComments = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectViews(projectName)
      if (status) {
        self.currentProjectStatistics.views = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectLikes(projectName)
      if (status) {
        self.currentProjectStatistics.likes = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectDislikes(projectName)
      if (status) {
        self.currentProjectStatistics.dislikes = data
      }
    })()

    this.setLoading(false)
  }
}
