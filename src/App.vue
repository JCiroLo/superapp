<template>
  <Loader :show="loading" />
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from './components/Navbar/index.vue'
import { mapMutations, mapGetters } from 'vuex'
import swal2Config from '../swal2.config.json'

export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapMutations(['loginUser'])
  },
  beforeMount () {
    try {
      const currentSession = JSON.parse(
        Buffer.from(
          window.sessionStorage.getItem('userData'),
          'base64'
        ).toString('utf8')
      )

      if (new Date().getTime() >= currentSession.expirationTime) {
        sessionStorage.removeItem('userData')
        console.log('Sesión expirada')
        this.$swal({
          ...swal2Config.error,
          title: 'Sesión expirada'
        })
        return
      }
      this.loginUser(currentSession)
    } catch (e) {}
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import './assets/scss/Buttons.scss';
@import './assets/scss/Form.scss';
@import '~@vueform/toggle/themes/default.css';

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  color: $font-color;
}

.toggle-green {
  --toggle-bg-on: #{$primary};
  --toggle-border-on: #{$primary};

  &:focus {
    box-shadow: none;
  }
}
</style>
