<template>
	<view>
		<dynamic-form
			:config="config"
			:srvFormData="formData"
			
			workflow="true"
			:ConfirmConfig="ConfirmConfig"
			:piId="piId"
			:LastKey="processDefineKey"
			noCommit="true"
			:Details="false"
			:hideButton="true"
			:taskId="taskId"
			:processDefineKey="Key"
			@getFormData="getFormData"
		></dynamic-form>
<!-- 		<view style=" width: 90%;margin: 10px auto;padding: 5px;text-align: left;"><view style="font-weight: bolder;border-bottom: 1px solid #aaa;background-color: #1A5EB5;color: white;padding: 10px;">审批记录</view>
			<view class="MessageBox" v-for="(item,i) in confirmList" v-if="confirmList.length>0">
				<view style="font-weight: bold;margin-right:5px">发起时间:<span style="font-weight:normal;">{{item.time}}</span></view>
				<view style="font-weight: bold;margin-right:5px">办理步骤: <span style="font-weight:normal;">{{item.taskName}}</span></view>
				<view style="font-weight: bold;margin-right:5px">意见: <span style="font-weight:normal;">{{item.fullMessage}}</span></view>
			</view>
		</view> -->
<!-- 		<dynamic-page
			 :API="api"
			 :LastKey="processDefineKey"
			 :srvFormData="formData"
		></dynamic-page> -->
		<button class="showCompany" @click="showCompanyInfo" v-if="companyId">企业详情</button>
	</view>
</template>

<script>
	import _ from 'lodash'
	import {Base64} from '../../utils/tools.js'
	import {globalConfig} from '@/config.js'
	import {convert} from '@/utils/customTools.js'
	import dynamicForm from '../../components/dynamic-form/index.vue'
	// import confirm from '../../components/confirm.vue'
	import dynamicPage from '../../components/dynamic-page/index.vue'
	export default {
		onLoad(e) {
			// console.log(e)
			this.getPiId(e.query)
			this.getConfig()
			uni.showLoading({
				title:"加载中"
			})
		},
		created() {
			this.getConfirmConfig(this.api)
		},
		components:{
			dynamicForm,
			dynamicPage
		},
		onReady() {
			// console.log(this.config)
		},
		data() {
			return {
				pageAPi:`${globalConfig.formHost}?id=19013`,
				loadApi:`${globalConfig.workflowEP}/api.flow.examine/processDetail`,
				piId:"",
				taskId:"",
				config:null,
				method:"POST",
				data:{
				},
				formData:null,
				header:{
					Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
				},
				api: globalConfig.formHost + '?id=66000',
				processDefineKey:{},
				applyUserName:"",
				Key:"",
				formData:null,
				confirmList:[],
				ConfirmConfig:{
				
				},
				companyId:null
			}
		},
		methods: {
			// 查看企业详情
			showCompanyInfo(){
				uni.navigateTo({
					url:`/pages/enforcement/enforcementDetails?id=${this.companyId}`
				})
			},
			getFormData(e){
				// console.log('真实获取数据',e)
				this.formData=e
			},
			getConfirmConfig(api){
				let that = this
				uni.request({
					url:api,
					method:"GET",
					success(res) {
						let data = res.data.data
						// console.log("RES",data)
						let moduleData = data.moduleData
						// console.log(moduleData)
						let modules = res.data.data.modules
						let key
						modules.map((item,i)=>{
							if(item.type==="confirm"){
								key = item.key
								// console.log(key)
							}
						})
						that.ConfirmConfig = _.get(moduleData,key,"")
						// console.log(key,moduleData,that.ConfirmConfig)
					}
				})
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
			getPiId(e){
				let decode = JSON.parse(decodeURIComponent(e))
				this.piId=decode.piId
				this.taskId=decode.taskId
				// console.log(decode)
				// console.log(this.taskId)
				this.applyUserName = decode.instanceEntityVo.actApplyUserName
				this.Key = decode.processDefineKey
				this.data = {
					"processInstanceId": this.piId
				}
			},
			getConfig(){
				// console.log(this.data)
				// console.log(this.method)
				let that = this
				uni.request({
					url:this.loadApi,
					method:this.method,
					data:this.data,
					header:this.header,
					complete(res) {
						// console.log(res)
						if(res.data.code === "00000"){
							// console.log(res)
							let form = res.data.data.form
							let data = res.data.data.formData
							that.formData = data
							// console.log(form)
							// console.log("enforcementSeq",res.data.data.customValues.fileseq)
							if(res.data.data.customValues){
								if(res.data.data.customValues.companyName){
									uni.setNavigationBarTitle({
										title:res.data.data.customValues.companyName
									})
								}
								if(res.data.data.customValues.companyId){
									that.companyId = res.data.data.customValues.companyId
								}
								if(res.data.data.customValues.fileno){
									that.processDefineKey ={
										"applyUserName":that.applyUserName,
										"processDefineKey":res.data.data.processDefineKey,
										"fileno":res.data.data.customValues.fileno,
										"fileseq":res.data.data.customValues.fileseq||0,
										"processDefinitionId":res.data.data.processDefinitionId,
										"taskId":that.taskId
									}
								}else{
									that.processDefineKey ={
										"processDefineKey":res.data.data.processDefineKey,
										// "fileno":res.data.data.customValues.fileno,
										// "fileseq":res.data.data.customValues.fileseq||0,
										"processDefinitionId":res.data.data.processDefinitionId,
										"taskId":that.taskId
									}
								}
							}else{
								that.processDefineKey ={
									"processDefineKey":res.data.data.processDefineKey,
									// "fileno":res.data.data.customValues.fileno,
									// "fileseq":res.data.data.customValues.fileseq||0,
									"processDefinitionId":res.data.data.processDefinitionId,
									"taskId":that.taskId
								}
							}

							let jsonDefine = form.jsonDefine
							that.config = convert(JSON.parse(Base64.decode(jsonDefine)))
							// console.log("config",that.config)
							// console.log(that.processDefineKey)
							// console.log(that.config)
							that.getConfim(that.piId)
							uni.hideLoading()
						}
					}
				})
			},
		}
	}
</script>

<style>
	@keyframes show{
		from{opacity: 0;}
		to{opacity: 1;}
	}
	.MessageBox{
		border: 2px double #1A5EB5;
		padding: 10px;
	}
	.showCompany{
		position: fixed;
		top: 20%;
		right: 0;
		background-color: #46AA46;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		margin-left: 10px;
		color: white;
		font-weight: bolder;
		animation: show 2s linear 0s forwards;
	}
</style>
