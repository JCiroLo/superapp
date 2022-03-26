import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import titleMixin from './mixins/titleMixin'

import VueSweetalert2 from 'vue-sweetalert2'

import Accordion from './components/Accordion/index.vue'
import Modal from './components/Modal/index.vue'
import Loader from './components/Loader/index.vue'
import TagInput from './components/TagInput/index.vue'
import ListInput from './components/ListInput/index.vue'

import 'sweetalert2/dist/sweetalert2.min.css'

createApp(App)
  .use(store)
  .use(router)
  .use(VueSweetalert2)
  .component('Accordion', Accordion)
  .component('Modal', Modal)
  .component('Loader', Loader)
  .component('TagInput', TagInput)
  .component('ListInput', ListInput)
  .mixin(titleMixin)
  .mount('#app')
