<template>
	<view class="createPage">
		<image src="/static/images/live/bg2.png" class="bg2"></image>
		<view class="contBox">
			<u-navbar title="创建新直播" bgColor="transparent" :titleStyle="{ 'color': '#fff', 'font-size': '36rpx' }" placeholder>
				<template #left><text></text></template>
			</u-navbar>
			<!-- 平台选择 -->
			<view class="fcc-sb platformArea">
				<view :class="['platform', { 'act': selectPlatform === item.id }]" v-for="item in platformList"
					@click="changePla(item.id, item.name)">
					<image class="icon" :src="item.icon"></image>
					<text class="name">{{ item.name }}</text>
				</view>
				<!-- <view class="platform">
				<text class="name">更多敬请期待></text>
			</view> -->
			</view>
			<u--form class="panel mt0" :model="form" :rules="rules" ref="urlForm" errorType="toast"
				v-if="![3, 5].includes(selectPlatform)">
				<image src="/static/images/live/title.png" class="title"></image>
				<!-- 抖音直播 -->
				<u-form-item prop="live_id">
					<view class="iptBox">
						<u--input v-model.trim="form.live_id" border="none" class="ipt" prefixIcon="search"
							:readonly="user.info.dy_id ? true : false" prefixIconStyle="font-size: 36rpx;color: #909399"
							:placeholder="`输入直播账号的${pltName}号`" v-if="selectPlatform === 1"></u--input>
						<u--input v-else v-model.trim="form.live_id" border="none" class="ipt" prefixIcon="search"
							prefixIconStyle="font-size: 36rpx;color: #909399" placeholder="请输入直播间的分享链接"
							:formatter="formatter"></u--input>
					</view>
					<text class="searchText mc" @click="searchLive">搜索</text>
				</u-form-item>
				<view class="liveName">直播间：<text>{{ title }}</text></view>
			</u--form>

			<view class="panel" v-if="selectPlatform === 1">
				<view class="flex between">
					<view class="lebel">AI智能回复</view>
					<u-switch v-model="is_coze" size="40" @change="chnageCoze"></u-switch>
				</view>
			</view>

			<view class="panel">
				<view class="flex between">
					<view class="lebel">选择语音库</view>
					<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add"
						@click="goTo('/pagesub/voices/taskStore?type=2')"></u-button>
				</view>
				<view class="selectItem" v-if="task.selectVoice">
					<image src="/static/images/live/ico-voice.png" class="voice" />
					<text>{{ task.selectVoice.title }}</text>
				</view>
			</view>

			<view class="panel shadow" v-if="!is_coze">
				<view class="flex between">
					<view class="lebel">选择智能回复</view>
					<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add"
						@click="goTo('/pagesub/voices/taskStore?type=3')"></u-button>
				</view>
				<view class="selectItem" v-if="task.selectReply">
					<image src="/static/images/live/ico-reply.png" class="voice" />
					<text>{{ task.selectReply.title }}</text>
				</view>
			</view>
			<view class="panel shadow">
				<template v-if="[1, 3, 4].includes(selectPlatform)">

					<view class="flex between mar20">
						<text class="h1">欢迎语</text>
						<view>
							<u-switch v-model="welcome" size="40"></u-switch>
						</view>
					</view>
					<view class="flex between">
						<view class="lebel">间隔时间</view>
						<view class="flex">
							<u-number-box v-model="welcome_interval" :min="30" :step="5" :disabled="!welcome" inputWidth="80"
								buttonSize="50" integer></u-number-box>&nbsp;秒
						</view>
					</view>
					<view class="flex1 mar-20">
						<text class="h1">自定义欢迎语</text>
						<view class="flex mt-10">
							<u--input placeholder="请输入前置文字" v-model="name_before" :maxlength="10" clearable></u--input>
						</view>
						<view class="flex mt-10 blue">某某(例:张三)</view>
						<view class="flex mt-10">
							<u--input placeholder="请输入后置文字" v-model="name_after" :maxlength="10" clearable></u--input>
						</view>
					</view>
				</template>
				<view class="flex between mar20">
					<text class="h1">自动报时</text>
					<view>
						<u-switch v-model="is_time" size="40"></u-switch>
					</view>
				</view>
				<view class="flex between">
					<view class="lebel">间隔时间</view>
					<view class="flex">
						<u-number-box v-model="open_time" :min="30" :step="5" :disabled="!is_time" inputWidth="80" buttonSize="50"
							integer></u-number-box>&nbsp;秒
					</view>
				</view>
				<view class="flex between mar-20" v-if="!is_coze">
					<text class="h1">自动回复</text>
					<view>
						<u-switch v-model="is_auto_answer" size="40"></u-switch>
					</view>
				</view>

				<view class="flex between mar-20" v-if="[1, 2].includes(selectPlatform)">
					<text class="h1">点赞感谢语</text>
					<view>
						<u-switch v-model="is_like" size="40"></u-switch>
					</view>
				</view>

				<view class="flex between mar-20" v-if="[1, 2].includes(selectPlatform)">
					<text class="h1">关注感谢语</text>
					<view>
						<u-switch v-model="is_social" size="40"></u-switch>
					</view>
				</view>

				<view class="flex between mar-20" v-if="[1, 2].includes(selectPlatform)">
					<text class="h1">礼物感谢语</text>
					<view>
						<u-switch v-model="is_gift" size="40"></u-switch>
					</view>
				</view>

				<view class="flex between mar-20">
					<text class="h1">自动关播</text>
					<view class="flex">
						<u-number-box v-model="close_time" :min="0" :step="5" inputWidth="80" buttonSize="50"
							integer></u-number-box>&nbsp;分
					</view>
				</view>
			</view>
			<view class="placeholder"></view>
			<view class="fixedArea">
				<u-button type="primary" text="确定" shape="circle" class="submit" @click="startLive"></u-button>
			</view>
		</view>

		<!-- 视频号登录弹窗 -->
		<u-popup :show="isSphShow" :round="10" mode="center" closeable :closeOnClickOverlay="false" @close="sphClose">
			<view class="qrBox">
				<view>请使用{{ selectPlatform === 3 ? '微信' : '小红书' }}扫码授权</view>
				<image :src="sph_data.qrcode_base64" v-if="isSphShow && selectPlatform === 3"
					style="width: 400rpx;height: 400rpx;">
				</image>
				<uqrcode ref="uqrcode" canvas-id="qrcode" :value="sph_data.url" :options="{ margin: 10 }" v-else></uqrcode>
				<u-button type="primary" text="我已授权" :loading="isCheck" loadingText="正在验证中" shape="circle" :disabled="isCheck"
					class="submit" @click="checkStatus" style="margin-top: 20rpx;" v-if="selectPlatform === 3"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
