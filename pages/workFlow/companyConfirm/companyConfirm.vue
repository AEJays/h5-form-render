<template>
	<view>
		<!-- <view style="width: 100%;text-align: center;font-weight: bolder;font-size: 16px;background-color: #1A5EB5;color: white;padding: 10px 0;">请确认表单内容</view> -->
		<dynamic-form
		v-if="userList.userId&&piId"
			:config="config"
			:srvFormData="formData"
			
			workflow="true"
			hideLast="true"
			:ConfirmConfig="ConfirmConfig"
			:piId="piId"
			:LastKey="processDefineKey"
			noCommit="true"
			:hideButton="true"
			:processDefineKey="key"
			:user="userList"
			:taskId="taskId"
			:Details="false"
			:debug="true"
			@getData="getFormData"
		></dynamic-form>
		<dynamic-form
			v-if="!userList.userId&&piId"
			:config="config"
			:srvFormData="formData"
			workflow="true"
			hideLast="true"
			:ConfirmConfig="ConfirmConfig"
			:piId="piId"
			:LastKey="processDefineKey"
			noCommit="true"
			:hideButton="true"
			:processDefineKey="key"
			:taskId="taskId"
			:Details="false"
			:debug="true"
			@getData="getFormData"
		></dynamic-form>
		<!-- <view style="position: relative;top: 5px;right: 5px;transform: translate(-50%);" @click="isShow()"><img style="width: 30px;height: 30px;" :src="icon.navCf_blue"></img></view> -->
<!-- 		<dynamic-page
			 :API="api"
			 hideLast="true"
			 :LastKey="processDefineKey"
			 :srvFormData="formData"
		></dynamic-page> -->
<!-- 		<dynamic-page
			 :API="api"
			 :LastKey="processDefineKey"
		></dynamic-page> -->
	</view>
</template>

<script>
	import _ from 'lodash'
	import {Base64} from '@/utils/tools.js'
	import {globalConfig} from '@/config.js'
	import {convert} from '@/utils/customTools.js'
	import dynamicForm from '../../../components/dynamic-form/index.vue'
	// import confirm from '../../components/confirm.vue'
	import dynamicPage from '../../../components/dynamic-page/index.vue'
	export default {
		onLoad(e) {
			// console.log("e",e)
			this.getPiId(e.query)
			this.getConfig()
		},
		created() {
			this.icon = globalConfig.icon
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
				loadApi:`${globalConfig.workflowEP}/api.flow.examine/processDetail`,
				piId:"",
				api: globalConfig.formHost + '?id=66001',
				taskId:"",
				config:null,
				method:"POST",
				data:{
				},
				icon:null,
				userList:{
					userId:null,
					name:null
				},
				formData:null,
				header:{
					Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
				},
				key:null,
				processDefineKey:{},
				confirmList:[],
				ConfirmConfig:{
					
				}
				// show:false
				// id:""
			}
		},
		methods: {
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
			// isShow(){
			// 	this.show=!this.show
			// 	// console.log(this.show)
			// },
			getFormData(e){
				// console.log('真实获取数据',e)
				this.formData=e
			},
			getPiId(e){
				let decode = JSON.parse(decodeURIComponent(e))
				this.piId=decode.piId
				this.taskId=decode.taskId
				// console.log("decode",decode)
				// console.log("userInfo",uni.getStorageSync(globalConfig.userInfo))
				let userInfo = uni.getStorageSync(globalConfig.userInfo)
				let userId = userInfo.userId.toString()
				// console.log(userId)
				if(userId!==decode.preUserId){
					// console.log("还是进来了")
					this.userList.userId=decode.preUserId
					this.userList.name=decode.preUserName
				}
				this.key=decode.processDefineKey
				// console.log(decode)
				// console.log(this.taskId)
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
								if(res.data.data.customValues.fileno){
									that.processDefineKey ={
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
						}
					}
				})
			},
		}
	}
</script>

<style>
	.MessageBox{
		border: 2px double #1A5EB5;
		padding: 10px;
	}
</style>
