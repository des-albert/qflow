import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

import { colors } from 'quasar'

const defaultTheme = {
  card: '#d5aca9',
  button: '#9693bd',
  sideNav: '#bdb6ac',
  appBar: '#82a3a1',
  page: '#dfdebe',
  comment: '#e3b5a4',
  txtNormal: '#508CA4',
  txtBold: '#27476E'
}

//  Set default brands

Object.keys(defaultTheme).forEach(element => {
  colors.setBrand(element, defaultTheme[element])
})
store.commit('saveDefault', defaultTheme)

colors.setBrand('swatch', '#b9d6f2')

Vue.use(VueApollo)

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }

    // operation adds token to an authorization header

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError)
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err)
        if (err.name === 'AuthenticationError') {
          // set Auth Error in state
          store.commit('setAuthError', err)
          // signout user (to clear token)
          store.dispatch('signoutUser')
        }
      }
    }
  }
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),

  created() {
    this.$store.dispatch('getCurrentUser')
    this.$store.dispatch('getAssignees')
  }
}).$mount('#app')
