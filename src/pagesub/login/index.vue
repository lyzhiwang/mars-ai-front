<template>
	<view class="container content">
		<!-- <view :style="{paddingTop: `${statusBarHeight}px`}"></view> -->
		<view class="logo flex-rcc">
			<image src="/static/logo.png"></image>
		</view>
		
		<view class="formBox">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form1">
				<u-form-item label="" prop="username">
					<u--input v-model="form.username" shape="circle" :type="isLogin? 'text': 'number'" placeholder="请输入手机号" :maxlength="11" class="inputBox inputBox1" clearable></u--input>
				</u-form-item>
				<u-form-item label="" prop="password">
					<u--input v-model="form.password" :type="isAct?'text':'password'" shape="circle" placeholder="请输入密码" class="inputBox" clearable></u--input>
				</u-form-item>
				<u-form-item label="" prop="activation_code" v-if="!isLogin">
					<u--input v-model="form.activation_code" shape="circle" placeholder="请输入卡密" class="inputBox inputBox1" clearable></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="tips" @click="isLogin=!isLogin">{{isLogin? '没有账号?去注册': '返回登录'}}</view>
		<u-button type="primary" size="large" :text="isLogin? '立即登录': '马上注册'" :disabled="isLoading" color="#2281FE" shape="circle" :loadingText="isLogin? '登录中...': '注册中...'" :loading="isLoading" @click="submitLogin"></u-button>
		
		<!-- <u-modal :show="show" title="卡密激活" showCancelButton @confirm="confirm" @cancel="cancel" confirmText="激活">
			<view class="slot-content">
				<u--input v-model.trim="code" placeholder="请输入卡密" clearable class="codeBox"></u--input>
			</view>
		</u-modal> -->
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { login, activateCode, register } from '@/api'
	import { useUserStore } from '@/stores/index'
	
	const user = useUserStore()
	const show = ref(false)
	const code =ref('')
	const form = reactive({
		username: '',
		password: '',
		activation_code: ''
	})
	const isLogin = ref(true) 
	const form1 = ref(null)
	const isLoading = ref(false)
	const isAct = ref(false)
	const rules = {
		'username': {
			type: 'number',
			required: true,
			// 自定义验证函数，见上说明
			validator: (rule, value, callback) => {
				// uni.$u.test.mobile()就是返回true或者false的
				if(isLogin.value){
					return value!=='';
				}else{
					return uni.$u.test.mobile(value);
				}	
			},
			message: '手机号码不正确',
			// 触发器可以同时用blur和change
			trigger: ['change','blur'],
		},
		'password': {
			type: 'string',
			required: true,
			message: '请输入密码',
			trigger: ['blur', 'change']
		},
		'activation_code': {
			type: 'string',
			required: true,
			message: '请输入卡密',
			trigger: ['blur', 'change']
		}
	}
	
	const submitLogin = ()=>{
		form1.value.validate().then(res => {
			isLoading.value = true
			if(isLogin.value){
				// 登录
				login(form).then(res=>{
					if(res&&res.data){
						user.setUserToken(res.data.token)
						uni.switchTab({url:'/tabber/index/index'})
					}
				}).finally(()=>isLoading.value = false)
			}else{
				register(form).then(res=>{
					if(res&&res.data){
						uni.$u.toast('注册成功,请登录!')
						isLogin.value = true
					}
				}).finally(()=>isLoading.value = false)
			}	
		}).catch(errors => {
			uni.$u.toast('请确认填写的信息正确,再进行操作!')
		})
	}
	
	// const confirm = () =>{
	// 	if(!code.value) return uni.$u.toast('请输入正确的卡密')
	// 	activateCode({code: code.value}).then(res=>{
	// 		if(res && res.data){
	// 			const { username, pwd } = res.data;
	// 			form.username = username;
	// 			form.password = pwd;
	// 			show.value = false
	// 			code.value = null
	// 			isAct.value = true
	// 			uni.$u.toast('请保存您的账号密码!')
	// 		}
	// 	})
	// }
	
	// const cancel = ()=>{
	// 	show.value = false
	// 	code.value = null
	// }
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
		  box-shadow: 0rpx 0rpx 10rpx rgba(205, 205, 205, 0.7);
		  image{
			  width: 100%;
			  height: 100%;
			  border-radius: 20rpx;
			  // border-radius: 50%;
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