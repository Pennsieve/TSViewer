<template>
    <el-dialog
        @update:modelValue="visible = $event"
        :model-value="visible"
        @close='close'
        class="timeseries-annotation-layer-modal"
        ref="timeseries-filter-modal"
        title="Annotation Layers"
        >

      <template #default>
        <div slot="body">
          <div class="input-section">
            Layer Name:
            <el-input
              placeholder="Add a Layer Name"
              v-model="name"
              ref="input"
            />
          </div>
          <div class="input-section">
            Select Color:
            <el-select v-model="selectedColor" placeholder="Select">
              <!-- <div slot="prefix">
                  <circle-icon class="team-avatar" icon="icon-color" :currentColor="selectedColor"></circle-icon>
              </div> -->
              <el-option
                v-for="item in colorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <div class="color-option">
                  <div :style="{ backgroundColor: item.value, height:'30px', width:'30px', borderRadius:'50%' }"/>
                  <div style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</div>
                </div>

              </el-option>
            </el-select>
          </div>
        </div>
      </template>


      <template #footer>
        <div slot="footer">
          <div class="button-wrapper">
            <div class="buttons">
              <bf-button
                @click="handleFormCancel"
              >Cancel
              </bf-button>
              <bf-button
                @click="handleFormSubmit"
              >Save
              </bf-button>
            </div>
          </div>

        </div>
      </template>


    </el-dialog>

</template>

<script>

    import CircleIcon from "../icons/CircleIcon/CircleIcon.vue";
    import BfButton from "../shared/bf-button/BfButton.vue";

    export default {
        name: 'AnnotationLayerWindow',

        components:{
          CircleIcon,
          BfButton
        },
        props: {
            visible: {
              type: Boolean,
              default: false
            },
        },
        data: function () {
            return {
                name: "",
                selectedColor: "",
                colorOptions: [
                    {
                        label: 'Green',
                        value: '#18BA62',
                        iconBgColor: '#18BA62'
                    },
                    {
                        label: 'Gold',
                        value: '#FFBC27',
                        iconBgColor: '#FFBC27'
                    },
                    {
                        label: 'Red',
                        value: '#E94B4B',
                        iconBgColor: '#E94B4B'
                    },
                    {
                        label: 'Light Blue',
                        value: '#2760FF',
                        iconBgColor: '#2760FF'
                    },
                    {
                        label: 'Magenta',
                        value: '#FF4FFF',
                        iconBgColor: '#FF4FFF'
                    },
                    {
                        label: 'Cyan',
                        value: '#50FFFF',
                        iconBgColor: '#50FFFF'
                    },
                    {
                        label: 'Yellow',
                        value: '#FFFF4E',
                        iconBgColor: '#FFFF4E'
                    },
                    {
                        label: 'Purple',
                        value: '#512BAF',
                        iconBgColor: '#512BAF'
                    },
                    {
                        label: 'Lavendar',
                        value: '#8A6ECF',
                        iconBgColor: '#8A6ECF'
                    },
                    {
                        label: 'Teal',
                        value: '#389BAD',
                        iconBgColor: '#389BAD'
                    },
                    {
                        label: 'Dark Green',
                        value: '#187D46',
                        iconBgColor: '#187D46'
                    },
                    {
                        label: 'Brick Red',
                        value: '#B12800',
                        iconBgColor: '#B12800'
                    },
                    {
                        label: 'Dark Blue',
                        value: '#0C2475',
                        iconBgColor: '#0C2475'
                    },
                    {
                        label: 'Bright Orange',
                        value: '#FF5321',
                        iconBgColor: '#FF5321'
                    },
                    {
                        label: 'Pink',
                        value: '#FF99CC',
                        iconBgColor: '#FF99CC'
                    },
                    {
                        label: 'Tan',
                        value: '#DCC180',
                        iconBgColor: '#DCC180'
                    },
                    {
                        label: 'Medium Blue',
                        value: '#0D4EFF',
                        iconBgColor: '#0D4EFF'
                    },
                    {
                        label: 'Orange',
                        value: '#FF6C21',
                        iconBgColor: '#FF6C21'
                    },
                    {
                        label: 'Black',
                        value: '#000000',
                        iconBgColor: '#000000'
                    },
                    {
                        label: 'Gray',
                        value: '#9B9B9B',
                        iconBgColor: '#9B9B9B'
                    },
                    {
                        label: 'Lime',
                        value: '#00FF00',
                        iconBgColor: '#00FF00'
                    },
                    {
                        label: 'Salmon',
                        value: '#FA8072',
                        iconBgColor: '#FA8072'
                    },
                    {
                        label: 'Olive',
                        value: '#808000',
                        iconBgColor: '#808000'
                    },
                    {
                        label: 'Sienna',
                        value: '#A0522D',
                        iconBgColor: '#A0522D'
                    }
                ]
            }
        },

        methods: {
            close: function() {
                this.$emit('close-window')
            },
            handleFormSubmit: function () {
                this.$emit('createLayer', {name:this.name, color:this.selectedColor})
            },
            handleFormCancel: function () {
                this.close();
            },

        }
    }

</script>

<style lang="scss" scoped>
@import '../../assets/tsviewerVariables.scss';

    .color-option {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .timeseries-annotation-modal {
        display: block;
        box-sizing: border-box;
    }

    .input-section {
        margin-bottom: 8px;
        display:flex;
        flex-direction:column
    }

    .filterInput {
        width:100%
    }
    .select-wrapper {
        display: flex;
        flex-direction: column;
        border-left: 5px solid var(--dopamine)
    }
    #layerSelect {
        margin: 0 0 10px;
        width: auto;
    }
    .channels-icon {
        border: 1px solid var(--light-gray);
        border-radius: 2px;
        color: var(--light-gray);
        margin-right: 5px;
    }
    .button-wrapper {
        display: flex;
        flex-direction: row;
    }
    .channelsSelected {
        display: flex;
        flex-direction:row;
        margin-right: 20px;
    }
    h2 {
        margin: 20px 30px 30px 30px;
    }

</style>