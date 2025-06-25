let audioContext = null
let isPlaying = false
let queue = []
const playedUrls = new Set()
let isDestroyed = false

// 外部监听器
let onPlayStartCallback = null
let onPlayEndCallback = null
let onAllEndedCallback = null

/**
 * 设置开始播放事件通知
 * @param {Function} callback
 */
export function onPlayStart(callback) {
  onPlayStartCallback = callback
}

/**
 * 设置播放完成事件通知
 * @param {Function} callback
 */
export function onPlayEnd(callback) {
  onPlayEndCallback = callback
}

/**
 * 添加队列全部播放完成事件通知
 * @param {Function} callback
 */
export function onAllEnded(callback) {
  onAllEndedCallback = callback
}

/**
 * 添加语音 URL 到播放队列
 * @param {string} url
 */
export function addToAudioQueue(url) {
  if (isDestroyed) {
    console.warn('[Audio] 已销毁，不接受新的播放请求')
    return
  }
  if (!url || playedUrls.has(url)) return

  queue.push(url)
  tryPlayNext()
}

/**
 * 尝试播放下一条未播放音频
 */
function tryPlayNext() {
  if (isPlaying) return

  const nextUrl = queue.find((url) => !playedUrls.has(url))

  if (!nextUrl) {
    console.log('[Audio] ✅ 全部播放完成，清空队列等待新语音')
    queue = []
    playedUrls.clear()
    if (onAllEndedCallback) onAllEndedCallback()
    return
  }

  isPlaying = true
  playAudio(nextUrl, () => {
    playedUrls.add(nextUrl)
    isPlaying = false
    if (onPlayEndCallback) onPlayEndCallback(nextUrl)
    setTimeout(tryPlayNext, 100)
  })
}

/**
 * 播放单条音频
 * @param {string} url
 * @param {Function} onEnded
 */
function playAudio(url, onEnded) {
  if (audioContext) {
    audioContext.destroy()
    audioContext = null
  }

  audioContext = uni.createInnerAudioContext()
  audioContext.src = url
  audioContext.autoplay = true

  audioContext.onPlay(() => {
    onPlayStartCallback?.(url)
  })

  audioContext.onEnded(() => {
    audioContext.destroy()
    audioContext = null
    onEnded?.()
  })

  audioContext.onError((err) => {
    console.error('[Audio] ❌ 播放错误:', err)
    audioContext.destroy()
    audioContext = null
    onEnded?.()
  })
}

/**
 * 停止播放并清空队列
 */
export function stopAll() {
  console.log('[Audio] 🛑 手动停止播放，清理队列')
  if (audioContext) {
    audioContext.stop()
    audioContext.destroy()
    audioContext = null
  }
  isPlaying = false
  queue = []
  playedUrls.clear()
  isDestroyed = true // ❗️标记播放器已销毁
}

export function resetAudio() {
  isDestroyed = false
}
