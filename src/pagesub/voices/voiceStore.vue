<template>
	<view class="container content">
		<view class="listBox" v-if="list.length>0">
			<scroll-view :scroll-top="0" scroll-y="true" style="height: 90vh;" class="scrollBox">
				<u-swipe-action>
					<template v-for="(item,index) in list" :key="index">
						<u-swipe-action-item
						  :options="options1"
						  :name="index"
						  :threshold="100"
						  class="swiperItem"
						  @click="delItem(item)"
						>
						<view class="item flex-item-col-center" @click="handleItem(item)">
							<image :src="`/static/images/voices/${item.id === playDataId? 'pause': 'play'}.png`" class="sImage"></image>
							<view class="name u-line-1">{{item.title}}</view>
							
							<view class="delBox flex-rcc">
								<view class="iconBox flex-rcc" :class="{iconBox1: index<list.length-1}" @click.stop="changeSort(item,index, 1)" v-if="index>0">
									<u-icon name="arrow-upward" color="#2979ff" bold size="28"></u-icon>
								</view>
								<view class="iconBox flex-rcc" @click.stop="changeSort(item,index, 2)" v-if="index<list.length-1">
									<u-icon name="arrow-downward" color="#2979ff" bold size="28"></u-icon>
								</view>
								<!-- <image src="/static/images/voices/top.png" @click.stop="changeSort(item,index, 1)"></image>
								<image src="/static/images/voices/down.png" @click.stop="changeSort(item,index, 2)"></image> -->
							</view>
						</view>
						</u-swipe-action-item>
					</template>
				  </u-swipe-action>
			</scroll-view>
		</view>
		<u-empty v-else mode="data" text="暂无语音,请上传或录制!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		<view class="footterBox fcc-sb">
			<view class="btn flex-rcc" @click="toPath(`/pagesub/voices/upload?id=${id}`)">上传</view>
			<view class="btn btn2 flex-rcc" @click="toPath(`/pagesub/voices/transcribe?type=1&id=${id}`)">录制</view>
		</view>
		
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onHide } from '@dcloudio/uni-app'
	import { voiceReaIndex, voiceReaDestory, voiceRelationSort } from '@/api'
	import { useConfigStore } from '@/stores'
	
	const list = ref([])
	const config = useConfigStore()
	const options1=ref([{
                    text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
                }]) 
	
	const show = ref(false)
	const content = ref('请确认删除该语音?')
	const id = ref(null)
	onLoad((option)=>{
		config.getQnToken()
		id.value = option.id
		getList()
		innerAudioContext.onEnded(()=>{
			playDataId.value = null
		})
	})
	
	onShow(()=>{
		if(id.value){
			getList()
		}
	})
	
	// 获取语音库语音列表
	const getList =()=>{
		voiceReaIndex({voice_id: id.value}).then(res=>{
			list.value = res.data
		})
	}
	const currentId = ref(null)
	const delItem = item =>{
		currentId.value = item.id
		show.value = true
	}
	
	const changeSort = (item,index,type) =>{
		const length = list.value.length
		if(type===1){
			//向上
			if(index!==0){
				let temp = list.value[index]
				list.value[index] = list.value[index-1]
				list.value[index-1] = temp
				voiceRelationSort({id1: list.value[index].id, id2: list.value[index-1].id})
			}
		}else{
			if(index!==length-1){
				let temp = list.value[index]
				list.value[index] = list.value[index+1]
				list.value[index+1] = temp
				voiceRelationSort({id1: list.value[index].id, id2: list.value[index+1].id})
			}
		}
	}
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	
	const handleItem = item =>{
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
			innerAudioContext.src = item.upload.full_path;
			innerAudioContext.play();
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				innerAudioContext.stop();
				playDataId.value = null	
				
			}else{
				innerAudioContext.stop();
				playDataId.value = item.id
				innerAudioContext.src = item.upload.full_path;
				// 播放
				innerAudioContext.play();
			}
		}
		
	}
	
	const ok = ()=>{
		voiceReaDestory({id: currentId.value}).then(res=>{
			uni.showToast({title: '删除成功!',icon: 'success',duration: 2000});
			show.value = false
			getList()
			// const index = list.value.findIndex(v=> {return v.id===currentId.value})
			// if(index>-1) list.value.splice(index, 1)
		})
	}
	
	const toPath = url =>{
		uni.navigateTo({
			url
		})
	}
	
	onHide(()=>{
		playDataId.value = null
		innerAudioContext.stop()
	})
	
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  width: 100%;
	  height: 100vh;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  position: relative;
	  box-sizing: border-box;
	  .listBox{
		  width: 100%;
		  box-sizing: border-box;
		  .scrollBox{
			  padding-bottom: 50rpx;
			  background-color: #f9f9f9;
		  }
		  .swiperItem{
			  // border: 1px solid red;
			   margin-bottom: 20rpx;
			   border-radius: 20rpx;
		  }
		  .item{
			  width: 100%;
			  height: 100rpx;
			  font-size: 30rpx;
			  background: #ffffff;
			  color: #333333;
			  font-weight: bold;
			  padding: 0 18rpx;
			  position: relative;
			  .sImage{
				  width: 36rpx;
				  height: 36rpx;
				  margin-right: 22rpx;
			  }
			  .name{
				  width: 80%;
			  }
			  .delBox{
				  width: 18%;
				  height: 100%;
				  position: absolute;
				  top: 0;
				  right: 10rpx;
				  justify-content: flex-end;
				  .iconBox{
					  width: 50rpx;
					  height: 50rpx;
					  box-shadow: 0rpx 0rpx 5rpx #2281fe;
					  border-radius: 50%;
					  font-weight: bold;  
				  }
				  .iconBox1{
					  margin-right: 10rpx;
				  }
			  }
		  }
	  }
	  
	  
	  
	  .footterBox{
		  width: 100%;
		  min-height: 130rpx;
		  background: #ffffff;
		  position: absolute;
		  padding: 0 25rpx;
		  padding-bottom:30rpx;
		  bottom: 0 !important;
		  left: 0;
		  .btn{
			  width: 336rpx;
			  height: 98rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  font-size: 36rpx;
			  color: #333333;
		  }
		  .btn2{
			  background: #2281fe;
			  color: #ffffff;
		  }
	  }
	}
</style>