import { fabric } from 'fabric'
import * as $ from 'jquery'
import Swal from 'sweetalert2'
import Toast from '@/plugins/toast'
export default {

  getCanvas () {
    const whitebaordCanvas = new fabric.Canvas('mainCanvas', { selection: false })
    this.whitebaordCanvas = whitebaordCanvas
    this.createCanvasGrid()
  },

  // Drawing the grid
  createCanvasGrid () {
    const gridLength = 60
    const unitLength = 10
    const cWidth = 120 * unitLength
    const cHeight = 120 * unitLength

    this.whitebaordCanvas.setWidth(cWidth)
    this.whitebaordCanvas.setHeight(cHeight)
    const gridLines = []

    for (let i = 0; i < (cWidth / gridLength); i++) {
      // drawing grid lines and adding them to the  fabric group
      gridLines.push(new fabric.Line([i * gridLength, 0, i * gridLength, cHeight],
        { type: 'line', stroke: '#424B54', selectable: false }))
      gridLines.push(new fabric.Line([0, i * gridLength, cWidth, i * gridLength],
        { type: 'line', stroke: '#424B54', selectable: false }))
    }
    this.gridGroup = new fabric.Group(gridLines, {
      selectable: false,
      evented: false
    })
    this.gridGroup.addWithUpdate()
    this.whitebaordCanvas.add(this.gridGroup)
  },

  //  clearing  the grid
  clearGridFromCanvas () {
    this.gridGroup && this.whitebaordCanvas.remove(this.gridGroup)
    this.gridGroup = null
  },

  //  Fabric free drawing

  handDraw (selectedTool) {
    if (selectedTool === 'pen') {
      this.whitebaordCanvas.freeDrawingBrush.width = 1
    } else {
      this.whitebaordCanvas.freeDrawingBrush.width = 10
    }
    this.whitebaordCanvas.isDrawingMode = 1
    this.whitebaordCanvas.freeDrawingBrush.color = '#f7f7f7'
    this.whitebaordCanvas.renderAll()
  },

  clearDrawMode () {
    this.whitebaordCanvas.isDrawingMode = 0
  },

  setSelectMode () {
    this.clearDrawMode()
  },

  // Fabric js TextBox
  fabricTextBox () {
    this.clearDrawMode()
    const textField = new fabric.IText('Edit text', {
      width: 250,
      cursorColor: 'blue',
      top: 30,
      left: 300,
      fontSize: 20,
      fill: '#f7f7f7',
      id: new Date().getUTCMilliseconds()
    })
    this.deleteCanvasItem(textField.id)
    this.whitebaordCanvas.add(textField)
  },
  //  Fabric js Circle
  fabricCircle () {
    this.clearDrawMode()
    const circle = new fabric.Circle({
      radius: 100,
      fill: this.mainColor,
      stroke: '#cccccc',
      top: 100,
      left: 100,
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      id: new Date().getUTCMilliseconds()
    })
    this.deleteCanvasItem(circle.id)
    this.whitebaordCanvas.add(circle)
  },

  //  Fabric js Rectangle
  fabricRectangle () {
    this.clearDrawMode()
    const rectangle = new fabric.Rect({
      width: 100,
      height: 70,
      fill: this.mainColor,
      stroke: '#cccccc',
      left: 10,
      top: 20,
      id: new Date().getUTCMilliseconds()
    })
    this.deleteCanvasItem(rectangle.id)

    this.whitebaordCanvas.add(rectangle)
  },
  //  Fabric js Triangle
  fabricTriangle () {
    this.clearDrawMode()
    const triangle = new fabric.Triangle({
      width: 100,
      height: 70,
      fill: this.mainColor,
      stroke: '#cccccc',
      left: 10,
      top: 20,
      id: new Date().getUTCMilliseconds()
    })
    this.deleteCanvasItem(triangle.id)
    this.whitebaordCanvas.add(triangle)
  },

  // Fabric js Line

  fabricLine () {
    this.clearDrawMode()
    const line = new fabric.Line([100, 200, 200, 200], {
      id: new Date().getUTCMilliseconds(),
      stroke: 'white',
      strokeWidth: 3,
      left: 170,
      top: 150
    })
    this.deleteCanvasItem(line.id)
    this.whitebaordCanvas.add(line)
  },

  // Clear whitebaordCanvas
  fabricClearWhiteboard (event = false) {
    this.deactivateWhiteboardListeners()
    this.whitebaordCanvas.clear()
    this.createCanvasGrid()
    if (!event) {
      this.canvasRedoOrUndo('clear')
    }
    this.whiteboardListeners()
  },

  // Event listeners
  whiteboardListeners () {
    const context = this
    this.whitebaordCanvas.on('object:added', function (event) {
      if (event.target.type !== 'path') {
        context.updateWhiteboardState()
      }
    })
    this.whitebaordCanvas.on('object:removed', function (event) {
      context.updateWhiteboardState()
    })
    this.whitebaordCanvas.on('object:modified', function (event) {
      context.updateWhiteboardState()
    })
    this.whitebaordCanvas.on('selection:created', function (event) {
      context.activeObject = context.getActiveObject()
      context.objectId = event.target.id
    })
    this.whitebaordCanvas.on('selection:cleared', function () {
      context.updateWhiteboardState()
    })

    this.whitebaordCanvas.on('path:created', function (object) {
      object.path.id = new Date().getUTCMilliseconds()
      context.updateWhiteboardState()
    })
  },

  getActiveMembers () {
    const vm = this
    this.$fire.firestore.collection('users').where('online', '==', true)
      .onSnapshot((snapshot) => {
        this.currentUsers = []
        snapshot.forEach((doc) => {
          this.currentUsers.push(doc.data())
        })
        vm.monitoringLeaderPresence(this.currentUsers)
      })
  },

  getActiveObject () {
    return this.whitebaordCanvas.getActiveObject() == null ? this.whitebaordCanvas.getActiveGroup() : this.whitebaordCanvas.getActiveObject()
  },

  setStringJsonToCanvas (canvasString) {
    const context = this
    const jsonObject = JSON.parse(canvasString)
    fabric.util.enlivenObjects(jsonObject.objects, function (enlivenedObjects) {
      context.deactivateWhiteboardListeners()
      enlivenedObjects.forEach(function (obj) {
        if (obj.type === 'group') {
          obj.selectable = false
        }
        // context.whitebaordCanvas.setActiveObject(obj)
        context.whitebaordCanvas.add(obj)
      })
      context.whitebaordCanvas.renderAll()
      context.whiteboardListeners()
    })
  },

  deleteCanvasItem (id) {
    const context = this
    this.whitebaordCanvas.getObjects().forEach(function (object) {
      if (object.id === id) {
        context.whitebaordCanvas.remove(object)
      }
    })
  },

  // Undo or redo whitebaordCanvas
  canvasRedoOrUndo (actionType) {
    if (actionType === 'undo') {
      if (this.canvasMods < this.canvasStates.length - 1) {
        this.whitebaordCanvas.clear().renderAll()
        this.deactivateWhiteboardListeners()
        this.whitebaordCanvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods - 1])
        this.whiteboardListeners()
        this.whitebaordCanvas.renderAll()
        this.updateWhiteboardState(true)
        this.canvasMods += 1
      }
    } else if (actionType === 'redo') {
      if (this.canvasMods > 0) {
        this.whitebaordCanvas.clear().renderAll()
        this.deactivateWhiteboardListeners()
        this.whitebaordCanvas.loadFromJSON(this.canvasStates[this.canvasStates.length - 1 - this.canvasMods + 1])
        this.whiteboardListeners()
        this.whitebaordCanvas.renderAll()
        this.updateWhiteboardState(true)
        this.canvasMods -= 1
      }
    } else if (actionType === 'clear') {
      this.whitebaordCanvas.clear()
      this.createCanvasGrid()
      this.updateWhiteboardState(true)
    }
  },

  // Get canvasstates
  getCanvasStates () {
    const context = this
    this.$fire.firestore.collection('whiteboard_states')
      .where('canvasId', '==', context.activeWhiteboardId)
      .onSnapshot((snapshot) => {
        context.canvasStates = []
        snapshot.forEach((doc) => {
          context.canvasStates.push(doc.data().canvas)
        })
      })
  },

  sendUndoRedoRequest (action) {
    // axios.post('/undoredo', { action }).then((n) => {
    // })
  },

  deactivateWhiteboardListeners () {
    this.whitebaordCanvas.off('object:added')
    this.whitebaordCanvas.off('object:removed')
    this.whitebaordCanvas.off('object:modified')
    this.whitebaordCanvas.off('path:created')
  },

  // Export whitebaordCanvas to png

  exportToPng () {
    this.whitebaordCanvas.forEachObject((obj) => {
      obj.selectable = false
      obj.evented = false
    })
    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('download', 'CanvasAsImage.png')
    const whitebaordCanvas = document.getElementById('mainCanvas')
    whitebaordCanvas.toBlob(function (blb) {
      const url = URL.createObjectURL(blb)
      downloadLink.setAttribute('href', url)
      downloadLink.click()
    })
  },

  //   Check if the leader is active

  monitoringLeaderPresence (members) {
    const doesLeaderExist = members.filter(user => user.isAdmin).length > 0
    if (!doesLeaderExist) {
      this.$router.push('/vote')
    }
  },

  // Update whiteboar state

  newWhiteboard (member, whiteboardName) {
    if (member.isAdmin) {
      this.$nuxt.$loading.start()
      this.$fire.firestore.collection('canvas').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({
            isComplete: true
          })
        })
      }).then(() => {
        $('#new-canvas-form').modal('hide')
        this.whitebaordCanvas.clear()
        this.createCanvasGrid()
        this.$fire.firestore.collection('canvas').add({
          canvas: JSON.stringify(this.whitebaordCanvas.toObject(['id'])),
          isComplete: false,
          name: whiteboardName
        }).then(() => {
          this.$nuxt.$loading.finish()
        })
      })
    }
  },

  // update whiteboard

  updateWhiteboardState (isUndo = false) {
    this.$nuxt.$loading.start()
    this.$fire.firestore.collection('canvas').where('isComplete', '==', false).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        snapshot.docs[0].ref.update({
          canvas: JSON.stringify(this.whitebaordCanvas.toObject(['id']))
        }).then(() => {
          if (!isUndo) {
            this.saveCurrentState(snapshot.docs[0].id)
          }
        })
      }
    }).then(() => {
      this.$nuxt.$loading.finish()
    })
  },

  // get current state
  getCurrentState () {
    this.$fire.firestore.collection('canvas').where('isComplete', '==', false)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length > 0) {
          this.whitebaordCanvas.clear()
          this.activeWhiteboardId = snapshot.docs[0].id
          this.setStringJsonToCanvas(snapshot.docs[0].data().canvas)
          this.getCanvasStates()
          this.settingTheRequestInQueue()
        }
      })
  },

  // Save current canvas state for redo and undo
  saveCurrentState (id) {
    this.$fire.firestore.collection('whiteboard_states').add({
      canvas: JSON.stringify(this.whitebaordCanvas.toObject(['id'])),
      canvasId: id
    })
  },

  // Request to draw
  requestToDraw () {
    this.$nuxt.$loading.start()
    this.$fire.firestore.collection('drawQueue').where('uid', '==', this.user.uid)
      .where('boardId', '==', this.activeWhiteboardId).get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          this.$nuxt.$loading.finish()
          Swal.fire({
            title: 'Please Wait',
            text: 'You are already in the queue please wait for approval',
            type: 'error',
            confirmButtonText: 'Cool'
          })
        } else {
          this.$fire.firestore.collection('drawQueue').add({
            uid: this.user.uid,
            boardId: this.activeWhiteboardId
          }).then(() => {
            this.$nuxt.$loading.finish()
            Swal.fire({
              title: 'Success',
              text: 'Your request was added to the queue. Please wait for approval',
              type: 'success',
              confirmButtonText: 'Cool'
            })
          })
        }
      })
  },

  endDrawSession (uid) {
    this.$nuxt.$loading.start()
    this.$fire.firestore.collection('users').where('uid', '==', uid).get()
      .then((querySnapshot) => {
        querySnapshot.docs[0].ref.update({
          editing: false
        }).then(() => {
          if (this.drawQueue.length > 0) {
            const newEditingUserId = this.drawQueue[0].uid
            this.$fire.firestore.collection('drawQueue').where('uid', '==', newEditingUserId)
              .where('boardId', '==', this.activeWhiteboardId).get()
              .then((querySnapshot) => {
                if (querySnapshot.docs.length > 0) {
                  querySnapshot.docs[0].ref.delete().then(() => {
                    this.activateUserEditing(newEditingUserId)
                    this.$nuxt.$loading.finish()
                  })
                }
              })
          }
        })
      }).then(() => {
        this.$nuxt.$loading.finish()
        Toast.fire({
          title: 'The draw session was terminated successfully',
          type: 'info'
        })
      })
  },

  activateUserEditing (uid, directActivation = false) {
    if (directActivation) {
      this.$fire.firestore.collection('drawQueue').where('uid', '==', uid)
        .where('boardId', '==', this.activeWhiteboardId).get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            querySnapshot.docs[0].ref.delete()
          }
        })
    }
    this.$nuxt.$loading.start()
    this.$fire.firestore.collection('users').where('uid', '==', uid)
      .get().then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs[0].ref.update({
            editing: true
          }).then(() => {
            this.$nuxt.$loading.finish()
            Toast.fire({
              title: 'Draw session was started successfully',
              type: 'success'
            })
          })
        }
      })
  },

  settingTheRequestInQueue () {
    this.$fire.firestore.collection('drawQueue').where('boardId', '==', this.activeWhiteboardId)
      .onSnapshot((snapshot) => {
        this.drawQueue = []
        snapshot.forEach((doc) => {
          this.getUser(doc.data().uid)
        }
        )
      })
  },

  getUser (uid) {
    this.$fire.firestore.collection('users').where('uid', '==', uid)
      .where('online', '==', true).get().then((querySnapshot) => {
        this.drawQueue.push(querySnapshot.docs[0].data())
      })
  },

  // open recent
  openRecentWhiteboard (id) {
    if (this.user.isAdmin) {
      this.$nuxt.$loading.start()
      this.$fire.firestore.collection('canvas').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id === id) {
            doc.ref.update({
              isComplete: false
            })
          } else {
            doc.ref.update({
              isComplete: true
            })
          }
          $('#open-recent').modal('hide')
        })
      }).then(() => {
        this.$nuxt.$loading.finish()
        Toast.fire({
          title: 'Recent whiteboard was opened',
          type: 'success'
        })
      })
    }
  }

}
