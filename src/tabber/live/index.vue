<template>
<view class="livePage">
	<view class="bg"></view>
	<view class="container">
		<view class="panel">
			<button class="create" @click="goTo('/pagesub/live/create')">
				<image src="/static/images/live/collect.png" class="ion-crt"></image>
				创建新直播间
			</button>
			<view class="h1">
				<text>直播间</text>
				<image src="/static/images/live/living.png" class="status"></image>
			</view>
			<text class="name">直播间名称：超级泰麻辣烫</text>
			<view class="bottom">
				<text class="mc">直播中</text>
				<u-icon name="play-circle-fill" size="50rpx" color="#1E64FE"></u-icon>
				<text class="filename">这里是文件名称.xtx</text>
			</view>
		</view>
		<view class="panel">
			<view class="h1">
				<text>直播间</text>
				<image src="/static/images/live/reply.png" class="status"></image>
			</view>
			<view class="trying">
				<text>正在回复</text>
				<view class="replyBox">
					<u--input
						class="ipt"
						border="none"
						placeholder="暂无回复"
						v-model="replyCon"
						shape="circle"
						clearable
					></u--input>
				</view>
			</view>
			<view class="bottom">
				<text class="mc">语音回复</text>
				<u-icon name="pause-circle-fill" size="50rpx" color="#1E64FE"></u-icon>
				<text class="filename">这里是文件名称.xtx</text>
			</view>
		</view>
		<view class="panel">
			<view class="tit">直播间回复列表</view>
			<view class="li">
				<view class="state">未回复</view>
				<view class="quesion">店铺具体位置在哪？店铺具体位置在哪？店铺具体位置在哪？店铺具体位置在哪？店铺具体位置在哪？</view>
				<view class="btnGroup">
					<button type="default" class="btn reply"><image src="/static/images/live/msg.png" class="lIcon"></image>回复</button>
					<button type="default" class="btn collect"><image src="/static/images/live/collect.png" class="lIcon"></image>收录</button>
				</view>
			</view>
			<view class="li">
				<view class="state already">已回复</view>
				<view class="quesion">多店通用吗？</view>
				<view class="btnGroup">
					<button type="default" class="btn reply"><image src="/static/images/live/msg.png" class="lIcon"></image>回复</button>
					<button type="default" class="btn collect"><image src="/static/images/live/collect.png" class="lIcon"></image>收录</button>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/index'

const user = useUserStore()
const replyCon = ref('')

onLoad(()=>{
	
})
onShow(()=>{

})
const goTo = url => uni.navigateTo({url})
</script>

<style lang="scss" scoped>
.livePage{
	width: 100%;
	min-height: 100vh;
	position: relative;
	.bg{
		height: 100vh;
		background: linear-gradient(180deg,#1e64fe 0%, #f1f4ff 100%);
	}
	.container{
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		padding: 0 20rpx;
		width: 100%;
		overflow: hidden;
	}
	.panel{
		width: 710rpx;
		min-height: 250rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 30rpx 0;
		position: relative;
		.create{
			position: absolute;
			right: 22rpx;
			top: 20rpx;
			width: 235rpx;
			height: 60rpx;
			background: #1e64fe;
			border-radius: 30rpx;
			color: #fff;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.ion-crt{
				width: 30rpx;
				height: 26rpx;
			}
		}
		.h1{
			font-size: 36rpx;
			display: flex;
			align-items: center;
			font-weight: 700;
			color: #1e64fe;
		}
		.status{
			width: 166rpx;
			height: 31rpx;
			margin-left: 30rpx;
		}
		.trying{
			display: flex;
			align-items: center;
			.replyBox{
				width: 400rpx;
				height: 60rpx;
				margin-left: 13rpx;
				border: 2rpx solid #2281FE;
				border-radius: 30rpx;
				padding: 0 20rpx 0 30rpx;
			}
			.ipt{
				width: 100%;
				height: 60rpx;
			}
		}
		.bottom{
			display: flex;
			align-items: center;
			font-size: 30rpx;
			.mc{
				margin-right: 20rpx;
			}
			.filename{
				color: #666;
				margin-left: 20rpx;
			}
		}
		.tit{
			font-size: 36rpx;
			color: #333333;
			margin-bottom: 10rpx;
		}
		.li{
			width: 650rpx;
			// min-height: 150rpx;
			background: #e8f2ff;
			border-radius: 20rpx;
			margin: 10rpx 0;
			padding: 34rpx 20rpx 16rpx;
			position: relative;
			.state{
				width: 124rpx;
				height: 56rpx;
				line-height: 56rpx;
				background: #1e64fe;
				border-radius: 0px 20rpx 0px 20rpx;
				color: #ffffff;
				font-size: 26rpx;
				text-align: center;
				position: absolute;
				right: 0;
				top: 0;
				&.already{
					background: rgba(30,100,254,0.60);
				}
			}
			.quesion{
				font-size: 30rpx;
				color: #333333;
			}
			.btnGroup{
				display: flex;
				margin-top: 12px;
				justify-content: flex-end;
			}
			.btn{
				height: 55rpx;
				margin: 0 10rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 30rpx;
			}
			.lIcon{
				width: 30rpx;
				height: 30rpx;
			}
			.reply{
				border: 2rpx solid #1e64fe;
				color: #1e64fe;
				width: 136rpx;
			}
			.collect{
				background: #1e64fe;
				color: #fff;
				width: 132rpx;
			}
		}
	}
}
</style>
