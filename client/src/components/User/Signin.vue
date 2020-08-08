<template>
  <q-page class="bg-page row justify-center q-py-md">
    <div class="col-6">
      <q-card class="bg-card text-txtNormal row justify-center">
        <q-form @submit="handleSigninUser" v-model="isFormValid" ref="form">
          <q-card-section>
            <span class="text-h5">Welcome back to qFlow</span>
          </q-card-section>

          <q-card-section>
            <q-input filled clearable v-model="username" label="Username" :rules="usernameRules">
              <template v-slot:prepend>
                <q-icon name="face" />
              </template>
            </q-input>

            <q-input filled clearable color="blue" v-model="password" label="Password" :rules="passwordRules">
              <template v-slot:prepend>
                <q-icon name="fingerprint" />
              </template>
            </q-input>

          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn no-caps size="lg" class="bg-button full-width" :disabled:="!isFormValid" type="submit">
              Sign in
            </q-btn>
          </q-card-actions>
          <q-card-section class="text-txtNormal">
            Don't have an account ?
            <router-link to="/signup">Sign-up</router-link>
          </q-card-section>
        </q-form>
      </q-card>
    </div>

  </q-page>

</template>

<script>
import { mapGetters } from 'vuex'
import { colors } from 'quasar'
export default {
  name: 'Signin',
  data() {
    return {
      isFormValid: true,
      username: '',
      usernameRules: [(username) => !!username || 'Username is required', (username) => username.length < 10 || 'Username must be less than 10 characters'],
      password: '',
      passwordRules: [(password) => !!password || 'Password is required', (password) => password.length >= 4 || 'Username must be at least 4 characters']
    }
  },
  computed: {
    ...mapGetters(['user'])
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
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        })
      }
    }
  }
}
</script>
<style lang="sass">
.my-card
  width: 100%
  max-width: 250px

.custom-loader 
  animation: loader 1s infinite;
  display: flex;

@-moz-keyframes loader 
  from 
  transform: rotate(0);
  to 
  transform: rotate(360deg);

@-webkit-keyframes loader 
  from 
  transform: rotate(0);
  to 
  transform: rotate(360deg);
@-o-keyframes loader 
  from 
  transform: rotate(0);
  to 
  transform: rotate(360deg);

@keyframes loader 
  from 
  transform: rotate(0);
  to 
  transform: rotate(360deg);
</style>