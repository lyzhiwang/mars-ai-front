<template>
  <u-popup :show="show" @close="close" :closeOnClickOverlay="false" round="10" mode="center">
    <view class="box">
      <view class="u-flex u-flex-center">
        <image src="/static/images/living/plane.gif" class="plane"></image>
      </view>

      <u-line-progress :percentage="current_progress" activeColor="#2281fe" height="30"></u-line-progress>

      <view class="tips u-flex u-flex-center">{{ text }}</view>

      <view class="ps u-flex u-flex-center">
        注意: 创建过程中请不要返回或者关闭页面,否则将导致失败,此过程需保持网络畅通,请耐心等待!
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '正在创建智能体,请耐心等待...',
  },
  currentProgress: {
    type: Number,
    default: 0,
  },
  intervalSpeed: {
    type: Number,
    default: 100, // 动画间隔（ms）
  }
})

const emit = defineEmits(['close'])

const current_progress = ref(0)
const targetProgress = ref(0)
let timer = null

// 动画函数
function animateProgressTo (target) {
  if (target <= current_progress.value) return

  targetProgress.value = target

  if (timer) {
    clearInterval(timer)
    timer = null
  }

  timer = setInterval(() => {
    current_progress.value += 1
    if (current_progress.value >= targetProgress.value) {
      clearInterval(timer)
      timer = null
    }
  }, props.intervalSpeed)
}

// 监听外部进度变化
watch(() => props.currentProgress, (newVal) => {
  if (newVal > current_progress.value) {
    animateProgressTo(newVal)
  }
})

// 监听动画间隔变化（自动重启动画）
watch(() => props.intervalSpeed, () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    animateProgressTo(targetProgress.value)
  }
})

// 弹窗关闭时重置状态
watch(() => props.show, (val) => {
  if (!val) {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    current_progress.value = 0
    targetProgress.value = 0
  }
})

// 清理定时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const close = () => {
  emit('close')
}
</script>

<style lang='scss' scoped>
.box {
  width: 550rpx;
  height: 430rpx;
  background: #ffffff;
  padding: 0 50rpx 50rpx 50rpx;
  box-sizing: border-box;
  border-radius: 20rpx;

  .plane {
    width: 264rpx;
    height: 200rpx;
  }

  .tips {
    margin-top: 20rpx;
    font-size: 25rpx;
    color: #333333;
    font-weight: bold;
  }

  .ps {
    margin-top: 22rpx;
    font-size: 20rpx;
    color: #666;
  }
}
</style>
