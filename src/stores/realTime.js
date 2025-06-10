import { defineStore } from 'pinia'

export const useRealTimeStore = defineStore('clone', {
	state: () => ({
		type: null,
	}),
	actions: {
		setType(value){
			this.type = value
		}
	}
})