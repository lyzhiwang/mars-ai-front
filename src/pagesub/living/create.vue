<template>
  <view class="container-box" @click="show = false">
    <image src="/static/images/living/c-bg.png" class="top-bg"></image>

    <view class="c-box">
      <view class="steps">
        <view class="line"></view>
        <view class="steps-box">
          <view class="item-box">
            <view class="round-box">
              <image src="/static/images/living/s-1.png" class="icon"></image>
            </view>
            <view>填写商家信息</view>
          </view>
          <view class="item-box">
            <view class="round-box">
              <image src="/static/images/living/s-2.png" class="icon icon1"></image>
            </view>
            <view>填写直播信息</view>
          </view>

          <view class="item-box">
            <view class="round-box">
              <image src="/static/images/living/s-3.png" class="icon icon2"></image>
            </view>
            <view>开始直播</view>
          </view>
        </view>
      </view>

      <view class="title-box">选择声音</view>

      <view class="content">
        <view class="voice-list">
          <view class="item" v-for="(item, index) in voice_live" :key="index" @click="handleClick(item)"
            :class="{ Aitem: isSelect(item) }">
            <image :src="item.icon" class="icon"></image>
            {{ item.type }}
            <view class="select" v-if="isSelect(item)">
              <u-icon name="checkbox-mark" size="22" color="#fff" class="checkbox"></u-icon>
            </view>
          </view>

          <view class="item" v-for="(item, index) in cloneList" :key="index" @click="handleClick(item)"
            :class="{ Aitem: isSelect(item) }">
            <image :src="item.icon" class="icon"></image>
            <view class="name">{{ item.type }}</view>
            <view class="select" v-if="isSelect(item)">
              <u-icon name="checkbox-mark" size="22" color="#fff" class="checkbox"></u-icon>
            </view>
          </view>

          <view class="add-clone" @click="toClone">
            <image src="@/static/images/living/clone.png" class="clone-icon"></image>
            克隆音色
          </view>
        </view>
        <view class="cell">
          <view class="cell-left">主播音色</view>
          <view class="cell-right">
            <view class="timbre">
              <view class="info" v-if="form.anchor">
                <image :src="current_anchor.icon" class="icon"></image>
                <view class="name">{{ current_anchor.type }}</view>
              </view>
              <view v-else>未选择</view>
            </view>
          </view>
        </view>
        <view class="cell">
          <view class="cell-left">副播音色</view>
          <view class="cell-right">
            <view class="timbre">
              <view class="info" v-if="form.broadcast_voice">
                <image :src="current_broadcast_voice.icon" class="icon"></image>
                <view class="name">{{ current_broadcast_voice.type }}</view>
              </view>
              <view v-else>未选择</view>
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播语音场控</view>
          <view class="cell-right">
            <view class="control" @click="showControl = true">
              <view class="icon-box">
                <u-icon name="plus" color="#4F77FC" size="18"></u-icon>
              </view>
              自定义场控话术
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <template v-if="[1, 4].includes(realTime.type)">
          <view class="cell" v-if="realTime.type === 1">
            <view class="cell-left">直播间账号</view>
            <view class="cell-right" style="width: 70%">
              <u--input placeholder="快手直接复制链接粘贴即可" border="none" inputAlign="right" color="#4F77FC"
                v-model="form.live_url" clearable :formatter="formatter"></u--input>
            </view>
          </view>
          <view class="cell" v-else>
            <view class="cell-left">直播间账号</view>
            <view class="cell-right" style="width: 70%">
              <u--input placeholder="请输入正确的直播用户抖音ID" border="none" inputAlign="right" color="#4F77FC"
                v-model="form.live_url" clearable></u--input>
            </view>
          </view>
        </template>
        <view class="cell">
          <view class="cell-left">直播间名称</view>
          <view class="cell-right">
            <u--input placeholder="请输入直播间名称" border="none" inputAlign="right" color="#4F77FC" v-model="form.live_title"
              clearable></u--input>
          </view>
        </view>
      </view>
      <view class="title-box">填写商家信息</view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">您的行业</view>
          <view class="cell-right Industry" @click.stop="show = !show">
            {{ Industry[form.shop_type - 1].value }}
            <u-icon name="arrow-down-fill" color="#4F77FC" size="22"></u-icon>
            <u-transition :show="show">
              <view class="select-box">
                <view class="item" v-for="(item, index) in Industry" :key="index" @click="selectIndustry(item)"
                  :class="{ active: form.shop_type === item.key }">
                  {{ item.value }}
                </view>
              </view>
            </u-transition>
          </view>
        </view>

        <template v-if="form.shop_type === 1">
          <view class="cell-column">
            <view class="cell-title">1.您店铺的经营时间</view>
            <u--textarea v-model="form.shop_time" maxlength="-1" height="200" placeholder="请填写店铺的经营时间"></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">2.您店铺的地址</view>
            <u--textarea v-model="form.shop_address" height="200" maxlength="-1" placeholder="请填写店铺的地址"></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">3.您店铺的历史</view>
            <u--textarea v-model="form.shop_history" height="400" maxlength="-1" placeholder="请填写店铺的历史"></u--textarea>
          </view>
        </template>
        <template v-else>
          <view class="cell-column">
            <view class="cell-title">1.您的货源厂家名与厂家地址</view>
            <u--textarea v-model="form.factory_name" height="200" maxlength="-1"
              placeholder="请填写您的货源厂家名与厂家地址"></u--textarea>
          </view>
          <view class="cell-column">
            <view class="cell-title">2.您的货源厂家的一些优势</view>
            <u--textarea v-model="form.factory_advantage" height="400" maxlength="-1"
              placeholder="请填写您的货源厂家的一些优势"></u--textarea>
          </view>
        </template>
      </view>
      <view class="title-box">填写直播信息</view>
      <view class="content">
        <view class="text-content">
          <u--textarea v-model="form.live_info" height="400" count maxlength="2000" placeholder="请填写直播信息"></u--textarea>
        </view>
      </view>
      <view class="tips-box">
        <view class="t-title">注意！</view>
        不是让你写话术，而是让您告知AI:
        您卖什么?|解决什么问题，为什么要卖?」电商包部?团购如何核销?|直播福利?|遇到售后如何解决?!若是电商产品如何使用?|商品链接说明(号链接是啥?2号...)团购店消费环境(有停车场?对近有商场?有吃的?)|客户给您的好评举一些例子|注意事项?!想和直播间用户说的话|大家常问的问题对应的答案把内容写上去就行，AI会自动生成话术!
      </view>
      <view class="content">
        <view class="cell">
          <view class="cell-left">直播方式</view>
          <view class="cell-right">
            <view class="edit" :class="{ aEdit: form.is_edit }">
              <view class="select-v">
                <view class="select-v-icon"></view>
              </view>
              修改AI话术
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-box">
      <view class="countdown" @click="showCountDown = true">
        <image src="/static/images/living/b-1.png" class="icon"></image>
        <view class="time">倒计时</view>
      </view>

      <view class="btn" @click="next">下一步</view>

      <view class="countdown" @click="ProhibitedWords">
        <image src="/static/images/living/b-2.png" class="icon1"></image>
        <view class="time">违禁词</view>
      </view>
    </view>
    <FieldControl :show="showControl" :list="form.voice_controller" @close="saveControl" @save="saveControl">
    </FieldControl>
    <CountDown :show="showCountDown" v-model:closeTime="form.close_time" :closeTime="form.close_time"
      @close="showCountDown = false" @save="saveCountDown"></CountDown>
    <ProgressBox :show="showProgress" :text="progressText" :currentProgress="currentProgress" :intervalSpeed="speed">
    </ProgressBox>
  </view>
