<template>
	<view>
		<dynamic-page :API="api"></dynamic-page>
		<!-- 测试用解除绑定 -->
		<button @click="remove()">解除执法绑定</button>
		<button @click="removeQ()">解除企业绑定</button>
		<button @click="removeS()">解除街道绑定</button>
		<!-- 测试用的登录模块 -->
		<view
			class="LoginBox"
			v-if="checkout"
		>
		<view class="header">登录界面</view>
			<view class="inputBox">
				用户名:
				<input class="inputText" v-model="LoginData.username" placeholder="请输入用户名"/>
			</view>
			<view class="inputBox">
				密码:
			<input class="inputText" :type="pType" v-model="LoginData.password" placeholder="请输入密码"/>
			<checkbox style="float: right;" color="#2C405A" @click="changeType" :checkout="isCheckout">显示密码</checkbox>
			</view>
			<button @click="getToken" class="loginBtn">登录</button>
			<view class="Select" @click="checkoutSelect">没有用户？去绑定</view>
		</view>
		<view
					class="LoginBox"
					v-if="!checkout"
				>
				<view class="header">绑定界面</view>
					<view class="inputBox">
						用户名:
						<input class="inputText" v-model="registerData.username" placeholder="请输入用户名"/>
					</view>
					<view class="inputBox">
						密码:
					<input class="inputText" :type="pType" v-model="registerData.password" placeholder="请输入密码"/>
					<checkbox style="float: right;" color="#2C405A" @click="changeType" :checkout="isCheckout">显示密码</checkbox>
					</view>
					<button @click="register" class="loginBtn">绑定</button>
					<view class="Select" @click="checkoutSelect">已有用户？去登录</view>
			</view>
	</view>
	
</template>

<script>
	import dynamicPage from '../../components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	export default {
		data() {
			return {
				LoginData:{
					username:'',
					password:'',
					app:'public',
					from:5
				},
				registerData:{
					username:'',
					password:'',
					app:'public',
					from:5
				},
				api: globalConfig.formHost + '?id=130',
				focusVal:null,
				checkout:true,
				pType:"password",
				isCheckout:false
			}
		},
		methods: {
			// 测试用解除绑定模块
			remove(){
				uni.request({
					url:"https://api.uat.smallsaas.cn/api/u/bind/unbind",
					method:"POST",
					data:{
						"type":"EXECUTOR",
						"code":"B080060"
					},
					complete(res) {
						// console.log(res)
						if(res.data.data){
							uni.showToast({
								title:"解除绑定成功",
								duration:1000
							})
						}
					}
				})
			},
			removeQ(){
				uni.request({
					url:"https://api.uat.smallsaas.cn/api/u/bind/unbind",
					method:"POST",
					data:{
						"type":"COMPANY",
						"userId":"73"
					},
					complete(res) {
						// console.log(res)
						if(res.data.data){
							uni.showToast({
								title:"解除绑定成功",
								duration:1000
							})
						}
					}
				})
			},
			removeS(){
				uni.request({
					url:"https://api.uat.smallsaas.cn/api/u/bind/unbind",
					method:"POST",
					data:{
						"type":"STREET",
						"userId":"73"
					},
					complete(res) {
						// console.log(res)
						if(res.data.data){
							uni.showToast({
								title:"解除绑定成功",
								duration:1000
							})
						}
					}
				})
			},
			
			changeType(){
				this.isCheckout=!this.isCheckout
				if(this.isCheckout){
					this.pType="text"
				}else{
					this.pType="password"
				}
			},
			checkoutSelect(){
				this.checkout = !this.checkout
				this.LoginData.username=''
				this.LoginData.password=''
				this.registerData.username=''
				this.registerData.password=''
				this.isCheckout=false
				this.pType="password"
			},
			register(){
				uni.request({
					  // 请求路径
					  url: 'https://api.uat.smallsaas.cn/auth/appuser/register',
					  data: this.registerData,
					  header: {
						'content-type': 'application/x-www-form-urlencoded'
					  },
					  method: 'POST',
					  success(res){
					      // 请求成功后获取openid和session_key
					      if(res.data.code===0){
									uni.showModal({
										title:"绑定成功"
									})
								}else{
									uni.showModal({
										title:res.data.msg
									})
								}
					  },
					  fail(err) {
							uni.showModal({
								title:"绑定失败"
							})
					  }
				})
			},
			getToken(){
				uni.request({
				  // 请求路径
				  url: 'https://api.uat.smallsaas.cn/auth/oauth/form',
				  data: this.LoginData,
				  header: {
					'content-type': 'application/x-www-form-urlencoded'
				  },
				  method: 'POST',
				  success(res){
				      // 请求成功后获取openid和session_key
							let token;
							if(res.data.code===1){
								uni.showModal({
									title:res.data.msg
								})
							}else{
								uni.showModal({
									title:"登陆成功"
								})
							}
							// console.log(res.data)
							token = res.data.encryptedData
							uni.setStorageSync(globalConfig.tokenStorageKey,token)
				  },
			})
		}
		},
		components: {
			dynamicPage
		},
        //
        // onLoad() {
        //     // uni.navigateTo({
        //     //     url: '../test/form'
        //     // })
        // }
		// }
	}
</script>

<style lang="less">
	.LoginBox{
		background-color: white;
		border-radius: 10rpx;
		box-shadow: 0px 0px 5px #333333;
		.header{
			background-color: white;
			border-bottom: 1px solid #999;
			padding: 5px;
			text-align: center;
			font-weight: bolder;
		}
		.inputBox{
			width: 90%;
			height: auto;
			line-height: 30px;
			margin: 0 auto;
			// background-color: #efefef;
			border-bottom: 1px #999 solid;
			&:last-of-type{
				border-bottom: none;
			}
		}
		.loginBtn{
			background-color: #1A5EB5;
			color: white;
			width: 80%;
			margin: 50rpx auto;
		}
		.Select{
			color: #1A5EB5;
			width: 100%;
			text-align: right;
			margin-right: 10rpx;
			margin-bottom: 10r px;
		}
	}
</style>
