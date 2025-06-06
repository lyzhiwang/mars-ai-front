
let socketOpen = false
let socketMsgQueue = []
let socket = null

const wsUrl = 'ws://182.92.96.39:4205'

/**
 * 初始化 WebSocket 连接
 */
function initSocket(onMessageCallback) {
  if (socketOpen) return

  uni.connectSocket({
    url: wsUrl,
    success() {
      console.log('[WebSocket] 请求连接成功')
    },
    fail(err) {
      console.error('[WebSocket] 请求连接失败', err)
    }
  })

  uni.onSocketOpen(() => {
    console.log('[WebSocket] 已连接')
    socketOpen = true

    // 有排队的消息先发出去
    while (socketMsgQueue.length > 0) {
      sendMessage(socketMsgQueue.shift())
    }
  })

  uni.onSocketMessage((res) => {
    console.log('[WebSocket] 收到消息：', res.data)
    onMessageCallback && onMessageCallback(JSON.parse(res.data))
  })

  uni.onSocketClose(() => {
    console.warn('[WebSocket] 已关闭')
    socketOpen = false
  })

  uni.onSocketError((err) => {
    console.error('[WebSocket] 错误', err)
  })
}

/**
 * 发送 WebSocket 消息
 */
function sendMessage(messageObj) {
  const data = JSON.stringify(messageObj)

  if (socketOpen) {
    uni.sendSocketMessage({
      data,
      success() {
        console.log('[WebSocket] 消息发送成功', data)
      },
      fail(err) {
        console.error('[WebSocket] 消息发送失败', err)
      }
    })
  } else {
    console.log('[WebSocket] 尚未连接，将消息加入队列')
    socketMsgQueue.push(messageObj)
  }
}

/**
 * 关闭 WebSocket
 */
function closeSocket() {
  if (socketOpen) {
    uni.closeSocket()
    socketOpen = false
  }
}

export default {
  initSocket,
  sendMessage,
  closeSocket
}
