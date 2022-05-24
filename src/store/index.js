import { propOr, propEq, findIndex, mergeWith } from 'ramda'
import { viewerSidePanelTypes, viewerToolTypes } from '@/utils/constants'

const store = {
  state: {
    userToken: '',
    selectedPackage: {},
    // active viewer contains the package info response
    activeViewer: {},
    viewerSidePanelOpen: false,
    viewerSlideInfo: {
      curRotation: 0,
      curZoom: 0,
      isMeasuring: false,
      measureLength: 0,
      zoomPerClick: 0,
      minZoom: 0,
      maxZoom: 0
    },
    viewerChannels: [],
    viewerAnnotations: [],
    activeAnnotationLayer: {},
    activeAnnotation: {},
    viewerErrors: {},

    //TODO make strings enum constants
    viewerSidePanelView: viewerSidePanelTypes.INFO_PANEL,
    viewerActiveTool: viewerToolTypes.PAN,
    viewerMontageScheme: 'NOT_MONTAGED',
  },

  getters: {
    viewerSelectedChannels: state => {
      return state.viewerChannels.filter(channel => {
        return channel.selected
      })
    },
    viewerChannels: state => state.viewerChannels,
    viewerMontageScheme: state => state.viewerMontageScheme,
    activeViewer: state => state.activeViewer,
    viewerActiveTool: state => state.viewerActiveTool,
    activeAnnotation: state => state.activeAnnotation,
    viewerSidePanelOpen: state => state.viewerSidePanelOpen,
    viewerAnnotations: state => state.viewerAnnotations
  },

  mutations: {
    //TODO figure out why we clear state twice?
    CLEAR_STATE(state) {
      //reset all state to initial state
      const _initialState = initialState()
      // need to iteratively set keys to preserve reactivity
      Object.keys(_initialState).forEach(key => state[key] = _initialState[key])
    },
    OPEN_VIEWER(state, viewer) {
      state.activeViewer = viewer
    },
    SET_SIDE_PANEL(state, sidePanel) {
      state.viewerSidePanelOpen = sidePanel.open
      state.viewerSidePanelView = sidePanel.view
    },
    SET_ACTIVE_TOOL(state, tool) {
      state.viewerActiveTool = tool
    },
    UPDATE_VIEWER_SLIDE_INFO (state, newSlideInfo) {
      state.viewerSlideInfo = newSlideInfo
    },
    SET_CHANNELS (state, channels) {
      state.viewerChannels = channels
    },
    UPDATE_VIEW_CHANNEL  (state, data) {
      if (data.channelId) {
        const channelIndex = findIndex(propEq('id', data.channelId), state.viewerChannels)
        for (let d in data.data) {
          state.viewerChannels[channelIndex][d] = data.data[d]
        }
      }
    },
    SET_ACTIVE_ANNOTATION_LAYER (state, data) {
      state.activeAnnotationLayer = data
      state.viewerAnnotations.forEach(index => index.selected = false)
      const layerIndex = findIndex(propEq('id', data), state.viewerAnnotations)
      state.viewerAnnotations[layerIndex].selected = true

    },
    SET_ACTIVE_ANNOTATION (state, data) {
      state.viewerAnnotations.forEach( index =>
        index.annotations.forEach(ann =>
          ann.selected = false
        )
      )
      if (data.id) {
        const layerIndex = findIndex(propEq('id', data.layer_id), state.viewerAnnotations)
        const annotationIndex = findIndex(propEq('id', data.id), state.viewerAnnotations[layerIndex].annotations)
        state.viewerAnnotations[layerIndex].annotations[annotationIndex].selected = true
      }
      state.activeAnnotation = data
    },
    SET_ANNOTATIONS (state, data) {
      state.viewerAnnotations = data
    },
    SET_DISCUSSIONS (state, { discussions, comments }) {
      state.viewerDiscussions = {
        discussions,
        comments
      }
    },
    SET_VIEWER_ERRORS (state, data) {
      state.viewerErrors = data
    },
    SET_VIEWER_MONTAGE_SCHEME (state, data) {
      state.viewerMontageScheme = data
    },
    UPDATE_USER_TOKEN(state, data) {
      state.userToken = data
    },
    // Leveraged to get individual package state to package details route
    SELECT_PACKAGE(state, data) {
      state.selectedPackage = data
    },
  },

  actions: {
    openViewer: ({ commit }, evt) =>
      commit('OPEN_VIEWER', evt),
    setSidePanel: ({ commit }, evt) =>
      commit('SET_SIDE_PANEL', evt),
    setActiveTool: ({ commit }, evt) =>
      commit('SET_ACTIVE_TOOL', evt),
    setChannels: ({ commit }, evt) => {
      commit('SET_CHANNELS', evt)},
    updateViewChannel: ({commit}, data) => {
      commit('UPDATE_VIEW_CHANNEL', data)},
    setActiveAnnotationLayer: ({ commit }, evt) =>
      commit('SET_ACTIVE_ANNOTATION_LAYER', evt),
    setAnnotations: ({ commit }, annotations) =>
      commit('SET_ANNOTATIONS', annotations),
    setActiveAnnotation: ({ commit }, data) =>
      commit('SET_ACTIVE_ANNOTATION',  data),
    updateViewerSlideInfo: ({ commit }, evt) => {
      const newSlideInfo = mergeWith(this.state.viewerSlideInfo, evt)
      commit('UPDATE_VIEWER_SLIDE_INFO', newSlideInfo)
    },
    setDiscussions: ({commit}, discussionData) => {
      const discussions = propOr([], 'discussions', discussionData)
      const comments = propOr({}, 'comments', discussionData)
      commit('SET_DISCUSSIONS', { discussions, comments })
    },
    setViewerErrors: ({ commit }, evt) =>
      commit('SET_VIEWER_ERRORS', evt),
    setViewerMontageScheme: ({commit}, evt) =>
      commit('SET_VIEWER_MONTAGE_SCHEME', evt),
    setSelectedPackage: ({commit}, evt) => commit('SELECT_PACKAGE', evt),
    updateUserToken: ({commit}, evt) =>
      commit('UPDATE_USER_TOKEN', evt)
  }
}

const initialState = () => ({
  activeViewer: {},
  viewerSidePanelOpen: false,
  viewerSlideInfo: {
    curRotation: 0,
    curZoom: 0,
    isMeasuring: false,
    measureLength: 0,
    zoomPerClick: 0,
    minZoom: 0,
    maxZoom: 0
  },
  viewerChannels: [],
  viewerAnnotations: [],
  activeAnnotationLayer: {},
  activeAnnotation: {},
  viewerErrors: {},

  //TODO make strings enum constants
  viewerSidePanelView: viewerSidePanelTypes.INFO_PANEL,
  viewerActiveTool: viewerToolTypes.PAN,
  viewerMontageScheme: 'NOT_MONTAGED'
})

export default store