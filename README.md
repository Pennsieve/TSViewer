# tsviewer

tsviewer is a Vue 3 component library that provides an embeddable viewer component, backed by a Pinia store. This README will guide you through installation, setup, and usage.

## **📦 Installation**

Install the package via npm or yarn:

```bash
npm install tsviewer
# or
yarn add tsviewer
```

## **🚀 Usage**

### **1. Import the Component, Styles and Pinia store module**

In your Vue 3 component or layout setup:

```javascript
import { useViewerStore, tsviewer } from 'tsviewer'
import 'tsviewer/style'
```

### **2. Initialize the Viewer Store**

Before rendering `<tsviewer />`, you must initialize it by calling `fetchAndSetActiveViewer()` from the store. This ensures the viewer has the correct context.

You need to provide the following string parameter:
- **packageId**: The unique identifier for the package to load.

```javascript
const viewerStore = useViewerStore()

await viewerStore.fetchAndSetActiveViewer({
  packageId: packageId.value,
})
```

⚠️ **This is an async function. You must await it before using the component.**

### **3. Use the Component**

Once the store is initialized, you can render the component:

```vue
<template>
  <tsviewer />
</template>
```

## **✅ Full Example (Vue 3 + Composition API)**

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useViewerStore, TSViewer } from 'tsviewer'
import 'tsviewer/style'

const packageId = ref('your-package-id')
const isViewerReady = ref(false)

const viewerStore = useViewerStore()

onMounted(async () => {
  await viewerStore.fetchAndSetActiveViewer({
    packageId: packageId.value,
  })
  isViewerReady.value = true
})
</script>

<template>
  <tsviewer v-if="isViewerReady"/>
</template>
```

## **⚙️ Requirements**

- Vue 3
- Pinia (state management)

## **🛠️ Development & Contributing**

Coming soon.

## **📄 License**

MIT License.

Feel free to open issues or pull requests if you'd like to contribute or report bugs.