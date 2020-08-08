<template>
  <div class="q-pa-md row justify-center q-gutter-md">
    <q-card class="bg-signInForm text-horizNav">
      <q-card-section>
        <div class="text-h6">Create New Task
        </div>
      </q-card-section>
    </q-card>
    <q-separator />

    <div class="col-8">
      <q-form @submit="handleAddTask" v-model="isFormValid" ref="form">
        <q-input color="blue" v-model="title" label="Title" type="text" :rules="titleRules" required />

        <!--  Description Text Area -->

        <q-input color="blue" v-model="description" label="Description" type="textarea" :rules="descRules" required />

        <!--  Priority -->
        <q-select :options="priorities" v-model="priority" label="Priority" required />

        <!--  Due Date -->

        <div class="flex-break q-py-md" />
        <div class="row justify-center">
          <q-date v-model="dueDate" today-btn :default-year-month="minDate" title="Select Due Date" color="blue-grey-7" class="bg-signInForm">
          </q-date>
        </div>
        <div class="flex-break q-py-md" />
        <div class="row justify-center">

          <q-btn no-caps class="bg-button" :disabled:="!isFormValid" type="submit">
            Submit
          </q-btn>
        </div>
      </q-form>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'AddTask',

  data() {
    return {
      dialogOpen: false,
      isFormValid: true,
      title: '',
      description: '',
      priority: '',
      dueDate: new Date().toISOString().substr(0, 10),
      titleRules: [(title) => !!title || 'Title is required', (title) => title.length < 20 || 'Title must have less than 20 characters'],
      descRules: [(desc) => !!desc || 'Description is required', (desc) => desc.length < 200 || 'Description must have less than 200 characters'],
      priorityRules: [(priority) => !!priority || 'Priority is required'],
      priorities: ['top', 'medium', 'low']
    }
  },
  computed: {
    minDate() {
      return moment().format('YYYY/MM')
    },
    ...mapGetters(['loading', 'user'])
  },
  methods: {
    handleAddTask() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addTask', {
          title: this.title,
          description: this.description,
          status: 'created',
          requester: this.user.fullname,
          assignee: 'unassigned',
          dueDate: this.dueDate,
          priority: this.priority
        })
        this.$router.push('/tasks')
      }
    }
  }
}
</script>




 