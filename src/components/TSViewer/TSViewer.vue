<template>
  <div ref="ts_viewer" :class="[isPreview ? 'timeseries-viewer preview' : 'timeseries-viewer']">
    <TSScrubber ref="scrubber" :ts_start="ts_start" :ts_end="ts_end" :c-width="cWidth"
      :label-width="labelWidth" :cursor-loc="cursorLoc" :start="start" :duration="duration" :constants="constants"
      @setStart="updateStart" />

    <div id="channelCanvas">
      <!--       Channel labels-->
      <div ref="channelLabels" class="channel-labels">
        <div v-for="item in viewerChannels" :key="item.label">
          <div v-if="item.visible" class="chLabelWrap" :data-id="item.id" @tap="onLabelTap">
            <div class="labelDiv">
              {{ item.label }}
            </div>
            <div class="chLabelIndWrap" :hidden="hideLabelInfo" :class="[item.selected ? 'selected' : '']">
              <div class="chLabelInd" :hidden="hideLabelInfo">
                {{ _computeLabelInfo(item, globalZoomMult, item.rowScale) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--       Timeseries viewport-->
      <TSViewerCanvas ref="viewerCanvas" :window_height="window_height" :window_width="window_width"
        :duration="duration" :start="start" :c-width="cWidth" :c-height="cHeight" :constants="constants"
        :ts-start="ts_start" :ts-end="ts_end" :cursor-loc="cursorLoc" :global-zoom-mult="globalZoomMult"
        @setStart="updateStart" @setCursor="setCursor" @setGlobalZoom="setGlobalZoom" @setDuration="setDuration"
        @channelsInitialized="onChannelsInitialized" @annLayersInitialized="onAnnLayersInitialized"
        @closeAnnotationLayerWindow="onCloseAnnotationLayerWindow" @addAnnotation="onOpenAnnotationWindow"
        @updateAnnotation="onUpdateAnnotation" />
    </div>

    <TSViewerToolbar v-if="!isPreview" :constants="constants" :duration="duration" :start="start"
      @pageBack="onPageBack" @pageForward="onPageForward" @incrementZoom="onIncrementZoom"
      @decrementZoom="onDecrementZoom" @updateDuration="onUpdateDuration" @nextAnnotation="onNextAnnotation"
      @previousAnnotation="onPreviousAnnotation" @setStart="updateStart" />

    <TSFilterModal ref="filterWindow" :visible="filterWindowOpen" @update:visible="filterWindowOpen = $event"
      @closeWindow="onCloseFilterWindow" />

    <TSAnnotationModal ref="annotationModal" :visible="annotationWindowOpen"
      @update:visible="annotationWindowOpen = $event" @closeWindow="onCloseAnnotationWindow"
      @createUpdateAnnotation="onCreateUpdateAnnotation" />

    <TSAnnotationDeleteDialog :visible="isTsAnnotationDeleteDialogVisible" :delete-annotation="annotationDelete"
      @update:visible="isTsAnnotationDeleteDialogVisible = $event" @delete="deleteAnnotation" />


  </div>
</template>

<script>
import {
  head,
  pathOr,
  propOr,
  isEmpty
} from 'ramda'

import { nextTick } from 'vue';
import ViewerActiveTool from '../../mixins/viewer-active-tool'
import Request from '../../mixins/request'
import TsAnnotation from '../../mixins/ts-annotation'
import TSScrubber from './TSScrubber.vue'
import TSViewerCanvas from './TSViewerCanvas.vue'
import TSViewerToolbar from './TSViewerToolbar.vue'
import TSFilterModal from './TSFilterModal.vue'
import TSAnnotationModal from './TSAnnotationModal.vue'
import TSAnnotationDeleteDialog from './TSAnnotationDeleteDialog.vue'
import viewerStoreMixin from '../../mixins/viewer-store-mixin'


export default {
  name: 'TimeseriesViewer',

  mixins: [
    Request,
    ViewerActiveTool,
    TsAnnotation,
    viewerStoreMixin
  ],
  computed: {
    viewerMontageScheme() {
      return ""
    }
  },
  watch: {
    viewerSidePanelOpen: {
      handler: function () {
        this.onResize()
      },
      immediate: true
    },
  },

  computed: {
    activeViewer() {
      return this.viewerStore.activeViewer;
    },
    viewerChannels() {
      return this.viewerStore.viewerChannels;
    },
    viewerSidePanelOpen() {
      return this.viewerStore.viewerSidePanelOpen;
    },
    viewerAnnotations() {
      return this.viewerStore.viewerAnnotations;
    },

    _cpStyleLabels: function (height, nrVisCh) {
      const h = Math.max(1, Math.min(12, (height) / nrVisCh - 2));
      return 'font-size:' + h + 'px; height:' + h + 'px';
    },
    hideLabelInfo: function () {
      let hide = false;
      if (this.cHeight / this.nrVisChannels < 30) {
        hide = true;
      }
      return hide;
    },
    nrVisChannels: function () {
      this.viewerChannels.reduce((accumulator, currentValue) => {
        if (currentValue.visible) {
          return accumulator + 1
        }
        return accumulator
      }, 0)
    },

  },
  data: function () {
    return {
      constants: {
        TIMEUNIT: 'microSeconds',   // Basis for time
        XOFFSET: 0,                 // X-offset of graph in canvas
        XGRIDSPACING: 1000000,      // Time in microseconds between vertical lines
        NRPXPERLABEL: 150,          // Number of pixels per label on x-axis
        USEREALTIME: true,          // If true than interpret timepoints as UTC microseconds.
        DEFAULTDPI: 96,             // Default pixels per inch
        ANNOTATIONLABELHEIGHT: 20,  // Height of annotation label
        ROUNDDATAPIXELS: false,     // If true, canvas point will be rounded to integer pixels for faster render (faster)
        MINMAXPOLYGON: true,        // If true, then polygon is rendered thru minMax values, otherwise vertical lines (faster)
        PAGESIZEDIVIDER: 0.5,       // Number of pages that span the current canvas.
        PREFETCHPAGES: 2,           // Number of pages to read ahead of view.
        LIMITANNFETCH: 500,         // Maximum number of annotations that are fetched per request
        USEMEDIAN: false,           // Use Median instead of mean for centering channels
        CURSOROFFSET: 5,            // Offset of cursor canvas
        SEGMENTSPAN: 1209600000000, // One week of gap-data is returned per request.
        MAXRECURSION: 20,           // Maximum recursion depth of gap-data requests (max 2 years)
        MAXDURATION: 600000000,     // Maximum duration window (5min)
        INITDURATION: 15000000      // Initial duration window  (15sec)
      },
      summary: {},
      ts_start: null,
      ts_end: null,
      window_height: 0,
      window_width: 0,
      start: 0,                // Start Timestamp of viewer in microseconds
      duration: 0,            // Length of data in viewer in microseconds (ignore gaps)
      cWidth: 0,
      cHeight: 0,
      labelWidth: 0,
      globalZoomMult: 1,
      cursorLoc: 1 / 10,
      filterWindowOpen: false,
      annotationWindowOpen: false,
      annotationLayerWindowOpen: false,
      annotationDelete: null,
      isTsAnnotationDeleteDialogVisible: false,
      isPreview: false
    }
  },

  mounted: async function () {
    try {
      this.initChannels();

      const tsViewerEl = this.$refs.ts_viewer;
      if (!tsViewerEl) {
        console.error("Ref 'ts_viewer' not found.");
        return;
      }

      const heightStr = window.getComputedStyle(tsViewerEl).getPropertyValue('height');
      const containerHeight = parseInt(heightStr);

      if (isNaN(containerHeight)) {
        console.error("Could not parse height from ts_viewer element.");
        return;
      }

      const toolbarOffset = this.isPreview ? 0 : 100;
      this.window_height = containerHeight - toolbarOffset;
      this.window_width = tsViewerEl.offsetWidth ?? 0;

      window.addEventListener('resize', this.onResize);

      const labelWidth = this.$refs.channelLabels?.clientWidth ?? 0;
      this.labelWidth = labelWidth;

      this.cWidth = this.window_width - labelWidth - 15;
      this.cHeight = this.window_height - 88;

      const initDuration = this.constants?.INITDURATION;
      if (typeof initDuration !== 'number') {
        console.warn("INITDURATION is not defined or not a number.");
      }

      this.duration = initDuration ?? 0;
    } catch (error) {
      console.error("Error initializing viewer layout:", error);
    }
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    openEditAnnotationDialog: function (annotation) {
      this.viewerStore.setActiveAnnotation(annotation).then(() => {
        this.$refs.viewerCanvas.renderAnnotationCanvas()
        this.annotationWindowOpen = true
      })
    },
    onUpdateAnnotation: function (annotation) {
      this.openEditAnnotationDialog(annotation)
    },
    onCreateUpdateAnnotation: function (annotation) {
      this.annotationWindowOpen = false
      if (annotation.id) {
        this.updateAnnotation()
      } else {
        this.addAnnotation()
      }
    },
    onAnnotationUpdated: function () {
      this.$refs.viewerCanvas.renderAnnotationCanvas()
    },
    onOpenAnnotationWindow: function () {
      this.annotationWindowOpen = true
    },
    confirmDeleteAnnotation: function (annotation) {
      this.annotationDelete = annotation
      this.isTsAnnotationDeleteDialogVisible = true
    },
    deleteAnnotation: function (annotation) {
      this.isTsAnnotationDeleteDialogVisible = false
      this.removeAnnotation(annotation)
    },
    onAnnotationDeleted: function () {
      this.$refs.viewerCanvas.renderAnnotationCanvas()
    },
    onAddAnnotation: function (start, duration, onAll, label, description, layer) {
      this.addAnnotation(start, duration, onAll, label, description, layer)
    },
    onAnnotationCreated: function () {
      this.$refs.viewerCanvas.renderAnnotationCanvas()
    },
    onCreateAnnotationLayer: function (newLayer) {
      this.$refs.viewerCanvas.createAnnotationLayer(newLayer)
    },
    onCloseAnnotationLayerWindow: function () {
      this.annotationLayerWindowOpen = false
    },
    onCloseAnnotationWindow: function () {
      this.$refs.viewerCanvas.resetFocusedAnnotation()
      this.$refs.viewerCanvas.renderAnnotationCanvas()
      this.annotationWindowOpen = false
    },
    onCloseFilterWindow: function () {
      this.filterWindowOpen = false
    },
    onLabelTap: function (e) {
      e.stopPropagation();
      e.preventDefault();

      const append = e.detail.sourceEvent.metaKey;
      this.selectChannel({ channelId: e.currentTarget.dataset.id, append: append });
      this.$refs.viewerCanvas.renderAll()
    },
    onNextAnnotation: function () {
      this.start = this.$refs.viewerCanvas.getNextAnnotation()
    },
    onPreviousAnnotation: function () {
      this.start = this.$refs.viewerCanvas.getPreviousAnnotation()
    },
    onUpdateDuration: function (value) {
      this.setDuration(value * 1e6)
    },
    onIncrementZoom: function () {
      this.globalZoomMult = this.globalZoomMult * 1.25
    },
    onDecrementZoom: function () {
      this.globalZoomMult = this.globalZoomMult * 0.8
    },
    onAnnLayersInitialized: function () {
      this.$refs.scrubber.getAnnotations()
    },
    onChannelsInitialized: function () {
      this.$refs.scrubber.initSegmentSpans()

      // Resize the canvas as label length likely changed
      this.$nextTick(() => {
        this.onResize()
      })

    },
    onPageBack: function () {
      //TODO: Update logic to track gap over all channels

      let setStart = this.start - (3 * this.duration) / 4
      let channelOneSegments = this.viewerChannels[0].dataSegments

      let i = 0;
      for (let segment in channelOneSegments) {
        if (channelOneSegments[segment] > setStart) {
          break
        }
        i++
      }

      // If new page completely in gap --> set start to next timestamp with data
      if (i % 2 == 0) {
        setStart = channelOneSegments[i - 1] - 0.5 * this.duration
      }

      this.start = setStart
    },
    onPageForward: function () {

      //TODO: Update logic to track gap over all channels
      let setStart = this.start + (3 * this.duration) / 4
      let channelOneSegments = this.viewerChannels[0].dataSegments

      let i = 0;
      for (let segment in channelOneSegments) {
        if (channelOneSegments[segment] > setStart) {
          break
        }
        i++
      }

      // If new page completely in gap --> set start to next timestamp with data
      if (i % 2 == 0) {
        setStart = channelOneSegments[i] - 0.5 * this.duration
      }

      this.start = setStart
    },
    selectAnnotation: function (payload) {
      let rsPeriod = this.$refs.viewerCanvas.rsPeriod
      this.updateStart(payload.annotation.start - ((this.cursorLoc * this.cWidth - this.constants['CURSOROFFSET']) * rsPeriod))
    },
    selectChannel: function (payload) {
      const _channels = this.viewerChannels.map(channel => {
        const selected = channel.selected

        if (payload['append'] === false) {
          channel.selected = false
        }

        if (payload['channelId'] === channel.id) {
          channel.selected = !selected
        }

        return channel
      })

      this.viewerStore.setChannels(_channels)
    },
    selectChannels: function (ids, append) {
      const channels = this.viewerChannels.map(channel => {
        if (append === false) {
          channel.selected = false
        }
        if (channel.id in ids) {
          channel.selected = true
        }
        return channel
      })

      this.viewerStore.setChannels(channels)
    },
    updateStart: function (value) {
      this.start = value
    },
    setCursor: function (value) {
      // set the cursor location as a fraction of the width of the canvas
      this.cursorLoc = value
    },
    setGlobalZoom: function (value) {
      this.globalZoomMult = value
    },
    setDuration: function (value) {
      if (value > this.constants['MAXDURATION']) {
        this.duration = this.constants['MAXDURATION']
      } else {
        this.duration = value
      }

    },
    getChannelId: function (channel) {
      const isViewingMontage = true
      let id = propOr('', 'id', channel)
      let list = []
      if (isViewingMontage) {
        list = id.split('_')
        id = list.length ? head(list) : id // remove channel name from id
      }
      return id
    },
    async onResize(event) {
      console.log('onresize...');

      const tsViewerEl = this.$refs.ts_viewer;
      if (!tsViewerEl) {
        return;
      }

      const heightStr = window.getComputedStyle(tsViewerEl).getPropertyValue('height');
      const containerHeight = parseInt(heightStr);

      if (isNaN(containerHeight)) {
        console.error("Could not parse height from ts_viewer element.");
        return;
      }

      const toolbarOffset = this.isPreview ? 0 : 100;
      this.window_height = containerHeight - toolbarOffset;

      await nextTick();
      this.window_width = tsViewerEl.offsetWidth ?? 0;

      const labelWidth = this.$refs.channelLabels?.clientWidth ?? 0;
      this.labelWidth = labelWidth;

      this.cWidth = this.window_width - labelWidth - 16;
      this.cHeight = this.window_height - 40;

      console.log(this.cWidth);
    },
    _computeLabelInfo: function (item, globalZoomMult, rowscale) {
      const n = (((this.constants['DEFAULTDPI'] * window.devicePixelRatio) / (globalZoomMult * rowscale)) / 25.4).toFixed(1);
      return n + ' ' + item.unit + '/mm'
    },
    initChannels: function () {
      const channels = this.activeViewer.channels
      if (channels?.length > 0) {
        // Find Global start and end
        this.ts_start = channels[0].content.start
        this.ts_end = channels[0].content.end
        for (let ic = 1; ic < channels.length; ic++) {
          const spanStart = this.ts
          const spanEnd = pathOr(0, ['span', 'end', this.summary])
          if (channels[ic].content.start < this.ts_start) {
            this.ts_start = channels[ic].content.start
          }
          if (channels[ic].content.end > this.ts_end) {
            this.ts_end = channels[ic].content.end
          }
        }

        this.start = this.ts_start
      }
    },
    openLayerWindow: function (payload) {
      const layerModal = this.$refs.layerModal
      layerModal.isCreating = payload.isCreating

      if (!payload.isCreating) {
        layerModal.layer = payload.layer
      } else {
        layerModal.layer = {}
        // layerModal.setColorByIndex(this.viewerAnnotations.length % layerModal.colorOptions.length)
      }

      this.annotationLayerWindowOpen = true
    },
    openFilterWindow: function (payload) {

      const channels = propOr([], 'channels', payload);
      const filter = propOr('', 'filter', payload);
      const filterWindow = this.$refs.filterWindow;
      filterWindow.onChannels = channels;

      if (!isEmpty(filter)) {
        filterWindow.input0 = filter.input0;
        filterWindow.input1 = filter.input1;
        // TODO: commenting the following code, 'filterWindow' does not seem to have '_filters' or '_notchValues' properties, review and add the following if needed
        // for (let i=0; i<._filters.length; i++) {
        //     if (filterWindow._filters[i].value === filter.type) {
        //         filterWindow.selectedFilter = filter.type;
        //         break;
        //     }
        // }

        // for (let i=0; i<filterWindow._notchValues?.length; i++) {
        //     if (filterWindow._notchValues[i].value === filter.notchFreq) {
        //         filterWindow.selectedNotch = filter.notchFreq;
        //         break;
        //     }
        // }
      } else {
        filterWindow.input0 = NaN;
        filterWindow.input1 = NaN;
        filterWindow.selectedFilter = null;
        filterWindow.selectedNotch = null;
      }
      this.filterWindowOpen = true
    },
    setTimeseriesFilters: function (payload) {
      this.$refs.viewerCanvas.setFilters(payload)
    }
  }

}

</script>

<style lang="scss" scoped>
@import'../../assets/tsviewerVariables.scss';

.timeseries-viewer {
  display: flex;
  height: 100%;
  flex-direction: column;

  &.preview {
    height: 600px;
    border: 2px solid $gray_3;

  }
}

#channelCanvas {
  display: flex;
  background-color: white;
  flex: 1;
}

.channel-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  line-height: normal;
  margin-bottom: 32px;
  min-width: 75px;
}

.chLabelWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

}

.chLabelIndWrap {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  color: #3c54a4;
}

.chLabelInd {
  font-size: 0.6em;
  min-width: 70px;
  color: rgb(150, 150, 150);
  text-align: right;
  white-space: nowrap;
}

.labelDiv[selected] {
  color: #295eff;
  /*#ff9800;/*#358855;*/
}

.chLabelIndWrap[selected] {
  color: #295eff;
  /*#ff9800; /*#358855;*/
}

.labelDiv {
  align-self: flex-end;
  white-space: nowrap;
  color: var(--neuron);
}
</style>