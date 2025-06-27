<template>
  <view class="container-box">
    <image src="/static/images/living/star-bg.png" class="top-bg"></image>

    <view class="c-box">
      <view :style="{ marginTop: `${config.statusBar}px` }"></view>
      <view class="title-box">
        <view class="left-box">
          <u-icon name="arrow-left" size="31" bold color="#212121" @click="confirmBack"></u-icon>
          <view class="title">开播设置</view>
          <view>可修改生成的AI话术，修改后开启开播</view>
        </view>
        <image src="/static/images/living/s-icon.png" class="icon"></image>
      </view>

      <view class="detail-box">
        <view v-for="(item, index) in list" :key="index" style="margin-bottom: 20rpx">
          <u--textarea :height="500" v-model="item.content" maxlength="-1"
            @change="changeText(item, index)"></u--textarea>
        </view>
        <template v-if="count < 5000">
          <image src="/static/images/living/loading.png" class="loading" v-if="isLoading"></image>
          <view class="btn" @click="generate" v-else>继续生成</view>
        </template>
      </view>

      <view class="tips">
        <view class="title" :class="{ red: count > 5000 }">字数：{{ count }}/5000</view>
        建议5000字，如果对生成文案不满意，可点击生成的文案进行修改，或者在其他地方生成文案覆盖到这里即可。
      </view>
    </view>

    <view class="footer-box">
      <view class="btn" @click="star">开启直播</view>
    </view>
  </view>
</template>

<script setup>
import { onBackPress, onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useRealTimeStore } from '@/stores'
import { calculateCharacterCount } from '@/utils/helper'
import {
  sjliveDesc,
  liveResult,
  sjliveDescSubmit,
  sjliveVoiceStatus,
} from '@/api'

onLoad(() => {
  list.value = realTime.liveInfo.detail
  shouldContinuePolling.value = true
})

const count = computed(() => {
  let count = 0
  list.value.map((v, index) => {
    count += v.content.length
    // if (v.content.length === 0) list.value.splice(index, 1)
  })
  return count
})

const config = useConfigStore()
const realTime = useRealTimeStore()
let isNavigatingBack = false
const list = ref([])
const shouldContinuePolling = ref(true)
const isLoading = ref(false)

const changeText = (item, index) => {
  if (item.content.length === 0) list.value.splice(index, 1)
}
// 生成新文案
const generate = () => {
  isLoading.value = true
  sjliveDesc({ live_room_id: realTime.liveInfo.live_room_id }).then((res) => {
    const { conversation_id } = res.data
    if (conversation_id) {
      // 第二步：轮询获取生成文字
      pollLiveResult(conversation_id)
    } else {
      isLoading.value = false
      uni.showToast({ title: 'conversation_id 获取失败', icon: 'none' })
    }
  })
}

// 轮询获取生成结果，直到 detail 存在
const pollLiveResult = (conversation_id, retry = 0, maxRetry = 100) => {
  if (!shouldContinuePolling.value) return;
  if (retry >= maxRetry) {
    isLoading.value = false
    return uni.showToast({ title: '生成超时，请重试', icon: 'none' })
  }

  liveResult({ conversation_id })
    .then((res) => {
      if (res.data) {
        isLoading.value = false
        uni.showToast({ title: '生成成功', icon: 'success' })
        let obj = { conversation_id, content: res.data }
        list.value.push(obj)
      } else {
        setTimeout(
          () => pollLiveResult(conversation_id, retry + 1, maxRetry),
          2000
        )
      }
    })
    .catch((err) => {
      console.error('获取生成文字失败:', err)
      setTimeout(
        () => pollLiveResult(conversation_id, retry + 1, maxRetry),
        2000
      )
    })
}
const star = () => {
  if (count.value === 0)
    return uni.showToast({
      title: '请生成文案后开启直播!',
      icon: 'none',
    })
  if (isLoading.value)
    return uni.showToast({
      title: '检测到有正在生成的文案,请等待生成后开始直播!',
      icon: 'none',
    })
  if (count.value > 5000)
    return uni.showToast({
      title: '字数超出限制,请修改重复文案减少字数.',
      icon: 'none',
    })

  let bytes = getBytes()
  uni.showModal({
    title: '提示',
    content: `即将开始生成语音,此操作将消耗${bytes}个字符,是否继续?`,
    confirmText: '确定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.showLoading({
          title: '生成中...',
          mask: true
        })
        sjliveDescSubmit({
          live_room_id: realTime.liveInfo.live_room_id,
          data: list.value,
        })
          .then((res) => {
            pollliveVoiceStatus()
          })
          .catch((err) => {
            uni.hideLoading()
            console.log(err)
          })
      }
    },
  })

  // uni.navigateTo({
  //   url: '/pagesub/living/live',
  // })
}

