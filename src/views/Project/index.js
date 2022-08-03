import { mapMutations, mapGetters } from 'vuex'

import $Project from '../../services/project'
import $Gamification from '../../services/project.gamification'
import $Question from '../../services/project.question'
import $Validator from '../../validations'
import $Utils from '../../services/utils'

import ToggleButton from '@vueform/toggle'
import ProjectQuestion from '../../components/ProjectQuestion/index.vue'
import swal2Config from '../../../swal2.config.json'

const questionType = {
  1: 'rankingQuestions',
  2: 'hundredDollarsQuestions',
  6: 'kanoModelQuestions',
  7: 'likertQuestions'
}

export default {
  name: 'Proyecto',
  title () {
    return `Proyecto: ${this.$route.params.projectId}`
  },
  components: {
    ToggleButton,
    ProjectQuestion
  },
  data () {
    return {
      currentProject: $Project.getSchema(),
      currentProjectImage: null,
      currentProjectStatistics: {},
      currentProjectGamitfication: $Gamification.getSchema(),
      modal: {
        createQuestion: false,
        createComment: false
      },
      rankingQuestions: [],
      hundredDollarsQuestions: [],
      likertQuestions: [],
      kanoModelQuestions: [],
      newQuestion: $Question.getSchema(),
      newComment: {
        comentario: null,
        anonimo: false
      },
      projectComments: [],
      actions: {
        question: '' // create or update
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
    projectTabs () {
      return [
        {
          id: 'slot_0',
          name: 'Resumen',
          icon: 'fas fa-info fa-fw',
          disabled: false
        },
        {
          id: 'slot_1',
          name: 'Gamificación',
          icon: 'fas fa-gift fa-fw',
          disabled: !this.currentProject.gamificacion
        },
        {
          id: 'slot_2',
          name: 'Preguntas',
          icon: 'fas fa-question fa-fw',
          disabled: false
        },
        {
          id: 'slot_3',
          name: 'Comentarios',
          icon: 'fas fa-comments fa-fw',
          disabled: false
        }
      ]
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
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

      if (!$Validator.objectIsValid(this.newQuestion)) {
        this.$swal({
          ...swal2Config.error,
          title: 'No pueden haber campos vacíos al crear la pregunta.'
        })
        this.setLoading(false)
        return
      }

      if (this.actions.question === 'create') {
        const { status } = await $Question.insertQuestion({
          ...this.newQuestion,
          idProyecto: this.$route.params.projectId
        })
        if (!status) {
          this.$swal({
            ...swal2Config.error,
            title:
              'Hubo un error al crear pregunta. Inténtalo de nuevo más tarde.'
          })
          this.setLoading(false)
          return
        }

        this[questionType[this.newQuestion.tipoConsulta]].push(this.newQuestion)
        this.newQuestion = $Question.getSchema()

        this.$swal({
          ...swal2Config.success,
          title: 'Pregunta creada correctamente.'
        })

        this.modal.createQuestion = false
      } else if (this.actions.question === 'update') {
        const { status } = await $Question.updateQuestion(this.newQuestion)
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: 'Pregunta actualizada correctamente.'
          })
        } else {
          this.$swal({
            ...swal2Config.error,
            title:
              'Hubo un error al actualizar la pregunta. Inténtalo de nuevo más tarde.'
          })
        }
      }

      this.setLoading(false)
    },
    async deleteQuestion ({ numeroPregunta }) {
      if (confirm('¿Estás seguro que quieres eliminar la pregunta?')) {
        const { status } = await $Question.deleteQuestion(
          this.$route.params.projectId,
          numeroPregunta,
          1
        )
        if (status) {
          this.$swal({
            ...swal2Config.success,
            title: 'Pregunta eliminada.'
          })
        }
      }
    },
    async addComment () {
      if (!this.newComment.comentario) {
        this.$swal({
          ...swal2Config.error,
          title: 'Primero escribe un comentario.'
        })
        return
      }
      this.setLoading(true)

      const newComment = {
        idProyecto: this.$route.params.projectId,
        username: this.user.username,
        comentario: this.newComment.comentario,
        fecha: new Date(),
        tiempo: new Date(),
        anonimo: this.newComment.anonimo
      }

      const { status } = await $Project.insertComment(
        this.$route.params.projectId,
        newComment
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

      this.projectComments.push(newComment)
      this.newComment = {}
      this.modal.createComment = false
      this.setLoading(false)
    },
    async deleteComment (comment) {
      if (confirm('¿Estás seguro que quieres eliminar el comentario?')) {
        this.setLoading(true)
        const { status } = await $Project.deleteComment(
          this.$route.params.projectId,
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
    formatCurrency (value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'COP'
      })
        .format(value)
        .replace('COP', '$')
    },
    formatSlashedDate: $Utils.formatSlashedDate,
    formatStringDate: $Utils.formatStringDate
  },
  async beforeMount () {
    this.setLoading(true)

    const projectId = this.$route.params.projectId
    const self = this

    ;(async function () {
      const { data, status } = await $Project.getProject(projectId)
      if (status) {
        self.currentProject = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Gamification.getGamification(projectId)
      if (status && data) {
        self.currentProjectGamitfication = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectImage(projectId)
      if (status) {
        self.currentProjectImage = `data:image/jpeg;base64,${data}`
      } else {
        self.currentProjectImage =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYMZt8DcAt94DmfTzFV7BGzcm3FLFr3XqnY4-0hKSC9h1n11jFKp-Nqo59cjKXLS8V8qY&usqp=CAU'
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectQuestions(projectId, 1)
      if (status) {
        data.forEach((q, index) => {
          if (Object.keys(questionType).includes(q.tipoConsulta.toString())) {
            self[questionType[q.tipoConsulta]].push(q)
          }
        })
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getComments(projectId)
      if (status) {
        self.projectComments = data
      }
    })()
    ;(async function () {
      const { data, status } = await $Project.getProjectStatistics(projectId, 1)
      if (status) {
        console.log(data)
        self.currentProjectStatistics = data
      }
    })()

    this.setLoading(false)
  }
}