</template>

<script setup>
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import FieldControl from '@/components/living/FieldControl'
import CountDown from '@/components/living/CountDown'
import ProgressBox from '@/components/living/ProgressBox'
import { useRealTimeStore } from '@/stores'
import {
  createSjLive,
  liveFileStatus,
  aliVoiceCloneList,
  sjliveDesc,
  liveResult,
} from '@/api'
import { ref } from 'vue'

onLoad(() => {
  innerAudioContext.value = uni.createInnerAudioContext()
  shouldContinuePolling.value = true
  getList()
})

const innerAudioContext = ref(null)
const realTime = useRealTimeStore()
const voice_live = ref(realTime.voice_live)
const showControl = ref(false) // 场控显示
const showCountDown = ref(false)
const showProgress = ref(false) // 进度条显示
const progressText = ref('正在创建智能体,请耐心等待...')
const currentProgress = ref(0)
const speed = ref(300)
const Industry = ref([
  { key: 1, value: '实体店播' },
  { key: 2, value: '直播带货' },
])

const show = ref(false)
const current_anchor = ref({})
const current_broadcast_voice = ref({})
const form = ref({
  platform: realTime.type,
  anchor: '', // 主播音色
  broadcast_voice: '', // 副播音色
  live_url: '',
  live_title: '',
  shop_type: 1, // 1实体店铺 2 直播带货
  shop_time: '',
  shop_address: '',
  shop_history: '',
  voice_controller: [
    {
      name: '关注',
      detail: '感谢关注，你的关注就是对我们最大的支持。',
      interval_time: 5,
    },
    {
      name: '点赞',
      detail: '感谢点赞，你的点赞就是对我们最大的支持。',
      interval_time: 5,
    },
    {
      name: '礼物',
      detail: '感谢礼物，你的礼物就是对我们最大的支持。',
      interval_time: 5,
    },
    {
      name: '欢迎',
      detail: '欢迎，来的都是客，进来就是对我们的支持，感谢',
      interval_time: 5,
    },
    {
      name: '促单',
      detail: '咱们所有的套餐，数量有限，先到先得',
      interval_time: 5,
    },
  ],
  factory_name: '',
  factory_advantage: '',
  live_info: '',
  close_time: 80,
  is_edit: true,
})

