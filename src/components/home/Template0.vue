<template>
	<view class="container">
		<image src="/static/images/template0/top_bg.png" class="top_bg"></image>
	
		<view class="content">
			<view :style="{marginTop: `${statusBar}px`}">
			</view>
			<view class="swiperBox">
				<slot></slot>
			</view>
			
			<view class="to_live">
				<view class="btn-box" @click="toLive">
					<image src="/static/images/template0/kb_btn1.png" class="bg-btn"></image>
					<view class="b-box">
						<image src="/static/images/template0/kb_btn2.png" class="tv"></image>
						<view class="des">
							<text class="name">一键开播</text>
							<text class="sub">一键开启AI直播</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="menus flex" >
				
				<view class="voiceBox" @click="goTo('/pagesub/voices/index')">
					<image src="/static/images/template0/mb_1.png"></image>
					<image src="/static/images/template0/m_1.png" class="icon1"></image>
					<view class="i_box">
						<view class="name">AI语音库</view>
						<view class="sub">话术循环播放</view>
						<image src="/static/images/template0/m_1_1.png" class="play"></image>
						<view class="m_btn">立即体验</view>
					</view>
				</view>
				
				<view class="flex-cc fcc-sb">
					<view class="r-box" @click="goTo('/pagesub/ai/index')">
						<image src="/static/images/template0/mb_2.png"></image>
						<image src="/static/images/template0/m_2.png" class="icon2"></image>
						<view class="i_box i_box1">
							<view class="name">AI创作</view>
							<view class="sub">定制不同行业文案</view>
						</view>
					</view>
					<view class="r-box" @click="goTo('/pagesub/mine/index')">
						<image src="/static/images/template0/mb_2.png"></image>
						<image src="/static/images/template0/m_3.png" class="icon3"></image>
						<view class="i_box i_box1">
							<view class="name">声音克隆</view>
							<view class="sub">打造个性化声音</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="ct-box">
				<view class="box2" @click="goTo('/pagesub/store/tasks')">
					<image src="/static/images/template0/m_4.png" style="width: 128rpx;height: 148rpx;margin-top: 6rpx;"></image>
					<view class="i_box">
						<view class="name">话术库</view>
						<view class="sub">专业通用话术</view>
					</view>
				</view>
				<view class="box2" @click="goTo('/pagesub/goods/index')">
					<image src="/static/images/template0/m_5.png" style="width: 141rpx;height: 142rpx; margin-top: 10rpx;"></image>
					<view class="i_box">
						<view class="name">商品库</view>
						<view class="sub">添加或修改商品</view>
					</view>
				</view>
				<view class="box2" @click="goTo('/pagesub/knowledge/index')">
					<image src="/static/images/template0/m_6.png" style="width: 118rpx;height: 141rpx; margin-top: 10rpx;"></image>
					<view class="i_box">
						<view class="name">知识库</view>
						<view class="sub">专业知识库</view>
					</view>
				</view>
			</view>
			
			<view class="ct-box">
				<view class="box3" @click="goTo('/pagesub/reply/list')">
					<view class="i_box">
						<view class="name">智能回复库</view>
						<view class="sub">关键词回复</view>
					</view>
					<image src="/static/images/template0/m_7.png" class="m7" style="width: 154rpx;height: 143rpx;"></image>
				</view>
				
				<view class="box3" @click="goTo('/pagesub/common/voice')">
					<view class="i_box">
						<view class="name">公共语音库</view>
						<view class="sub">专业通用语音</view>
					</view>
					<image src="/static/images/template0/m_8.png" class="m8" style="width: 129rpx;height: 134rpx;"></image>
				</view>
			</view>
			
		</view>
		</view>
</template>

<script setup>
import { goTo } from '@/utils/helper.js'
const props = defineProps({
    statusBar: {
        type: Number,
        require: true,
    },
	app_name: {
		type: String,
		require: true,
	}
});

const toLive = () =>{
	uni.switchTab({
		url: '/tabber/live/type'
	})
}
</script>

