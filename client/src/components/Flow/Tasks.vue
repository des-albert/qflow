<template>
  <q-page class="bg-page row justify-center q-py-md">
    <div class="col-2" v-for="(stage, index) in stages" :key='index'>
      <draggable :list="buckets[stage]" group="openTasks" :move='handleMove' :disabled='dragDisabled'>
        <p slot="header" :tag="stage" class="text-txtBold bold" align="center">{{ stage }}</p>

        <q-card class="bg-card list-group" v-for="task in buckets[stage]" :key="task._id">
          <q-card-section>
            <span class="text-txtBold bold">{{ task.title }}</span>
          </q-card-section>
          <q-card-section>
            <span class="text-txtNormal normal">{{ task.description }}</span>
          </q-card-section>
          <q-card-section>
            <span class="text-txtNormal normal">{{ task.requester }}</span>
          </q-card-section>
          <q-card-section>
            {{ task.assignee }}
            <q-icon right @click="goToTask(task._id)" name="edit" />
          </q-card-section>
        </q-card>
      </draggable>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import moment from 'moment'

export default {
  name: 'Tasks',

  components: {
    draggable
  },

  data() {
    return {
      stages: ['created', 'assigned', 'in progress', 'on hold', 'complete', 'archive'],
      dragDisabled: true
    }
  },

  created() {
    this.handleGetTasks()
    this.dragDisabled = this.user.role === 'Requester'
  },

  computed: {
    ...mapGetters(['user', 'loading', 'tasks', 'buckets'])
  },

  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow()
    },
    goToTask(taskId) {
      this.$router.push(`/task/${taskId}`)
    },

    handleGetTasks() {
      const userRole = localStorage.getItem('role')
      const fullname = localStorage.getItem('fullname')

      switch (userRole) {
        case 'Manager': {
          this.$store.dispatch('getAllTasks')
          break
        }

        case 'Requester': {
          this.$store.dispatch('getRequestTasks', {
            fullname: fullname
          })
          break
        }

        case 'Assignee': {
          this.$store.dispatch('getAssignTasks', {
            fullname: fullname
          })

          break
        }
      }
    },

    handleMove(evt) {
      const movedId = evt.draggedContext.element._id
      var stageTag = evt.relatedContext.component.rootContainer.firstElementChild.innerText
      if (this.stages.includes(stageTag)) {
        this.$store.dispatch('changeStatus', {
          taskId: movedId,
          status: stageTag
        })
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.bold 
  font-size: 20px
  font-weight: bold


.normal 
  font-size: 20px 

</style>