<template>
  <q-page v-if="getTask" class="bg-page row justify-center q-py-md">
    <div class="col-8">

      <!--    Task Details  -->

      <q-card class="bg-card">
        <q-card-section class="justify-center">
          <p class="text-txtBold text-h5" align="center">Task Detail</p>
        </q-card-section>
        <q-card-section class="justify-center">
          <span class="text-txtBold name"> Title: </span><span class="text-txtNormal value"> {{ getTask.title }}</span>
        </q-card-section>
        <q-card-section class="justify-center">
          <span class="text-txtBold name"> Description: </span><span class="text-txtNormal value"> {{ getTask.description}}</span>
        </q-card-section>
        <q-card-section class="justify-center">
          <div class="row">
            <div class="col-4">
              <span class="text-txtBold name"> Requester: </span><span class="text-txtNormal value"> {{ getTask.requester}}</span>
            </div>
            <div class="col-4">
              <span class="text-txtBold name"> Priority: </span><span class="text-txtNormal value"> {{ getTask.priority }}</span>
            </div>
            <div class="col-4">
              <span class="text-txtBold name"> Due Date: </span><span class="text-txtNormal value"> {{ getTimeFromNow(getTask.dueDate) }}</span>
            </div>
          </div>
        </q-card-section>

        <!-- Assignee  -->

        <q-card-section>
          <div class="row">
            <div class="col-4">
              <span class="text-txtBold name"> Assignee: </span><span class="text-txtNormal value"> {{ getTask.assignee}}</span>
            </div>
            <div class="col-4">
              <q-btn class="bg-button" label="Reassign" @click="dialogOpen = true">
              </q-btn>
              <q-dialog v-model="dialogOpen" persistent>
                <q-card class="bg-comment q-pa-md" style="width: 500px">
                  <q-card-section class="row items-center">
                    <q-select filled style="width: 400px" :options="assignees" label="Select Assignee" v-model="assignee" />
                  </q-card-section>
                  <q-card-actions>
                    <q-btn class="bg-button" flat label="Close" @click.native="dialogOpen = false" />
                    <q-btn class="bg-button" flat label="Save" @click.native="handleAssignTask" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
        </q-card-section>

        <!-- Status  -->

        <q-card-section>
          <div class="row">
            <div class="col-4">
              <span class="text-txtBold name"> Status: </span><span class="text-txtNormal value"> {{ getTask.status}}</span>
            </div>
            <div class="col-4">
              <q-btn class="bg-button" label="Update" @click="statusOpen = true">
              </q-btn>
              <q-dialog v-model="statusOpen" persistent>
                <q-card class="bg-comment q-pa-md" style="width: 500px">
                  <q-card-section class="row items-center">
                    <q-select filled style="width: 400px" :options="statusList" label="Select Status" v-model="status" />
                  </q-card-section>
                  <q-card-actions>
                    <q-btn class="bg-button" flat label="close" @click.native="dialogOpen = false" />
                    <q-btn class="bg-button" flat label="save" @click.native="handleTaskStatus" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Message Input  -->

    <div class="col-8">
      <q-form class="bg-comment" @submit="handleAddComment" v-model="isFormValid" :rules="commentRules" ref="form">
        <q-input color="blue" v-model="commentBody" label="Add comment" type="text" required>
          <template v-slot:prepend>
            <q-icon name="playlist_add" />
          </template>
          <template v-slot:append>
            <q-btn @click="handleAddComment" flat :icon="commentBody && 'send'" />
          </template>
        </q-input>
      </q-form>
    </div>

    <!-- Messages -->

    <div class="col-8">
      <q-scroll-area style="height: 200px" :thumb-style="thumbStyle" :bar-style="barStyle">
        <q-list bordered max-width="600px">
          <template v-for="comment in getTask.updates">
            <q-item :key="comment.title">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon :class="checkIfOwnComment(comment) ? 'text-accent' : 'text-grey'" name="chat_bubble" />
                </q-avatar>
              </q-item-section>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="comment.commentUser.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  {{ comment.commentBody }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ comment.commentUser.username }} - <span class="hidden-xs-only">{{ getTimeFromNow(comment.commentDate) }}</span>
                </q-item-label>
              </q-item-section>

            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>


<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { GET_TASK, ADD_TASK_COMMENT } from '../../queries'

export default {
  name: 'Task',
  props: ['taskId'],

  data() {
    return {
      dialogOpen: false,
      statusOpen: false,
      assignee: '',
      requester: false,
      commentBody: '',
      isFormValid: true,
      statusList: ['created', 'assigned', 'in progress', 'on hold', 'complete', 'archive'],
      status: '',
      commentRules: [
        (comment) => !!comment || 'Comment is required',
        (comment) => (comment && comment.length < 80) || 'Comment must be less than 80 characters'
      ],
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: 'bg-button',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: 'bg-button',
        width: '9px',
        opacity: 0.2
      }
    }
  },

  apollo: {
    getTask: {
      query: GET_TASK,
      variables() {
        return {
          taskId: this.taskId
        }
      }
    }
  },
  created() {
    this.requester = localStorage.getItem('role') == 'Requester' ? true : false
  },
  computed: {
    ...mapGetters(['user', 'assignees'])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow()
    },
    checkIfOwnComment(comment) {
      return this.user && this.user._id === comment.commentUser._id
    },
    handleTaskStatus() {
      this.statusOpen = false
      this.$store.dispatch('changeStatus', {
        taskId: this.taskId,
        status: this.status
      })
      this.$router.push('/tasks')
    },
    handleAssignTask() {
      this.dialogOpen = false
      this.$store.dispatch('assignTask', {
        taskId: this.taskId,
        fullname: this.assignee
      })

      this.$router.push('/tasks')
    },
    handleAddComment() {
      if (this.$refs.form.validate()) {
        const variables = {
          commentBody: this.commentBody,
          userId: this.user._id,
          taskId: this.taskId
        }

        this.$apollo
          .mutate({
            mutation: ADD_TASK_COMMENT,
            variables,
            update: (cache, { data: { addTaskComment } }) => {
              const data = cache.readQuery({
                query: GET_TASK,
                variables: { taskId: this.taskId }
              })

              data.getTask.updates.unshift(addTaskComment)

              cache.writeQuery({
                query: GET_TASK,
                variables: { postId: this.postId },
                data
              })
            }
          })
          .then(() => {
            this.$refs.form.reset()
          })
          .catch((err) => console.error(err))
      }
    }
  }
}
</script>

<style lang="sass">
.name 
  font-size: 20px;
  font-weight: bold;
  font-family: 'Open Sans';

.value 
  font-size: 20px;
  font-family: 'Open Sans';

</style>