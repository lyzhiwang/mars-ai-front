<template>
  <u-popup :show="show" @close="close" round="10" mode="center">
    <view class="box">
      <image src="@/static/images/living/down.png" class="down"></image>
      <view class="title">您计划多少分钟后结束直播？</view>
      <view class="content">
        <u--input
          placeholder="输入分钟数"
          border="none"
          clearable
          type="number"
          v-model="localCloseTime"
        ></u--input>
      </view>

      <view class="btns">
        <view class="btn" @click="close">取消</view>
        <view class="btn btn1" @click="save">确定</view>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  closeTime: {
    type: Number,
    default: 0,
  },
})

const localCloseTime = ref(props.closeTime)

watch(
  () => props.closeTime,
  (val) => {
    localCloseTime.value = val
  }
)

const emit = defineEmits(['close', 'save'])

const save = () => {
  if (!localCloseTime.value)
    return uni.showToast({ title: '请输入倒计时时间', icon: 'none' })
  emit('save', localCloseTime)
}
const close = () => {
  emit('close')
}
</script>
<style lang="scss" scoped>
.box {
  width: 550rpx;
  height: 364rpx;
  background: #ffffff;
  border-radius: 20rpx;
  position: relative;
  padding-top: 110rpx;
  .down {
    width: 205rpx;
    height: 272rpx;
    position: absolute;
    top: -162rpx;
    left: 164rpx;
  }
  .title {
    width: 100%;
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 50%;
    margin: 20rpx auto;
    :deep(.u-input) {
      width: 100%;
      height: 76rpx;
      background: #f7f7f7;
      border-radius: 10rpx;
      padding: 0 26rpx !important;
    }
  }
  .btns {
    width: 100%;
    padding: 0 90rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      width: 158rpx;
      height: 63rpx;
      background: #e9eeff;
      border-radius: 15rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      font-weight: 400;
      color: #4f77fc;
    }
    .btn1 {
      background: #2281fe;
      color: #ffffff;
    }
  }
}
</style>
