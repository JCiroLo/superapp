export default {
  name: 'TagInputs',
  props: {
    list: Array,
    type: String,
    placeholder: String,
    ordered: Boolean
  },
  data () {
    return {
      inputContent: null
    }
  },
  methods: {
    addElement () {
      if (this.inputContent) {
        this.$emit('addElement', this.inputContent)
        this.inputContent = null
      }
    },
    removeElement (index) {
      this.$emit('removeElement', index)
    }
  }
}
