<template>
  <div>
    <table class="table table-striped table-dark">
      <thead>
        <th>#</th>
        <th>Name</th>
        <th>Action</th>
        <th>Rename</th>
      </thead>
      <tbody>
        <tr v-for="(draw, index) in drawings" :key="draw.id">
          <td>{{ index + 1 }}</td>
          <td>{{ draw.name }}</td>
          <td><a href="" class="btn btn-primary btn-sm" @click.prevent="openRecent(draw.id)">open</a></td>
          <td><a href="" class="btn btn-info btn-sm" @click.prevent="showModal(draw)">Rename</a></td>
        </tr>
      </tbody>
      <tfoot>
        <th>#</th>
        <th>Name</th>
        <th>Action</th>
        <th>Rename</th>
      </tfoot>
    </table>

    <!-- Modal -->
    <div
      id="update-form"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Rename  Whiteboard
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-window-close    " /></span>
            </button>
          </div>
          <form @submit.prevent="rename(updateDraw.id,name)">
            <div class="modal-body">
              <div class="form-group">
                <label for="">Enter your Whiteboard name</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  name="name"
                  aria-describedby="helpId"
                  placeholder=""
                >
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" @click="closeModal">
                Close
              </button>
              <button type="submit" class="btn btn-success">
                Rename
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as $ from 'jquery'
import Toast from '@/plugins/toast'

export default {
  data () {
    return {
      drawings: [],
      name: '',
      updateDraw: ''
    }
  },
  mounted () {
    this.recentDrawings()
  },

  methods: {
    closeModal () {
      $('#update-form').modal('hide')
    },
    showModal (draw) {
      this.updateDraw = draw
      this.name = draw.name
      $('#update-form').modal('show')
    },
    rename (id, name) {
      this.$nuxt.$loading.start()
      this.$fire.firestore.collection('canvas').doc(id).update({
        name
      }).then(() => {
        this.$nuxt.$loading.finish()
        this.closeModal()
        Toast.fire({
          title: 'Whiteboard was renamed successfully',
          type: 'success'
        })
      })
    },
    openRecent (id) {
      this.$nuxt.$emit('openrecent', id)
    },
    recentDrawings () {
      this.$fire.firestore.collection('canvas').onSnapshot((snapshot) => {
        this.drawings = []
        snapshot.forEach((doc) => {
          this.drawings.push({ ...doc.data(), id: doc.id })
        })
      })
    }
  }
}
</script>
