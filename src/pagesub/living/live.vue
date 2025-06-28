<template>
  <view class="livePage">
    <view class="bg"></view>
    <view class="c-box">
      <u-navbar bgColor="#1e64fe" :title="live_title" titleStyle="font-size:36rpx;color:#fff" leftIconSize="40rpx"
        leftIconColor="#fff" fixed autoBack placeholder>
        <!-- <template #right><text class="liveRecord" @click="toLiveRecord">直播记录</text></template> -->
      </u-navbar>

      <view class="box">
        <view class="line">距离自动关播还有: {{ timeText }}</view>
        <view class="line">直播平台:
          <view class="value">
            <image :src="`/static/images/living/${platform_info.key}.png`" class="icon"></image>
            <view :style="{ color: platform_info.color }">{{
              platform_info.name
            }}</view>
          </view>
        </view>
        <view class="line">直播间名称: <view class="value">{{ live_title }}</view>
        </view>
        <view class="line">
          <template v-if="[1, 4].includes(platform)">
            直播地址:
            <view class="value">{{ liveInfo?.live_room?.live_url }}</view>
          </template>
          <template v-else>
            <text v-if="platform === 2">视频号需开启直播后扫码二维码</text>
            <text v-if="platform === 3">小红书需扫码二维码后开启直播</text>
            <view style="color: #315D8F;" @click="getSphCode">获取二维码</view>
          </template>

        </view>
        <view class="line" style="height: 100rpx;">
          <view v-if="isPlaying" style="display: flex;align-items: center;">
            <image src="/static/images/live/icon-playing.gif" class="playing"></image>
            正在播放:

          </view>
          {{ isPlaying ? `第${currentIndex + 1}条语音话术` : '暂未播放'
          }}
          <image :src="`/static/images/living/${isPlaying ? 'pause' : 'play'}.png`" class="btn-icon">
            <!-- @click="handlePlay" -->
          </image>

        </view>
      </view>

      <view class="box">
        <view class="title">语音生成日志</view>
        <scroll-view scroll-y class="log-scroll">
          <view class="logs">
            <view class="item" v-for="(item, index) in vocieList" :key="index">
              " {{ item.text }} " 文本生成语音成功,已加入队列!
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="box">
        <view class="title">直播日志</view>
        <scroll-view scroll-y class="log-scroll1">
          <view class="logs">
            <view class="item" v-for="(item, index) in logs" :key="index">
              类型: {{ item.type }} {{ item.text }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 视频号登录弹窗 -->
    <u-popup :show="isSphShow" :round="10" mode="center" closeable :closeOnClickOverlay="false" @close="sphClose">
      <view class="qrBox">
        <view>请使用{{ platform === 3 ? '小红书' : '微信' }}扫码授权</view>
        <image :src="sph_data.qrcode_base64" v-if="isSphShow && platform === 2" style="width: 400rpx;height: 400rpx;">
        </image>
        <uqrcode ref="uqrcode" canvas-id="qrcode" :value="sph_data.url" :options="{ margin: 10 }" v-else></uqrcode>

        <u-button type="primary" text="我已授权" :loading="isCheck" loadingText="正在验证中" shape="circle" :disabled="isCheck"
          class="submit" @click="checkStatus" style="margin-top: 20rpx;" v-if="platform === 2"></u-button>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { ref, reactive } from 'vue'
import { useWsStore } from '@/stores/ws'
import { useRealTimeStore } from '@/stores'
import {
  sjlive,
  sjliveVoiceKz,
  interactiveAudioCreate,
  interactiveAudioFetch,
} from '@/api/index'
import {
  addToAudioQueue,
  onPlayStart,
  onPlayEnd,
  onAllEnded,
  stopAll,
  resetAudio,
} from './composables/audioPlayerQueue.js'
import { useAudioPlayer } from './composables/useAudioPlayer'
import { useCountdown } from './composables/useCountdown.js'
import { canTrigger } from '@/utils/helper.js'


const { timeText, startCountdown } = useCountdown()
const {
  startLoopPlay,
  lowerVolume,
  restoreVolume,
  pause,
  resume,
  stop,
  currentIndex,
  isPlaying,
} = useAudioPlayer() // ← { shuffle: true }启用随机播放

const realTime = useRealTimeStore()
const wsStore = useWsStore()

const handlePlay = () => {
  if (isPlaying.value) {
    pause()
  } else {
    resume()
  }
}

// 注册事件监听器
onPlayStart((url) => {
  lowerVolume()
  pause()
  console.log('[事件] 开始播放:', url)
})

onPlayEnd((url) => {
  restoreVolume()
  resume()
  console.log('[事件] 播放完成:', url)
})

onAllEnded(() => {
  // 队列全部播放完成,触发随机获取
  setTimeout(() => {
    if (lastUser.value && !isGetVoice.value) {
      isGetVoice.value = true
      const params = {
        live_room_id: liveInfo.value.live_room.id,
        name: lastUser.value,
        voice: liveInfo.value.live_room_relation.broadcast_voice,
      }
      interactiveAudioCreate(params).then((res) => {
        pollInteractiveAudioFetch() // 轮询请求结果
      })
    }
  }, 10000)
})

onLoad((options) => {
  resetAudio() // 初始化回复队列
  getLiveInfo(options.roomId)
  // 监听消息
  uni.$on('ws-message', (data) => {
    // 可解析 JSON 或处理逻辑
    console.log('🎯 收到服务器消息:', JSON.parse(data))
    const msg = JSON.parse(data)

    handleMessage(msg)
  })
})

const logs = ref([]) // 直播日志
const vocieList = ref([]) // 语音生成记录
const liveInfo = ref({}) // 直播间信息
const lastUser = ref('')
const isGetVoice = ref(false) // 当前是否获取语音
const live_title = ref('实时直播')
const platform_info = ref({})
const platform = ref(4) // 平台信息
const getLiveInfo = (roomId) => {
  sjlive({
    id: roomId || realTime.liveInfo.live_room_id,
  })
    .then((res) => {
      startCountdown(res.data.live_room.close_time)
      liveInfo.value = res.data
      const { live_room, live_room_relation } = res.data
      // platform.value = live_room.platform
      live_title.value = live_room_relation.live_title
      platform_info.value = realTime.menuList[platform.value - 1]
      if (platform.value === 2) return getSphCode() //视频号
      //小红书
      if (platform.value === 3) {
        const options = {
          ws_url: res.data.ws_xhs_url,
          platform: platform.value, //live_room.platform,
        }
        return wsStore.connect(options)
      }
      let ws_url = ''
      if (platform.value === 1) {
        // 快手
        ws_url = res.data.ws_ks_url
      } else {
        // 抖音
        ws_url = res.data.ws_url
      }
      const options = {
        ws_url,
        platform: platform.value, //live_room.platform,
        live_url: live_room.live_url,
      }
      playBackgroundSound()
      wsStore.connect(options)
    })
    .catch((err) => {
      console.log(err)
    })
}

const playBackgroundSound = () => {
  // 播放背景话术
  const { live_room_scripts } = liveInfo.value
  if (live_room_scripts.length) {
    const audios = live_room_scripts.map((item) => {
      return item.path
    })
    startLoopPlay(audios)
  } else {
    uni.showToast({ title: '未检测到话术语音列表!', icon: 'none' })
  }
}

const MAX_CONCURRENT_REQUESTS = 10; // 最大并发请求数
let currentRequests = 0; // 当前正在处理的请求数
// 监听处理消息
const handleMessage = (msg) => {
  if (currentRequests >= MAX_CONCURRENT_REQUESTS) return
  const { live_room } = liveInfo.value;
  const params = { live_room_id: live_room.id };

  // 快手平台处理
  if (platform.value === 1) {
    handleKuaishou(msg, params);
  }
  // 视频号平台处理
  else if (platform.value === 2) {
    handleSph(msg, params);
  }
  // 小红书平台处理
  else if (platform.value === 3) {
    if (msg.MessageType === '二维码') return getXhsCode(msg.Content)
    if (msg.MessageType === '未开播，等待开播') {
      isSphShow.value = false
      return uni.showToast({
        title: '扫码授权成功，请开启直播!',
        icon: 'none',
        duration: 3000,
      })
    }
    if (msg.MessageType === 'ws链接成功') return playBackgroundSound()
    handleXhs(msg, params);
  }
  // 抖音平台处理
  else if (platform.value === 4) {
    // 点赞每个用户每分钟只触发一次
    if (msg.giftId === 'like') {
      if (canTrigger(msg.user.nickname)) return handleDouyin(msg, params);
    } else {
      handleDouyin(msg, params);
    }

  }

  // 发送语音请求
  if (Object.keys(params).length > 1) { // 确保有有效参数
    currentRequests++
    sjliveVoiceKz(params).then((res) => {
      if (res.data?.url) {
        vocieList.value.unshift({ text: res.data.text });
        addToAudioQueue(res.data.url);
      }
    }).finally(() => {
      currentRequests--
    });
  }
};

// 快手消息处理
const handleKuaishou = (msg, params) => {
  const { voice_controller, live_room_relation } = liveInfo.value;
  if (msg.MessageType === '在线人数') return;

  if (msg.MessageType === '互动') {
    params.type = 2;
    params.bot_id = live_room_relation.bot_id;
    params.text = msg.Content;
    addLog(`内容:${msg.Content}`, '互动');
  }
  else if (msg.MessageType === '点赞') {
    params.text = `${msg.NickName}${voice_controller[1].detail}`;
    addLog(`用户: ${msg.NickName}`, '点赞');
  }
  else if (msg.MessageType === '礼物') {
    params.text = `感谢${msg.NickName}送的礼物,${voice_controller[2].detail}`;
    addLog(`用户: ${msg.NickName}`, '礼物');
  }

  if (msg.MessageType !== '在线人数') {
    lastUser.value = msg.NickName;
  }
};

// 小红书消息处理
const handleXhs = (msg, params) => {
  const { voice_controller, live_room_relation } = liveInfo.value;
  if (msg.MessageType === '互动') {
    params.type = 2;
    params.bot_id = live_room_relation.bot_id;
    params.text = msg.Content;
    addLog(`内容:${msg.Content}`, '互动');
  }
  else if (msg.MessageType === '点赞') {
    params.text = `${msg.NickName}${voice_controller[1].detail}`;
    addLog(`用户: ${msg.NickName}`, '点赞');
  }
  else if (msg.MessageType === '礼物') {
    params.text = `感谢${msg.NickName}送的礼物,${voice_controller[2].detail}`;
    addLog(`用户: ${msg.NickName}`, '礼物');
  }
  else if (msg.MessageType === '进入') {
    params.text = `${msg.NickName}${voice_controller[3].detail}`;
    addLog(`用户: ${msg.NickName}`, '进入');
  } else {
    return
  }

  if (['互动', '点赞', '礼物', '进入'].includes(msg.MessageType) && msg.NickName) {
    lastUser.value = msg.NickName;
  }
};

// 视频号消息处理
const handleSph = (msg, params) => {
  const { voice_controller, live_room_relation } = liveInfo.value;
  if (msg.msgType === 1) {
    params.type = 2;
    params.bot_id = live_room_relation.bot_id;
    params.text = msg.content;
    addLog(`内容:${msg.content}`, '互动');
  }
  else if (msg.msgType === 10005) {
    params.text = `${msg.nickname}${voice_controller[3].detail}`;
    addLog(`用户: ${msg.nickname}`, '进入');
    lastUser.value = msg.nickname;
  }
  else if (msg.msgType === "gift") {
    params.text = `${msg.nickname}${voice_controller[2].detail}`;
    addLog(`用户: ${msg.nickname}`, '礼物');
    lastUser.value = msg.nickname;
  }
};

// 抖音消息处理
const handleDouyin = (msg, params) => {
  const { voice_controller, live_room_relation } = liveInfo.value;
  if (msg.content) {
    params.type = 2;
    params.bot_id = live_room_relation.bot_id;
    params.text = msg.content;
    addLog(`内容:${msg.content}`, '互动');
  }
  else if (msg.common?.method === 'WebcastMemberMessage') {
    params.text = `${msg.user.nickname}${voice_controller[3].detail}`;
    addLog(`用户: ${msg.user.nickname}`, '进入');
    lastUser.value = msg.user.nickname;
  }
  else if (msg.giftId === 'social' && msg.user?.nickname) {
    params.text = `${msg.user.nickname}${voice_controller[0].detail}`;
    addLog(`用户: ${msg.user.nickname}`, '关注');
    lastUser.value = msg.user.nickname;
  }
  else if (msg.giftId === 'like' && msg.user?.nickname) {
    params.text = `${msg.user.nickname}${voice_controller[1].detail}`;
    addLog(`用户: ${msg.user.nickname}`, '点赞');
    lastUser.value = msg.user.nickname;
  }
  else if (msg.giftId && msg.user?.nickname) {
    params.text = `${msg.user.nickname}${voice_controller[2].detail}`;
    addLog(`用户: ${msg.user.nickname}`, '礼物');
    lastUser.value = msg.user.nickname;
  }
};

// 添加日志的公共方法
const addLog = (text, type) => {
  logs.value.unshift({ text, type });
};

// 轮询获取生成语音结果，直到 detail 存在
const pollInteractiveAudioFetch = (retry = 0, maxRetry = 100) => {
  if (!isGetVoice.value) return; // 手动停止轮询
  if (retry >= maxRetry) {
    isGetVoice.value = false
    return uni.showToast({ title: '生成超时，请重试', icon: 'none' })
  }

  interactiveAudioFetch({ id: liveInfo.value.live_room.id })
    .then((res) => {
      if (res.data.path) {
        isGetVoice.value = false
        addToAudioQueue(res.data.path)
      } else {
        setTimeout(() => pollInteractiveAudioFetch(retry + 1, maxRetry), 4000)
      }
    })
    .catch((err) => {
      isGetVoice.value = false
      console.error('获取生成文字失败:', err)
      // setTimeout(() => pollInteractiveAudioFetch(retry + 1, maxRetry), 2000)
    })
}


// 视频号获取二维码
const sph_session = ref('')
const sph_data = ref({})
const isSphShow = ref(false)
const timmer = ref(null)
const isCheck = ref(false)
const sphURL = 'http://123.56.68.226:4206'
async function getSphCode () {
  if (platform.value === 2) {
    // 获取视频号Session
    const res = await uni.request({ url: sphURL + '/session/create', method: 'POST' })
    console.log('res', res.data.session_id)
    sph_session.value = res.data.session_id
    const value = await uni.request({ url: `${sphURL}/session/${sph_session.value}/login/qrcode` })
    sph_data.value = value.data.data
    sph_data.value.qrcode_base64 = `data:image/png;base64,${sph_data.value.qrcode_base64}`
    console.log('sph_data.value', sph_data.value)
    isSphShow.value = true
  } else {
    // 小红书
    wsStore.close()
    const options = {
      ws_url: liveInfo.value.ws_xhs_url,
      platform: platform.value, //live_room.platform,
    }
    wsStore.connect(options)
  }
}

function checkStatus () {
  isCheck.value = true
  timmer.value = setInterval(() => {
    uni.request({
      url: `${sphURL}/session/${sph_session.value}/login/status`,
      success: (res) => {
        console.log('res.data', res.data)
        if (res.data.status === "danmu_active") {
          clearInterval(timmer.value)
          isCheck.value = false
          begin_sph()
        }
        if (res.data.status === "error" || res.data.status === "error_api_join_live") {
          clearInterval(timmer.value)
          isCheck.value = false
          isSphShow.value = false
          uni.showModal({
            title: '提示',
            content: '二维码已失效,请重新获取扫码!',
            success: (res) => {
              if (res.confirm) getSphCode()
            }
          })
        }
      }
    })
  }, 1000)
}

function begin_sph () {
  isSphShow.value = false
  const options = {
    ws_url: `${liveInfo.value.ws_sph_url}/ws/danmu/${sph_session.value}`,
    platform: platform.value
  }
  playBackgroundSound()
  wsStore.connect(options)
}

function sphClose () {
  isSphShow.value = false
  isCheck.value = false
  if (timmer.value) clearInterval(timmer.value)
}

// 小红书获取二维码
function getXhsCode (content) {
  sph_data.value.url = content
  isSphShow.value = true
}


onUnload(() => {
  isGetVoice.value = false
  stop() // 关闭主播播放
  stopAll() // 关闭副播播放
  wsStore.close()
  uni.$off('ws-message')
})
</script>
<style lang="scss" scoped>
.livePage {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-y: hidden;

  .bg {
    min-height: 100vh;
    background: linear-gradient(180deg, #1e64fe 20%, #f1f4ff 100%);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
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
    z-index: 2;

    .box {
      width: 100%;
      min-height: 200rpx;
      box-sizing: border-box;
      background-color: #fff;
      padding: 20rpx;
      border-radius: 20rpx;
      margin-top: 40rpx;

      .log-scroll {
        margin: 20rpx 0;
        width: 100%;
        height: 300rpx;
      }

      .log-scroll1 {
        margin: 20rpx 0 0 0;
        width: 100%;
        height: 520rpx;
      }

      .title {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;

      }

      .logs {
        width: 100%;
        padding: 20rpx;
        color: #666;
        font-size: 25rpx;

        .item {
          padding: 10rpx 0;
          line-height: 40rpx;
        }
      }

      .line {
        width: 100%;
        padding: 10rpx;
        box-sizing: border-box;
        font-size: 26rpx;
        color: #333;
        font-weight: 400;
        display: flex;
        align-items: center;
        position: relative;

        .btn-icon {
          width: 80rpx;
          height: 80rpx;
          position: absolute;
          right: 0;
          bottom: 10rpx;
        }

        .playing {
          width: 80rpx;
          height: 80rpx;
        }

        .value {
          padding-left: 20rpx;
          display: flex;
          align-items: center;
          font-weight: bold;

          .icon {
            width: 30rpx;
            height: 30rpx;
            margin-right: 10rpx;
          }
        }
      }

      .flex-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .qrBox {
    padding: 60rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
