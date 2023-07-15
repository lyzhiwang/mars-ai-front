<script>
export default {
  onLaunch: function () {
    console.log('App Launch', uni.$u.config.v)
	const systemInfo = uni.getWindowInfo()
	uni.setStorageSync('statusBarHeight', systemInfo.statusBarHeight);
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-plus/index.scss";
</style>
