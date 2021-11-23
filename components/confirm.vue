<template>
	<view>
		<view style="background-color: white;width: 90%;margin: 10px auto;padding: 5px;text-align: left;" v-if="confirmList.length>0&&!config.hideConfirm">
			<view style="font-weight: bolder;border-bottom: 1px solid #aaa;background-color: #1A5EB5;color: white;padding: 10px;">{{config.groupText||"审批记录"}}<span style="float: right;" @click="isShowList()">{{text}}</span></view>
			<view class="MessageBox" v-for="(item,i) in confirmList"  v-show="!showList">
				<view style="font-weight: bold;margin-right:5px">发起时间:<span style="font-weight:normal;">{{item.time}}</span></view>
				<view style="font-weight: bold;margin-right:5px">办理步骤: <span style="font-weight:normal;">{{item.taskName}}</span></view>
				<view style="font-weight: bold;margin-right:5px">意见: <span style="font-weight:normal;">{{item.fullMessage}}</span></view>
			</view>
		</view>
		<view class="Confirm" style="position: relative;"  v-if="!noCommit">
			<view class="comment">
				<view class="title">{{config.placeholder||"办理意见"}}
				</view>
	<!-- 			<view>
					<button @click="">模板测试</button>
				</view> -->
				<textarea adjust-position="true" v-model:value="comment" class="comment_input"
				:placeholder="'请输入'+(config.placeholder||'办理意见')"
				maxlength="-1"
				></textarea>
			</view>
			<view class="ConfirmBox">
				<view class="agree button" @click="GetAgree('backToPrev')" v-if="!hideLast">
					{{config.lastText||"回退"}}
				</view>
				<view class="agree button" @click="GetAgree()">
					{{config.agreeText||"提交"}}
				</view>
				<view class="agree button" @click="exit()">
					关闭
				</view>
	<!-- 			<view class="refuse button" @click="GetRefuse()">
					{{config.refuseText}}
				</view> -->
				<!-- <button @click="getFormData()">测试</button> -->
			</view>
		</view>
		<view style="position: relative;height: 50px;"  v-if="noCommit">
			<view class="ConfirmBox">
							<view class="agree button" @click="GetAgree('backToPrev')" v-if="!hideLast">
								{{config.lastText||"回退"}}
							</view>
							<view class="agree button" @click="GetAgree()">
								{{config.agreeText||"提交"}}
							</view>
							<view class="agree button" @click="exit()">
								关闭
							</view>
				<!-- 			<view class="refuse button" @click="GetRefuse()">
								{{config.refuseText}}
							</view> -->
							<!-- <button @click="getFormData()">测试</button> -->
						</view>
			</view>
		</view>

</template>

