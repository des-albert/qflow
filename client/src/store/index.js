import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router'
import { apolloClient } from '../main'

import {
  ADD_TASK,
  GET_ALL_TASKS,
  GET_REQUEST_TASKS,
  GET_ASSIGN_TASKS,
  CHANGE_STATUS,
  GET_CURRENT_USER,
  GET_ASSIGNEES,
  SIGNIN_USER,
  SIGNUP_USER,
  SAVE_THEME
} from '../queries'

import { colors } from 'quasar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    assignees: [],
    error: null,
    loading: false,
    tasks: [],
    buckets: {},
    user: null,
    theme: {},
    defaultTheme: {}
  },
  mutations: {
    clearError: state => (state.error = null),

    clearUser: state => (state.user = null),

    newTask: (state, payload) => {
      state.tasks.push(payload)
    },

    setAssignees: (state, payload) => {
      state.assignees = payload
    },

    setAuthError: (state, payload) => {
      state.authError = payload
    },

    setLoading: (state, payload) => {
      state.loading = payload
    },

    setError: (state, payload) => {
      state.error = payload
    },

    setTasks: (state, payload) => {
      state.tasks = payload

      var result = {
        created: [],
        assigned: [],
        'in progress': [],
        'on hold': [],
        complete: [],
        archive: []
      }
      for (var i = 0; i < state.tasks.length; ++i) {
        for (var item in result) {
          if (state.tasks[i].status == item) result[item].push(state.tasks[i])
        }
      }

      state.buckets = result
    },

    resetTheme: state => {
      state.theme = state.defaultTheme
      Object.keys(state.theme).forEach(element => {
        colors.setBrand(element, state.theme[element])
      })
    },

    setTheme: (state, payload) => {
      state.theme = payload
      Object.keys(state.theme).forEach(element => {
        colors.setBrand(element, state.theme[element])
      })
    },

    saveDefault: (state, payload) => {
      state.defaultTheme = payload
    },

    setUser: (state, payload) => {
      state.user = payload
    }
  },
  actions: {
    // Task Queries

    addTask: ({ commit }, payload) => {
      commit('setLoading', true)

      apolloClient
        .mutate({
          mutation: ADD_TASK,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false)
          commit('addTask', data.addTask)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },

    getAllTasks: ({ commit }) => {
      commit('setLoading', true)

      apolloClient
        .query({
          query: GET_ALL_TASKS
        })
        .then(({ data }) => {
          commit('setTasks', data.getAllTasks)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },

    getRequestTasks: ({ commit }, payload) => {
      commit('setLoading', true)

      // use Apollo client to fire action

      apolloClient
        .query({
          query: GET_REQUEST_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setTasks', data.getRequestTasks)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },

    getAssignTasks: ({ commit }, payload) => {
      commit('setLoading', true)

      // use Apollo client to fire action

      apolloClient
        .query({
          query: GET_ASSIGN_TASKS,
          variables: payload
        })
        .then(({ data }) => {
          commit('setTasks', data.getAssignTasks)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },

    // User Queries

    getCurrentUser: ({ commit }) => {
      commit('setLoading', true)
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit('setLoading', false)
          commit('setUser', data.getCurrentUser)

          if (data.getCurrentUser) {
            commit('setTheme', JSON.parse(data.getCurrentUser.theme))
            localStorage.setItem('role', data.getCurrentUser.role)
            localStorage.setItem('fullname', data.getCurrentUser.fullname)
          }
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },

    getAssignees: ({ commit }) => {
      apolloClient
        .query({
          query: GET_ASSIGNEES
        })
        .then(({ data }) => {
          commit('setAssignees', data.getAssignees)
        })
        .catch(err => {
          console.error(err)
        })
    },

    // Mutations

    assignTask: ({}, payload) => {
      apolloClient
        .mutate({
          mutation: ASSIGN_TASK,
          variables: payload
        })
        .then(({ data }) => {})
        .catch(err => {
          console.error(err)
        })
    },

    changeStatus: ({}, payload) => {
      apolloClient
        .mutate({
          mutation: CHANGE_STATUS,
          variables: payload
        })
        .then(({ data }) => {})
        .catch(err => {
          console.error(err)
        })
    },

    saveTheme: ({ commit }, payload) => {
      commit('clearError')
      commit('setLoading', true)
      commit('setTheme', JSON.parse(payload.theme))

      apolloClient
        .mutate({
          mutation: SAVE_THEME,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.error(err)
        })
    },

    signupUser: ({ commit }, payload) => {
      commit('clearError')
      commit('setLoading', true)

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false)

          localStorage.setItem('token', data.signupUser.token)

          router.go()
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.error(err)
        })
    },

    signinUser: ({ commit }, payload) => {
      localStorage.setItem('token', '')
      commit('clearError')
      commit('setLoading', true)

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit('setLoading', false)
          localStorage.setItem('token', data.signinUser.token)

          router.go()
        })
        .catch(err => {
          commit('setLoading', false)
          commit('setError', err)
          console.error(err)
        })
    },

    signoutUser: async ({ commit }) => {
      // clear user in state

      commit('clearUser')
      commit('resetTheme')

      // remove token from localStorage

      await localStorage.setItem('token', '')
      await localStorage.setItem('role', '')

      // end Session

      await apolloClient.resetStore()

      // redirect to home

      await router.push('/')
    }
  },
  getters: {
    assignees: state => state.assignees,
    authError: state => state.authError,
    error: state => state.error,
    loading: state => state.loading,
    searchResults: state => state.searchResults,
    tasks: state => state.tasks,
    buckets: state => state.buckets,
    user: state => state.user,
    theme: state => state.theme,
    defaultTheme: state => state.defaultTheme
  },
  modules: {}
})
