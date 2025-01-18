<template>
	<view class="container content">
		
		<template v-if="!bot_info">
			<view class="empty-list">
				<image src="/static/images/knowledge/knowledge.png" class="icon"></image>
				<view class="des">暂无知识库</view>
			</view>
			<view class="box-btn">
				<u-button type="primary" color="#2281FE" shape="circle" size="large" text="创建知识库" @click="create"></u-button>
			</view>
		</template>
		
		<template v-else>
			<view class="box-btn1">
				<view class="btn-b" v-if="list.length<5">
					<u-button type="primary" color="#2281FE" text="上传内容" @click="goTo('/pagesub/knowledge/add')"></u-button>
				</view>
				<view class="btn-b" v-if="ids.length">
					<u-button type="warning" text="一键更新" @click="updateFile"></u-button>
				</view>
				<view class="btn-b" v-if="list.length">
					<u-button type="success" text="发布知识库" @click="publish"></u-button>
				</view>
			</view>
			<view class="empty-list" v-if="list.length===0">
				<image src="/static/images/knowledge/knowledge.png" class="icon"></image>
				<view class="des">暂无知识库内容,请上传</view>
			</view>
			<view class="list-box" v-else>
				<view class="item u-flex" v-for="(item,index) in list" :key="index">
					<view class="tag u-flex u-flex-xy-center" v-if="['0','9'].includes(item.status)">{{Number(item.status) === 0? '待更新': '处理失败,请删除后重新上传!'}}</view>
					<view class="u-flex title" style="margin-left: 20rpx">
						{{item.name}}
					</view>
					<view class="btns">
						<!-- <view class="btn u-flex u-flex-xy-center" v-if="Number(item.status) === 0" @click="updateFile(item)">更新</view> -->
						<view  class="btn btn1 u-flex u-flex-xy-center" @click="delFile(item)">删除</view>
					</view>
				</view>
				<view class="tips">上传后请先更新,更新成功后发布即可生效!</view>
			</view>
		</template>
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
	import { onShow } from '@dcloudio/uni-app'
	import { getBot, createBot, fileList, fileProgress, fileDelete, updateBot } from '@/api/index.js'
	import { goTo } from '@/utils/helper.js'
	
	
	onShow(()=>{
		getBotInfo()
	})
	
	const show = ref(false)
	const content = ref('请确认删除该内容?')
	
	const bot_info = ref(null)
	// 获取智能体配置信息
	const getBotInfo = () =>{
		uni.showLoading({title: '加载中...', mask: true})
		getBot().then(res =>{
			bot_info.value = res.data
			uni.hideLoading()
			console.log('bot_info.value', bot_info.value)
			if(res.data) {
				// 请求上传列表
				getList()
			}
		}).catch(e =>{
			uni.hideLoading()
			console.log('err',e)
		})
	}
	
	
	// 创建智能体
	const create = () =>{
		uni.showLoading({title: '创建中...', mask: true})
		createBot().then(res =>{
			uni.hideLoading()
			getBotInfo()
			uni.showToast({title: '创建成功!'}) 
		}).catch(e =>{
			uni.hideLoading()
			console.log('err',e)
		})
	}
	
	// 文件列表
	const list = ref([])
	const getList = ()=>{
		fileList().then(res =>{
			list.value = res.data
			handleIds(list.value)
			console.log('list.value', list.value)
		})
	}
	
	const ids = ref([])
	const handleIds = list =>{
		ids.value = []
		list.map(v =>{
			if(Number(v.status) === 0) ids.value.push(v.document_id)
		})
	}
	
	// 更新上传文件
	const updateFile = () =>{
		uni.showLoading({title: '更新中...', mask: true})
		console.log('ids',ids.value)
		fileProgress({document_ids: ids.value}).then(res =>{
			uni.hideLoading()
			uni.showToast({title: '更新成功!'})
			getList()
		}).catch(e =>{
			uni.hideLoading()
			console.log('err',e)
		})
	}
	
	// 删除文件
	const currentId = ref([])
	const delFile = item =>{
		currentId.value = []
		currentId.value.push(item.document_id)
		show.value = true
	}
	
	
	// 确认删除
	const ok = ()=>{
		fileDelete({document_ids: currentId.value}).then(res=>{
			uni.showToast({title: '删除成功!',icon: 'success',duration: 2000});
			show.value = false
			const index = list.value.findIndex(v=> {return v.document_id===currentId.value[0]})
			if(index>-1) list.value.splice(index, 1)
		})
	}
	
	// 更新发布智能体
	const publish = () =>{
		uni.showLoading({title: '发布中...', mask: true})
		updateBot().then(res =>{
			uni.hideLoading()
			uni.showToast({title: '发布成功!',icon: 'success',duration: 2000});
		}).catch(e =>{
			uni.hideLoading()
			console.log('err',e)
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
		.u-flex{
			display: flex;
		}
		.u-flex-xy-center{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.box-btn{
			width: 100%;
			// padding: 108rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			.btn-b{
				width: 300rpx;
				padding: 30rpx;
				box-sizing: border-box;
			}
		}
		.box-btn1{
			width: 100%;
			display: flex;
			align-items: center;
			padding: 15rpx 0;
			.btn-b{
				margin-right: 30rpx;
			}
		}
	}
	.empty-list{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 146rpx 0;
		.icon{
			width: 360rpx;
			height: 290rpx;
		}
		.des{
			font-size: 28rpx;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: 400;
			color: #666666;
			margin-top: -70rpx;
		}
	}
	
	.list-box{
		width: 100%;
		.tips{
			margin-top: 15rpx;
			font-size: 26rpx;
			text-align: center;
			color: red;
			font-weight: bold;
		}
		.item{
			width: 100%;
			min-height: 120rpx;
			background: #ffffff;
			border-radius: 20rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			justify-content: space-between;
			align-items: center; 
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			position: relative;
			.title{
				width: 70%;
				white-space: nowrap;     /* 防止换行 */
				overflow: hidden;        /* 超出部分隐藏 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
			}
			.tag{
				height: 30rpx;
				font-size: 22rpx;
				padding: 4rpx 8rpx;
				font-weight: 400;
				color: #fff;
				background-color: #19BE6B;
				border-radius: 15rpx;
				position: absolute;
				top: 12rpx;
				left: 20rpx;
			}
			.btn{
				padding: 6rpx 22rpx;
				border-radius: 3rpx;
				font-size: 26rpx;
				font-weight: 400;
				background-color: #2281FE;
				color: #fff;
			}
			.btn1{
				margin-top: 5rpx;
				background-color: #F56C6C;
			}
			
		}
	}
</style>