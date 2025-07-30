export const useChannelDataRequest = () => {

  const openConnection = async (timeseriesDiscoverApi, packageId, userToken) => {

    const myConnectionPromise = new Promise((resolve, reject) => {
      const url = timeseriesDiscoverApi + '?session=' + userToken + '&package=' + packageId
      console.log('Opening WebSocket connection to:', url)
      let response = null

      const ws = new WebSocket(url)
  
      ws.onopen = () => {
        console.log('🔗 WebSocket opened for package:', packageId)
        const payload = { montage: 'NOT_MONTAGED', packageId: packageId }
        console.log('🎛️ Sending message payload')
        ws.send(JSON.stringify(payload))
      }
  
      ws.onclose = () => {
        console.log('🔌 WebSocket closed for package:', packageId)
        if (response && response.channelDetails) {
          resolve({res: response.channelDetails, status: 'websocket closed'})
        } else {
          console.warn('No channel details received')
          resolve({res: null, status: 'websocket closed without data'})
        }
      }
  
      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data)
        response = JSON.parse(event.data)
        ws.close()
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        reject(error)
      }
    })



    const resolvedData = await myConnectionPromise

    return resolvedData
  }


  return {
    openConnection
  }
}