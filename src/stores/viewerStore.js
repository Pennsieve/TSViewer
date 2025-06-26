import { defineStore } from 'pinia';
import {
  propOr, propEq, findIndex, flatten, compose,
  pluck, pathOr, includes, remove, find
} from 'ramda';
import { viewerSidePanelTypes, viewerToolTypes } from '../utils/constants';
import { useSendXhr } from '../mixins/request/request_composable';
import { useToken } from '../composables/useToken'

const getLayerIndex = (key, data, viewerAnnotations) => {
  const layerId = propOr('', key, data);
  return findIndex(propEq('id', layerId), viewerAnnotations);
};

const initialState = () => ({
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
});

export const useViewerStore = defineStore('viewer', {
  state: initialState,

  getters: {
    viewerSelectedChannels: (state) => state.viewerChannels.filter(ch => ch.selected),
    getViewerActiveLayer: (state) => () => find(propEq('selected', true), state.viewerAnnotations),
    getAnnotationById: (state) => (id) => compose(
      find(propEq('id', id)),
      flatten,
      pluck('annotations')
    )(state.viewerAnnotations),
    viewerMpp: (state) => compose(
      propOr('', 'value'),
      find(propEq('key', 'aperio.MPP')),
      propOr([{}], 'properties'),
      find(propEq('category', 'Blackfynn')),
      propOr([{}], 'properties')
    )(state.activeViewer)
  },

  actions: {
    clearState() {
      Object.assign(this, initialState());
    },

    setActiveViewer(viewer) {
      this.activeViewer = viewer;
    },

    async fetchAndSetActiveViewer(data) {
      const id = data.packageId;
      const token = await useToken();
      const url = `https://api.pennsieve.net/packages/${id}?api_key=${token}`;
      const response = await useSendXhr(url);
      this.setActiveViewer(response);
    },

    closeViewer() {
      this.clearState();
    },

    setSidePanel({ open, view }) {
      this.viewerSidePanelOpen = open;
      this.viewerSidePanelView = view;
    },

    updateViewerSlideInfo(info) {
      this.viewerSlideInfo = info;
    },

    setChannels(chs) {
      this.viewerChannels = chs;
    },

    updateViewChannel({ channelId, data }) {
      const idx = findIndex(propEq('id', channelId), this.viewerChannels);
      if (idx >= 0) Object.entries(data).forEach(([k, v]) => (this.viewerChannels[idx][k] = v));
    },

    updateChannel({ data, channelIndex }) {
      this.viewerChannels[channelIndex] = data;
    },

    createLayer(data) {
      this.viewerAnnotations.push(data);
    },

    setActiveAnnotationLayer(id) {
      this.activeAnnotationLayer = id;
      this.viewerAnnotations.forEach(l => (l.selected = false));
      const idx = findIndex(propEq('id', id), this.viewerAnnotations);
      if (idx >= 0) this.viewerAnnotations[idx].selected = true;
    },

    setActiveAnnotation(data) {
      this.viewerAnnotations.forEach(l => l.annotations.forEach(a => (a.selected = false)));
      if (data.id) {
        const li = getLayerIndex('layer_id', data, this.viewerAnnotations);
        const ai = findIndex(propEq('id', data.id), this.viewerAnnotations[li].annotations);
        if (ai >= 0) this.viewerAnnotations[li].annotations[ai].selected = true;
      }
      this.activeAnnotation = data;
    },

    updateLayer({ layer, index }) {
      this.viewerAnnotations[index] = layer;
    },

    deleteLayer({ index }) {
      this.viewerAnnotations.splice(index, 1);
    },

    setAnnotations(anns) {
      this.viewerAnnotations = anns;
    },

    createAnnotation({ annotation, index }) {
      this.viewerAnnotations[index].annotations.push(annotation);
    },

    updateAnnotation({ data }) {
      const li = getLayerIndex('layer_id', data, this.viewerAnnotations);
      const ai = findIndex(propEq('id', data.id), this.viewerAnnotations[li].annotations);
      this.viewerAnnotations[li].annotations[ai] = data;
    },

    deleteAnnotation({ data }) {
      const li = getLayerIndex('layer_id', data, this.viewerAnnotations);
      const ai = findIndex(propEq('id', data.id), this.viewerAnnotations[li].annotations);
      this.viewerAnnotations[li].annotations.splice(ai, 1);
    },

    setDiscussions({ discussions, comments }) {
      this.viewerDiscussions = { discussions, comments };
    },

    createDiscussion({ discussion, comment }) {
      const id = pathOr('', ['discussion_id'], comment);
      const existing = this.viewerDiscussions.comments[id] || [];
      existing.push(comment);
      if (!includes(discussion, this.viewerDiscussions.discussions)) {
        this.viewerDiscussions.discussions.push(discussion);
        this.viewerDiscussions.comments[id] = existing;
      }
    },

    removeDiscussion(idx) {
      this.viewerDiscussions.discussions.splice(idx, 1);
    },

    createComment({ comment, discussionId }) {
      (this.viewerDiscussions.comments[discussionId] ||= []).push(comment);
    },

    removeComment(data) {
      const did = propOr(0, 'discussion_id', data);
      const comments = propOr([], did, this.viewerDiscussions.comments);
      const cid = propOr(0, 'id', data);
      const cidx = findIndex(propEq('id', cid), comments);
      const updated = remove(cidx, 1, comments);
      this.viewerDiscussions.comments[did] = updated;
      if (updated.length === 0) {
        const dIdx = findIndex(propEq('id', did), this.viewerDiscussions.discussions);
        if (dIdx >= 0) this.viewerDiscussions.discussions.splice(dIdx, 1);
      }
    },

    setViewerErrors(errs) {
      this.viewerErrors = errs;
    },

    setViewerMontageScheme(scheme) {
      this.viewerMontageScheme = scheme;
    },

    selectPackage(pkg) {
      this.selectedPackage = pkg;
    }
  }
});