<style lang="scss" scoped>
.container{
	width: 100%;
	height: calc(100% - var(--tab-bar-height) - env(safe-area-inset-bottom));
	background-color: #d1f1ff;
	position: relative;
	.top_bg{
		width: 100%;
		height: 526rpx;
	}
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0rpx 20rpx 20rpx 20rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.swiperBox{
	width: 100%;
	height: 360rpx;
	box-sizing: border-box;
	margin-top: 30rpx;
}

.to_live{
	width: 100%;
	display: flex;
	padding: 30rpx 67rpx;
	box-sizing: border-box;
	.btn-box{
		width: 100%;
		height: 163rpx;
		position: relative;
		.bg-btn{
			width: 100%;
			height: 100%;
		}
		.b-box{
			width: 100%;
			height: 163rpx;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: -8rpx;
			.des{
				display: flex;
				flex-direction: column;
			}
			.tv{
				width: 75rpx;
				height: 71rpx;
				margin-right: 19rpx;
			}
			.name{
				font-size: 42rpx;
				font-weight: bold;
				font-style: italic;
				text-align: left;
				color: #ffffff;
				line-height: 51rpx;
				letter-spacing: 4.2rpx;
			}
			.sub{
				font-size: 18rpx;
				font-weight: 400;
				color: #ffffff;
				letter-spacing: 1.8rpx;
			}
		}
	}
}


.menus{
	width: 100%;
	// padding: 0 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	image{
		width: 100%;
		height: 100%;
	}
	.voiceBox{
		width: 343rpx;
		height: 321rpx;
		position: relative;
		.icon1{
			width: 208rpx;
			height: 225rpx;
			position: absolute;
			top: -8rpx;
			right: -11rpx;
		}
	}
	.i_box{
		top: 51rpx;
		left: 28rpx;
		position: absolute;
		
		.name{
			font-size: 30rpx;
			font-weight: 700;
			color: #333333;
		}
		.sub{
			font-size: 22rpx;
			font-weight: 400;
			color: #666666;
			margin-top: 16rpx;
		}
		.play{
			width: 49rpx;
			height: 48rpx;
			margin-top: 26rpx;
		}
		.m_btn{
			width: 135rpx;
			height: 43rpx;
			background: #ffffff;
			border: 1rpx solid #4886ff;
			border-radius: 21rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 22rpx;
			font-weight: 400;
			color: #4886ff;
			margin-top: 30rpx;
		}
	}
	.i_box1{
		top: 32rpx;
		left: 27rpx;
		position: absolute;
	}
	.r-box{
		width: 342rpx;
		height: 149rpx;
		position: relative;
		.icon2{
			width: 179rpx;
			height: 171rpx;
			position: absolute;
			top: -31rpx;
			right: -8rpx;
		}
		.icon3{
			width: 148rpx;
			height: 160rpx;
			position: absolute;
			top: -13rpx;
			right: 12rpx;
		}
	}
}

.ct-box{
	width: 100%;
	display: flex;
	justify-content: space-around;
	margin: 24rpx 0;
	.box2{
		width: 222rpx;
		height: 249rpx;
		background: #ffffff;
		border-radius: 25rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.i_box{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.name{
				font-size: 30rpx;
				font-weight: 700;
				color: #333333;
			}
			.sub{
				margin-top: 10rpx;
				font-size: 22rpx;
				font-weight: 400;
				color: #666666;
			}
		}
	}
	.box3{
		width: 340rpx;
		height: 160rpx;
		background: #ffffff;
		border-radius: 25rpx;
		display: flex;
		position: relative;
		.i_box{
			margin-top: 28rpx;
			margin-left: 32rpx;
		}
		.name{
			font-size: 30rpx;
			font-weight: 700;
			color: #333333;
		}
		.sub{
			margin-top: 10rpx;
			font-size: 22rpx;
			font-weight: 400;
			color: #666666;
		}
		.m7{
			position: absolute;
			top: 11rpx;
			right: 5rpx;
		}
		.m8{
			position: absolute;
			top: 6rpx;
			right: 18rpx;
		}
	}
	
}
.menus1{
	margin-top: 23rpx;
	
}
</style>