import { onPageScroll, onUnload, onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useTaskStore, useLiveStore, useUserStore } from '@/stores'
import { getLiveTit, createLiveRoom, getBot } from '@/api'
import { goTo } from '@/utils/helper'


const config = useConfigStore()
const task = useTaskStore()
const live = useLiveStore()
const user = useUserStore()
const urlForm = ref()
const form = reactive({
	live_id: null,
	live_url: '',
})
const title = ref('')
const welcome = ref(false) // 是否开启欢迎语
const welcome_interval = ref(30) // 欢迎的间隔时间
const is_gift = ref(false) // 是否开启礼物欢迎语
const is_auto_answer = ref(false) // 是否开启三分钟自动关键词回复
const is_like = ref(false) // 是否开启点赞欢迎语
const is_social = ref(false) // 是否开启关注欢迎语
const is_coze = ref(false) // 是否开启chat自动回复
const name_before = ref('欢迎') // 自定义欢迎语前置
const name_after = ref('进入直播间') // 自定义欢迎语后置
const is_time = ref(false) // 是否开启自动报时
const open_time = ref(180) // 自动报时的间隔时间
const close_time = ref(0) // 自动关播时间
const selectPlatform = ref(1) // 当前选择的直播平台
const pltName = ref('抖音')
const rules = reactive({
	live_id: [
		{
			required: true,
			message: '请输入直播账号的抖音号',
			trigger: ['blur', 'change'],
		},
		// {
		// 	validator: (rule, value, callback) => {
		// 		return uni.$u.test.url(value)
		// 	},
		// 	message: '请填写正确的直播地址',
		// 	trigger: ['blur', 'change'],
		// }
	]
})
const sphURL = 'http://123.56.68.226:4206'


onLoad(() => {
	getBot().then(res => {
		live.setBotInfo(res.data)
	})
	console.log('user', user.info.dy_id)
	if (user.info.dy_id) {
		form.live_id = user.info.dy_id
		form.live_url = ''
	}
})

onUnload(() => {
	if (timmer.value) clearInterval(timmer.value)
})

