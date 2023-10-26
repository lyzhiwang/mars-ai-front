<template>
	<component 
		:is="currentComponent" 
		:statusBar="config.statusBar"
		:app_name="config.app_name"
	>
		<u-swiper
			:list="swiperList"
			autoplay
			circular
			width="100%"
			height="100%"
		></u-swiper>
	</component>
</template>

<script setup>
import Template1 from '@/components/home/Template1'
import Template2 from '@/components/home/Template2'
import Template3 from '@/components/home/Template3'
import Template4 from '@/components/home/Template4'
import Template5 from '@/components/home/Template5'
import Template6 from '@/components/home/Template6'
import { onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useLiveStore } from '@/stores'
import { getBanner } from '@/api'

const config = useConfigStore()
const live = useLiveStore()
const swiperList = ref(['/static/images/voices/banner.png'])
const currentComponent = shallowRef(null)

function comingsoon(){
	uni.showToast({title: '暂未开放', icon: 'none'})
}
onLoad(()=>{
	const oem_id = import.meta.env.VITE_OEM_ID
	// 加载对应模板
	currentComponent.value = Template2
	getBanner({oem_id}).then(res=>{
		if(res && res.data && res.data.length>0){
			swiperList.value = res.data.map(item=>item.upload.full_path) 
		}
	})
})
</script>

<style lang="scss" scoped>

</style>
