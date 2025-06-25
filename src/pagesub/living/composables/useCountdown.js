import { ref, onUnmounted } from 'vue'

export function useCountdown() {
  const timeText = ref('00:00')
  const timer = ref(null)
  const remainingSeconds = ref(0)

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const startCountdown = (minutes) => {
    if (timer.value) clearInterval(timer.value)

    remainingSeconds.value = minutes * 60
    timeText.value = formatTime(remainingSeconds.value)

    timer.value = setInterval(() => {
      remainingSeconds.value--
      timeText.value = formatTime(remainingSeconds.value)

      if (remainingSeconds.value <= 0) {
        clearInterval(timer.value)
        timer.value = null

        // 倒计时结束后直接跳转
        uni.reLaunch({ url: '/tabber/live/type' })
        uni.showToast({ title: '倒计时结束，已跳转', icon: 'none' })
      }
    }, 1000)
  }

  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  })

  return {
    timeText,
    startCountdown,
  }
}
