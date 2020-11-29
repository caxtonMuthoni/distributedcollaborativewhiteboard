<template>
  <div class="container-fluid" style="height:100vh;">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card login-card  text-white mt-2 p-3">
          <div class="text-center mb-2">
            <img src="/brand.png" alt="" style="height:70px; width:70px;">
          </div>
          <div class="card-header text-center">
            Member Register
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="form-group">
                <label for="name">Enter your username</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  name="name"
                  class="form-control"
                  placeholder="eg. John"
                  required
                >
              </div>
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
              <div class="form-group">
                <label for="c_password">Confirm your password</label>
                <input
                  id="c_password"
                  v-model="c_password"
                  type="password"
                  name="c_password"
                  class="form-control"
                  placeholder=""
                  required
                >
              </div>
              <button type="submit" class="btn-primary btn btn-s btn-block">
                Sign Up
              </button> <br>
              <a href="/login" class="btn btn-outline-light btn-s btn-block">Login to an existing Account</a>
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
      name: '',
      email: '',
      password: '',
      c_password: ''
    }
  },
  methods: {
    register () {
      if (this.password !== this.c_password) {
        Swal.fire({
          title: 'Oops, incorrect input',
          text: 'Password mismatch',
          type: 'error',
          confirmButtonText: 'Cool'
        })
      } else {
        this.$nuxt.$loading.start()
        this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password).then((credential) => {
          return this.$fire.firestore.collection('users').add({
            uid: credential.user.uid,
            name: this.name,
            editing: false,
            isAdmin: false,
            online: true,
            votes: 0

          }).then(() => {
            this.$nuxt.$loading.finish()
            this.$router.push('/whiteboard')
            Toast.fire({
              title: 'You signed up successfully',
              type: 'success'
            })
          })
        }).catch((error) => {
          Swal.fire({
            title: `Oops, ${error.code}`,
            text: error.message,
            type: 'error',
            confirmButtonText: 'Cool'
          })
          this.$nuxt.$loading.fail()
        })
      }
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
