import $Analytics from '../../services/analytics'
import $Project from '../../services/project'
import ToggleButton from '@vueform/toggle'
import { mapMutations } from 'vuex'

export default {
  name: 'Analytics',
  title: 'Estadísticas',
  components: {
    ToggleButton
  },
  data () {
    return {
      sidebarItems: [
        { title: 'Dashboard', icon: 'fa-th-large', route: 'Home' },
        { title: 'Estadísitcas', icon: 'fa-analytics', route: 'Analytics' }
      ],
      interactions: [],
      chartData: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setLoading']),
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

    const {
      status,
      data: interactions
    } = await $Analytics.getUserInteractions()

    if (status) {
      this.interactions = await Promise.all(
        interactions.map(async p => {
          const img = await this.getThumbnail(p.nombre)
          return { ...p, thumbnail: img }
        })
      )
    }

    // this.interactions = console.log(interactions)

    this.setLoading(false)
  }
}
