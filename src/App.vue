<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useConfigStore } from '@/stores'

const config = useConfigStore()

onLaunch(()=>{
	const systemInfo = uni.getWindowInfo()
	config.setStatusBar(systemInfo.statusBarHeight)
})
onShow(()=>{
	 console.log('App Show')
})
onHide(()=>{
	console.log('App Hide')
})
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-plus/index.scss";
</style>
