<template>
  <div class="container-fluid" style="height:100vh;">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card login-card  text-white mt-5 p-5">
          <div class="text-center mb-3">
            <img src="/brand.png" alt="" style="height:90px; width:90px;">
          </div>
          <div class="card-header text-center">
            Member Login
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email">Enter your email address</label>
                <input
                  id="email"
                  v-model="email"
                  type="text"
                  name="email"
                  class="form-control"
                  placeholder="eg. john@gmail.com"
                  required
                >
              </div>
              <div class="form-group">
                <label for="password">Enter your password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  name="password"
                  class="form-control"
                  placeholder=""
                  required
                >
              </div>
              <button type="submit" class="btn-primary btn btn-s btn-block">
                Sign In
              </button> <br>
              <a href="/register" class="btn btn-outline-light btn-s btn-block">Create a new Account</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Toast from '@/plugins/toast'
import Swal from 'sweetalert2'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$nuxt.$loading.start()
      this.$fire.auth.signInWithEmailAndPassword(this.email, this.password).then((credentials) => {
        return this.$fire.firestore.collection('users')
          .where('uid', '==', credentials.user.uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                online: true
              }).then(() => {
                this.$nuxt.$loading.finish()
                this.$router.push({ path: '/whiteboard' })
                Toast.fire({
                  title: 'You signed in successfully',
                  type: 'success'
                })
              })
            })
          })
      }).catch((error) => {
        Swal.fire({
          title: 'Oops, an error occured',
          text: error.message,
          type: 'error',
          confirmButtonText: 'Cool'
        })
        this.$nuxt.$loading.fail()
      })
    }
  }
}
</script>

<style scoped>
 .login-card{
    background: #9152f8;
    background: -webkit-linear-gradient(bottom, #7579ff, #b224ef);
    background: -o-linear-gradient(bottom, #7579ff, #b224ef);
    background: -moz-linear-gradient(bottom, #7579ff, #b224ef);
    background: linear-gradient(bottom, #7579ff, #b224ef);
 }
</style>
