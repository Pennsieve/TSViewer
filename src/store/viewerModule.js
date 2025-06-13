import {
  propOr, propEq, findIndex, flatten, compose,
  pluck, pathOr, includes, remove, find
} from 'ramda'
import { viewerSidePanelTypes, viewerToolTypes } from'../utils/constants'
import {useSendXhr} from "../mixins/request/request_composable"


const getLayerIndex = (key, data, viewerAnnotations) => {
  const layerId = propOr('', key, data)
  return findIndex(propEq('id', layerId), viewerAnnotations)
}

const initialState = () => ({
  userToken: '',
  selectedPackage: {},

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
  viewerDiscussions: {
    discussions: [],
    comments: {}
  },
  viewerErrors: {},

  viewerSidePanelView: viewerSidePanelTypes.INFO_PANEL,
  viewerActiveTool: viewerToolTypes.PAN,
  viewerMontageScheme: 'NOT_MONTAGED'
})

const state = initialState()

const getters = {
  viewerSelectedChannels: state => state.viewerChannels.filter(ch => ch.selected),
  viewerChannels: state => state.viewerChannels,
  viewerMontageScheme: state => state.viewerMontageScheme,
  activeViewer: state => state.activeViewer,
  viewerActiveTool: state => state.viewerActiveTool,
  activeAnnotation: state => state.activeAnnotation,
  viewerSidePanelOpen: state => state.viewerSidePanelOpen,
  viewerAnnotations: state => state.viewerAnnotations,
  userToken: state => state.userToken,
  selectedPackage: state => state.selectedPackage,

  getViewerActiveLayer: state => () => find(propEq('selected', true), state.viewerAnnotations),
  getAnnotationById: state => id => compose(
    find(propEq('id', id)),
    flatten,
    pluck('annotations')
  )(state.viewerAnnotations),
  viewerMpp: state => compose(
    propOr('', 'value'),
    find(propEq('key', 'aperio.MPP')),
    propOr([{}], 'properties'),
    find(propEq('category', 'Blackfynn')),
    propOr([{}], 'properties')
  )(state.activeViewer)
}

const mutations = {
  CLEAR_STATE(state) {
    const _initial = initialState()
    Object.keys(_initial).forEach(k => (state[k] = _initial[k]))
  },
  SET_ACTIVE_VIEWER(state, viewer) {
    state.activeViewer = viewer
  },
  SET_SIDE_PANEL(state, { open, view }) {
    state.viewerSidePanelOpen = open
    state.viewerSidePanelView = view
  },
  SET_ACTIVE_TOOL(state, tool) {
    state.viewerActiveTool = tool
  },
  UPDATE_VIEWER_SLIDE_INFO(state, info) {
    state.viewerSlideInfo = info
  },
  SET_CHANNELS(state, chs) {
    state.viewerChannels = chs
  },
  UPDATE_VIEW_CHANNEL(state, { channelId, data }) {
    const idx = findIndex(propEq('id', channelId), state.viewerChannels)
    if (idx >= 0) Object.entries(data).forEach(([k, v]) => (state.viewerChannels[idx][k] = v))
  },
  UPDATE_CHANNEL(state, { data, channelIndex }) {
    state.viewerChannels[channelIndex] = data
  },
  CREATE_LAYER(state, data) {
    state.viewerAnnotations.push(data)
  },
  SET_ACTIVE_ANNOTATION_LAYER(state, id) {
    state.activeAnnotationLayer = id
    state.viewerAnnotations.forEach(l => (l.selected = false))
    const idx = findIndex(propEq('id', id), state.viewerAnnotations)
    if (idx >= 0) state.viewerAnnotations[idx].selected = true
  },
  SET_ACTIVE_ANNOTATION(state, data) {
    state.viewerAnnotations.forEach(l => l.annotations.forEach(a => (a.selected = false)))
    if (data.id) {
      const li = getLayerIndex('layer_id', data, state.viewerAnnotations)
      const ai = findIndex(propEq('id', data.id), state.viewerAnnotations[li].annotations)
      if (ai >= 0) state.viewerAnnotations[li].annotations[ai].selected = true
    }
    state.activeAnnotation = data
  },
  UPDATE_LAYER(state, { layer, index }) {
    state.viewerAnnotations[index] = layer
  },
  DELETE_LAYER(state, { index }) {
    state.viewerAnnotations.splice(index, 1)
  },
  SET_ANNOTATIONS(state, anns) {
    state.viewerAnnotations = anns
  },
  CREATE_ANNOTATION(state, { annotation, index }) {
    state.viewerAnnotations[index].annotations.push(annotation)
  },
  UPDATE_ANNOTATION(state, { data }) {
    const li = getLayerIndex('layer_id', data, state.viewerAnnotations)
    const ai = findIndex(propEq('id', data.id), state.viewerAnnotations[li].annotations)
    state.viewerAnnotations[li].annotations[ai] = data
  },
  DELETE_ANNOTATION(state, { data }) {
    const li = getLayerIndex('layer_id', data, state.viewerAnnotations)
    const ai = findIndex(propEq('id', data.id), state.viewerAnnotations[li].annotations)
    state.viewerAnnotations[li].annotations.splice(ai, 1)
  },
  SET_DISCUSSIONS(state, { discussions, comments }) {
    state.viewerDiscussions = { discussions, comments }
  },
  CREATE_DISCUSSION(state, { discussion, comment }) {
    const id = pathOr('', ['discussion_id'], comment)
    const existing = state.viewerDiscussions.comments[id] || []
    existing.push(comment)
    if (!includes(discussion, state.viewerDiscussions.discussions)) {
      state.viewerDiscussions.discussions.push(discussion)
      state.viewerDiscussions.comments[id] = existing
    }
  },
  REMOVE_DISCUSSION(state, idx) {
    state.viewerDiscussions.discussions.splice(idx, 1)
  },
  CREATE_COMMENT(state, { comment, discussionId }) {
    propOr([], discussionId, state.viewerDiscussions.comments).push(comment)
  },
  REMOVE_COMMENT(state, data) {
    const did = propOr(0, 'discussion_id', data)
    const comments = propOr([], did, state.viewerDiscussions.comments)
    const cid = propOr(0, 'id', data)
    const cidx = findIndex(propEq('id', cid), comments)
    const updated = remove(cidx, 1, comments)
    state.viewerDiscussions.comments[did] = updated
    if (updated.length === 0) {
      const dIdx = findIndex(propEq('id', did), state.viewerDiscussions.discussions)
      if (dIdx >= 0) state.viewerDiscussions.discussions.splice(dIdx, 1)
    }
  },
  SET_VIEWER_ERRORS(state, errs) {
    state.viewerErrors = errs
  },
  SET_VIEWER_MONTAGE_SCHEME(state, scheme) {
    state.viewerMontageScheme = scheme
  },
  UPDATE_USER_TOKEN(state, token) {
    state.userToken = token
  },
  SELECT_PACKAGE(state, pkg) {
    state.selectedPackage = pkg
  }
}