const shouldContinuePolling = ref(true)

const selectIndustry = (item) => {
  form.value.shop_type = item.key
}

const cloneList = ref([])

const formatter = (value) => {
  // 快手过滤输入的汉字
  if (realTime.type === 1) {
    const match = value.match(/v\.kuaishou\.com\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }
}

const getList = () => {
  aliVoiceCloneList().then((res) => {
    cloneList.value = res.data.map((v) => ({
      ...v,
      voice: v.voice_name,
      icon: '/static/images/living/music.png',
      type: v.name,
    }))
  })
}

const isSelect = (item) => {
  return [form.value.anchor, form.value.broadcast_voice].includes(item.voice)
}

const handleClick = (item) => {
  // 停止并释放旧的音频资源
  if (innerAudioContext.value) {
    innerAudioContext.value.stop()
    innerAudioContext.value.destroy()
    innerAudioContext.value = null
  }

  // 创建新的音频实例
  innerAudioContext.value = uni.createInnerAudioContext()

  // 设置 anchor 和 broadcast_voice 的逻辑
  if (!form.value.anchor) {
    current_anchor.value = item
    form.value.anchor = item.voice
  } else if (!form.value.broadcast_voice) {
    current_broadcast_voice.value = item
    form.value.broadcast_voice = item.voice
  } else {
    // 如果两者都已设置，则替换 anchor，重置 broadcast_voice
    current_anchor.value = item
    form.value.anchor = item.voice
    current_broadcast_voice.value = {}
    form.value.broadcast_voice = ''
  }

  // 播放音频
  if (item.path) {
    innerAudioContext.value.src = item.path
    innerAudioContext.value.play()
  }
}

const saveCountDown = (value) => {
  form.value.close_time = Number(value)
  showCountDown.value = false
}

const saveControl = (list) => {
  form.value.voice_controller = list
  showControl.value = false
}

// 下一步
const next = () => {
  shouldContinuePolling.value = true

  let obj = { ...form.value }

  // 表单校验
  if (!form.value.anchor)
    return uni.showToast({ title: '请选择主播音色', icon: 'none' })
  if (!form.value.broadcast_voice)
    return uni.showToast({ title: '请选择副播音色', icon: 'none' })
  if (!form.value.live_url && [1, 4].includes(realTime.type))
    return uni.showToast({ title: '请填写直播间信息', icon: 'none' })
  if (!form.value.live_title)
    return uni.showToast({ title: '请填写直播间名称', icon: 'none' })
  if (!form.value.live_info)
    return uni.showToast({ title: '请填写直播信息', icon: 'none' })

  if (form.value.shop_type === 1) {
    delete obj.factory_name
    delete obj.factory_advantage
    if (!form.value.shop_time)
      return uni.showToast({ title: '请填写经营时间', icon: 'none' })
    if (!form.value.shop_address)
      return uni.showToast({ title: '请填写经营时间', icon: 'none' })
    if (!form.value.shop_history)
      return uni.showToast({ title: '请填写店铺历史', icon: 'none' })
  } else {
    delete obj.shop_time
    delete obj.shop_address
    delete obj.shop_history
    if (!form.value.factory_name)
      return uni.showToast({ title: '请填写货源厂家与商家地址', icon: 'none' })
    if (!form.value.factory_advantage)
      return uni.showToast({ title: '请填写货源厂家的优势', icon: 'none' })
  }

  // uni.showLoading({ title: '提交中,请勿退出...', mask: true })
  // 开始进度并设置25%
  speed.value = 500
  currentProgress.value = 25
  showProgress.value = true
  progressText.value = "正在创建智能体,请耐心等待..."
  // 提交直播信息
  createSjLive(obj)
    .then((res) => {
      const { liveRoom } = res.data
      if (!liveRoom.id) throw new Error('liveRoom.id 不存在')
      realTime.setliveInfo('live_room_id', liveRoom.id)
      // 第一步：轮询直播状态
      speed.value = 780
      currentProgress.value = 50
      progressText.value = "智能体文案上传中..."
      pollLiveFileStatus(liveRoom.id)
    })
    .catch((err) => {
      console.error('提交失败:', err)
      closeProgress()
    })
}

// 轮询直播文件状态，直到 status = true
const pollLiveFileStatus = (liveRoomId, retry = 0, maxRetry = 500) => {
  if (!shouldContinuePolling.value) return closeProgress()
  if (retry >= maxRetry) {
    closeProgress()
    return uni.showToast({ title: '状态超时，请重试', icon: 'none' })
  }

  liveFileStatus({ live_room_id: liveRoomId })
    .then((res) => {
      if (res.data.status) {
        speed.value = 1500
        currentProgress.value = 99
        progressText.value = "智能体正在生成直播场控文字..."
        // 成功后继续取 conversation_id
        sjliveDesc({ live_room_id: liveRoomId }).then((res) => {
          const { conversation_id } = res.data
          if (conversation_id) {
            // 第二步：轮询获取生成文字
            pollLiveResult(conversation_id)
          } else {
            closeProgress()
            uni.showToast({ title: 'conversation_id 获取失败', icon: 'none' })
          }
        })
      } else {
        setTimeout(
          () => pollLiveFileStatus(liveRoomId, retry + 1, maxRetry),
          3000
        )
      }
    })
    .catch((err) => {
      console.error('状态检查失败:', err)
      setTimeout(
        () => pollLiveFileStatus(liveRoomId, retry + 1, maxRetry),
        3000
      )
    })
}

// 轮询获取生成结果，直到 detail 存在
const pollLiveResult = (conversation_id, retry = 0, maxRetry = 500) => {
  if (!shouldContinuePolling.value) return closeProgress()
  if (retry >= maxRetry) {
    closeProgress()
    return uni.showToast({ title: '生成超时，请重试', icon: 'none' })
  }

  liveResult({ conversation_id })
    .then((res) => {
      if (res.data) {
        speed.value = 0
        currentProgress.value = 100
        progressText.value = "直播场控文字生成成功!"
        let obj = { conversation_id, content: res.data }
        let arr = [obj]
        realTime.setliveInfo('detail', arr)
        closeProgress()
        uni.showToast({ title: '直播场控文字生成成功', icon: 'success' })
        uni.navigateTo({ url: '/pagesub/living/star' })
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

function ProhibitedWords () {
  uni.navigateTo({
    url: '/pagesub/living/words',
  })
}

const toClone = () => {
  uni.navigateTo({ url: '/pagesub/living/clone' })
}

const closeProgress = () => {
  speed.value = 300
  showProgress.value = false
  progressText.value = ""
  currentProgress.value = 0
}
onHide(() => {
  if (innerAudioContext.value) {
    innerAudioContext.value.destroy()
    innerAudioContext.value = null
  }
})

onUnload(() => {
  closeProgress()
  shouldContinuePolling.value = false
  if (innerAudioContext.value) {
    innerAudioContext.value.destroy()
    innerAudioContext.value = null
  }
})
</script>

<style lang="scss" scoped>
.container-box {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;

  .top-bg {
    width: 100%;
    height: 448rpx;
  }

  .c-box {
    width: 100%;
    min-height: 500rpx;
    padding: 0 30rpx;
    padding-bottom: 80px;
    /* 预留底部栏高度 + 安全距离 */
    box-sizing: border-box;
    margin-top: -85rpx;
    position: relative;

    .steps {
      width: 100%;
      height: 136rpx;
      background: #ffffff;
      border-radius: 15rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 54rpx;
      box-sizing: border-box;
      position: relative;

      .line {
        width: 80%;
        border: 1px dashed #207efe;
        margin-top: -20rpx;
      }

      .steps-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 54rpx;
        box-sizing: border-box;
        position: absolute;

        .item-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 18rpx;
          font-weight: 400;
          color: #2281fe;
          line-height: 20rpx;

          .round-box {
            width: 68rpx;
            height: 68rpx;
            background: #f7f9ff;
            border: 1rpx solid #6185fb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6rpx;

            .icon {
              width: 37rpx;
              height: 33rpx;
            }

            .icon1 {
              width: 28rpx;
              height: 37rpx;
            }

            .icon2 {
              width: 37rpx;
              height: 35rpx;
            }
          }
        }
      }
    }

    .title-box {
      padding-top: 35rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
      letter-spacing: 2.8rpx;
    }

    .content {
      width: 690rpx;
      min-height: 95rpx;
      background: #ffffff;
      border-radius: 20rpx;
      margin-top: 20rpx;

      .voice-list {
        width: 100%;
        min-height: 332.5rpx;
        background: #ffffff;
        border-radius: 14rpx;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        padding: 20rpx 4rpx 0 6rpx;

        .add-clone {
          width: 320rpx;
          height: 87rpx;
          background: #e9eeff;
          border-radius: 10rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27rpx;
          font-weight: 400;
          color: #207efe;
          margin: 0 10rpx 16rpx 8rpx;

          .clone-icon {
            width: 41rpx;
            height: 40rpx;
            margin-right: 22rpx;
          }
        }

        .item {
          width: 320rpx;
          height: 90rpx;
          background: #f6f8fd;
          border-radius: 10rpx;
          display: flex;
          align-items: center;
          // justify-content: center;
          padding-left: 16rpx;
          font-size: 28rpx;
          color: #333333;
          margin: 0 10rpx 16rpx 8rpx;
          border: 1rpx solid #f6f8fd;
          position: relative;
          overflow: hidden;

          .name {
            max-width: 60%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .icon {
            width: 70rpx;
            height: 70rpx;
            margin-right: 24rpx;
          }
        }

        .Aitem {
          border: 1rpx solid #165dff;
          color: #165dff;
        }

        .select {
          width: 34rpx;
          height: 34rpx;
          background-color: #165dff;
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 1;

          .checkbox {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }

        .select::after {
          content: '';
          width: 0px;
          height: 0px;
          border-left: 0rpx solid transparent;
          border-right: 38rpx solid transparent;
          border-top: 38rpx solid #f6f8fd;
          position: absolute;
          top: -2rpx;
          left: -2rpx;
        }
      }

      .cell {
        width: 100%;
        height: 98rpx;
        padding: 0 22rpx 0 35rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .cell-left {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
        }

        .cell-right {
          width: 50%;
          display: flex;
          justify-content: flex-end;

          .edit {
            display: flex;
            align-items: center;
            font-size: 22rpx;
            font-weight: 400;
            color: #666666;

            .select-v {
              width: 26rpx;
              height: 26rpx;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1rpx solid #666666;
              margin-right: 10rpx;
            }
          }

          .aEdit {
            color: #416cfa;

            .select-v {
              border: 1rpx solid #416cfa;
            }

            .select-v-icon {
              width: 14rpx;
              height: 14rpx;
              border-radius: 50%;
              background-color: #416cfa;
            }
          }

          .control {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 26rpx;
            font-weight: 400;
            color: #4f77fc;

            .icon-box {
              width: 26rpx;
              height: 26rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1rpx solid #4f77fc;
              border-radius: 50%;
              margin-right: 8rpx;
            }
          }

          .timbre {
            min-width: 138rpx;
            height: 47rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f6f8fd;
            padding: 0 10rpx;
            border-radius: 5rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: #666666;

            .info {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16rpx;
              font-weight: 400;
              color: #2d5aec;

              .icon {
                width: 37rpx;
                height: 37rpx;
                margin-right: 10rpx;
              }
            }
          }
        }

        .Industry {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 26rpx;
          font-weight: 400;
          color: #4f77fc;
          position: relative;

          .select-box {
            position: absolute;
            top: 50rpx;
            right: -20rpx;
            width: 210rpx;
            height: 141rpx;
            background: #ffffff;
            border-radius: 20rpx;
            box-shadow: 0rpx 0rpx 5rpx NaNrpx rgba(90, 90, 90, 0.06);
            z-index: 9999;

            .item {
              width: 209rpx;
              height: 68rpx;
              border-radius: 20rpx;
              font-size: 28rpx;
              font-weight: 400;
              color: #666666;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .active {
              color: #2281fe;
              background: #e9eeff;
            }
          }
        }
      }

      .cell-column {
        width: 100%;
        min-height: 98rpx;
        padding: 0 44rpx 30rpx 35rpx;
        box-sizing: border-box;

        .cell-title {
          font-size: 26rpx;
          font-weight: 400;
          color: #666666;
          margin-bottom: 18rpx;
        }

        :deep(.u-textarea) {
          min-height: 143rpx;
          background: #fafbff;
          border: 1rpx solid #f5f6fa !important;
          border-radius: 20rpx;

          .uni-textarea-textarea {
            font-size: 24rpx;
            font-weight: 400;
            color: #666666;
            line-height: 45rpx;
          }
        }
      }

      // 文本域样式
      .text-content {
        width: 100%;
        padding: 30rpx 25rpx;
        box-sizing: border-box;

        :deep(.u-textarea) {
          height: 469rpx;
          background: #fafbff;
          border: 1rpx solid #f5f6fa !important;
          border-radius: 20rpx;

          .uni-textarea-textarea {
            font-size: 24rpx;
            font-weight: 400;
            color: #666666;
            line-height: 45rpx;
          }
        }
      }
    }

    .tips-box {
      width: 100%;
      padding: 20rpx 40rpx;
      box-sizing: border-box;
      font-size: 24rpx;
      color: #999999;
      line-height: 40rpx;

      .t-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #2281fe;
        margin-bottom: 20rpx;
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
    padding: 0 58rpx;

    .btn {
      width: 400rpx;
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

    .countdown {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 47rpx;
        height: 48rpx;
        margin-bottom: 8rpx;
      }

      .icon1 {
        width: 55rpx;
        height: 46rpx;
        margin-bottom: 6rpx;
      }
    }
  }
}
</style>
