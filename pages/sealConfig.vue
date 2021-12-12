<template>
	<view>
		<view class="history-imageBox" @touchstart="listTouchStart" @touchend="listTouchEnd" @touchmove="listTouchMove">
			<view v-for="(item,i) in list">
				<image :src="item.url" style="background-color: white;border: 1px dotted #555;transform: rotate(-90deg);transform-origin: center center;" mode="aspectFit" class="history-image" @click="handleImage(i)"></image>
				<view class="history-name">{{item.name}}</view>
				<view v-show="isImage===i" class="bigImage">
					<image style="width: 100vw;height: 100vw;background-color: white;border: 1px solid #555;transform: rotate(-90deg);transform-origin: center center;" :src="item.url" mode="aspectFit"></image>
					<view class="buttonGroup">
						<button class="bigImage_button" @click="handleShowForm(item.id)">更改印章信息</button>
						<button class="bigImage_button" @click="deleteUserSeal(item.id)">删除</button>
						<button class="bigImage_button" @click="handleShowPassword(item.id)">更改密码</button>
						<button class="bigImage_button" @click="hideImage">返回</button>
					</view>
				</view>
				<!-- 遮罩层 -->
				<view v-show="showForm == item.id||showPassword == item.id" class="mask" @click="hideForm"></view>
				<!-- 更改信息 -->
				<view v-show="showForm == item.id||showPassword == item.id" class="form">
					<dynamic-form
						v-if="config&&showForm == item.id"
						:config="config"
						:srvFormData="item"
						:ifManualSubmit="true"
						@submit="(e)=>putUserSeal(item.id,e)"
					></dynamic-form>
					<dynamic-form
						v-if="passwordConfig&&showPassword == item.id"
						:config="passwordConfig"
						:srvFormData="{'id':item.id,'password':item.password}"
						:ifManualSubmit="true"
						@submit="(e)=>putUserSealPassword(item.id,e)"
					></dynamic-form>
				</view>
			</view>
			<view v-show="showAdd" class="mask" @click="hideForm"></view>
			<view v-show="showAdd" class="form">
				<dynamic-form
					v-if="AddConfig"
					:config="AddConfig"
					:ifManualSubmit="true"
					@submit="(e)=>addUserSeal(e)"
				></dynamic-form>
			</view>
			<view class="buttonGroup">
				<button @click="handleShowAdd()" class="bigImage_button">添加</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	import dynamicForm from '@/components/dynamic-form/index.vue'
	export default {
		components:{
			dynamicForm
		},
		data() {
			return {
				api:`${globalConfig.workflowEP}/admin/userseal`,
				userId:null,
				userInfo:null,
				header:{
				},
				list:[],
				isImage:null,
				size:10,
				current:1,
				total:0,
				startX:"",
				endX:"",
				showForm:null,
				showPassword:null,
				showAdd:false,
				config:null,
				passwordConfig:null,
				AddConfig:null
			}
		},
		created() {
			uni.setNavigationBarTitle({
				title:"印章管理"
			})
			this.userInfo = uni.getStorageSync(globalConfig.userInfo)
			this.userId = this.userInfo.userId
			this.header = {
				Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
			}
			this.getFormConfig()
			this.getPasswordConfig()
			this.getAddConfig()
			this.getUserSealVaild()
		},
		methods: {
			handleShowAdd(){
				this.showAdd = true
			},
			// 获取表单配置
			getFormConfig(){
				let that = this
				uni.request({
					url:`${globalConfig.formHost}?id=84512`,
					success(res) {
						// console.log(res)
						that.config = res.data.data
					}
				})
			},
			getPasswordConfig(){
				let that = this
				uni.request({
					url:`${globalConfig.formHost}?id=84513`,
					success(res) {
						// console.log(res)
						that.passwordConfig = res.data.data
					}
				})
			},
			getAddConfig(){
				let that = this
				uni.request({
					url:`${globalConfig.formHost}?id=84514`,
					success(res) {
						that.AddConfig = res.data.data
					}
				})
			},
			// 显示表单
			handleShowForm(id){
				// console.log(id)
				this.showForm = id
				
			},
			handleShowPassword(id){
				// console.log(id)
				this.showPassword = id
				// console.log(this.showPassword)
			},
			hideForm(){
				this.showForm = null
				this.showPassword = null
			},
			listTouchStart(touch){
				// console.log(touch,"start")
				this.startX = touch.changedTouches[0].clientX
			},
			// 滑动列表动作中
			listTouchMove(touch){
				// console.log(touch,"move")
			},
			// 胡丹列表动作结束
			listTouchEnd(touch){
				this.endX = touch.changedTouches[0].clientX
				if(this.startX-this.endX>100){
					if(this.current*this.size<this.total){
						this.current = this.current+1
						this.getUserSealVaild()
					}
				}
				// console.log(touch,"end")
			},
			// 选择Image
			handleImage(i){
				this.isImage = i
			},
			hideImage(){
				this.isImage = null
			},
			// 修改印章
			putUserSeal(id,item){
				let that = this
				uni.request({
					url:this.api+`?id=${id}&name=${item.name}&url=${item.url}`,
					method:"PUT",
					header:this.header,
					success() {
							that.showForm = null
							that.$reload()
					}
				})
			},
			// 查询所有可用印章
			getUserSealVaild(){
				let that = this
				let data = {}
				data = {
					"size":this.size,
					"current":this.current
				}
				uni.request({
					url:this.api+"/valid",
					header:this.header,
					data:data,
					success(res) {
						uni.hideLoading()
						// console.log(res)
						if(res.data.code===0){
								// console.log(res.data.data.records)
								that.list.push(...res.data.data.records)
								that.total = res.data.data.total
						}else{
							uni.showModal({
								title:res.data.msg,
								confirmColor:"#FC1944"
							})
						}
					}
				})
			},
			// 重置印章密码
			putUserSealPassword(id,item){
				let that = this
				uni.request({
					url:this.api+"/password"+`?id=${id}&password=${item.password}`,
					method:"PUT",
					header:this.header,
					data:{
						"id":id,
						...item
					},
					success() {
						that.showPassword = null
						that.$reload()
						uni.showToast({
							title:"更改密码成功",
							icon:"success"
						})
					}
				})
			},
			// 增加印章
			addUserSeal(item){
				let that = this
				uni.request({
					url:this.api+`?name=${item.name}&url=${item.url}&password=${item.password}`,
					header:this.header,
					method:"POST",
					complete() {
						that.showAdd = false
						that.$reload()
						uni.showToast({
							title:"添加成功"
						})
					}
				})
			},
			// 删除印章
			deleteUserSeal(id){
				let that = this
				uni.request({
					url:this.api+"/"+id,
					header:this.header,
					method:"DELETE",
					complete() {
						that.$reload()
						uni.showToast({
							title:"删除成功",
							icon:"success"
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.history-name{
		text-align: center;
		font-size: 16px;
		font-weight: bolder;
	}
	.bigImage{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100000;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #EEE;
	}
	.buttonGroup{
		display: flex;
		width: 100%;
		position: fixed;
		bottom: 50px;
		&>.bigImage_button{
			background-color: #1A5EB5;
			color: white;
		}
	}
	.history-imageBox{
		display: flex;
		// flex-wrap: wrap;
		align-items: center;
		overflow: scroll;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #EEE;
	}
	.history-image{
		width: 100px;
		height: 100px;
		&:first-child{
			margin-left: 5px;
		}
		margin-right: 5px;
		margin-top: 5px;
		// border-radius: 5px;
	}
	.form{
		position: fixed;
		bottom: 0px;
		left: 0;
		// background-color: black;
		width: 100%;
		// height: 200px;
		z-index: 100002;
	}
	.password{
		position: fixed;
		bottom: 0px;
		// background-color: black;
		width: 100%;
		// height: 200px;
		z-index: 100003;
	}
	.mask{
		background-color: rgba(0,0,0,.8);
		z-index: 100001;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
