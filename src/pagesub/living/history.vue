<template>
  <view class='container-box'>
    <template v-if="list.length">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="left-box">
          <image :src="`/static/images/living/${icon[item.platform - 1]}-icon.png`" class="icon"></image>
          <view>
            <view class="title u-line-1">{{ item.live_title }}</view>
            <view>{{ item.created_at }}</view>
          </view>
        </view>
        <view class="btn-box">
          <view class="btn" v-if="[1, 4].includes(item.platform)" @click="edit(item)">编辑</view>
          <view class="btn btn1" @click="toLive(item)">重新开播</view>
        </view>
      </view>
      <u-loadmore :status="status" fontSize="28" loadmoreText="点击加载更多" style="padding-bottom: 20rpx;"
        @loadmore="loadmore" />
    </template>

    <u-empty v-else mode="data" text="暂无记录!" :marginTop="160" iconSize="160" textSize="28"
      style="width: 100%;"></u-empty>

    <edit-living :show="showEdit" :list="row" @close="close" @save="updataLiving"></edit-living>
  </view>
</template>

<script setup>
import { onShow, onReachBottom } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { sjLiveList, sjStoreUpdate } from '@/api/index'
import EditLiving from '@/components/living/EditLiving.vue'

onShow(() => {
  list.value = []
  params.value.page = 1
  getList()
})

const list = ref([])
const total = ref(0)
const status = ref('loadmore')
const icon = ref(['ks', 'sph', 'xhs', 'dy', 'pdd', 'zfb', 'mt', 'jd', 'tb'])
const params = ref({
  page: 1,
  size: 10
})
const showEdit = ref(false)

const getList = () => {
  status.value = 'loading'
  sjLiveList(params.value).then((res) => {
    list.value = list.value.concat(res.data.list)
    total.value = res.data.total
    if (list.value.length >= res.data.total) status.value = 'nomore'
    else status.value = 'loadmore'
  })
}
const loadmore = () => {
  if (list.value.length < total.value) {
    params.value.page++
    getList()
  } else {
    status.value = 'nomore'
  }
}

const toLive = (item) => {
  uni.navigateTo({
    url: '/pagesub/living/live?roomId=' + item.id
  })
}

const row = ref({})
const edit = (item) => {
  row.value = item
  console.log(row.value)
  showEdit.value = true
}

const close = () => {
  showEdit.value = false
}

const updataLiving = value => {
  console.log('value', value)
  showEdit.value = false
  const living_params = {
    live_room_id: value.id,
    live_title: value.live_title,
    live_url: value.live_url,
  }
  sjStoreUpdate(living_params).then(res => {
    uni.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    list.value = []
    params.value.page = 1
    getList()
  })
}

// 页面触底加载下一页
onReachBottom(() => {
  if (list.value.length < total.value) {
    params.value.page++
    getList()
  }
})

</script>
<style lang='scss' scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 30rpx;
  box-sizing: border-box;

  .item {
    width: 100%;
    height: 100rpx;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 16rpx 25rpx 16rpx 18rpx;
    box-sizing: border-box;
    margin-bottom: 25rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-box {
      display: flex;
      align-items: center;
      font-size: 18rpx;
      font-weight: 400;
      color: #666666;
      letter-spacing: 1.8rpx;

      .title {
        width: 300rpx;
        font-size: 26rpx;
        font-weight: bold;
        color: #585858;
      }

      .icon {
        width: 66rpx;
        height: 66rpx;
        flex-shrink: 0;
        margin-right: 20rpx;
      }
    }

    .btn-box {
      display: flex;
      align-items: center;

      .btn {
        display: flex;
        align-items: center;
        height: 46rpx;
        padding: 0 12rpx;
        background: #ffffff;
        font-size: 22rpx;
        font-weight: bold;
        color: #2281fe;
        border: 1rpx solid #2281fe;
        border-radius: 10rpx;
        box-sizing: border-box;
        margin-left: 25rpx;
      }

      .btn1 {
        background: #2281fe;
        color: #ffffff;
      }
    }
  }
}
</style>