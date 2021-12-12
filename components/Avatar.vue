<template>
	<view>
		<view class="AvatarCard" v-if="theme==='enforcement'||theme==='company'">
			<view class="avatar_Box">
				<image :src="list.avatar||icon.avatarMy" v-if="list.avatar||icon.avatarMy" class="avatar"></image>
				<view class="unBind" @click="unbinding">解绑</view>
			</view>
			<view class="title_Box" v-if="theme==='enforcement'">
				<view class="row"><span class="title">姓名:</span>{{list.nickName||list.username||'-'}}</view>
				<view class="row"><span class="title">证号:</span>{{getCode(theme)||'-'}}</view>
			</view>
			<view class="title_Box" v-if="theme==='company'">
				<view class="row"><span class="title">公司名称:</span>{{companyList.name||'-'}}</view>
				<view class="row"><span class="title">企业信用代码:</span>{{companyList.licenceNo||'-'}}</view>
			</view>
			<image :src="icon.qrcode" @click="changeQrCode" v-if="theme==='company'" mode="aspectFit" class="qr_icon"></image>
			<view v-if="theme==='company'" v-show="isShowQrCode" class="qrcode_box">
				<ayQrcode ref="qrcode" :modal="modal_qr" :url="url" @hideQrcode="hideQrcode" :height="200" :width="200"
				/>
				<text style="text-align: center;font-weight: bolder;">长按二维码保存</text>
			</view>
			<image :src="icon.notice" @click="getNotice()" mode="aspectFit" class="notice"></image>
		</view>
		<view class="AvatarCard" v-if="theme==='street'" style="flex-direction: column;align-items: center;">
			<view class="avatar_Box">
				<image :src="list.avatar||icon.avatarMy" v-if="list.avatar||icon.avatarMy" class="avatar"></image>
				<view class="unBind" @click="unbinding">解绑</view>
			</view>
			<view class="title_Box">
				<view class="row"><span class="title">{{list.nickName||list.username||'-'}}</span></view>
			</view>
			<image :src="icon.notice" @click="getNotice()" mode="aspectFit" class="notice"></image>
		</view>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	import card from './other/Card.vue'
	import ayQrcode from "@/components/ay-qrcode/ay-qrcode.vue"
	export default {
		name:"Avatar",
		data() {
			return {
				icon:{},
				list:{},
				companyList:{},
				code:'',
				modal_qr: false,
				url:null,
				isShowQrCode:false
			};
		},
		components:{
			ayQrcode,
			card
		},
		props:{
			item:{
				type:Object
			},
			theme:String
		},
		mounted() {
			// console.log(this.theme)
			if(this.theme==="company"){
				// console.log(this.companyList)
				this.companyList = globalConfig.companyInfo
				this.getQrUrl()
				// console.log("list",this.list)
			}
		},
		methods:{
			// 二维码操作
			// 展示二维码
			showQrcode() {
				let _this = this;
				this.modal_qr = true;
				// uni.showLoading()
				setTimeout(function() {
					// uni.hideLoading()
					_this.$refs.qrcode.crtQrCode()
				}, 50)
			},
			changeQrCode(){
				this.isShowQrCode = !this.isShowQrCode
			},
			//传入组件的方法
			hideQrcode() {
				this.modal_qr = false;
			},
			// 二维码地址
			getQrUrl(){
				this.url = `${globalConfig.workflowEP}/api.webapp/invQrCode/${this.companyList.licenceNo}/Mes`
				// console.log(this.url)
				if(this.url){
					this.showQrcode();//一加载生成二维码
				}
			},
			
			getNotice(){
				uni.navigateTo({
					url:"/pages/notice"
				})
			},
			getCode(item){
				let that = this;
				if(item==="enforcement"){
					uni.request({
						url:`${globalConfig.loginEP}/admin/user/info`,
						method:"GET",
						header:{
								Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
						},
						success(res) {
							// console.log(res.data.data.sysUser.personNo)
							that.code = res.data.data.sysUser.personNo
						}
					})
				}else if(item==="company"){
					uni.request({
						url:`${globalConfig.loginEP}/admin/user/info`,
						method:"GET",
						header:{
								Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
						},
						success(res) {
							// console.log(res.data.data.sysUser.personNo)
							that.code = res.data.data.sysUser.personNo
						}
					})
				}else{
					
				}
				return this.code
			},
			unbinding(){
				let that = this
				if(this.theme==="company"){
					uni.request({
						url:`${globalConfig.loginEP}/admin/systhirdpartyuser/unbindUser`,
						method:"PUT",
						header:{
								Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
						},
						success(e) {
							// console.log(e)
							if(e.data.data===true){
								uni.showLoading({
									content:"解绑成功",
									showCancel:false
								})
								setTimeout(()=>{
									uni.reLaunch({
										url:"/pages/login/third-Login/third-Login",
										success() {
											uni.hideLoading()
											that.$loginDefault()//登录默认用户
										}
									})
								},2000)
							}
						}
					})
				}else{
					uni.request({
						url:`${globalConfig.loginEP}/admin/systhirdpartyuser/unbindUser`,
						method:"PUT",
						header:{
								Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
						},
						success(e) {
							// console.log(e)
							if(e.data.data===true){
								uni.showLoading({
									content:"解绑成功",
									showCancel:false
								})
								setTimeout(()=>{
									uni.reLaunch({
										url:"/pages/login/third-Login/third-Login",
										success() {
											uni.hideLoading()
											that.$loginDefault()//登录默认用户
										}
									})
								},2000)
							}
						}
					})	
				}
			}
		},
		created() {
			
			if(this.item){
				this.list=this.item
			}else{
				this.list = uni.getStorageSync(globalConfig.userInfo)
				// console.log(this.list)
			}
			this.icon = globalConfig.icon
			// console.log("userInfo",uni.getStorageSync(globalConfig.userInfo))
		}
	}
</script>

<style lang="less">
	.AvatarCard{
		background-color: white;
		display: flex;
		padding: 50px 10px;
		margin: 10px;
		position: relative;
		.notice{
			position: absolute;
			top: 10px;
			right: 10px;
			width: 25px;
			height: 25px;
		}
		// box-shadow: 0px 0px 5px #aaa;
		.avatar_Box{
			padding: 5px;
			.unBind{
				position: relative;
				bottom: 0;
				width: 30px;
				font-size: 10px;
				background-color: #00ACA7;
				color: white;
				text-align: center;
				left: 50%;
				transform: translate(-50%);
				padding: 3px 10px;
				border-radius: 3px;
			}
			.avatar{
				width: 50px;
				height: 50px;
				border-radius: 50%;
			}
		}
	}
	.title_Box{
		.title{
			font-weight: bolder;
			margin: 0 10px;
		}
		.row{
			line-height: 30px;
		}
	}
	.qr_icon{
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: 25px;
		height: 25px;
	}
	.qrcode_box{
		position: absolute;
		top: 40px;
		right: 40px;
		width: 220px;
		height: 240px;
		background-color: white;
		display: flex;
		flex-direction: column;
		font-size: 16px;
		justify-content: center;
		align-items: center;
		border-radius: 5px;
		box-shadow: 0px 0px 5px #aaa;
	}
</style>
