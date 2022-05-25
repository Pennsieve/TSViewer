<template>
  <div class="timeseries-viewer-toolbar">
    <div id="left-controls">
      <el-tooltip
        placement="top-end"
        content="Toggle Time Zoom Controls">
        <button
          class="btn-icon"
          @click="toggleTimeZoom()">
          <svg
            class="svg-fill icon"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path d="M13.653125,14.3537502 L11.29125,11.9918752 C11.6475,11.4075002 11.8525,10.7200002 11.8525,9.98562517 C11.8525,7.85000017 10.001875,6.00000017 7.86625,6.00000017 C5.730625,5.99937517 4,7.73062517 4,9.86625017 C4,12.0012502 5.850625,13.8518752 7.985625,13.8518752 C8.69625,13.8518752 9.360625,13.6587502 9.9325,13.3243752 L12.306875,15.7000002 C12.539375,15.9318752 12.91625,15.9318752 13.148125,15.7000002 L13.7375,15.1106252 C13.969375,14.8787502 13.885,14.5856252 13.653125,14.3537502 Z M5.19,9.86625017 C5.19,8.38750017 6.388125,7.18937517 7.86625,7.18937517 C9.345,7.18937517 10.6625,8.50625017 10.6625,9.98562517 C10.6625,11.4637502 9.46375,12.6625002 7.985625,12.6625002 C6.506875,12.6618752 5.19,11.3443752 5.19,9.86625017 Z M16,3 L13,6 L13,4 L9,4 L9,2 L13,2 L13,6.2778623e-16 L16,3 Z M3,6 L2.66453526e-15,3 L3,-7.66951701e-17 L3,2 L9,2 L9,4 L3,4 L3,6 Z"/>
          </svg>
        </button>
      </el-tooltip>

      <el-input-number
        v-model="durationInSeconds"
        v-if="showTimeZoom"
        :precision="1"
        :step="5"
        :max="this.constants['MAXDURATION']"
        size="mini"
        controls-position="right">
      </el-input-number>

      <el-tooltip
        placement="top-end"
        content="Toggle Vertical Zoom Controls">
        <button
          class="btn-icon"
          @click="toggleVerticalZoom()">
          <svg
            class="svg-fill icon"
            width="20"
            height="20"
            viewBox="0 0 16 16"
          >
            <path d="M15.715625,12.416875 L13.35375,10.055 C13.71,9.470625 13.915,8.783125 13.915,8.04875 C13.915,5.913125 12.064375,4.063125 9.92875,4.063125 C7.793125,4.0625 6.0625,5.79375 6.0625,7.929375 C6.0625,10.064375 7.913125,11.915 10.048125,11.915 C10.75875,11.915 11.423125,11.721875 11.995,11.3875 L14.369375,13.763125 C14.601875,13.995 14.97875,13.995 15.210625,13.763125 L15.8,13.17375 C16.031875,12.941875 15.9475,12.64875 15.715625,12.416875 Z M7.2525,7.929375 C7.2525,6.450625 8.450625,5.2525 9.92875,5.2525 C11.4075,5.2525 12.725,6.569375 12.725,8.04875 C12.725,9.526875 11.52625,10.725625 10.048125,10.725625 C8.569375,10.725 7.2525,9.4075 7.2525,7.929375 Z M3,0 L6,3 L4,3 L4,7 L2,7 L2,3 L0,3 L3,0 Z M6,13 L3,16 L0,13 L2,13 L2,7 L4,7 L4,13 L6,13 Z"/>
          </svg>
        </button>
      </el-tooltip>

      <el-button-group v-if="showVertZoom">
        <el-button icon="el-icon-plus" size="mini" @click="incrementZoom"></el-button>
        <el-button icon="el-icon-minus" size="mini" @click="decrementZoom"></el-button>
      </el-button-group>
    </div>

    <div id="center-controls">
      <el-tooltip
        placement="top-end"
        content="Page Back">
        <button
          class="btn-icon"
          @click="pageBack()">
          <svg
            class="svg-fill icon"
            width="18"
            height="12"
            viewBox="0 0 12 12"
          >
            <path d="M10.959,0.571 L3.756,5.52 C3.756,5.52 3.477,5.721 3.477,6.001 C3.477,6.281 3.756,6.48 3.756,6.48 L10.959,11.431 C11.531,11.811 12,11.53 12,10.805 L12,1.196 C12,0.469 11.531,0.188 10.959,0.571 Z M2,0 L1,0 C0.447,0 0,0.048 0,0.6 L0,11.4 C0,11.952 0.447,12 1,12 L2,12 C2.553,12 3,11.952 3,11.4 L3,0.6 C3,0.048 2.553,0 2,0 Z"/>
          </svg>
        </button>
      </el-tooltip>
