<template>
	<view class="container content">
		<view class="box">
			<view class="title">新项目名称</view>
			<u--input
			    placeholder="请输入项目名称"
				v-model="name"
			    border="bottom"
			    clearable
			  ></u--input>
		</view>
		
		<u-button type="primary" shape="circle" size="large" text="确定添加" @click="add"></u-button>
	</view>
</template>

<script setup>
	const customStyle = {
		fontSize: '18px'
	}
	
	const name = ref('测试名称')
	
	const add = ()=>{
		if(!name.value) return uni.showToast({title: '项目名称不能为空!',icon: 'none',duration: 2000});
		uni.navigateTo({
			url: '/pagesub/voices/voiceStore'
		})
		
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		.box{
			width: 100%;
			padding: 34rpx 40rpx;
			box-sizing: border-box;
			background: #ffffff;
			margin-bottom: 122rpx;
			.title{
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
		}
		.btn{
			font-size: 18px;
			color: red;
			height: 88rpx;
		}
	}
</style>