const isSphShow = ref(false) // 显示视频号登录弹窗
const platformList = [
	{ id: 1, name: '抖音', icon: '/static/images/live/dy.png' },
	{ id: 2, name: '快手', icon: '/static/images/live/ks.png' },
	{ id: 3, name: '视频号', icon: '/static/images/live/sph.png' },
	{ id: 4, name: '美团', icon: '/static/images/live/meituan.jpeg' },
	// {id: 5, name: '小红书', icon: '/static/images/live/xhs.png'}
]

// 知识库开启
const chnageCoze = e => {
	if (!live.bot_info.is_publish) {
		is_coze.value = false
		uni.$u.toast('请先配置发布知识库后开启!')
	}
}

const formatter = (value) => {
	// 过滤输入的汉字
	if (value.includes('http')) {
		// 使用正则表达式匹配字符串中的 URL
		const matches = value.match(/(https?:\/\/[^\s]+)/g);
		return (matches && matches.length > 0) ? matches[0] : '';
	} else {
		return value
	}
}
function changePla (id, name) {
	selectPlatform.value = id
	pltName.value = name
	form.live_id = null
	form.live_url = ''
	title.value = ''
}
function searchLive () {
	if (!form.live_id) {
		if (selectPlatform.value === 1) return uni.$u.toast('请输入正确的抖音号')
		else if (selectPlatform.value === 2) return uni.$u.toast('请输入快手直播间的分享链接')
	} else {
		if (selectPlatform.value === 1 && uni.$u.test.url(form.live_id)) return uni.$u.toast('请输入正确的抖音号')
	}
	let parame = { live_id: form.live_id }
	if (selectPlatform.value != 1) parame.type = selectPlatform.value
	getLiveTit(parame).then(res => {
		if (res && res.data) {
			title.value = res.data.title
			form.live_url = res.data.live_url
		}
	})
}

const sph_data = ref({})
// const uqrcode = ref(null)
function startLive () {
	if (![3, 5].includes(selectPlatform.value)) {
		if (!form.live_id || !form.live_url) return uni.$u.toast('请先根据提示填写直播间配置并搜索')
	}
	if (!task.selectVoice) return uni.$u.toast('请选择语音库')
	if (!task.selectReply && !is_coze.value) return uni.$u.toast('请选择回复')
	const parame = {
		voice_id: task.selectVoice.id,
		// answer_id: task.selectReply.id, 
		is_welcome: welcome.value,
		live_url: form.live_url,
		type: 1,
		platform: selectPlatform.value,
		is_gift: is_gift.value,
		is_like: is_like.value,
		is_coze: is_coze.value,
		is_social: is_social.value,
		is_auto_answer: is_auto_answer.value,
		name_before: name_before.value ? name_before.value : '欢迎',
		name_after: name_after.value ? name_after.value : '进入直播间',
		is_time: is_time.value,
		open_time: open_time.value,
		close_time: close_time.value,
	}
	if (!is_coze.value) {
		parame.answer_id = task.selectReply.id
	} else {
		parame.answer_id = 0
	}
	if (welcome.value) {
		parame.welcome_interval = welcome_interval.value
	}
	if (selectPlatform.value === 2) {
		// 快手处理链接
		const arr = parame.live_url.split('.com/')
		parame.live_url = arr[1]
	}
	if (![3, 5].includes(selectPlatform.value)) {
		console.log('parame', parame)
		createLiveRoom(parame).then(res => {
			if (res) {
				// 开始直播
				live.setTitle(title.value)
				uni.navigateBack()
				// uni.switchTab({url: '/tabber/live/index'})
			}
		})
	} else {
		if (selectPlatform.value === 5) {
			// 链接小红书
			uni.showLoading({ title: '加载中...' })
			live.globelMessage6((res) => {
				if (res.MessageType === "二维码" && res.Content) {
					uni.hideLoading()
					sph_data.value.url = res.Content
					isSphShow.value = true
				} else {
					uni.hideLoading()
				}
			})
		} else {
			// 获取视频号Session二维码
			getSphCode()
		}
	}
}

// 视频号获取二维码
async function getSphCode () {
	// 获取视频号Session
	const res = await uni.request({ url: sphURL + '/session/create', method: 'POST' })
	console.log('res', res.data.session_id)
	sph_session.value = res.data.session_id
	const value = await uni.request({ url: `${sphURL}/session/${sph_session.value}/login/qrcode` })
	sph_data.value = value.data.data
	sph_data.value.qrcode_base64 = `data:image/png;base64,${sph_data.value.qrcode_base64}`
	console.log('sph_data.value', sph_data.value)
	isSphShow.value = true
}

