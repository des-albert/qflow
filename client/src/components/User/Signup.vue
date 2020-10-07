<template>
  <q-page class="bg-page row justify-center q-py-md">
    <div class="col-6">
      <q-card class="bg-card text-txtNormal justify-center">
        <q-card-section class="col-6">
          <div class="text-h6">Create qFlow Account </div>
        </q-card-section>

        <!--     Error Alert -->

        <div class="row" v-if="error" justify="center">
          <form-alert :message="error.message" />
        </div>

        <!--    Signup Form -->

        <q-form @submit="handleSignupUser" v-model="isFormValid" ref="form">
          <q-card-section>
            <q-input color="blue" filled clearable v-model="username" label="Username" type="text" :rules="usernameRules">
              <template v-slot:prepend>
                <q-icon name="face" />
              </template>
            </q-input>

            <q-input color="blue" filled clearable v-model="email" label="Email" type="email" :rules="emailRules">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <q-input color="blue" filled clearable v-model="fullname" label="Full Name" type="text" :rules="fullnameRules">
              <template v-slot:prepend>
                <q-icon name="face" />
              </template>
            </q-input>

            <q-input color="blue" filled clearable v-model="password" label="Password" :rules="passwordRules">
              <template v-slot:prepend>
                <q-icon name="fingerprint" />
              </template>
            </q-input>

            <q-input color="blue" filled clearable v-model="passwordConfirmation" label="Confirm Password" :rules="passwordRules">
              <template v-slot:prepend>
                <q-icon name="fingerprint" />
              </template>
            </q-input>

            <q-select fill-input :options="roles" v-model="role" label="Role">
              <template v-slot:prepend>
                <q-icon name="group" />
              </template>
            </q-select>

          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn no-caps size="lg" class="bg-button full-width" :disabled:="!isFormValid" type="submit">
              <span slot="loader" class="custom-loader">
                <q-icon light>cached</q-icon>
              </span>
              Sign up
            </q-btn>
          </q-card-actions>
        </q-form>

      </q-card>
    </div>

  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Signup',

  data() {
    return {
      isFormValid: true,
      username: '',
      email: '',
      fullname: '',
      password: '',
      role: '',
      passwordConfirmation: '',
      usernameRules: [(username) => !!username || 'Username is required', (username) => username.length < 10 || 'Username must be less than 10 characters'],
      fullnameRules: [(fullname) => !!fullname || 'Full Name is required'],
      emailRules: [(email) => !!email || 'Email is required', (email) => /.@+./.test(email) || 'Email must be valid'],
      passwordRules: [
        (password) => !!password || 'Password is required',
        (password) => password.length >= 4 || 'Username must be at least 4 characters',
        (confirmation) => confirmation === this.password || 'Passwords must match'
      ],
      roles: ['Requester', 'Manager', 'Assignee']
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user', 'defaultTheme'])
  },
  watch: {
    user(value) {
      // if user changes redirect to home page

      if (value) {
        this.$router.push('/tasks')
      }
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          fullname: this.fullname,
          password: this.password,
          role: this.role,
          theme: JSON.stringify(this.defaultTheme)
        })
      }
    }
  }
}
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>