<script>
	import {globalConfig} from '@/config.js'
	export default {
		name:"confirm",
		data() {
			return {
				comment:"",
				username:"",
				confirmList:[],
				showList:false,
				text:"收起"
			};
		},
		props:{
			hideLast:false,
			config:{
				type:Object,
				default(){
					return {
						agreeText:"同意",
						lastText:"回退",
						refuseText:"拒绝",
						placeholder:"请输入..."
					}
				}
			},
			formData:Object,
			LastKey:Object,
			piId:String,
			userlist:Object,
			jumpUrl:String,
			processDefineKey:String,
			noCommit:{
				type:Boolean,
				default(){
					return false
				}
			},
			customValues:{
				type:Object
			},
			form:Object,
			fields:Object
		},
		watch:{
			piId:{
				handler(value,oldValue){
					// console.log("VALUE",value,oldValue)
				},
				deep:true
			},
			noCommit:{
				handler(value,oldValue){
					// console.log("noCommit?",value,"oldNotCommit",oldValue)
				}
			}
		},
		created(){
			this.getConfim(this.piId)
		},
		mounted() {
			// console.log("noCommit",this.noCommit)
			// // console.log("confimKey",this.LastKey)
			// // console.log("FormDATA",this.formData)
			// // console.log("userInfo",globalConfig.userInfo)
			this.username=uni.getStorageSync(globalConfig.userInfo).username
			// // console.log("PIID",this.piId)
		},
		methods:{
			// getFormData(){
			// 	// console.log("FormDATA",this.formData)
			// },
			isShowList(){
				// // console.log("SHOWLIST",this.showList)
				if(this.showList===true){
					this.text="收起"
				}else{
					this.text="展开"
				}
				this.showList=!this.showList
			},
			getConfim(key,taskId){
				let pkey = key
				let that = this
				uni.request({
					url:`${globalConfig.workflowEP}/api.flow.examine/getComments`,
					method:"POST",
					data:{
						"processInstanceId":pkey
					},
					header:{
						Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
					},
					success(res){
						// console.log("res",res)
						that.confirmList=res.data.data
					}
				})
			},
			exit(){
				uni.navigateBack({
					delta:10
				})
			},
			// 设置错误信息
			handleRecursive (data = []) {
			    data.map(x => {
			        if (_.get(x, '__config__.required') === true) {
			const formType = _.get(x, '__config__.tag')
			            if (['', undefined, null].includes(this.form[x.__vModel__])) {
			                x.error = true
			            }
			            if (['el-checkbox-group', 'el-multiple-modal-select'].includes(formType) && _.get(this.form, x.__vModel__, []).length === 0) {
			               x.error = true 
			            }
			if (formType === 'el-switch' && ['', undefined, null, false].includes(this.form[x.__vModel__])) {
				x.error = true
			}
			            if (formType === 'el-slider' && ['', undefined, null, false, 0].includes(this.form[x.__vModel__])) {
			                x.error = true
			            }
			        }
			        if (_.get(x, '__config__.children', []).length > 0) {
			            x.__config__.children = [...this.handleRecursive(x.__config__.children)]
			        }
			        return x
			    })
			    return data
			},
			GetAgree(openType){
				console.log(this.processDefineKey)
				const list = this.fields
				        this.fields = [...this.handleRecursive(list)]
				let isPass = true
				let that = this
				const checkField = (data = []) => {
					data.map(x => {
						if (x.error) {
							isPass = false
						}
						if(x.__vModel__==="startTime"||x.__vModel__==="endTime"){
							if(that.form["startTime"]>that.form["endTime"]){
								isPass = false
								x.error = true
								x["error-message"]="开始时间不能大于结束时间"
							}else{
								x.error = false
							}
						}
						if (_.get(x, '__config__.children', []).length > 0) {
						   checkField(x.__config__.children) 
						}
					})
				}
				        checkField(this.fields)
								this.$emit("getError",this.fields)
				        if (!isPass) {
				            return
				        }
				uni.showLoading({
					title:"提交中"
				})
				// // console.log(value);
				// // console.log(this.comment)
				// console.log("KEY",this.LastKey.applyUserName)
				let pages = getCurrentPages()
				let page = pages[0]
				let token = uni.getStorageSync(globalConfig.tokenStorageKey)
				let header = {
					Authorization:token
				}
				let url = `${globalConfig.workflowEP}/api.flow.examine/complete`
				let data;
				if(this.userlist){
					data = {
						"processDefineKey":this.LastKey.processDefineKey||this.processDefineKey,
						"customValues":{
							"fileno":this.LastKey.fileno||1,
							"fileseq":this.LastKey.fileseq||10,
							...this.customValues
						},
						"userId":this.userlist.userId,
						"userName":this.userlist.name,
						"ignoreNotPersistent":true,
						"formData":this.formData,
						"operType":openType,
						"comment":this.comment,
						"taskId":this.LastKey.taskId
					}
				}else{
					data = {
						"processDefineKey":this.LastKey.processDefineKey||this.processDefineKey,
						"customValues":{
							"fileno":this.LastKey.fileno||1,
							"fileseq":this.LastKey.fileseq||10,
							...this.customValues
						},
						"ignoreNotPersistent":true,
						"formData":this.formData,
						"operType":openType,
						"comment":this.comment,
						"taskId":this.LastKey.taskId
					}
				}
				// console.log("JUMP",this.jumpUrl)
				// // console.log(data)
				let allName = uni.getStorageSync("allName")
				if(allName.length>0&&Array.isArray(allName)){ //初始化表单
					allName.map((item,i)=>{
						uni.removeStorageSync(item)
					})
				}
				uni.request({
					header:header,
					url:url,
					data:data,
					method:this.config.method||"POST",
					complete(res) {
						if(res.data.code==="00000"){
							// // console.log(page)
							// uni.reLaunch({
							// 	url:page.$page.fullPath,
							// 	fail(e) {
							// 		// console.log(e)
							// 	}
							// })
							uni.hideLoading()
							let pId = res.data.data.processInstanceId
							if(that.jumpUrl){
								uni.navigateTo({
									url:"/pages"+that.jumpUrl+"?processInstanceId="+pId,
									success(){
										uni.showToast({
											// duration:500,
											title:"提交成功"
										})
									}
								})
							}else{
								uni.navigateBack({
									delta:10,
									success(){
										uni.showToast({
											// duration:500,
											title:"提交成功"
										})
									}
								})
							}
						}else{
							uni.showModal({
								content:res.data.msg
							})
						}
					}
				})
			},
		// 	GetRefuse(){
		// 		// // console.log(value);
		// 		// // console.log(this.comment)
		// 		let pages = getCurrentPages()
		// 		let page = pages[0]
		// 		let token = uni.getStorageSync(globalConfig.tokenStorageKey)
		// 		let header = {
		// 			Authorization:token
		// 		}
		// 		let that = this
		// 		let url = `${globalConfig.workflowEP}/api.flow.examine/complete`
		// 		let data = {
		// 			"processDefineKey":this.LastKey.processDefineKey,
		// 			"version":"1",
		// 			"customValues":{
		// 				"fileno":this.LastKey.fileno,
		// 				"fileseq":String(Number(this.LastKey.fileseq)+1)
		// 			},
		// 			"operType":"backToApply",
		// 			"comment":this.comment,
		// 			"taskId":this.LastKey.taskId
		// 		}
		// 		// // console.log(data)
		// 		uni.request({
		// 			header:header,
		// 			url:url,
		// 			data:data,
		// 			method:this.config.method||"POST",
		// 			complete(res) {
		// 				// console.log(res)
		// 				if(res.data.code==="00000"){
		// 					uni.showToast({
		// 						duration:500,
		// 						title:"审批成功"
		// 					})
		// 					let querydata = {
		// 						...that.config.query,
		// 						...data
		// 					}
		// 					let backUrl = '/pages'+that.config.failUrl+'?query='+encodeURIComponent(JSON.stringify(querydata))
		// 					// console.log(backUrl)
		// 					uni.navigateTo({
		// 						url:backUrl
		// 					})
		// 				}else{
		// 					uni.showModal({
		// 						content:res.data.msg
		// 					})
		// 				}
		// 			}
		// 		})
		// 	}
		}
	}