// 获取合成语音状态
const pollliveVoiceStatus = (retry = 0, maxRetry = 1000) => {
  if (!shouldContinuePolling.value) return;
  if (retry >= maxRetry) {
    uni.hideLoading()
    return uni.showToast({ title: '生成超时，请重试', icon: 'none' })
  }
  sjliveVoiceStatus({ live_room_id: realTime.liveInfo.live_room_id })
    .then((res) => {
      if (res.data.length) {
        uni.hideLoading()
        uni.showToast({ title: '生成成功', icon: 'success' })
        uni.redirectTo({
          url: '/pagesub/living/live?roomId=' + realTime.liveInfo.live_room_id
        });
      } else {
        setTimeout(() => pollliveVoiceStatus(retry + 1, maxRetry), 2000)
      }
    })
    .catch((err) => {
      console.error('获取生成文字失败:', err)
      setTimeout(() => pollliveVoiceStatus(retry + 1, maxRetry), 2000)
    })
}

//  计算字符数
const getBytes = () => {
  let count = 0
  list.value.map((v) => {
    count += calculateCharacterCount(v.content)
  })
  return count
}

function confirmBack () {
  uni.showModal({
    title: '提示',
    content: '确定要返回上一页吗？未保存的内容将丢失。',
    confirmText: '确定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 用户点击确定 -> 返回上一页
        shouldContinuePolling.value = false
        isNavigatingBack = true
        uni.navigateBack()
      }
      // 用户点击取消 -> 不做处理，留在当前页
    },
  })
}

onBackPress(() => {
  if (isNavigatingBack) return false // 防止递归触发
  confirmBack()
  return true // 必须 return true，表示拦截返回行为
})
</script>
<style lang="scss" scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;

  .top-bg {
    width: 100%;
    height: 567rpx;
  }

  .c-box {
    width: 100%;
    min-height: 500rpx;
    padding: 0 30rpx;
    padding-bottom: 80px;
    /* 预留底部栏高度 + 安全距离 */
    box-sizing: border-box;
    position: absolute;
    top: 0;
    z-index: 1;

    .title-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      padding: 56rpx 14rpx 0 6rpx;
      box-sizing: border-box;

      .title {
        font-size: 38rpx;
        font-weight: bold;
        color: #212121;
        padding: 45rpx 0 20rpx 0;
      }

      .icon {
        width: 192rpx;
        height: 170rpx;
      }
    }

    .detail-box {
      width: 100%;
      min-height: 828rpx;
      background: #ffffff;
      border-radius: 20rpx;
      margin-top: 30rpx;
      padding: 20rpx;
      box-sizing: border-box;

      .loading {
        width: 58rpx;
        height: 59rpx;
        margin-left: 22rpx;
        margin-top: 22rpx;
        animation: spin 0.22s linear infinite;
      }

      :deep(.u-textarea) {
        background: #f9f9f9;
        border: 1rpx solid #f9f9f9 !important;
        border-radius: 20rpx;

        .uni-textarea-textarea {
          font-size: 24rpx;
          font-weight: 400;
          color: #333;
          line-height: 45rpx;
        }
      }

      .btn {
        width: 149rpx;
        height: 48rpx;
        background: #2281fe;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        font-weight: 700;
        color: #ffffff;
        margin-top: 20rpx;
      }
    }

    .tips {
      width: 100%;
      padding: 30rpx 18rpx;
      font-size: 28rpx;
      color: #666666;
      line-height: 49rpx;

      .title {
        color: #2281fe;
      }

      .red {
        color: #ff0000;
      }
    }
  }

  .footer-box {
    width: 100%;
    min-height: 150rpx;
    background: #ffffff;
    border-radius: 30rpx 30rpx 0rpx 0rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #2281fe;
    padding: 0 30rpx;

    .btn {
      width: 100%;
      height: 100rpx;
      background: #2281fe;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      font-weight: 700;
      color: #ffffff;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
