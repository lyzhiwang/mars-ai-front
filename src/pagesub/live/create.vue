<template>
<view class="createPage">
	<image src="/static/images/live/bg2.png" class="bg2"></image>
	<view class="contBox">
		<!-- <view :style="{'height': `${config.statusBar}px`}"></view>-->
		<u-navbar 
			title="创建新直播" 
			bgColor="transparent" 
			:titleStyle="{'color':'#fff','font-size':'36rpx'}" 
			placeholder
		></u-navbar>
		<u--form
			class="panel"
			:model="form"
			:rules="rules"
			ref="form1"
			errorType="toast"
		>
			<image src="/static/images/live/title.png" class="title"></image>
			<u-form-item prop="url" borderBottom ref="item1">
				<view class="iptBox">
					<u--input 
						v-model="form.url" 
						border="none" 
						class="ipt"
						prefixIcon="search"
						prefixIconStyle="font-size: 36rpx;color: #909399"
						placeholder="输入直播间地址"
					></u--input>
				</view>
				<text class="searchText mc" @click="searchLive">搜索</text>
			</u-form-item>
			<view class="liveName">直播间：<text>XXXXXXXX</text></view>
			<image src="/static/images/live/icon-msg.png" class="icon-msg"></image>
		</u--form>
		<view class="panel">
			<view class="flex between">
				<view class="lebel">选择语音库</view>
				<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add"></u-button>
			</view>
			<view class="selectItem" v-for="i in 2">
				<image src="/static/images/live/ico-voice.png" class="voice"/>
				<text>开播第一段</text>
			</view>
		</view>
		<view class="panel shadow">
			<view class="flex between">
				<view class="lebel">选择智能回复</view>
				<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add"></u-button>
			</view>
			<view class="selectItem" v-for="i in 4">
				<image src="/static/images/live/ico-reply.png" class="voice"/>
				<text>回复第一段</text>
			</view>
		</view>
		<view class="placeholder"></view>
		<view class="fixedArea">
			<u-button type="primary" text="确定" shape="circle" class="submit"></u-button>
		</view>
	</view>
</view>
</template>

<script setup>
import { onPageScroll } from '@dcloudio/uni-app'
import { useConfigStore } from '@/stores'

const config = useConfigStore()
// const bgColor = ref('transparent')
const form = reactive({
	url: '',
})
const rules = reactive({
	url: {
		type: 'string',
		required: true,
		message: '请填写正确的直播地址',
		trigger: ['blur', 'change']
	}
})

// onPageScroll((e)=>{
// 	console.log(111, JSON.stringify(e))
// 	bgColor.value = e.scrollTop>10 ? '#519af8' :'transparent'
// })
function searchLive(){
	
}
</script>

<style lang="scss" scoped>
.createPage{
	width: 100%;
	min-height: 100vh;
	.bg2{
		width: 750rpx;
		height: 1127rpx;
	}
}
.contBox{
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	padding: 0 20rpx;
	.panel{
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
		&.shadow{
			box-shadow: 0 0 8rpx 0 #e0e0e0;
		}
		.title{
			width: 125rpx;
			height: 31rpx;
		}
		.iptBox{
			width: 566rpx;
			height: 60rpx;
			border: 2rpx solid #2281FE;
			border-radius: 30rpx;
			padding: 0 20rpx 0 30rpx;
			position: relative;
			z-index: 2;
			margin: 30rpx 0 26rpx;
		}
		.ipt{
			width: 100%;
			height: 60rpx;
		}
		.searchText{
			font-size: 30rpx;
			padding-left: 14rpx;
			font-weight: 700;
		}
		.liveName{
			font-size: 30rpx;
			color: #333;
		}
		.icon-msg{
			position: absolute;
			bottom: -4rpx;
			right: -10rpx;
			width: 182rpx;
			height: 216rpx;
		}
		.add{
			width: 134rpx;
			height: 44rpx;
			margin: 0;
		}
		.lebel{
			font-size: 32rpx;
		}
	}
	.between{
		flex-direction: row!important;
		align-items: center;
		justify-content: space-between;
	}
	.fixedArea{
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
	.placeholder{
		box-sizing: content-box;
		width: 710rpx;
		height: 168rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.submit{
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
	.selectItem{
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
		.voice{
			width: 36rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}
	}
}
</style>