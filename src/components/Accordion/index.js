export default {
  name: 'Accordion',
  props: {
    collapsed: Boolean
  },
  data () {
    return {
      state: this.collapsed
    }
  },
  methods: {
    toggleState () {
      this.state = !this.state
    }
  }
}
