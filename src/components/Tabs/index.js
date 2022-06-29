export default {
  name: 'Tabs',
  props: {
    tabs: Array,
    vertical: Boolean
  },
  data () {
    return {
      selectedTab: null
    }
  },
  computed: {
    currentTab () {
      return this.selectedTab || this.tabs.at(0).id
    }
  }
}
