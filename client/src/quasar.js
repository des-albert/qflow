import Vue from 'vue'

import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import './styles/quasar.variables.styl'
import { Quasar, Notify } from 'quasar'

Vue.use(Quasar, {
  config: {
    notify: {}
  },

  components: {
    /* not needed if importStrategy is not 'manual' */
  },
  directives: {
    /* not needed if importStrategy is not 'manual' */
  },
  plugins: {
    Notify
  }
})
