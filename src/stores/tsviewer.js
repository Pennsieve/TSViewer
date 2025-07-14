// @/stores/tsviewer.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as site from "@/site-config/site.json";
import { propEq, findIndex } from 'ramda'
import { useToken } from '@/composables/useToken'

export const useViewerStore = defineStore('tsviewer', () => {

    const config = site
    const viewerChannels = ref([])
    const viewerMontageScheme = ref('NOT_MONTAGED')
    const customMontageMap = ref({})
    const workspaceMontages = ref([])
    const viewerErrors = ref(null)
    const needsRerender = ref(null)
    const activeViewer = ref({})

    // Annotation-related state
    const viewerAnnotations = ref([])
    const activeAnnotationLayer = ref({})
    const activeAnnotation = ref({})
    const viewerActiveTool = ref('POINTER')

    // Getters (from original Vuex getters)
    const getMontageMessageByName = computed(() => {
        return (name) => {
            return workspaceMontages.value.find(montage => montage.name === name)
        }
    })

    const viewerSelectedChannels = computed(() => {
        return viewerChannels.value.filter(channel => channel.selected)
    })

    const getViewerActiveLayer = computed(() => {
        return () => {
            const activeLayer = viewerAnnotations.value.find(annotation => annotation.selected)
            if (!activeLayer) {
                console.warn('No active layer found, available layers:', viewerAnnotations.value)
                // Return the first layer if no layer is selected
                return viewerAnnotations.value.length > 0 ? viewerAnnotations.value[0] : null
            }
            return activeLayer
        }
    })

    const validateAnnotationLayers = () => {
        let hasErrors = false

        viewerAnnotations.value.forEach((layer, index) => {
            if (!layer.id && layer.id !== 0) {
                console.error(`Layer at index ${index} missing ID:`, layer)
                hasErrors = true
            }

            if (!layer.annotations) {
                console.warn(`Layer at index ${index} missing annotations array:`, layer)
                layer.annotations = []
            }
        })

        if (hasErrors) {
            console.error('Annotation layer validation failed. Layers:', viewerAnnotations.value)
        }

        return !hasErrors
    }

    const getAnnotationById = computed(() => {
        return (id) => {
            const allAnnotations = viewerAnnotations.value.flatMap(layer => layer.annotations || [])
            return allAnnotations.find(annotation => annotation.id === id)
        }
    })

    // Actions
    const setActiveViewer = (viewer) => {
      activeViewer.value = viewer;
    }

    const setChannels = (channels) => {
        viewerChannels.value = channels
    }

    const setViewerMontageScheme = (scheme) => {
        viewerMontageScheme.value = scheme
    }

    const setCustomMontageMap = (map) => {
        customMontageMap.value = map
    }

    const setWorkspaceMontages = (montages) => {
        workspaceMontages.value = montages
    }

    const setViewerErrors = (errors) => {
        viewerErrors.value = errors
    }


    const setNeedsRerender = (renderData) => {
        needsRerender.value = renderData
    }

    const fetchAndSetActiveViewer = async (data) => {
      const id = data.packageId;
      const token = await useToken();
      const url = `https://api.pennsieve.net/packages/${id}?api_key=${token}`;
      const response = await useSendXhr(url);
      
      if (isTSFileProcessed(response)) {
        setActiveViewer(response);
        return Promise.resolve(response);
      } else {
        throw new Error('Timeseries viewer is not available, since the file is not processed');
      }
    }

    const isTSFileProcessed = () => {
      return (record) => {
        const fileState = record?.content?.state;
        return fileState === "READY";
      }
    }

    // Add annotation-related actions
    const setAnnotations = (annotations) => {
        // FIX: Validate annotation structure before setting
        const validatedAnnotations = annotations.map(annotation => {
            // Ensure each annotation has required properties
            if (!annotation.id && annotation.id !== 0) {
                console.warn('Annotation layer missing ID:', annotation)
                // Generate a temporary ID if missing
                annotation.id = Math.random().toString(36).substr(2, 9)
            }

            // Ensure annotations array exists
            if (!annotation.annotations) {
                annotation.annotations = []
            }

            // Ensure other required properties exist
            if (!annotation.name) {
                annotation.name = `Layer ${annotation.id}`
            }

            return annotation
        })

        viewerAnnotations.value = validatedAnnotations
        console.log('Set annotations with validated structure:', validatedAnnotations)
    }

    const setActiveAnnotationLayer = (layerId) => {
        if (!layerId && layerId !== 0) {
            console.error('setActiveAnnotationLayer called with invalid layerId:', layerId)
            return
        }

        activeAnnotationLayer.value = layerId

        // Clear all selected flags first
        viewerAnnotations.value.forEach(annotation => annotation.selected = false)

        // Find and select the target layer
        const layerIndex = findIndex(propEq('id', layerId), viewerAnnotations.value)
        if (layerIndex >= 0) {
            viewerAnnotations.value[layerIndex].selected = true
            console.log('Successfully set active layer:', viewerAnnotations.value[layerIndex])
        } else {
            console.error('Layer with ID not found:', layerId, 'Available layers:', viewerAnnotations.value)
        }
    }

    const setActiveAnnotation = (annotation) => {
        // Clear all selected annotations
        viewerAnnotations.value.forEach(layer =>
            layer.annotations?.forEach(ann => ann.selected = false)
        )

        // Set the new active annotation as selected if it has an ID
        if (annotation.id) {
            const layerIndex = findIndex(propEq('id', annotation.layer_id), viewerAnnotations.value)
            if (layerIndex >= 0) {
                const annotationIndex = findIndex(propEq('id', annotation.id), viewerAnnotations.value[layerIndex].annotations)
                if (annotationIndex >= 0) {
                    viewerAnnotations.value[layerIndex].annotations[annotationIndex].selected = true
                }
            }
        }

        activeAnnotation.value = annotation
    }

    const setActiveTool = (tool) => {
        viewerActiveTool.value = tool
    }

    const createLayer = (layer) => {
        // FIX: Validate layer structure before creating
        if (!layer.id && layer.id !== 0) {
            console.error('Cannot create layer without ID:', layer)
            return
        }

        // Ensure the layer has required properties
        const validatedLayer = {
            id: layer.id,
            name: layer.name || `Layer ${layer.id}`,
            description: layer.description || '',
            visible: layer.visible !== undefined ? layer.visible : true,
            selected: layer.selected || false,
            annotations: layer.annotations || [],
            color: layer.color,
            hexColor: layer.hexColor,
            bkColor: layer.bkColor,
            selColor: layer.selColor,
            userId: layer.userId,
            ...layer // Spread any additional properties
        }

        viewerAnnotations.value.push(validatedLayer)
        console.log('Created layer with validated structure:', validatedLayer)
    }


    const updateLayer = (layerData) => {
        const index = findIndex(propEq('id', layerData.id), viewerAnnotations.value)
        if (index >= 0) {
            const updatedLayer = Object.assign(viewerAnnotations.value[index], layerData)
            viewerAnnotations.value[index] = updatedLayer
        }
    }

    const deleteLayer = (layerData) => {
        const index = findIndex(propEq('id', layerData.id), viewerAnnotations.value)
        if (index >= 0) {
            viewerAnnotations.value.splice(index, 1)
        }
    }

    const createAnnotation = (annotation) => {
        const layerIndex = findIndex(propEq('id', annotation.layer_id), viewerAnnotations.value)
        if (layerIndex >= 0) {
            if (!viewerAnnotations.value[layerIndex].annotations) {
                viewerAnnotations.value[layerIndex].annotations = []
            }
            viewerAnnotations.value[layerIndex].annotations.push(annotation)
            setActiveAnnotation(annotation)
        }
    }

    const updateAnnotation = (annotation) => {
        const layerIndex = findIndex(propEq('id', annotation.layer_id), viewerAnnotations.value)
        if (layerIndex >= 0) {
            const annotations = viewerAnnotations.value[layerIndex].annotations
            const annotationIndex = findIndex(propEq('id', annotation.id), annotations)
            if (annotationIndex >= 0) {
                annotations[annotationIndex] = annotation
            }
        }
    }

    const deleteAnnotation = (annotation) => {
        const layerIndex = findIndex(propEq('id', annotation.layer_id), viewerAnnotations.value)
        if (layerIndex >= 0) {
            const annotations = viewerAnnotations.value[layerIndex].annotations
            const annotationIndex = findIndex(propEq('id', annotation.id), annotations)
            if (annotationIndex >= 0) {
                annotations.splice(annotationIndex, 1)
            }
        }
    }

    const updateChannelProperty = (channelId, property, value) => {
        const channel = viewerChannels.value.find(ch => ch.id === channelId)
        if (channel) {
            channel[property] = value
        }

    }

    const updateChannelVisibility = (channelId, visible) => {
        updateChannelProperty(channelId, 'visible', visible)
    }

    const updateChannelSelection = (channelId, selected) => {
        updateChannelProperty(channelId, 'selected', selected)
    }

    const updateChannelFilter = (channelId, filter) => {
        updateChannelProperty(channelId, 'filter', filter)
    }

    // Reset all state
    const resetViewer = () => {
        viewerChannels.value = []
        viewerMontageScheme.value = 'NOT_MONTAGED'
        customMontageMap.value = {}
        workspaceMontages.value = []
        viewerErrors.value = null
        viewerAnnotations.value = []
        activeAnnotationLayer.value = {}
        activeAnnotation.value = {}
        viewerActiveTool.value = 'POINTER'
        activeViewer.value = {}
    }

    const triggerRerender = (cause) => {
        setNeedsRerender({
            timestamp: Date.now(),
            cause: cause
        })
    }

    const resetRerenderTrigger = () => {
        needsRerender.value = null
    }

    return {
        // State
        viewerChannels,
        viewerMontageScheme,
        customMontageMap,
        workspaceMontages,
        viewerErrors,
        needsRerender,
        viewerAnnotations,
        activeAnnotationLayer,
        activeAnnotation,
        activeViewer,
        viewerActiveTool,
        config,

        // Getters
        getMontageMessageByName,
        viewerSelectedChannels,
        getViewerActiveLayer,
        getAnnotationById,

        // Actions
        setChannels,
        setViewerMontageScheme,
        setCustomMontageMap,
        setWorkspaceMontages,
        setViewerErrors,
        setAnnotations,
        setActiveAnnotationLayer,
        setActiveAnnotation,
        setActiveTool,
        createLayer,
        updateLayer,
        deleteLayer,
        createAnnotation,
        updateAnnotation,
        deleteAnnotation,
        updateChannelProperty,
        updateChannelVisibility,
        updateChannelSelection,
        updateChannelFilter,
        validateAnnotationLayers,
        resetViewer,
        triggerRerender,
        resetRerenderTrigger,
        isTSFileProcessed,
        fetchAndSetActiveViewer,
        setActiveViewer
    }
})