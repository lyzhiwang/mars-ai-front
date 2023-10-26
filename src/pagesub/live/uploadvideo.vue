<template>
<view class="page">
	<view class="panel">
		<view class="h2">直播视频上传</view>
		<u-upload
			:fileList="video"
			capture="album"
			@afterRead="videoAfterRead"
			@delete="deleteVideo"
			:maxCount="1"
			accept="video"
			width="128"
			height="128"
		></u-upload>
		<view class="tip">*建议上传横屏视频</view>
	</view>
	<view class="placeholder"></view>
	<view class="fixedArea">
		<u-button type="primary" text="确定" shape="circle" class="submit" @click="submit"></u-button>
	</view>
</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useLiveStore } from '@/stores';

const config = useConfigStore()
const live = useLiveStore()
const video = ref([])
onLoad((option)=>{
	config.getQnToken('video')
	if(live.liveRoomVideo){
		video.value[0] = live.liveRoomVideo
	}
})

async function videoAfterRead(event){
	const { file } = event
	video.value.push({
		...file,
		status: 'uploading',
		message: '上传中',
	});
	const {id, path} = await uploadFilePromise(file.url);
	if(path){
		video.value[0] = {...file, status: 'success', message: '', url: path, id}
	}
}
function deleteVideo(event){
	video.value = []
}
function uploadFilePromise(url){
	return new Promise((resolve, reject) => {
		let a = uni.uploadFile({
			url: 'https://upload-z1.qiniup.com',
			filePath: url,
			name: 'file',
			formData: {
				"token": config.qnToken,
				"x:type": 15,
			},
			success: (res) => {
				const data = JSON.parse(res.data)
				resolve(data.data);
			},
			fail: (err) => {
				reject(err)
			}
		});
	});
}
function submit(){
	if(video.value.length>0){
		live.setLiveRoomVideo(video.value[0])
		uni.navigateBack()
	}else{
		uni.$u.toast('您未上传直播视频，无法提交')
	}
}
</script>

<style lang="scss" scoped>
.page{
	min-height: 100vh;
	padding: 36rpx 20rpx;
	background: #f8f8f8;
	display: flex;
	flex-direction: column;
	align-items: center;
	.panel{
		width: 710rpx;
		min-height: 510rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 0 auto;
		padding: 34rpx 30rpx;
	}
	.h2{
		font-size: 28rpx;
		color: #333;
		line-height: 28rpx;
		margin-bottom: 16rpx;
	}
	.con{
		display: flex;
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
		background-color: #f8f8f8;
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
	.tip{
		font-size: 22rpx;
		color: #999999;
	}
}
</style>
