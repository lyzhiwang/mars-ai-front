<template>
<view class="page">
	<view class="panel">
		<view class="title">回复标题</view>
		<u--input placeholder="请输入标题" border="bottom" v-model="form.title"></u--input>
	</view>
	<view class="panel">
		<view class="title">关键字<text class="r">*关键字一行一个</text></view>
		<view class="iptBox" v-for="(item, i) in form.keyword" :key="i">
			<u--input placeholder="请输入关键字" border="none" v-model.trim="form.keyword[i]" class="ipt" readonly></u--input>
		</view>
		<view class="iptBox">
			<u--input 
				class="ipt"
				placeholder="请输入关键字" 
				border="none" 
				v-model.trim="iptword" 
				@blur="updateKeyword" 
				autoBlur
			></u--input>
		</view>
	</view>
	<u-button type="primary" text="确定添加" shape="circle" class="submit" @click="backToList"></u-button>
</view>
</template>

<script setup>
const form = reactive({
	title: '',
	keyword: [],
})
const iptword = ref('')

const redirect = url => uni.redirectTo({url})
function updateKeyword(val){
	if(val){
		iptword.value = ''
		form.keyword.push(val)
	}
}
function backToList(){
	console.log(1111, form)
	redirect('/pagesub/reply/list')
}
</script>

<style lang="scss" scoped>
.page{
	padding: 36rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
	.panel{
		width: 710rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 30rpx 0;
	}
	.title{
		font-size: 32rpx;
		font-weight: 700;
		color: #000;
		margin-bottom: 20rpx;
		.r{
			font-size: 22rpx;
			margin-left: 6rpx;
		}
	}
	.submit{
		margin-top: 100rpx;
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
	.iptBox{
		width: 640rpx;
		height: 80rpx;
		border: 2rpx solid #2281FE;
		border-radius: 10rpx;
		padding: 0 20rpx 0 30rpx;
		position: relative;
		z-index: 2;
		margin: 30rpx 0 26rpx;
	}
	.ipt{
		width: 100%;
		height: 80rpx;
	}
}
</style>