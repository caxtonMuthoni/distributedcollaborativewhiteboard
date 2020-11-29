<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
      <a class="navbar-brand" href="/">Collaborative Whiteboard</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active" />
        </ul>
        <ul class="navbar-nav">
          <li v-if="!user" class="nav-item">
            <nuxt-link class="nav-link" to="/register">
              Sign up
            </nuxt-link>
          </li>
          <li v-if="!user" class="nav-item">
            <nuxt-link class="nav-link" to="/login">
              Sign in
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link v-if="user" class="nav-link" to="/whiteboard" @click="logout">
              Whiteboard
            </nuxt-link>
          </li>
          <li class="nav-item">
            <a v-if="user" href="#" class="nav-link" to="/" @click="logout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <Nuxt class="bg-dark" />
  </div>
</template>

<script>
import Toast from '@/plugins/toast'

export default {
  data () {
    return {
      user: ''
    }
  },
  mounted () {
    this.$fire.auth.onAuthStateChanged((user) => {
      this.user = user
      if (!user) {
        this.$router.push('/')
      }
    })
  },
  methods: {
    logout () {
      this.$fire.firestore.collection('users').where('uid', '==', this.user.uid)
        .get().then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            querySnapshot.docs[0].ref.update({
              isAdmin: false,
              online: false
            }).then(() => {
              this.$fire.auth.signOut().then((res) => {
                this.user = ''
                Toast.fire({
                  title: 'You signed out successfully',
                  type: 'info'
                })
              })
            })
          }
        })
    }
  }
}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
