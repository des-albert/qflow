<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-appBar">
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="menu" />
        <q-toolbar-title>
          qFlow
        </q-toolbar-title>

        <q-btn no-caps flat v-if="user">User: {{ user.fullname }} </q-btn>
        <q-btn no-caps flat v-for="item in navItems" :key="item.title" :to="item.link">
          <q-icon :name="item.icon" />
          {{ item.title }}
        </q-btn>

        <q-btn no-caps flat v-if="user" icon="account_box" to="/profile">
          Profile
        </q-btn>

        <!-- Signout Button -->

        <q-btn no-caps flat v-if="user" icon="exit_to_app" @click="handleSignoutUser">
          Sign out
        </q-btn>

      </q-toolbar>
    </q-header>

    <!-- Side Navbar Links -->

    <q-drawer v-model="leftDrawerOpen" show-if-above behavior="desktop" elevated content-class="bg-sideNav">
      <q-list>
        <q-item v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- App Content -->

    <q-page-container class="bg-page">
      <transition name="fade" mode="out-in" duration="250">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LayoutDefault',

  components: {},

  data() {
    return {
      leftDrawerOpen: false,
      authSnackbar: false
    }
  },

  computed: {
    ...mapGetters(['user']),

    navItems() {
      let items = [
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.user) {
        items = [{ icon: 'chat', title: 'Tasks', link: '/tasks' }]
      }
      return items
    },

    sideNavItems() {
      let items = [
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]

      if (this.user) {
        if (this.user.role == 'Requester') {
          items = [
            { icon: 'chat', title: 'Tasks', link: '/tasks' },
            { icon: 'stars', title: 'Create Task', link: '/addTask' },
            { icon: 'account_box', title: 'Profile', link: '/profile' },
            { icon: 'brush', title: 'Colors', link: '/colors' },
            { icon: 'help_outline', title: 'About', link: '/about' }
          ]
        } else {
          items = [
            { icon: 'chat', title: 'Tasks', link: '/tasks' },
            { icon: 'account_box', title: 'Profile', link: '/profile' },
            { icon: 'brush', title: 'Colors', link: '/colors' },
            { icon: 'help_outline', title: 'About', link: '/about' }
          ]
        }
      }

      return items
    }
  },

  watch: {
    user(value) {
      if (value) this.showNotify()
    }
  },

  methods: {
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    },
    showNotify() {
      this.$q.notify({
        message: 'You are now signed in',
        color: 'bg-comment',
        icon: 'announcement'
      })
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
