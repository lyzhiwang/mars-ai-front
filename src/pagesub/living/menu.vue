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
    </view>
  </view>
</template>

<script setup>
import { useConfigStore, useRealTimeStore } from '@/stores'

const config = useConfigStore()
const realTime = useRealTimeStore()
const menuList = ref([
  {
    type: 1,
    key: 'ks',
    name: '快手',
    iconWidth: 93,
    iconHeight: 100,
    color: '#8F5B31',
    desColor: '#DEC2AA',
  },
  {
    type: 2,
    key: 'sph',
    name: '视频号',
    iconWidth: 97,
    iconHeight: 75,
    color: '#315D8F',
    desColor: '#AEC3E0',
  },
  {
    type: 3,
    key: 'xhs',
    name: '小红书',
    iconWidth: 95,
    iconHeight: 95,
    color: '#8F3131',
    desColor: '#E39C9C',
  },
  {
    type: 4,
    key: 'dy',
    name: '抖音',
    iconWidth: 97,
    iconHeight: 95,
    color: '#315D8F',
    desColor: '#AEC3E0',
  },
  {
    type: 5,
    key: 'pdd',
    name: '拼多多',
    iconWidth: 87,
    iconHeight: 76,
    color: '#8F3131',
    desColor: '#E39C9C',
  },
  {
    type: 6,
    key: 'zfb',
    name: '支付宝',
    iconWidth: 93,
    iconHeight: 93,
    color: '#315D8F',
    desColor: '#AEC3E0',
  },
  {
    type: 7,
    key: 'mt',
    name: '美团',
    iconWidth: 92,
    iconHeight: 92,
    color: '#8F5B31',
    desColor: '#DEC2AA',
  },
  {
    type: 8,
    key: 'jd',
    name: '京东',
    iconWidth: 93,
    iconHeight: 92,
    color: '#8F3131',
    desColor: '#E39C9C',
  },
  {
    type: 9,
    key: 'tb',
    name: '淘宝',
    iconWidth: 93,
    iconHeight: 90,
    color: '#8F3131',
    desColor: '#E39C9C',
  },
])

const onclick = (item) => {
  if ([ 5, 6, 7, 8, 9].includes(item.type)) {
    uni.showToast({ title: '正在开发中,请期待!', icon: 'none' })
  } else {
    realTime.setType(item.type)
    uni.navigateTo({
      url: '/pagesub/living/create',
    })
  }
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
  }
}
</style>
