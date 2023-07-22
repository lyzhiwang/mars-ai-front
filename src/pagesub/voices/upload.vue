<template>
	<view class="container content">
		<view class="title">上传音频</view>
		<view class="uploadBox">
			<!-- <u-upload
				accept="video"
				:fileList="fileList6"
				@afterRead="afterRead"
				@delete="deletePic"
				name="6"
				multiple
				:maxCount="1"
				width="300"
				height="100"
			> -->
				<view class="upStyle flex-rcc" @click="upLoad">
					<image src="/static/images/voices/audio.png"></image>
					上传音频
				</view>
			<!-- </u-upload> -->
		</view>
		<view class="name flex-rcc">
			<u--input
			    placeholder="请输入该音频名称"
			    border="none"
			    clearable
			  ></u--input>
		</view>
		
		<u-button type="primary" size="large" text="确定添加" color="#2281FE" shape="circle" @click="save" class="btn"></u-button>
	</view>
</template>

<script setup>
	
	const name = ref('')
	const fileList6 = ref([])
	
	const afterRead = () =>{
		
	}
	
	const deletePic = () =>{
		
	}
	
	const upLoad = () =>{
		// var environment = plus.android.importClass("android.os.Environment");
		// var sdRoot = environment.getExternalStorageDirectory();
		// var files = plus.android.invoke(sdRoot,"listFiles");
		// console.log('files', files)
		// console.log('uni', uni.canIUse('chooseVideo'))
		uni.chooseFile({
			success: function (res) {
				console.log(JSON.stringify(res.tempFilePaths));
			}
		});
	}
	
	const save = ()=>{
		
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