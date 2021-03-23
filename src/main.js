import Vue from 'vue'
import App from './App.vue'
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')


