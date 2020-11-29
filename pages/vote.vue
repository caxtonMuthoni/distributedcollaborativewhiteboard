<template>
  <div class="container-fluid" style="height:100vh;">
    <div class="card bg-dark text-light h-100">
      <div class="card-header">
        Voting for the Leader
      </div>
      <div class="card-body">
        <div class="row">
          <div v-for="user in currentUsers" :key="user.id" class="col-md-2">
            <div class="card bg-dark card-vote">
              <div class="card-body text-center">
                <h4 class="card-title">
                  {{ user.name }}
                </h4>
                <p class="card-text badge badge-info">
                  {{ user.votes }}
                </p> <br>
                <a href="" class="btn btn-success btn-sm" @click.prevent="vote(user.id ,user.votes)"><span><i class="fas fa-check mr-2   " /></span> Vote</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2'
import Toast from '@/plugins/toast'

export default {
  data () {
    return {
      usersCount: null,
      currentUsers: [],
      votes: [],
      user: ''

    }
  },
  computed: {

  },
  mounted () {
    this.$fire.auth.onAuthStateChanged((user) => {
      this.user = user
      if (!user) {
        this.$router.push('/')
      } else {
        this.$fire.firestore.collection('users').where('uid', '==', user.uid)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.user = doc.data()
            })
          })
      }
    })

    this.getCadindates()
  },
  methods: {
    getCadindates () {
      this.$fire.firestore.collection('users').where('online', '==', true).onSnapshot((snapshot) => {
        this.currentUsers = []
        snapshot.forEach((doc) => {
          this.currentUsers.push({ ...doc.data(), id: doc.id })
        })
        this.checkLeaderNode()
      })
    },
    checkLeaderNode () {
      const isAdmin = this.currentUsers.filter(user => user.isAdmin).length > 0

      if (isAdmin) {
        this.$router.push('/whiteboard')
      }
    },
    getCadindateVotes (userId) {
      return this.votes.filter(vote => vote.candidateId === userId).length
    },

    vote (candidateId, votes) {
      this.$nuxt.$loading.start()
      this.hasUserVoted(candidateId, votes)
    },

    hasUserVoted (uid, votes) {
      this.$fire.firestore.collection('voters').where('uid', '==', this.user.uid).where('status', '==', true).get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            Swal.fire({
              title: 'Oops, you have voted',
              text: 'You have already voted. You can\'t vote twice',
              type: 'error',
              confirmButtonText: 'Cool'
            })
            this.$nuxt.$loading.fail()
          } else {
            this.saveVotedMember(uid, votes)
          }
        })
    },

    saveVotedMember (uid, votes) {
      this.$fire.firestore.collection('voters').add({
        uid: this.user.uid,
        status: true
      }).then((res) => {
        this.submitVote(uid, votes)
      })
    },

    submitVote (candidateId, votes) {
      this.$fire.firestore.collection('users').doc(candidateId).update({
        votes: votes + 1
      }).then((data) => {
        this.generateLeader()
        this.$nuxt.$loading.finish()
        Toast.fire({
          title: 'Your vote was submited successfully',
          type: 'success'
        })
      })
    },

    // Generating the new leader
    generateLeader () {
    // 1.0   Check if any user has attained 50% of the active members votes
      const totalMembers = this.currentUsers.length
      const vm = this
      this.currentUsers.forEach((user) => {
        if (user.votes >= (totalMembers / 2)) {
          //    Set all candidates votes to Zero && Generate the leader node
          vm.$fire.firestore.collection('users').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (querySnapshot.docs.length > 0) {
                if (doc.id !== user.id) {
                  doc.ref.update({
                    votes: 0,
                    isAdmin: false
                  })
                } else {
                  doc.ref.update({
                    votes: 0,
                    isAdmin: true,
                    editing: true
                  })
                }
              }
            })
          }).then((res) => {
            // Set all casted votes status to inactive
            vm.$fire.firestore.collection('voters').get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.update({
                  status: false
                }).then((res) => {
                //   Navigate to the whiteboard
                  vm.$router.push('/whiteboard')
                })
              })
            })
          })
        //   })
        }
      })
    }

  }
}
</script>

<style scoped>
  .card-vote :hover{
     background: #0275d8;
  }
</style>
