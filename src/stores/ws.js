import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWsStore = defineStore('ws', () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const reconnectTimer = ref(null)
  const isManuallyClosed = ref(false)
  const options = ref({}) // 传递进来的参数,判断ws的地址跟发送的不同逻辑
  const connect = (value) => {
    close()
    options.value = value
    if (socket.value) {
      socket.value.close()
    }

    isManuallyClosed.value = false
    const ws_address = value.ws_url
    socket.value = uni.connectSocket({
      url: ws_address,
      success: () => console.log('[WS] 尝试连接中...'),
      fail: (err) => console.error('[WS] 连接失败', err),
    })

    socket.value.onOpen(() => {
      console.log('[WS] ✅ 已连接')
      isConnected.value = true
      if (options.value.platform === 2) return // 视频号直接return
      // 示例：连接成功后立即发送初始化消息
      let payload = {}
      if (options.value.platform === 1) {
        // 快手
        payload = {
          Action: 'AddWebcast',
          Data: JSON.stringify({
            ShareCode: options.value.live_url,
          }),
        }
      } else if (options.value.platform === 3) {
        // 小红书
        payload = {
          Action: 'AddWebcast',
          Data: JSON.stringify({
            IsNew: true,
          }),
        }
      } else if (options.value.platform === 4) {
        // 抖音
        payload = {
          live_url: `https://live.douyin.com/${options.value.live_url}`,
        }
      }
      send(payload)
    })

    socket.value.onMessage((res) => {
      // console.log('[WS] 📩 收到消息:', res.data)
      uni.$emit('ws-message', res.data) // 全局事件分发
    })

    socket.value.onClose(() => {
      isConnected.value = false
      if (!isManuallyClosed.value) {
        reconnect()
      }
    })

    socket.value.onError((err) => {
      console.error('[WS] 错误:', err)
      isConnected.value = false
      if (!isManuallyClosed.value) {
        reconnect()
      }
    })
  }

  const reconnect = () => {
    if (reconnectTimer.value) return
    reconnectTimer.value = setTimeout(() => {
      console.log('[WS] 🔄 正在重连...')
      connect(options.value)
      reconnectTimer.value = null
    }, 3000)
  }

  const send = (msg) => {
    if (isConnected.value && socket.value) {
      socket.value.send({ data: JSON.stringify(msg) })
    } else {
      console.warn('[WS] ❌ 未连接，无法发送')
    }
  }

  const close = () => {
    isManuallyClosed.value = true
    if (socket.value) {
      socket.value.close()
      socket.value = null
      isConnected.value = false
    }
    console.warn('[WS] 关闭连接')
  }

  return {
    socket,
    isConnected,
    connect,
    send,
    close,
  }
})
