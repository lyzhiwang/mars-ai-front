<template>
<view class="page2">
	<template v-if="plist.length>0">
		<view class="panel" v-for="(item, i) in plist" :key="item.id">
			<!-- <view class="dele" @click="deleteItem(item)"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view> -->
			<view class="tit ell">直播店铺名称/抖音号</view>
			<view class="time">2023-10-21 12:02:12</view>
			<view class="flex-rcc enter" @click="goTo('/pagesub/live/detail?id='+1)">进入</view>
		</view>
		<u-loadmore v-if="plist.length>=size" :status="listStatus" fontSize="28rpx" iconSize="30rpx" line/>
	</template>
	<u-empty v-else mode="data" textSize="28"></u-empty>
</view>
</template>

<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { replyClassList, deleReplyClass } from '@/api'
import { goTo } from '@/utils/helper.js'

const plist = ref([1])
const listStatus = ref('loadmore')
let page = 1, last = 0;
const size = 20;

function deleteItem(item){
	const {id, title} = item
	uni.showModal({
		title: '提示',
		content: `是否确定删除当前回复项目(${title})?`,
		success: function (res) {
			if (res.confirm) {
				deleReplyClass(id).then(res=>{
					uni.showToast({title: '删除成功', icon: 'success', duration: 2000});
					queryList(true)
				})
			}
		}
	})
}
function queryList(init){
	replyClassList({page, size}).then(res=>{
		if(res&&res.data){
			const {list, total} = res.data
			plist.value = init ? list : plist.value.concat(list);
			last = Math.ceil(total/size)
			if(page >= last) listStatus.value = 'nomore';
		}
	})
}
onLoad(()=>queryList(true))
onReachBottom(()=>{
	if(page >= last) return;
	listStatus.value = 'loading'
	if(page < last){
		page++
		queryList()
	}
})
</script>

<style lang="scss" scoped>
.page2{
	padding: 2rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
	.panel{
		width: 710rpx;
		min-height: 135rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		position: relative;
		margin: 15rpx 0;
		.dele{
			position: absolute;
			right: 0;
			top: 0;
			width: 53rpx;
			height: 53rpx;
			background: #2281fe;
			border-radius: 0 20rpx 0 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.tit{
			font-size: 30rpx;
			font-weight: bold;
			color: #333333;
		}
		.time{
			font-size: 24rpx;
			color: #999999;
			margin-top: 24rpx;
		}
		.enter{
			width: 110rpx;
			height: 56rpx;
			background: #e8f2ff;
			border: 2rpx solid #1e64fe;
			border-radius: 28rpx;
			position: absolute;
			top: 50%;
			right: 30rpx;
			transform: translateY(-50%);
			font-size: 26rpx;
			color: #1e64fe;
		}
	}
}
</style>