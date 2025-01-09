<template>
	<view class="container content">
		<web-view :src="`/hybrid/html/upload.html?token=${encodeURIComponent(userStore.qnToken)}`" @onPostMessage="postMessage" @message="postMessage"></web-view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { useConfigStore } from '@/stores';
	import { createBotFile } from '@/api'
	
	const userStore = useConfigStore()
	let id = null, type = null;
	onLoad((option)=>{
		type = option.type
		id = option.id
		userStore.getQnToken('text/plain')
		console.log('encodeURIComponent(userStore.qnToken)', encodeURIComponent(userStore.qnToken))
	})
	
	const postMessage = (data)=>{
		uni.showLoading({title: '加载中...', mask: true})
		const { web_url, name } = data.detail.data[0]
		createBotFile({web_url, name}).then(res =>{
			uni.hideLoading()
			uni.showToast({title: '添加成功', icon: 'success', duration: 1500});
			setTimeout(uni.navigateBack, 1500)
		}).catch(e=>{
			uni.hideLoading()
			console.log('err',e)
		})
		
	}
	
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  .title{
		  width: 100%;
		  font-size: 36rpx;
		  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		  color: #212121;
	  }
	  .uploadBox{
		  width: 100%;
		  margin: 30rpx 0;
		  .upStyle{
			  width: 300rpx;
			  height: 100rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  image{
				  width: 58rpx;
				  height: 40rpx;
				  margin-right: 16rpx;
			  }
		  }
	  }
	  .name{
		  width: 100%;
		  height: 77rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  padding: 0 20rpx;
	  }
	  .btn{
		  width: 710rpx;
		  position: absolute;
		  bottom: 28rpx;
		  left: 20rpx;
	  }
	}
</style>