<!--      
      <el-tooltip
        placement="top-end"
        content="Previous Annotation">
        <button
          class="btn-icon"
          @click="previousAnnotation()">
          <svg-icon
            name="next-annotation-left-facing"
            height="12"
            width="18"/>
        </button>
      </el-tooltip> -->
     
     <el-tooltip
        placement="top-end"
        content="Automatic Forward">
        <button
          class="btn-icon"
          @click="togglePlayback()">
          <svg
            v-if="isPlaying"
            class="svg-fill icon"
            width="18"
            height="12"
            viewBox="0 0 10 12"
          >
            <path d="M2,0 C2.553,0 3,0.048 3,0.6 L3,11.4 C3,11.952 2.553,12 2,12 L1,12 C0.447,12 0,11.952 0,11.4 L0,0.6 C0,0.048 0.447,0 1,0 L2,0 Z M9,0 C9.553,0 10,0.048 10,0.6 L10,11.4 C10,11.952 9.553,12 9,12 L8,12 C7.447,12 7,11.952 7,11.4 L7,0.6 C7,0.048 7.447,0 8,0 L9,0 Z"/>
          </svg>
          <svg
            v-else
            class="svg-fill icon"
            width="18"
            height="12"
            viewBox="0 0 10 12"
          >
            <path d='M10,6.001 C10,6.3 9.695,6.515 9.695,6.515 L1.134,11.818 C0.51,12.227 0,11.924 0,11.149 L0,0.852 C0,0.075 0.51,-0.226 1.135,0.182 L9.696,5.487 C9.695,5.487 10,5.702 10,6.001 Z'/>
          </svg>
        </button>
      </el-tooltip>
<!--
     <el-tooltip
        placement="top-end"
        content="Next Annotation">
        <button
          class="btn-icon"
          @click="nextAnnotation()">
          <svg-icon
            name="next-annotation-right-facing"
            height="12"
            width="18"/>
        </button>
     
     </el-tooltip> -->
      
      <el-tooltip
        placement="top-end"
        content="Next Page">
        <button
          class="btn-icon"
          @click="pageForward()">
          <svg
            class="svg-fill icon"
            width="18"
            height="12"
            viewBox="0 0 12 12"
          >
            <path d="M8.244,5.52 L1.041,0.571 C0.469,0.188 0,0.469 0,1.196 L0,10.805 C0,11.53 0.469,11.811 1.041,11.43 L8.244,6.479 C8.244,6.479 8.523,6.28 8.523,6.001 C8.523,5.721 8.244,5.52 8.244,5.52 Z M10,0 L11,0 C11.553,0 12,0.048 12,0.6 L12,11.4 C12,11.952 11.553,12 11,12 L10,12 C9.447,12 9,11.952 9,11.4 L9,0.6 C9,0.048 9.447,0 10,0 Z"/>
          </svg>
        </button>
      </el-tooltip>
    </div>
    <div id="right-controls">
<!--      <el-tooltip-->
<!--        placement="top-end"-->
<!--        content="Montaging Controls">-->
<!--        <el-select v-model="selectedMontage" placeholder="Select" size="mini" @change="updateMontageScheme">-->
<!--          <el-option-->
<!--            v-for="item in montageOptions"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-tooltip>-->

      <el-tooltip
        placement="top-end"
        content="Toggle Play Back Speed Controls">
        <button
          class="btn-icon"
          @click="togglePlaybackSpeed()">
        <svg
          class="svg-fill icon"
          width="22"
          height="20"
          viewBox="0 0 16 16"
        >
          <path d="M5.1008,5.396 C4.7432,5.616 6.0584,8.7896 6.3792,9.3064 C6.6592,9.7616 7.2536,9.9 7.7056,9.6216 C8.16,9.34 8.3016,8.7464 8.0216,8.2936 C7.704,7.7752 5.4576,5.1752 5.1008,5.396 Z M4.8328,1.9216 C5.5752,1.6632 6.3704,1.52 7.2,1.52 C8.0296,1.52 8.8248,1.6632 9.5672,1.9216 C9.8304,2.0128 10.1792,1.8296 10.0248,1.4328 C9.912,1.1448 9.8032,0.8632 9.7592,0.7488 C9.6544,0.4776 9.2792,0.2536 9.116,0.2168 C8.4984,0.0776 7.8584,0 7.2,0 C6.5416,0 5.9016,0.0776 5.2832,0.2168 C5.12,0.2536 4.7456,0.4776 4.6408,0.7488 C4.5968,0.8632 4.4872,1.1448 4.3752,1.4328 C4.2208,1.8296 4.5696,2.0136 4.8328,1.9216 Z M14.4784,2.5488 C14.3248,2.3648 14.1616,2.1848 13.988,2.0112 C13.8152,1.8376 13.6352,1.6752 13.452,1.5208 C13.3296,1.4176 12.9696,1.3336 12.7416,1.5616 C12.5144,1.7896 11.4232,2.8792 11.4232,2.8792 C11.7448,3.1096 12.0576,3.3632 12.3472,3.652 C12.6368,3.9408 12.8888,4.2536 13.12,4.576 C13.12,4.576 14.2104,3.4864 14.4376,3.2584 C14.6664,3.0296 14.5824,2.6704 14.4784,2.5488 Z M7.2,2.32 C3.62,2.32 0.7192,5.2208 0.7192,8.8 C0.7192,12.38 3.62,15.2808 7.2,15.2808 C10.7784,15.2808 13.68,12.38 13.68,8.8 C13.68,5.2216 10.7784,2.32 7.2,2.32 Z M7.2,13.6808 C4.5056,13.6808 2.32,11.496 2.32,8.8008 C2.32,6.1056 4.5048,3.9208 7.2,3.9208 C9.8952,3.9208 12.0808,6.1056 12.0808,8.8008 C12.0808,11.4952 9.8952,13.6808 7.2,13.6808 Z"/>
        </svg>  
        </button>
      </el-tooltip>

      <el-select
        v-model="selectedPlaySpeed"
        v-if="showPlaybackSpeed"
        placeholder="Select"
        size="mini"
        class="playSelect">
        <el-option
          v-for="item in playSpeedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

    </div>

  </div>
