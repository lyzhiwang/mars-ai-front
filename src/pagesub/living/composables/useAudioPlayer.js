import { ref } from 'vue'

export function useAudioPlayer(options = { shuffle: false }) {
  const audioList = ref([])
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  let audioContext = null
  const shuffle = options.shuffle
  let originalVolume = 1 // 默认音量

  let playOrder = []

  // 随机打乱数组
  const shuffleArray = (arr) => {
    const shuffled = arr.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // 初始化音频上下文
  const initAudioContext = () => {
    if (audioContext) audioContext.destroy()
    audioContext = uni.createInnerAudioContext()
    audioContext.volume = originalVolume
    audioContext.autoplay = true

    audioContext.onEnded(() => {
      playNext()
    })

    audioContext.onPlay(() => {
      isPlaying.value = true
    })

    audioContext.onPause(() => {
      isPlaying.value = false
    })

    audioContext.onStop(() => {
      isPlaying.value = false
    })

    audioContext.onError((err) => {
      console.error('[Audio] 播放出错:', err)
      playNext()
    })
  }

  // 播放指定索引
  const playAudioAtIndex = (index) => {
    if (!playOrder.length) return
    const fixedIndex = index % playOrder.length
    currentIndex.value = fixedIndex

    const src = playOrder[fixedIndex]
    if (!audioContext) initAudioContext()

    audioContext.src = src
    audioContext.play()
    console.log(`[Audio] ▶️ 播放第 ${fixedIndex + 1} 条`)
  }

  // 播放下一条
  const playNext = () => {
    const next = (currentIndex.value + 1) % playOrder.length
    playAudioAtIndex(next)
  }

  // 播放上一条
  const playPrev = () => {
    const prev = (currentIndex.value - 1 + playOrder.length) % playOrder.length
    playAudioAtIndex(prev)
  }

  // 暂停
  const pause = () => {
    if (audioContext && isPlaying.value) audioContext.pause()
  }

  // 继续
  const resume = () => {
    if (audioContext && !isPlaying.value) audioContext.play()
  }

  // 停止
  const stop = () => {
    if (audioContext) {
      audioContext.stop()
      audioContext.destroy()
      audioContext = null
      isPlaying.value = false
    }
  }

  // 开始播放
  const startLoopPlay = (list) => {
    if (!Array.isArray(list) || list.length === 0) return

    audioList.value = list
    playOrder = shuffle ? shuffleArray(list) : list.slice()
    currentIndex.value = 0
    playAudioAtIndex(0)
  }

  // 降低音量
  const lowerVolume = () => {
    if (audioContext) {
      originalVolume = audioContext.volume // 记住原始音量
      audioContext.volume = 0.2
      console.log('[Audio] 🔉 音量已降低至 20%')
    }
  }

  // 恢复音量
  const restoreVolume = () => {
    if (audioContext) {
      audioContext.volume = originalVolume || 1
      console.log('[Audio] 🔊 音量已恢复至 100%')
    }
  }

  return {
    // 状态
    audioList,
    currentIndex,
    isPlaying,

    // 控制
    startLoopPlay,
    playAudioAtIndex,
    playNext,
    playPrev,
    pause,
    resume,
    stop,
    lowerVolume,
    restoreVolume,
  }
}
