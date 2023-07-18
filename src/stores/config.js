import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
	persist: {
	    enabled: true,
		detached: true, // 设置订阅与组件分离
	},
	state: () => ({
		account: '',
		password: '',
		remeberPwd: false,
		statusBar: 24, // 状态栏的高度
	}),
	actions: {
		setRemeberPwd(val) {
		  this.remeberPwd = val
		},
		savePwd(form) {
		  this.password = form.password
		  this.account = form.account
		},
		setStatusBar(height){
			this.statusBar = height
		}
	}
})