export default {
  name: 'ToggleButton',
  props: {
    state: Boolean
  },
  methods: {
    toggleState () {
      this.$emit('toggleState')
    }
  }
}
