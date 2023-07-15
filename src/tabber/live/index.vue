<template>
	<view class="content">
		<view class="header">
			<text>火星AI无人直播</text>
		</view>
		<u-button type="primary" text="确定"></u-button>
		<u-swiper
			:list="swiperList"
			@click="click"
		></u-swiper>
	</view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/index'

const user = useUserStore()
const title = ref('')
const swiperList = ref(['https://cdn.uviewui.com/uview/swiper/swiper1.png',
                    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
                    'https://cdn.uviewui.com/uview/swiper/swiper3.png'])

onLoad(()=>{
	
})
onShow(()=>{
	console.log(111, user.token)
})

const click = ()=>{
	
}

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.header{
	display: flex;
	align-items: center;
	height: 68rpx;
}
</style>
