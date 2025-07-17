<template>
  <view class="container-box">
    <image src="/static/images/living/m-bg.png" class="top-bg"></image>
    <view class="content">
      <view :style="{ marginTop: `${config.statusBar}px` }"></view>
      <view class="userinfo">
        <image src="/static/images/living/avatar.png" class="avatar"></image>
        <view class="user-box">
          <view class="name">HELLO</view>
          <view class="des">欢迎使用AI实时直播</view>
        </view>
      </view>
      <view class="banner-box">
        <image src="/static/images/living/m-banner.png" class="banner"></image>
      </view>

      <view class="menu-box">
        <view class="menu-title">直播平台</view>
        <view class="menu-list">
          <view class="menu-item" v-for="(item, index) in realTime.menuList" :key="index" @click="onclick(item)">
            <image :src="`/static/images/living/${item.key}_bg.png`" class="menu-bg"></image>
            <view class="box-c">
              <view class="menu-text" :style="{ color: item.color }">{{ item.name }}直播</view>
              <view class="des" :style="{ color: item.desColor }">
                <view>{{ item.name }}平台</view>
                <view>实景直播</view>
              </view>
            </view>
            <image :src="`/static/images/living/${item.key}.png`" class="icon" :style="{
              width: `${item.iconWidth}rpx`,
              height: `${item.iconHeight}rpx`,
            }"></image>
          </view>
        </view>
      </view>

      <view class="history-box" v-if="list.length">
        <view class="title">
          <view class="tit">直播历史记录</view>
          <view class="more" @click="toHistory">查看全部></view>
        </view>

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
      </view>
    </view>
    <edit-living :show="showEdit" :list="row" @close="close" @save="updataLiving"></edit-living>
  </view>
</template>

<script setup>
import { useConfigStore, useRealTimeStore } from '@/stores'
import { sjLiveList, sjStoreUpdate } from '@/api/index'
import { onShow } from '@dcloudio/uni-app'
import EditLiving from '@/components/living/EditLiving.vue'


const list = ref([])
const config = useConfigStore()
const realTime = useRealTimeStore()
const icon = ref(['ks', 'sph', 'xhs', 'dy', 'pdd', 'zfb', 'mt', 'jd', 'tb'])
const showEdit = ref(false)

onShow(() => {
  getList()
})

const getList = () => {
  list.value = []
  sjLiveList({ page: 1, size: 3 }).then((res) => {
    list.value = res.data.list
  })
}


const onclick = (item) => {
  if ([5, 6, 7, 8, 9].includes(item.type)) {
    uni.showToast({ title: '正在开发中,请期待!', icon: 'none' })
  } else {
    realTime.setType(item.type)
    uni.navigateTo({
      url: '/pagesub/living/create',
    })
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
const toHistory = () => {
  uni.navigateTo({
    url: '/pagesub/living/history',
  })
}

const close = () => {
  showEdit.value = false
}

const updataLiving = list => {
  console.log('list', list)
  showEdit.value = false
  const params = {
    live_room_id: list.id,
    live_title: list.live_title,
    live_url: list.live_url,
  }
  sjStoreUpdate(params).then(res => {
    uni.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    getList()
  })
}

</script>

<style lang="scss" scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f4f7ff;
  position: relative;

  .top-bg {
    width: 100%;
    height: 646rpx;
  }

  .content {
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .userinfo {
      width: 100%;
      padding: 50rpx 26rpx 35rpx 26rpx;
      display: flex;
      align-items: center;
      color: #fff;

      .avatar {
        width: 76rpx;
        height: 76rpx;
        margin-right: 20rpx;
      }

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }

      .des {
        font-size: 26rpx;
      }
    }

    .banner-box {
      width: 100%;
      height: 275rpx;
      padding: 0 30rpx;
      box-sizing: border-box;

      .banner {
        width: 100%;
        height: 100%;
      }
    }

    .menu-box {
      width: 100%;
      padding: 0 0 0 30rpx;
      box-sizing: border-box;

      .menu-title {
        margin-top: 50rpx;
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
      }

      .menu-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }

      .menu-item {
        width: 221rpx;
        height: 131rpx;
        position: relative;
        margin-bottom: 20rpx;
        margin-right: 16rpx;

        .menu-bg {
          width: 100%;
          height: 100%;
        }

        .icon {
          position: absolute;
          bottom: 7rpx;
          right: 7rpx;
          z-index: 1;
        }

        .box-c {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          padding: 15rpx;
          box-sizing: border-box;

          .menu-text {
            font-size: 24rpx;
            font-weight: bold;
          }

          .des {
            margin-top: 15rpx;
            font-size: 16rpx;
          }
        }
      }
    }

    .history-box {
      width: 100%;
      min-height: 300rpx;
      padding: 30rpx;
      box-sizing: border-box;

      .title {
        width: 100%;
        padding: 5rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24rpx;
        color: #666666;

        .tit {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
          letter-spacing: 2.8rpx;
        }
      }

      .item {
        width: 100%;
        height: 100rpx;
        background: #ffffff;
        border-radius: 20rpx;
        padding: 16rpx 25rpx 16rpx 18rpx;
        box-sizing: border-box;
        margin-top: 25rpx;
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
  }
}
</style>
