<template>
  <div class="container-fluid text-light" style="height:100vh;">
    <div class="row justify-content-center no-gutters m-0 p-0">
      <div class="col-md-12">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
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
              <li class="nav-item dropdown  mx-2">
                <a
                  id="navbarDropdown"
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  File
                </a>
                <div class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                  <a v-if="user.isAdmin" data-toggle="modal" data-target="#new-canvas-form" href="" class="text-light dropdown-item"><span><i class="fas fa-folder-plus mr-2   " /></span>Create New</a>
                  <div class="dropdown-divider" />
                  <a href="" class="text-light dropdown-item" @click.prevent="exportToPng"><span><i class="fas fa-save  mr-2  " /></span>Export to png</a>
                  <div class="dropdown-divider" />
                  <a v-if="user.isAdmin" href="" data-toggle="modal" data-target="#open-recent" class="text-light dropdown-item"><span><i class="fas fa-clock mr-2   " /></span>Open Recent</a>
                  <div class="dropdown-divider" />
                  <a v-if="user.isAdmin" href="" data-toggle="modal" data-target="#queueModal" class="text-light dropdown-item"><span><i class="fas fa-draw-polygon  mr-2  " /></span>Members Requests</a>
                </div>
              </li>

              <li class="nav-item dropdown  mx-2">
                <a
                  id="navbarDropdown"
                  :class="{disabled: !user.editing}"
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Edit
                </a>
                <div class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                  <a href="" :class="{disabled: !user.editing}" class="dropdown-item text-light" @click.prevent="canvasRedoOrUndo('undo')"><span><i class="fas fa-undo  mr-2  " /></span>Undo</a>
                  <div class="dropdown-divider" />
                  <a href="" :class="{disabled: !user.editing}" class="dropdown-item text-light" @click.prevent="canvasRedoOrUndo('redo')"><span><i class="fas fa-redo mr-2   " /></span>Redo</a>
                  <div class="dropdown-divider" />
                  <a href="" :class="{disabled: !user.editing}" class="dropdown-item text-light" @click.prevent="fabricClearWhiteboard()"><span><i class="fas fa-trash  mr-2 text-danger " /></span>Clear</a>
                </div>
              </li>

              <li class="nav-item dropdown  mx-2">
                <a
                  id="navbarDropdown"
                  :class="{disabled: !user.editing}"
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Shapes
                </a>
                <div class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                  <li><a href="" class="dropdown-item text-light" @click.prevent="fabricCircle"><i class="fas fa-circle m-2   " /> Circle</a></li>
                  <div class="dropdown-divider" />
                  <li><a href="" class="dropdown-item text-light" @click.prevent="fabricRectangle"> <i class="fas m-2 fa-vector-square    " /> Rectangle</a></li>
                  <div class="dropdown-divider" />
                  <li><a href="" class="dropdown-item text-light" @click.prevent="fabricTriangle"> <i class="fas m-2 fa-caret-up    " /> Triangle</a></li>
                </div>
              </li>

              <li class="nav-item  mx-2">
                <a class="nav-link" href="#" :class="{disabled: !user.editing}" @click.prevent="fabricTextBox"><span><i class="mr-2 fas fa-text-width    " /></span>Text</a>
              </li>
              <li class="nav-item  mx-2">
                <a class="nav-link" href="#" :class="{disabled: !user.editing}" @click.prevent="fabricLine"><span> <i class="fas fa-minus mr-2   " /></span> Line</a>
              </li>
              <li class="nav-item dropdown  mx-2">
                <a
                  id="navbarDropdown"
                  :class="{disabled: !user.editing}"
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Free Draw
                </a>
                <div class="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                  <a href="" class="text-light dropdown-item" @click.prevent="handDraw('brush')"><span><i class="fas fa-paint-brush  mr-2  " /></span> Brush</a>
                  <div class="dropdown-divider" />
                  <a href="" class="text-light dropdown-item" @click.prevent="handDraw('pen')"><span> <i class="fas fa-pen   mr-2 " /> </span> Pen</a>
                </div>
              </li>

              <li class="nav-item mx-2">
                <a v-if="!user.editing" class="nav-link" href="#" @click.prevent="requestToDraw"><span> <i class="fas fa-paper-plane mr-2   " /></span>Request To Draw</a>
                <a v-else href="#" title="You are drawing" class="badge badge-primary nav-link">Drawing</a>
              </li>
              <li class="nav-item mx-2 float-right" />
            </ul>
            <!-- <form class="form-inline my-2 my-lg-0 color-picker" style="display:none;">
                     <a href="" class=" disabled badge badge-info my-2 my-sm-0">Set Fill color</a>
                      <input style="width:50px;" class="form-control mr-sm-2" type="color" v-model="objectColor" name="color" id="color">
                    </form> -->
          </div>
        </nav>
      </div>
      <div class="col-md-2">
        <div style="height:85vh;" class="bg-dark">
          <ul class="list-group active-users bg-dark">
            <li class="list-group-item bg-dark">
              <i class="fas fa-th-list mr-1 text-primary   " /><strong class="text-info">{{ usersCount }} Active Members</strong>
            </li>
            <li v-for="cuser in currentUsers" :key="cuser.id" class="list-group-item bg-dark text-light">
              <span><a v-if="cuser.isAdmin == 1" href="" title="Admin" class="btn"><i class="fas fa-lock text-success  mr-2 " /></a>
                <a v-else title="Member" href="" class="btn"><i class="fas fa-check  mr-2 text-info " /></a></span>{{ cuser.name }}
              <a v-show="cuser.editing" :title="cuser.name + ' can edit'" class="btn float-right p-0" href=""><span class="badge badge-info">Editing</span></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-10 bg-dark">
        <div class="card" style="height:86vh;">
          <div class="card-body p-0 canvas-container">
            <canvas id="mainCanvas" width="100" height="100" class="gridCanvas" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      id="queueModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modelTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">
              Drawing Members Management
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-window-close    " /></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-6">
                  <div class="card-header">
                    <strong class="text-info">Waiting members</strong>
                  </div>
                  <strong v-if="drawQueue.length < 1" class="text-danger text-center">No waiting users</strong>
                  <table v-else class="table table-striped table-dark">
                    <thead>
                      <th>#</th>
                      <th>Member</th>
                      <th>Status</th>
                      <th>Action</th>
                    </thead>
                    <tbody>
                      <tr v-for="(user,index) in drawQueue" :key="user.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ user.name }}</td>
                        <td><a href="" class="badge badge-success">waiting </a></td>
                        <td><a href="" class="btn btn-info btn-sm" @click.prevent="activateUserEditing(user.uid, true)">activate</a></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th>#</th>
                      <th>Member</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tfoot>
                  </table>
                </div>
                <div class="col-md-6">
                  <div class="card-header">
                    <strong class="text-info">Drawing members</strong>
                  </div>
                  <table class="table table-striped table-dark">
                    <thead>
                      <th>#</th>
                      <th>Member</th>
                      <th>Action</th>
                    </thead>
                    <tbody>
                      <tr v-for="(user,index) in getActiveUsers" :key="user.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ user.name }}</td>
                        <td v-if="!user.isAdmin">
                          <a href="" class="btn btn-primary btn-sm" @click.prevent="endDrawSession(user.uid)"><span><i class="fas fa-check mr-2   " /></span>Terminate</a>
                        </td>
                        <td v-else>
                          <a href="" class="badge badge-success" @click.prevent=""><span><i class="fas fa-lock mr-2   " /></span>Admin</a>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th>#</th>
                      <th>Member</th>
                      <th>Action</th>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      id="open-recent"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modelTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">
              Recent drawing
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-window-close    " /></span>
            </button>
          </div>
          <div class="modal-body">
            <RecentDrawing @openrecent="openRecentWhiteboard" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      id="new-canvas-form"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modelTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog bg-dark" role="document">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">
              Create new Drawing
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-window-close    " /></span>
            </button>
          </div>
          <form @submit.prevent="newWhiteboard(user,name)">
            <div class="modal-body">
              <div class="form-group">
                <label for="name">What is the name of the whiteboard</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  name="name"
                  placeholder="eg.circuit design"
                >
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                Close
              </button>
              <button type="submit" class="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import methods from '@/plugins/methods'
import RecentDrawing from '@/components/RecentDrawing'

export default {
  components: {
    RecentDrawing
  },
  props: ['muser'],
  data () {
    return {
      user: '',
      msg: 'turtututu',
      whitebaordCanvas: '',
      usersCount: null,
      currentUsers: [],
      objectColor: '#ccc',
      activeObject: null,
      objectId: 0,
      canvasStates: [],
      canvasMods: 0,
      sendBroadcast: true,
      gridGroup: null,
      drawQueue: [],
      name: '',
      mainColor: '#424B54',
      activeWhiteboardId: ''
    }
  },
  computed: {
    getActiveUsers () {
      return this.currentUsers.filter(user => user.editing)
    }
  },

  mounted () {
    this.$nuxt.$on('openrecent', this.openRecentWhiteboard)

    // Detect auth users
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

    this.getCanvas()
    this.whiteboardListeners()
    this.getActiveMembers()
    this.getCurrentState()
  },

  methods: { ...methods }
}
</script>

<style scoped>
   .canvas-container{
    overflow:hidden;
    background:#292b2c;
    width: 100%;
    height: 100%;
   }

   .dot{
       font-size: 0.7em;
   }

   .active-users{
       height: 85vh;
       overflow-y: auto;
   }

   .tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

</style>
