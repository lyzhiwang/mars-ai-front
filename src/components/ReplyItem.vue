<template>
<view :class="['panel',{'expand': !showMore}]">
	<view class="dele" @click="deleteItem"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view>
	<view class="fir">
		<view class="index">{{ index }}</view>
		<u--text text="超级泰麻辣烫" :lines="1" size="30rpx" bold color="#333"></u--text>
	</view>
	<view class="iptBox vcenter">
		<text class="keyword">{{data.keyword.join('/')}}</text>
	</view>
	<view class="iptBox between" v-for="(item, i) in list">
		<view class="vcenter">
			<u-icon name="play-circle-fill" size="50rpx" color="#1E64FE"></u-icon>&nbsp;
			<u--text text="录音名字11111111录音名字录音名字录音名字录音名字录音名字录音名字录音名字" :lines="1" size="28rpx" color="#333"></u--text>
		</view>
		<u-icon name="trash-fill" size="50rpx" color="#1E64FE" @click="delReplyVoice"></u-icon>
	</view>
	<view class="btnGroup" v-if="!showMore">
		<button class="btn">上传</button>
		<button class="btn">录制</button>
		<button class="btn" @click="goTo('/pagesub/reply/add')">添加关键字</button>
	</view>
	<view class="center expand" v-if="showMore" @click="toggleExt"><u-icon name="arrow-down" color="#999" size="32rpx"></u-icon>&nbsp;展开更多</view>
	<view class="center" v-else @click="toggleExt"><u-icon name="arrow-up" color="#999" size="32rpx"></u-icon>&nbsp;收起</view>
</view>
</template>

<script setup>
import { goTo } from '@/utils/helper.js'
const props = defineProps({
    data: {
        type: Object,
        require: true,
		default: {
			keyword: ['地址','在哪','真的','假的','的是根深蒂固山豆根但是'],
			replyVoice: [1,2,3,4]
		}
    },
	index:{
		type: Number,
		require: true,
	}
});

const showMore = ref(true)
const list = computed(()=>{
	return showMore.value ? props.data.replyVoice.slice(0,1) : props.data.replyVoice
})

function deleteItem(){
	
}
function delReplyVoice(){
	
}
function toggleExt(){
	showMore.value = !showMore.value
}
</script>

<style lang="scss" scoped>
.center{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #999;
}
.between{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.panel{
	width: 710rpx;
	min-height: 184rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx 30rpx 0;
	position: relative;
	margin: 15rpx 0;
	transition: all 1s;
	&.expand{
		height: auto!important;
		overflow: hidden;
	}
	.fir{
		display: flex;
		align-items: center;
	}
	.index{
		width: 40rpx;
		height: 40rpx;
		background: #f2faff;
		border-radius: 50%;
		color: #2281fe;
		font-size: 32rpx;
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 14rpx;
	}
	.dele{
		position: absolute;
		right: 0;
		top: 0;
		width: 53rpx;
		height: 53rpx;
		background: #2281fe;
		border-radius: 0 20rpx 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.iptBox{
		width: 640rpx;
		min-height: 80rpx;
		border: 2rpx solid #2281FE;
		border-radius: 10rpx;
		position: relative;
		z-index: 2;
		margin: 20rpx 0 0;
		padding: 20rpx;
		.keyword{
			line-height: 40rpx;
		}
	}
	.ipt{
		width: 100%;
		height: 80rpx;
	}
	.btnGroup{
		display: flex;
		justify-content: center;
		margin-top: 26rpx;
		.btn{
			height: 55rpx;
			background: #e8f2ff;
			border: 2rpx solid #2281fe;
			border-radius: 10rpx;
			font-size: 26rpx;
			color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 20rpx;
			&:after{
				border: 0;
			}
		}
	}
}
</style>