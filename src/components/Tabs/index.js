export default {
  name: 'Tabs',
  props: {
    tabs: Array
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
