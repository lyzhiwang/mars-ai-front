import { useUserStore } from '@/stores'
export const goTo = url => {
	const user = useUserStore()
	if(user.isLogin){
		uni.navigateTo({url})
	}else{
		uni.showModal({
			title: '提示',
			content: '您还未登录，请先登录',
			success: function (res) {
				if (res.confirm) {
					uni.navigateTo({ url: '/pagesub/login/index' })
				}
			}
		})
	}
}