export default {
  name: 'TagInputs',
  props: {
    tags: Array,
    type: String,
    placeholder: String
  },
  data () {
    return {
      inputContent: null
    }
  },
  methods: {
    addElement () {
      if (this.inputContent) {
        this.$emit('addTag', this.inputContent)
        this.inputContent = null
      }
    },
    removeElement (index) {
      this.$emit('removeTag', index)
    }
  }
}
