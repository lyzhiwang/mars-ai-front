<template>
<view class="page">
	<image src="/static/images/template/bg6.png" class="bg"></image>
	<view class="content">
		<!-- 顶部header -->
		<u-navbar bgColor="transparent" title="首页" titleStyle="font-size:36rpx;font-weight:bold;color:#333" :fixed="false">
			<template #left><text></text></template>
		</u-navbar>
		<!-- 轮播图插槽 -->
		<view class="swiperBox">
			<slot></slot>
		</view>
		<!-- 菜单按钮区 -->
		<view class="menuArea">
			<view class="menu m1 flex" @click="goTo('/pagesub/voices/index')">
				<image src="/static/images/template/sticker6_1.png" class="sticker"></image>
				<view>
					<view class="h3">AI语音库</view>
					<view class="desc">话术支持循环播放</view>
					<view class="btn">立即体验</view>
				</view>
				
			</view>
			<view class="menu m2 flex" @click="goTo('/pagesub/reply/list')">
				<image src="/static/images/template/sticker6_2.png" class="sticker"></image>
				<view>
					<view class="h3">智能回复库</view>
					<view class="desc">评论区关键词回复</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m3 flex" @click="goTo('/pagesub/store/tasks')">
				<image src="/static/images/template/sticker6_3.png" class="sticker"></image>
				<view>
					<view class="h3">话术库</view>
					<view class="desc">专业通用话术</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m4 flex" @click="goTo('/pagesub/ai/index')">
				<image src="/static/images/template/sticker6_4.png" class="sticker"></image>
				<view>
					<view class="h3">AI创作</view>
					<view class="desc">定制不同行业文案</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m5 flex" @click="goTo('/pagesub/common/voice')">
				<image src="/static/images/template/sticker6_5.png" class="sticker"></image>
				<view>
					<view class="h3">公共语音库</view>
					<view class="desc">专业通用语音</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m6 flex" @click="goTo('/pagesub/goods/index')">
				<image src="/static/images/template/sticker6_6.png" class="sticker"></image>
				<view>
					<view class="h3">商品库</view>
					<view class="desc">添加或修改商品</view>
					<view class="btn">立即体验</view>
				</view>
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
</script>

<style lang="scss" scoped>
.page{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding-bottom: 20rpx;
	position: relative;
	.bg{
		width: 750rpx;
		height: 380rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.content{
		position: relative;
		z-index: 2;
		width: 750rpx;
		.swiperBox{
			width: 710rpx;
			height: 360rpx;
			box-sizing: border-box;
			margin: 20rpx auto 32rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}
		.menuArea{
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx;
			justify-content: space-between;
		}
		.menu{
			width: 341rpx;
			height: 182rpx;
			border-radius: 20rpx;
			margin-bottom: 14rpx;
			margin-top: 56rpx;
		}
		
		.sticker{
			width: 149rpx;
			height: 208rpx;
			margin-top: -52rpx;
			// position: absolute;
			// right: 12rpx;
			// bottom: 6rpx;
		}
		.h3{
			color: #333333;
			font-size: 36rpx;
			font-weight: 700;
			margin-top: 22rpx;
		}
		.desc{
			color: #666666;
			font-size: 22rpx;
			margin: 10rpx 0;
		}
		.btn{
			width: 105rpx;
			height: 35rpx;
			border-radius: 17rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 18rpx;
		}
		
		.m1{
			background: linear-gradient(0deg,#f2f4ff 0%, #c9d8ff 100%);
			.h3,.desc{
				color: #4D51DF;
			}
			.btn{
				background: #4D51DF;
			}
		}
		.m2{
			background: linear-gradient(0deg,#fff5f3 0%, #ffddd6 100%);
			.h3,.desc{
				color: #FF5F4E;
			}
			.btn{
				background: #FF5F4E;
			}
		}
		.m3{
			background: linear-gradient(0deg,#eefaff 0%, #cdfaf2 100%);
			.h3,.desc{
				color: #32C9AA;
			}
			.btn{
				background: #32C9AA;
			}
		}
		.m4{
			background: linear-gradient(0deg,#f1fffb 0%, #b8f9ff 100%);
			.h3,.desc{
				color: #00C0D3;
			}
			.btn{
				background: #00C0D3;
			}
		}
		.m5{
			background: linear-gradient(0deg,#f2faff 0%, #c9dbff 100%);
			.h3,.desc{
				color: #3B71EC;
			}
			.btn{
				background: #3B71EC;
			}
		}
		.m6{
			background: linear-gradient(0deg,#fffaf2 0%, #ffebd6 100%);
			.h3,.desc{
				color: #FF8120;
			}
			.btn{
				background: #FF8120;
			}
		}
	}
}
</style>