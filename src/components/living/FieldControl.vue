<template>
  <u-popup
    :show="show"
    mode="bottom"
    safeAreaInsetBottom
    closeOnClickOverlay
    round="10"
    @close="close"
  >
    <view class="p-box">
      <scroll-view class="scroll-box" scroll-y>
        <view class=""></view>
      </scroll-view>
      <view class="footer-btn">
        <view class="btn">新建场控</view>
        <view class="btn btn1">确定保存</view>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'open'])

const close = () => {
  emit('close')
}
</script>
<style lang="scss" scoped>
.p-box {
  width: 100%;
  height: 1020rpx;
  padding-top: 20rpx;
  .scroll-box {
    width: 100%;
    height: 860rpx;
    border: 1px solid #e5e5e5;
  }
  .footer-btn {
    width: 100%;
    height: 150rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 35rpx;
    box-sizing: border-box;
    .btn {
      width: 310rpx;
      height: 100rpx;
      background: #f6f8fd;
      border: 2rpx solid #2281fe;
      border-radius: 52rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      font-weight: 700;
      color: #2281fe;
    }
    .btn1 {
      background: #2281fe;
      border: 2rpx solid #2281fe;
      color: #ffffff;
    }
  }
}
</style>
