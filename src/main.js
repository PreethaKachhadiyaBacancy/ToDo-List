import Vue from 'vue'
import App from './App.vue'
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.use(Toaster);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


