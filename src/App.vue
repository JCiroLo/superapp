<template>
  <Loader :show="loading" />
  <Navbar />
  <div class="super-app-city">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import { mapMutations, mapGetters } from 'vuex'
import Navbar from './components/Navbar/index.vue'
import swal2Config from '../swal2.config.json'

export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: {
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    ...mapMutations(['loginUser'])
  },
  beforeMount () {
    if (!sessionStorage.userData) {
      return
    }
    try {
      const currentSession = JSON.parse(
        Buffer.from(
          window.sessionStorage.getItem('userData'),
          'base64'
        ).toString('utf8')
      )

      if (new Date().getTime() >= currentSession.expirationTime) {
        sessionStorage.removeItem('userData')
        this.$swal({
          ...swal2Config.error,
          title: 'Sesión expirada'
        })
        return
      }
      this.loginUser(currentSession)
      console.log(currentSession)

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${currentSession.access_token}`
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

@import './assets/scss/Buttons.scss';
@import './assets/scss/Form.scss';
@import './assets/scss/Card.scss';
@import '~@vueform/toggle/themes/default.css';
@import './assets/scss/Transitions.scss';

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  color: $font-color;
  background-color: #f0f2f5;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #ccc;

  &:hover {
    background-color: #bbb;
  }
}

.super-app-city {
  margin-top: $navbar-height;
}

.toggle-green {
  --toggle-bg-on: #{$primary};
  --toggle-border-on: #{$primary};

  &:focus {
    box-shadow: none !important;
  }
}
</style>