</template>

<script>
    export default {
        name: 'TimeseriesViewerToolbar',
        computed: {
          durationInSeconds: {
            // getter
            get: function () {
              return this.duration / 1e6
            },
            // setter
            set: function (newValue) {
              this.$emit('updateDuration', newValue)
            }
          }
        },
        props: {
           constants: Object,
           duration: Number,
           start: Number
        },
        data: function () {
            return {
              showVertZoom: true,
              showTimeZoom: true,
              showPlaybackSpeed: true,
              selectedTimeRange: 0,
              isPlaying: false,
              montageOptions: [{
                value: 'NOT_MONTAGED',
                label: 'Continuous (Default)'
              }, {
                value: 'REFERENTIAL_VS_CZ',
                label: 'Referential Montage'
              }, {
                value: 'BIPOLAR_ANT_POS',
                label: 'Ant/Post Montage'
              }, {
                value: 'BIPOLAR_TRANSVERSE',
                label: 'Transverse Montage'
              }],
              selectedMontage: '',
              playSpeedOptions: [{
                value: 0.5,
                label: '0.5x'
              }, {
                value: 1,
                label: '1x'
              }, {
                value: 2,
                label: '2x'
              }, {
                value: 5,
                label: '5x'
              },
              {
                value: 10,
                label: '10x'
              }],
              selectedPlaySpeed: null,
              intervalTimer: null,
              intervalPeriod: 150,
              intervalPage: 1000000
            }
        },
        mounted: function () {
          this.selectedMontage = 'NOT_MONTAGED'
          this.selectedPlaySpeed = 1
        },
        methods: {
          updateMontageScheme: function (value) {
            console.log('Updating Montage Scheme:' + value)
            this.$store.dispatch('setViewerMontageScheme', value)
          },
          updatePlaybackSpeed: function (value) {
            console.log('Updating Playback Speed:' + value)
          },
          toggleTimeZoom: function () {
            this.showTimeZoom = !this.showTimeZoom
          },
          toggleVerticalZoom: function () {
            this.showVertZoom = !this.showVertZoom
          },
          togglePlaybackSpeed: function () {
            this.showPlaybackSpeed = !this.showPlaybackSpeed
          },
          togglePlayback: function () {
            if(this.isPlaying === false) {
              this.startPlay();
            } else {
              this.stopPlay();
            }
          },
          pageBack: function() {
            this.$emit('pageBack')
          },
          pageForward: function() {
            this.$emit('pageForward')
          },
          incrementZoom: function() {
            this.$emit('incrementZoom')
          },
          decrementZoom: function() {
            this.$emit('decrementZoom')
          },
          updateDuration: function() {
            this.$emit('updateDuration',this.selectedTimeRange)
          },
          nextAnnotation: function () {
            this.$emit('nextAnnotation')
          },
          previousAnnotation: function () {
            this.$emit('previousAnnotation')
          },
          startPlay: function() {
            this.isPlaying = true
            let that = this;
            this.intervalTimerFnc = function() {
              that.$emit('setStart', that.start + (that.intervalPage * that.selectedPlaySpeed))
              that.intervalTimer = setTimeout( that.intervalTimerFnc, that.intervalPeriod);
            }
            this.intervalTimer = setTimeout(this.intervalTimerFnc, this.intervalPeriod);
          },
          stopPlay: function() {
            this.isPlaying = false
            this.intervalPeriod = 150;
            clearInterval(this.intervalTimer);
          }
        }
    }
</script>

<style lang="scss" scoped>
    .timeseries-viewer-toolbar {
        border-top: 1px solid #DADADA;
        background: #F7F7F7;
        display: flex;
        padding: 8px 0;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }
    .icon {
      vertical-align: middle;
      padding-bottom: 1px;
    }
    .btn-icon {
      color: #928D85;
      margin-left: 8px;
      margin-right: 2px;
      &:last-child {
        margin-right:8px;
      }
      &.selected, &:hover, &[focused] {
        color: #5039F7;
      }
      &[disabled] {
        color: #E7E5E1;
      }
    }
    .playSelect {
      width: 70px;
      margin-right: 8px;
    }
</style>
