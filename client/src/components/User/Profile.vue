<template>
  <q-page v-if="user" class="bg-page row justify-center q-py-md">
    <div class="col-6">

      <!--    User Details  -->

      <q-card class="bg-card">

        <q-card-section>
          <div class="row">
            <div class="col-4">
              <img :src="user.avatar" />
            </div>
            <div class="col-4">
              <p class="text-txtBold text-h5" align="center">User Details</p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="profile text-txtBold">Username: </span><span class="value text-txtNormal">{{ user.username }} </span>
        </q-card-section>
        <q-card-section>
          <span class="profile text-txtBold">Full Name: </span><span class="value text-txtNormal">{{ user.fullname }} </span>
        </q-card-section>
        <q-card-section>
          <span class="profile text-txtBold">Email: </span><span class="value text-txtNormal">{{ user.email }}</span>
        </q-card-section>
        <q-card-section>
          <span class="profile text-txtBold">Role: </span><span class="value text-txtNormal">{{ user.role }}</span>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user'])
  }
}
</script>
<style lang="sass" scoped>
.profile 
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';

.value 
  font-size: 20px;
  font-family: 'Open Sans';

</style>