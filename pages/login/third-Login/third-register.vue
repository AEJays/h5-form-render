<template>
	<view>
		<!-- 执法人员绑定页面 -->
		<view class="LoginBox enf" v-if="type === '2'">
			<view class="title">执法人员绑定</view>
			<view class="inputBox">
				<image :src="iconList.inputEnforcement" class="e-Icon"></image>
				<input v-model="username" type="text" class="input enforcement" placeholder="请输入用户名" />
			</view>
			<view class="inputBox">
				<image :src="iconList.inputPassword" class="e-Icon"></image>
				<input v-model="password" type="password" class="input enforcement" placeholder="请输入密码" />
			</view>
			<button class="loginBtn" @click="register('EXECUTOR')">绑定</button>
		</view>
		<!-- 企业人员绑定页面 -->
		<view class="LoginBox company" v-else-if="type === '4'">
			<view class="title">企业人员绑定</view>
			<!-- 自动识别功能接口未接上 -->
			<!-- <c-lincense @getValue="lincenseValue"></c-lincense> -->
			<view class="inputBox">
				<image :src="iconList.inputCompany" class="e-Icon"></image>
				<input v-model="lincenseNo" type="text" class="input company" placeholder="请输入企业信用代码" />
			</view>
			<view class="inputBox">
				<image :src="iconList.inputPhone" class="e-Icon"></image>
				<input v-model="username" type="text" class="input company" placeholder="请输入手机号" />
			</view>
<!-- 			<view class="inputBox">
				<image :src="iconList.inputPassword" class="e-Icon"></image>
				<input v-model="password" type="password" class="input company" placeholder="请输入密码" />
			</view> -->
			<view style="display: flex;background-color: white;" class="loginBtn">
				<button @click="returnQy" style="background-color: #1A5EB5;color: white;">去企业备案库登记信息</button>
				<button @click="register('COMPANY')" style="background-color: #1A5EB5;color: white; flex: 1; margin-left: 10px;">绑定</button>
			</view>
		</view>
		<!-- 街镇用户绑定页面 -->
		<view class="LoginBox street" v-else-if="type === '3'">
			<view class="title">街镇人员绑定</view>
			<!-- 自动识别功能接口未接上 -->
			<!-- <c-lincense @getValue="lincenseValue"></c-lincense> -->
			<view class="inputBox">
				<image :src="iconList.inputStreet" class="e-Icon"></image>
				<input v-model="username" type="text" class="input company" placeholder="请输入用户名" />
			</view>
			<view class="inputBox">
				<image :src="iconList.inputPassword" class="e-Icon"></image>
				<input v-model="password" type="password" class="input company" placeholder="请输入密码" />
			</view>
			<button class="loginBtn" @click="register('STREET')">绑定</button>
		</view>
		<view v-else>请检查用户类型是否正确！</view>
	</view>
</template>

