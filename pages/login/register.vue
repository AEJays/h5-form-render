<template>
	<view>
		<!-- 执法人员绑定页面 -->
		<view class="LoginBox" v-if="type === '2'">
			<view class="title">执法人员绑定绑定</view>
			<view class="inputBox">
				<image :src="iconList.inputEnforcement" class="e-Icon"></image>
				<input v-model="enforcementNumber" type="number" class="input enforcement" placeholder="请输入执法证件号" />
			</view>
			<button class="loginBtn" @click="register('EXECUTOR')">绑定</button>
		</view>
		<!-- 企业人员绑定页面 -->
		<view class="LoginBox" v-else-if="type === '4'">
			<view class="title">企业人员绑定绑定</view>
			<!-- 自动识别功能接口未接上 -->
			<!-- <c-lincense @getValue="lincenseValue"></c-lincense> -->
			<view class="inputBox">
				<image :src="iconList.inputCompany" class="e-Icon"></image>
				<input v-model="lincenseNo" type="number" class="input company" placeholder="请输入企业信用代码" />
			</view>
			<button class="loginBtn" @click="register('COMPANY')">绑定</button>
		</view>
		<!-- 街镇用户绑定页面 -->
		<view class="LoginBox" v-else-if="type === '3'">
			<view class="title">街镇人员绑定绑定</view>
			<!-- 自动识别功能接口未接上 -->
			<!-- <c-lincense @getValue="lincenseValue"></c-lincense> -->
			<view class="inputBox">
				<image :src="iconList.inputStreet" class="e-Icon"></image>
				<input v-model="deptId" type="number" class="input company" placeholder="请输入社区编号" />
			</view>
			<button class="loginBtn" @click="register('STREET')">绑定</button>
		</view>
		<view v-else>请检查用户类型是否正确！</view>
	</view>
</template>

<script>
	import dynamicPage from '../../components/dynamic-page/index.vue'
	import cLincense from '../../components/dynamic-form/custom/c-lincense.vue'
	import { globalConfig } from '@/config.js'
	export default {
		onLoad(e) {
			this.iconList = globalConfig.icon
			// console.log(this.iconList)
			let query = JSON.parse(decodeURIComponent(e.query))
			this.type = query.type
			this.userId = query.userId
			this.getTitle(this.type)
		},
		data() {
			return {
				type:"",
				enforcementNumber:null,
				lincenseNo:null,
				api:"https://api.uat.smallsaas.cn/api/u/bind",
				methods:"POST",
				data:{},
				iconList:{},
				deptId:null,
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
						type:Type,
						code:that.enforcementNumber,
						userId:that.userId
					}
				}else if(Type==="COMPANY"){
					that.data = {
						type:Type,
						code:that.lincenseNo,
						userId:that.userId
					}
				}else if(Type==="STREET"){
					that.data = {
						type:Type,
						deptId:that.deptId,//暂时为默认
						userId:that.userId
					}
				}

				uni.request({
					url:that.api,
					method:that.methods,
					data:that.data,
					complete(data) {
						if(data.data.code===200){
							if(data.data.data){
								uni.showLoading({
									title:"绑定成功，即将跳转"
								})
								uni.navigateTo({
									url:"/pages/login/login_register/enforcement_login?id="+that.type,
									success() {
										uni.hideLoading()
									},
									fail(err) {
										// console.log(err)
									}
								})
								// switch(that.type){
								// 	case '2':uni.reLaunch({
								// 		url:"/pages/Market-index/Market-index",
								// 		success() {
								// 			uni.hideLoading()
								// 		}
								// 	});break;
								// 	case '4':uni.reLaunch({
								// 		url:"/pages/companyHome/home",
								// 		success() {
								// 			uni.hideLoading()
								// 		}
								// 	});break;
								// 	case '3':uni.reLaunch({
								// 		url:"/pages/street/myhome",
								// 		success() {
								// 			uni.hideLoading()
								// 		}
								// 	});break;
								// }
							}
						}else{
							if(Type==="COMPANY"){
								uni.showModal({
									showCancel:false,
									content:data.data.message,
									confirmText:"录入企业",
									success(ModalConfirm) {
										if(ModalConfirm.confirm){
											uni.redirectTo({
												url:"/pages/login/addCompany"
											})
										}
									}
								})
							}else{
								uni.showModal({
									content:data.data.message,
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
							}
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
		height: 200px;
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
