<template>
	<view class="container content">
		<view class="list">
			<view class="item flex-rcc">
				<image class="lIcon" src="/static/images/voices/list-icon.png"></image>
				<view class="name">侧是是是萨达萨达撒</view>
				<image class="rIcon" src="/static/images/voices/select.png"></image>
			</view>
		</view>
		
		<view class="btn flex-rcc">确定添加</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  .list {
		   width: 100%;
		  .item{
			  width: 100%;
			  height: 100rpx;
			  background: #ffffff;
			  border-radius: 20rpx;
			  padding: 28rpx 16rpx;
			  margin-bottom: 18rpx;
			  .lIcon{
				  width: 40rpx;
				  height: 40rpx;
			  }
			  .name{
				  width: 80%;
				  padding: 0 20rpx;
			  }
			  .rIcon{
				  width: 32rpx;
				  height: 32rpx;
			  }
		  }
	  }
	  .btn{
		  width: 710rpx;
		  height: 88rpx;
		  background: #2281fe;
		  border-radius: 44rpx;
		  font-size: 36rpx;
		  color: #ffffff;
		  position: absolute;
		  bottom: 28rpx;
		  left: 20rpx;
	  }
	}
</style>