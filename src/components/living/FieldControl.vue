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
        <view class="list">
          <view class="item" v-for="(item, index) in list" :key="index">
            <view class="item-title">
              <view>{{ item.name }}</view>
              <image
                src="@/static/images/living/del.png"
                class="del"
                v-if="index > 2"
                @click="delItem(index)"
              ></image>
            </view>
            <view class="item-content">
              {{ item.detail }}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="footer-btn">
        <view class="btn" @click="is_show = true">新建场控</view>
        <view class="btn btn1" @click="save">确定保存</view>
      </view>
    </view>
  </u-popup>

  <u-popup
    :show="is_show"
    @close="is_show = false"
    round="10"
    zIndex="10076"
    mode="center"
  >
    <view class="popup-content">
      <u--input
        placeholder="请输入场控标题"
        border="none"
        maxlength="15"
        clearable
        placeholderStyle="placeholderStyle"
        v-model="form.name"
      ></u--input>
      <u--textarea
        v-model="form.detail"
        height="210"
        placeholder="请输入场控话术"
        count
      ></u--textarea>
      <u--input
        placeholder="请输入催单频率（时间/秒）"
        border="none"
        clearable
        placeholderStyle="placeholderStyle"
        v-model="form.interval_time"
      ></u--input>
      <view class="btns">
        <view class="btn" @click="closeAdd">取消</view>
        <view class="btn btn1" @click="pushItem">确认</view>
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
  list: {
    type: Array,
    default: [],
  },
})

const is_show = ref(false)

const list = ref(props.list)

watch(
  () => props.list,
  (val) => {
    list.value = val
  }
)

const form = ref({
  name: '',
  detail: '',
  interval_time: '',
})
const emit = defineEmits(['close', 'save'])

const close = () => {
  emit('close', list.value)
}

const closeAdd = () => {
  is_show.value = false
  form.value = { key: '', value: '', time: '' }
}
const pushItem = () => {
  if (form.value.key === '' || form.value.value === '') {
    uni.showToast({ title: '请填写完整', icon: 'none' })
    return
  }
  if (form.value.time === '') {
    form.value.time = '0'
  }
  list.value.push(form.value)
  form.value = { key: '', value: '', time: '' }
  is_show.value = false
}
const delItem = (index) => {
  list.value.splice(index, 1)
  uni.showToast({ title: '删除成功!', icon: 'none' })
}

const save = () => {
  emit('save', list.value)
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
    .list {
      width: 100%;
      padding: 0 30rpx;
      box-sizing: border-box;
      .item {
        width: 100%;
        min-height: 182rpx;
        background: #f6f8fd;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        .item-title {
          width: 100%;
          height: 90rpx;
          background: #e9eeff;
          padding: 0 30rpx;
          display: flex;
          align-items: center;
          font-size: 30rpx;
          font-weight: 700;
          color: #2281fe;
          border-radius: 20rpx 20rpx 0rpx 0rpx;
          justify-content: space-between;
          .del {
            width: 50rpx;
            height: 50rpx;
          }
        }
        .item-content {
          width: 100%;
          padding: 27rpx;
          box-sizing: border-box;
          font-size: 26rpx;
          font-weight: 400;
          color: #333333;
        }
      }
    }
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

.popup-content {
  width: 550rpx;
  height: 608rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  :deep(.u-input) {
    width: 100%;
    height: 76rpx;
    background: #f7f7f7;
    border-radius: 10rpx;
    padding: 0 26rpx !important;
  }
  :deep(.u-textarea) {
    width: 100%;
    background: #f7f7f7;
    border-radius: 10rpx;
    border-color: #f7f7f7 !important;
    margin: 20rpx 0;
  }
  .btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
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
      margin-left: 45rpx;
    }
  }
}
</style>