// 轮询视频号二维码授权
const timmer = ref(null)
const sph_cookie = ref(null)
const sph_session = ref(null)
const isCheck = ref(false)
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
					title.value = '视频号正在直播'
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

// 视频号开播
function begin_sph () {
	isSphShow.value = false
	const parame = {
		voice_id: task.selectVoice.id,
		answer_id: task.selectReply.id,
		is_welcome: welcome.value,
		live_url: sph_session.value,
		type: 1,
		platform: selectPlatform.value,
		is_gift: is_gift.value,
		is_like: is_like.value,
		is_social: is_social.value,
		is_auto_answer: is_auto_answer.value,
		name_before: name_before.value ? name_before.value : '欢迎',
		name_after: name_after.value ? name_after.value : '进入直播间',
		is_time: is_time.value,
		open_time: open_time.value,
		close_time: close_time.value,
		sph_session: sph_session.value
	}
	if (welcome.value) {
		parame.welcome_interval = welcome_interval.value
	}
	createLiveRoom(parame).then(res => {
		if (res) {
			// 开始直播
			live.setTitle(title.value)
			uni.setStorageSync('is_sph', true)
			uni.navigateBack()
		}
	})
}

function sphClose () {
	isSphShow.value = false
	isCheck.value = false
	if (timmer.value) clearInterval(timmer.value)
}

onBeforeUnmount(() => {
	if (task.selectVoice) task.setVoice(null)
	if (task.selectReply) task.setReply(null)
})
</script>

<style lang="scss" scoped>
.createPage {
	width: 100%;
	min-height: 100vh;

	.bg2 {
		width: 750rpx;
		height: 1127rpx;
	}
}

.contBox {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	padding: 0 20rpx;

	.platformArea {
		padding-top: 20rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.platform {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 49%;
		height: 96rpx;
		background: #ffffff;
		border-radius: 15rpx;
		transition: all 500ms;
		margin-bottom: 20rpx;

		.icon {
			width: 42rpx;
			height: 42rpx;
		}

		.name {
			font-size: 36rpx;
			color: #333333;
			margin-left: 6rpx;
		}

		&.act {
			border: 2rpx solid #1e64fe;
			box-shadow: -1rpx 2rpx 6rpx 0 rgba(0, 0, 0, 0.22);

			.name {
				color: #207efe;
				font-weight: bold;
			}
		}
	}

	.mt0 {
		margin-top: 0 !important;
	}

	.panel {
		width: 710rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 30rpx 0;
		position: relative;
		overflow: hidden;

		&.shadow {
			box-shadow: 0 0 8rpx 0 #e0e0e0;
		}

		.title {
			width: 125rpx;
			height: 31rpx;
		}

		.iptBox {
			width: 566rpx;
			height: 60rpx;
			border: 2rpx solid #2281FE;
			border-radius: 30rpx;
			padding: 0 20rpx 0 30rpx;
			position: relative;
			z-index: 2;
			margin: 30rpx 0 26rpx;
		}

		.ipt {
			width: 100%;
			height: 60rpx;
		}

		.searchText {
			font-size: 30rpx;
			padding-left: 14rpx;
			font-weight: 700;
			position: relative;
			z-index: 1;
		}

		.liveName {
			font-size: 30rpx;
			color: #333;
		}

		.icon-msg {
			position: absolute;
			bottom: -4rpx;
			right: -10rpx;
			width: 182rpx;
			height: 216rpx;
			z-index: 0;
		}

		.add {
			width: 134rpx;
			height: 44rpx;
			margin: 0;
		}

		.lebel {
			font-size: 32rpx;
		}

		.mar20 {
			margin-bottom: 20rpx;
		}

		.mar-20 {
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}

		.mt-10 {
			margin-top: 10rpx;
		}

		.blue {
			color: #1e64fe;
		}
	}

	.h1 {
		font-size: 36rpx;
		display: flex;
		align-items: center;
		font-weight: 700;
		color: #1e64fe;
	}

	.between {
		flex-direction: row !important;
		align-items: center;
		justify-content: space-between;
	}

	.fixedArea {
		box-sizing: content-box;
		height: 128rpx;
		width: 710rpx;
		padding-top: 40rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.placeholder {
		box-sizing: content-box;
		width: 710rpx;
		height: 168rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.submit {
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}

	.selectItem {
		min-height: 40px;
		background: #ffffff;
		border: 2rpx solid #2281fe;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #333;
		padding: 20rpx;

		.voice {
			width: 36rpx;
			height: 36rpx;
			margin-right: 8rpx;
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
</style>