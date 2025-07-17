<template>
  <u-popup :show="show" :closeOnClickOverlay="false" @close="close" round="10" mode="center">
    <view class="box">
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播间名称</view>
          <view class="cell-right">
            <u--input placeholder="请输入直播间名称" inputAlign="left" color="#4F77FC" v-model="list.live_title"
              clearable></u--input>
          </view>
        </view>
        <view class="cell" v-if="list.platform === 1">
          <view class="cell-left">直播间账号</view>
          <view class="cell-right">
            <u--input placeholder="快手直接复制链接粘贴即可" inputAlign="left" color="#4F77FC" v-model="list.live_url" clearable
              :formatter="formatter"></u--input>
          </view>
        </view>
        <view class="cell" v-else>
          <view class="cell-left">直播间账号</view>
          <view class="cell-right">
            <u--input placeholder="请输入正确的直播用户抖音ID" inputAlign="left" color="#4F77FC" v-model="list.live_url"
              clearable></u--input>
          </view>
        </view>
      </view>

      <view class="btns">
        <view class="btn" @click="close">取消</view>
        <view class="btn btn1" @click="save">确定</view>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  list: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'save'])

const list = reactive({ ...props.list })

watch(
  () => props.list,
  (val) => {
    Object.assign(list, val)
    console.log('val', val)
  },
  { deep: true }
)

const formatter = (value) => {
  const match = value.match(/v\.kuaishou\.com\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

const save = () => {
  if (!list.live_title) {
    return uni.showToast({ title: '请输入直播间名称', icon: 'none' })
  }
  if (!list.live_url) {
    return uni.showToast({ title: '请输入直播间账号', icon: 'none' })
  }
  emit('save', { ...list })
}

const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.box {
  width: 550rpx;
  min-height: 364rpx;
  background: #ffffff;
  border-radius: 20rpx;
  position: relative;

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
    width: 80%;
    margin: 20rpx auto;

    .cell {
      width: 100%;
      // padding: 0 22rpx 0 35rpx;
      box-sizing: border-box;
      padding-bottom: 20rpx;

      .cell-left {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
        padding-bottom: 20rpx;
      }
    }
  }

  .btns {
    width: 100%;
    padding: 0 90rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

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