const actions = {
  setActiveViewer: ({ commit, state }, data) => {
    const id = data.packageId
    const token = state.userToken 
    const url = `https://api.pennsieve.net/packages/${id}?api_key=${token}`

    return useSendXhr(url)
      .then(response => {
        commit('SET_ACTIVE_VIEWER', response)
      })
  },
  closeViewer: ({ commit }) => commit('CLEAR_STATE'),
  setSidePanel: ({ commit }, data) => commit('SET_SIDE_PANEL', data),
  setActiveTool: ({ commit }, data) => commit('SET_ACTIVE_TOOL', data),
  setChannels: ({ commit }, data) => commit('SET_CHANNELS', data),
  updateViewChannel: ({ commit }, data) => commit('UPDATE_VIEW_CHANNEL', data),
  updateChannel: ({ commit, state }, ch) => {
    const idx = findIndex(propEq('id', propOr('', 'id', ch)), state.viewerChannels)
    commit('UPDATE_CHANNEL', { data: ch, channelIndex: idx })
  },
  createLayer: ({ commit }, layer) => commit('CREATE_LAYER', layer),
  updateLayer: ({ commit, state }, data) => {
    const idx = getLayerIndex('id', data, state.viewerAnnotations)
    const layer = { ...state.viewerAnnotations[idx], ...data }
    commit('UPDATE_LAYER', { layer, index: idx })
  },
  deleteLayer: ({ commit, state }, data) => {
    const idx = getLayerIndex('id', data, state.viewerAnnotations)
    commit('DELETE_LAYER', { index: idx })
  },
  setAnnotations: ({ commit }, anns) => commit('SET_ANNOTATIONS', anns),
  createAnnotation: ({ commit, state }, ann) => {
    const idx = getLayerIndex('layer_id', ann, state.viewerAnnotations)
    commit('CREATE_ANNOTATION', { annotation: ann, index: idx })
    commit('SET_ACTIVE_ANNOTATION', ann)
  },
  setActiveAnnotation: ({ commit }, data) => commit('SET_ACTIVE_ANNOTATION', data),
  updateAnnotation: ({ commit }, data) => commit('UPDATE_ANNOTATION', { data }),
  deleteAnnotation: ({ commit }, data) => commit('DELETE_ANNOTATION', { data }),
  setDiscussions: ({ commit }, discData) => {
    const discussions = propOr([], 'discussions', discData)
    const comments = propOr({}, 'comments', discData)
    commit('SET_DISCUSSIONS', { discussions, comments })
  },
  createDiscussion: ({ commit }, data) => commit('CREATE_DISCUSSION', data),
  removeDiscussion: ({ commit, state }, id) => {
    const idx = findIndex(propEq('id', id), state.viewerDiscussions.discussions)
    commit('REMOVE_DISCUSSION', idx)
  },
  createComment: ({ commit }, cmt) => {
    const did = propOr(0, 'discussion_id', cmt)
    commit('CREATE_COMMENT', { comment: cmt, discussionId: did })
  },
  removeComment: ({ commit }, evt) => commit('REMOVE_COMMENT', evt),
  setViewerErrors: ({ commit }, data) => commit('SET_VIEWER_ERRORS', data),
  setViewerMontageScheme: ({ commit }, data) => commit('SET_VIEWER_MONTAGE_SCHEME', data),
  setSelectedPackage: ({ commit }, pkg) => commit('SELECT_PACKAGE', pkg),
  updateUserToken: ({ commit }, token) => commit('UPDATE_USER_TOKEN', token)
}

const viewerModule = {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}

export default viewerModule
