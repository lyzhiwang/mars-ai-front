<template>
	<view class="container content">
		<!-- <view :style="{paddingTop: `${statusBarHeight}px`}"></view> -->
		<view class="logo flex-rcc">
			<image src="/static/logo.png"></image>
		</view>
		
		<view class="formBox">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form1">
				<u-form-item label="" prop="username">
					<u--input v-model="form.username" shape="circle" placeholder="请输入账号" class="inputBox inputBox1" clearable></u--input>
				</u-form-item>
				<u-form-item label="" prop="password">
					<u--input v-model="form.password" password shape="circle" placeholder="请输入密码" class="inputBox" clearable></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="tips" @click="show=true">卡密激活?</view>
		<u-button type="primary" size="large" text="立即登录" :disabled="isLoading" color="#2281FE" shape="circle" loadingText="登录中..." :loading="isLoading" @click="submitLogin"></u-button>
		
		<u-modal :show="show" title="卡密激活" showCancelButton @confirm="confirm" @cancel="cancel" confirmText="激活">
			<view class="slot-content">
				<u--input v-model.trim="code" placeholder="请输入卡密" clearable class="codeBox"></u--input>
			</view>
		</u-modal>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { login, activateCode } from '@/api'
	import { useUserStore } from '@/stores/index'
	
	const user = useUserStore()
	const show = ref(false)
	const code =ref('')
	const form = reactive({
		username: '',
		password: ''
	})
	const form1 = ref(null)
	const isLoading = ref(false)
	const rules = {
		'username': {
			type: 'string',
			required: true,
			message: '请填写姓名',
			trigger: ['blur', 'change']
		},
		'password': {
			type: 'string',
			required: true,
			message: '请输入密码',
			trigger: ['blur', 'change']
		},
	}
	onLoad(()=>{

	})
	
	const submitLogin = ()=>{
		form1.value.validate().then(res => {
			isLoading.value = true
			login(form).then(res=>{
				if(res&&res.data){
					user.setUserToken(res.data.token)
					uni.switchTab({url:'/tabber/index/index'})
				}
			}).finally(()=>isLoading.value = false)
		}).catch(errors => {
			uni.$u.toast('请填写正确的账号密码')
		})
	}
	
	const confirm = () =>{
		if(!code.value) return uni.$u.toast('请输入正确的卡密')
		activateCode({code: code.value}).then(res=>{
			if(res && res.data){
				const { username, pwd } = res.data;
				form.username = username;
				form.password = pwd;
				show.value = false
				code.value = null
			}
		})
	}
	
	const cancel = ()=>{
		show.value = false
		code.value = null
	}
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 252rpx 90rpx;
	  box-sizing: border-box;
	  background-color: #fff !important;
	  .logo{
		  width: 180rpx;
		  height: 180rpx;
		  background: #f0f6ff;
		  border-radius: 20rpx;
		  image{
			  width: 131rpx;
			  height: 123rpx;
		  }
	  }
	  .formBox{
		  width: 100%;
		  margin-top: 66rpx;
		  margin-bottom: 36rpx;
		  .inputBox{
			  height: 80rpx;
			  padding-left: 40rpx !important;
		  }
	  }
	  .tips{
		  font-size: 24rpx;
		  color: #2281FE;
		  text-decoration:underline;
		  margin-bottom: 36rpx;
	  }
	  .slot-content{
		  width: 100%;
		  padding: 40rpx;
	  }
	  .codeBox{
		  width: 100%;
		  padding: 20rpx !important;
	  }
	}
</style>