</script>

<style lang="less">
	.Confirm{
		width: 90%;
		margin: 0 auto;
		box-shadow: 0px 0px 5px #999;
		border-radius: 5px;
		background-color: #eee;
		padding: 5px;
	}
	.ConfirmBox{
		z-index: 2;
		min-width: 97%;
		position: absolute;
		right: 5px;
		bottom: 10px;
		height: 40px;
		padding: 0px;
		margin-top: 20px;
		display: flex;
		border-radius: 10px;
		.button{
			flex: 1;
			// box-shadow: 0px 0px 5px #999;
			min-width: 20%;
			height: 40px;
			line-height: 40px;
			// padding: 0 10%;
			margin: 0 10px;
			text-align: center;
			font-size: 14px;
			font-weight: bolder;
			border-radius: 5px;
			// line-height: 60px;
			&:hover{
				opacity: .8;
			}
		}
		.agree{
			background-color: #46aa46;
			color: white;
		}
		// .refuse{
		// 	background-color: #e75f5f;
		// 	color: white;
		// }
	}
	.comment{
		// z-index: 1;
		width: 100%;
		.comment_input{
			width: 90%;
			background-color: white;
			margin: 0 auto;
			border: 1px dotted #aaa;
			// border-bottom: 1px dotted #aaa;
			padding: 1em;
		}
		.title{
			font-weight: bolder;
			margin: 5px;
			// padding: 5px 0;
			font-size: 14px;
			// border-bottom: 1px solid #999;
		}
	}
	.MessageBox{
		border: 2px double #1A5EB5;
		padding: 10px;
	}
</style>
