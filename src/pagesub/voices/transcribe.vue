<template>
	<view class="container content">
		<view class="txtBox">
			<u--textarea v-model="value1" placeholder="请输入内容" count height="616" maxlength="5000"></u--textarea>
			<view class="export">导入文档</view>
		</view>
		
		<view class="mediaBox"></view>
	</view>
</template>

<script setup>
	
	const value1 = ref('开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段')
	const list = ref([
		{
			id: 1,
			type: 1,
			name: '开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段'
		},
		{
			id: 2,
			type: 2,
			name: '开播第二段'
		},
		{
			id: 3,
			type: 2,
			name: '开播第三段'
		}
	])
	
	const show = ref(false)
	const content = ref('请确认删除该语音?')
	
	const delItem = item =>{
		show.value = true
	}
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const handleItem = item =>{
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				playDataId.value = null
			}else{
				playDataId.value = item.id
				// 播放
			}
		}
		
	}
	
	const ok = ()=>{
		show.value = false
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
	  
	  .txtBox{
		  width: 100%;
		  height: 616rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  .u-textarea{
		  		  padding-bottom: 50rpx !important;
		  }
		  .export{
			  background-color: #ffffff;
			  position: absolute;
			  font-size: 28rpx;
			  font-weight: bold;
			  color: #2281fe;
			  padding: 5rpx;
			  border-radius: 5rpx;
			  margin-top: -50rpx;
			  margin-left: 10rpx;
			  z-index: 99999;
		  }
	  }
	}
</style>