import { defineStore } from 'pinia'

export const useCloneStore = defineStore('clone', {
	state: () => ({
		upload_info: {},
	}),
	actions: {
		saveUploadInfo(data){
			console.log('data', data)
			this.upload_info = data
		}
	}
})