<script>
	import dynamicPage from '../../../components/dynamic-page/index.vue'
	import cLincense from '../../../components/dynamic-form/custom/c-lincense.vue'
	import { globalConfig } from '@/config.js'
	export default {
		onLoad(e) {
			this.iconList = globalConfig.icon
			// console.log(this.iconList)
			let query = JSON.parse(decodeURIComponent(e.query))
			// console.log(query)
			this.query = query
			this.type = query.type
			this.userId = query.userId
			this.getTitle(this.type)
			this.lincenseNo = this.$cache("YyzzCode")
		},
		data() {
			return {
				type:"",
				lincenseNo:null,
				api:`${globalConfig.loginEP}/admin/appuser/bindUser`,
				methods:"POST",
				data:{},
				query:"",
				iconList:{},
				deptId:null,
				username:null,
				password:null
			}
		},
		methods: {
			getTitle(e){
				switch(e){
					case "2":this.setTitle("执法人员绑定");break;
					case "4":this.setTitle("企业用户绑定");break;
					case "3":this.setTitle("街镇用户绑定");break;
				}
			},
			returnQy(){
				uni.navigateBack({
					delta:10,
					success(){
						uni.navigateTo({
							url:"/pages/login/addCompany"
						})
					}
				})
			},
			setTitle(e){
				// console.log(e)
				uni.setNavigationBarTitle({
					title:e
				})
			},
			lincenseValue(e){
				// console.log(e)
			},
			register(Type){
				let that = this;
				if(Type==="EXECUTOR"){
					that.data = {
						app:that.query.app,
						from:that.query.from,
						auth:that.query.auth,
						username:that.username,
						password:that.password,
						type:2,
					}
				}else if(Type==="COMPANY"){
					that.data = {
						type:4,
						licenceNo:that.lincenseNo,
						app:that.query.app,
						from:that.query.from,
						auth:that.query.auth,
						username:that.username,
						password:"hdty@2021",
					}
					uni.setStorageSync("isOneCompanyRegister",true)
				}else if(Type==="STREET"){
					that.data = {
						app:that.query.app,
						from:that.query.from,
						auth:that.query.auth,
						username:that.username,
						password:that.password,
						type:3,
					}
				}

				uni.request({
					url:that.api,
					method:that.methods,
					data:that.data,
					header:{
						"content-Type":"application/x-www-form-urlencoded"
					},
					complete(data) {
						// console.log(data.data.code)
						if(data.data.code===0){
							// if(data.data.data){
								uni.showLoading({
									title:"绑定成功"
								})
								uni.navigateTo({
									url:"/pages/login/third-Login/IsLogin?id="+that.type,
									success() {
										that.username=null
										that.password=null
										uni.hideLoading()
									},
									fail(err) {
										uni.showModal({
											title:data.data.msg,
											showCancel:false,
											confirmColor:"#FC1944"
										})
										// console.log(err)
									}
								})
							// 	switch(that.type){
							// 		case '2':uni.reLaunch({
							// 			url:"/pages/Market-index/Market-index",
							// 			success() {
							// 				uni.hideLoading()
							// 			}
							// 		});break;
							// 		case '4':uni.reLaunch({
							// 			url:"/pages/companyHome/home",
							// 			success() {
							// 				uni.hideLoading()
							// 			}
							// 		});break;
							// 		case '3':uni.reLaunch({
							// 			url:"/pages/street/myhome",
							// 			success() {
							// 				uni.hideLoading()
							// 			}
							// 		});break;
							// 	// }
							// }
						}else{
							// console.log(data)
							// if(Type==="COMPANY"){
							// 	uni.showModal({
							// 		showCancel:false,
							// 		content:data.message,
							// 		confirmText:"录入企业",
							// 		success(ModalConfirm) {
							// 			if(ModalConfirm.confirm){
							// 				uni.redirectTo({
							// 					url:"/pages/login/addCompany"
							// 				})
							// 			}
							// 		}
							// 	})
							// }else{
								uni.showModal({
									content:data.data.msg,
									cancelText:"更改角色",
									confirmText:"重新填写",
									success(MConfirm) {
										if(MConfirm.cancel){
											uni.navigateBack({
												delta:10
											})
										}
									}
								})
							// }
						}
					}
				})
			}
		},
		components: {
			dynamicPage,
			cLincense
		}
	}
</script>

<style lang="less">
	.LoginBox{
		margin: 10px;
		&.enf{
			height: 240px;
		}
		&.company{
			height: 240px;
		}
		&.street{
			height: 240px;
		}
		background-color: white;
		box-shadow: 0px 0px 5px #999;
		border-top-right-radius: 5px;
		border-top-left-radius: 5px;
		position: relative;
		.title{
			padding: 10px;
			font-weight: bolder;
			font-size: 14px;
			border-bottom: 1px dashed #999;

		}
		.loginBtn{
			background-color: #1A5EB5;
			color: white;
			width: 90%;
			flex: 1;
			position: absolute;
			bottom: 0px;
			left: 50%;
			transform: translate(-50%, -10px);
			bottom: 0;
			&:hover{
				opacity: .8;
			}
		}
	}
	.inputBox{
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #eee;
		.e-Icon{
			width: 30px;
			height: 30px;
			margin: 10px;
		}
		.input{
			height: 50px;
		}
	}
	
</style>
