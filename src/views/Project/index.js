import $Project from '../../services/project'
import ToggleButton from '@vueform/toggle'
import { mapMutations } from 'vuex'
import swal2Config from '../../../swal2.config.json'

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
      newComment: { username: null, comment: null },
      projectComments: []
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
    handleAddCronograma (element) {
      this.newQuestion.opciones.push(element)
    },
    handleRemoveCronograma (index) {
      this.newQuestion.opciones.splice(index, 1)
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
          title: 'Hubo un error al crear pregunta. Inténtelo de nuevo.'
        })
      }
      this.setLoading(false)
    },
    async addComment () {}
  },
  async beforeMount () {
    this.setLoading(true)

    const projectName = this.$route.params.projectName
    const self = this

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

    this.setLoading(false)
  }
}