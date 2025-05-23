import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/index'

export const useUserStore = defineStore('user', {
	persist: {
	    enabled: true,
		detached: true, // 设置订阅与组件分离
	},
    state: () => {
		return {
			token: '',
			info: {
			    userId: '',
			    name: '',
			},
		}
    },
    getters: {
        isLogin: state => !!state.token,
    },
    actions: {
        setUserToken(str) {
            this.token = str
        },
        setUserInfo(info) {
            this.info = info
        },
        setLongLink(url){
            this.workman = url
        },
        logOut() {
            this.$reset()
        },
        async getUserInfo() {
            try {
                const res = await getUserInfo()
                this.setUserInfo(res.data)
				console.log(res.data);
                return res.data
            } catch (error) {
                throw error
            }
        },
    }
})