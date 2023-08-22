<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useConfigStore } from '@/stores'
import { getAppVersion } from '@/api'
import { updateUseModal } from '@/utils/hotupdate'

const config = useConfigStore()
function checkVeision() {
	// 获取manifest.json 的信息 版本信息
	plus.runtime.getProperty(plus.runtime.appid, wgtinfo => {
		const { versionCode, version } = wgtinfo
		config.setAPPVersion(version)
		getAppVersion().then(res => {
			if(!res.data) return
			const { new_version, new_version_code, url, ishot } = res.data
			if(Number(versionCode) < Number(new_version_code)){
				// 检测新版本提示
				ishot
				? updateUseModal({
					title: '版本检查',
					contents: '有新版本更新',
					is_mandatory: true,
					url,
					platform: 'android',
					type: 'wgt'// 安装包类型
				})
				: uni.showModal({
					title: '版本检查',
					content: '检测到新版本，是否下载安装包？',
					confirmText: '下载',
					showCancel: false,
					success: res => {
						// 打开浏览器下载新版APP
						plus.runtime.openURL(url)
					}
				})
			}
		})
	});
}
onLaunch(()=>{
	const systemInfo = uni.getWindowInfo()
	config.setStatusBar(systemInfo.statusBarHeight)
})
onShow(()=>{
	checkVeision()
	// console.log('App Show')
})
onHide(()=>{
	// console.log('App Hide')
})
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-plus/index.scss";
</style>
