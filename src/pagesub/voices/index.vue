<template>
	<view class="container content">
		<view class="addBox flex-rcc" @click="toPath">
			<image src="/static/images/voices/add.png"></image> <text>添加新项目</text>
		</view>
		
		<view class="item flex-col flex-item-row-between" v-for="(item,index) in data" :key="index">
			<view class="delBox flex-rcc" @click="handleDel(item)">
				<image src="/static/images/voices/del.png"></image>
			</view>
			<view class="title flex flex-item-col-center">
				<view class="circle flex-rcc">{{index+1}}</view>
				<view class="titBox u-line-1">{{item.name}}</view>
			</view>
			<view class="des fcc-sb">
				已上传{{item.voices}}条语音 
				<u-icon name="arrow-right" size="36" color="#999999" bold></u-icon></view>
		</view>
		
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'

const data = ref([{
	name: '超级泰麻辣',
	voices: 10,
	id: 1
}])

const show = ref(false)
const content = ref('请确认删除该项目?')

onShow(()=>{
	console.log(11111111)
})

const toPath = ()=>{
	uni.navigateTo({
		url: '/pagesub/voices/add'
	})
}

// 删除
const handleDel = item =>{
	show.value = true
}

// 确认删除
const ok = ()=>{
	
}

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36rpx 20rpx;
  box-sizing: border-box;
  .addBox{
	  width: 100%;
	  height: 82rpx;
	  background: #ffffff;
	  border-radius: 10rpx;
	  font-size: 30rpx;
	  color: #333333;
	  margin-bottom: 30rpx;
	  image{
		  width: 40rpx;
		  height: 40rpx;
		  margin-right: 15rpx;
	  }
  }
  .item{
	  width: 100%;
	  min-height: 185rpx;
	  background: #ffffff;
	  border-radius: 20rpx;
	  padding: 26rpx 19rpx;
	  box-sizing: border-box;
	  position: relative;
	  margin-bottom: 24rpx;
	  .delBox{
		  width: 53rpx;
		  height: 53rpx;
		  background: #2281fe;
		  border-radius: 0px 20rpx 0px 20rpx;
		  image{
			  width: 27rpx;
			  height: 29rpx;
		  }
		  position: absolute;
		  top: 0;
		  right: 0;
	  }
	  .title{
		  font-size: 30rpx;
		  font-weight: bold;
		  color: #333333;
		  .titBox{
			width: 80%;  
		  }
		  .circle{
			  width: 40rpx;
			  height: 40rpx;
			  background: #f2faff;
			  border-radius: 50%;
			  font-size: 32rpx;
			  color: #2281fe;
			  font-weight: bold;
			  margin-right: 16rpx;
		  }
	  }
	  .des{
		  width: 100%;
		  height: 80rpx;
		  background: rgba(34,129,254,0.10);
		  border-radius: 10rpx;
		  font-size: 28rpx;
		  color: #333333;
		  padding: 0 24rpx;
		  box-sizing: border-box;
	  }
  }
}
</style>
