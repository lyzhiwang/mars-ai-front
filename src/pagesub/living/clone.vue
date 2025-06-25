<template>
  <view class="page">
    <view class="content">
      <view class="title-b">
        <view class="tit">上传音频素材</view>
        <view>上传一段音频，轻松打造专属个人特有的声音模型</view>
      </view>

      <view class="s-box">
        <view class="h_box">
          <view class="left">
            <view class="block"></view>
            <view class="name">选择方式</view>
          </view>
          <!-- <view class="right" @click="toPath('/pagesub/mine/index')">我的声音&nbsp; ></view> -->
        </view>

        <view class="menu" @click="toPath('/pagesub/living/transcribe')">
          <image
            src="/static/images/mine/clone-1.png"
            style="width: 96rpx; height: 110rpx"
          ></image>
          <view class="title">录制自己的声音</view>
          <view class="sub">点击录制音频，建议录制30~60秒内</view>
        </view>
        <view class="menu" @click="toPath('/pagesub/living/add')">
          <image src="/static/images/mine/clone-2.png"></image>
          <view class="title">从本地上传语音文件</view>
          <view class="sub"
            >支持MP3，WAV，MP4格式，支持音频时长30秒以上，大小10M以内</view
          >
        </view>
      </view>

      <!-- <view class="btn2" @click="toPath('/pagesub/mine/begin')">添加声音克隆</view> -->

      <view class="tips">
        <p class="tit">语音克隆要求:</p>
        <p>1.上传的音频要求15~30秒，大小10M以内</p>
        <p>2.录制的过程确保环境安静没有明显噪音</p>
        <p>3.录制的过程不要长时间不说话，保证语速平稳</p>
        <p>4.录制的过程语调不要时高时低，保持音量均衡</p>
        <p>5.录制的过程避免出现其他人声</p>
      </view>
    </view>
  </view>
</template>

<script setup>
const toPath = (url) => {
  uni.navigateTo({
    url,
  })
}
</script>

<style lang="scss" scoped>
.page {
  background: #f5f5f5;
  min-height: 100vh;
  .content {
    padding: 0 30rpx;
    box-sizing: border-box;
    .title-b {
      font-size: 24rpx;
      font-weight: bold;
      color: #999999;
      padding: 30rpx 0;
      .tit {
        font-size: 30rpx;
        font-weight: 700;
        color: #282828;
        margin-bottom: 26rpx;
      }
    }
    .s-box {
      width: 100%;
      height: 740rpx;
      background: #ffffff;
      border-radius: 20rpx;
      padding: 31rpx 28rpx;
      box-sizing: border-box;
      .h_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          font-size: 30rpx;
          font-weight: 700;
          color: #282828;
          .block {
            width: 6rpx;
            height: 25rpx;
            background: #2281fe;
            border-radius: 3rpx;
            margin-right: 14rpx;
          }
        }
        .right {
          font-size: 28rpx;
          font-weight: 400;
          color: #ff9b39;
        }
      }

      .menu {
        width: 100%;
        height: 300rpx;
        background: #f7f9ff;
        border: 2rpx dashed #6185fb;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 22rpx;
        font-weight: 400;
        color: #666666;
        margin-top: 20rpx;
        image {
          width: 95rpx;
          height: 92rpx;
        }
        .title {
          font-size: 26rpx;
          font-weight: bold;
          color: #282828;
          margin-bottom: 20rpx;
        }
        .sub {
          max-width: 70%;
          text-align: center;
        }
      }
    }

    .btn2 {
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
      margin-top: 50rpx;
    }

    .tips {
      padding: 42rpx 32rpx;
      box-sizing: border-box;
      font-size: 28rpx;
      font-weight: 400;
      color: #9e9e9e;
      line-height: 49rpx;
      .tit {
        font-size: 30rpx;
      }
    }
  }
}
</style>
