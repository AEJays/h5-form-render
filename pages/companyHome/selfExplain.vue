<template>
	<view>
		<dynamic-form
			:config="config"
			:srvFormData="formData"
			:Details="true"
			:taskId="taskId"
			:hideConfirm="true"
		></dynamic-form>
<!-- 		<view style=" width: 90%;margin: 10px auto;padding: 5px;text-align: left;"><view style="font-weight: bolder;border-bottom: 1px solid #aaa;background-color: #1A5EB5;color: white;padding: 10px;">审批记录</view>
			<view class="ConfirmBox" v-for="(item,i) in confirmList" v-if="confirmList.length>0">
				<view style="font-weight: bold;margin-right:5px">发起时间:<span style="font-weight:normal;">{{item.time}}</span></view>
				<view style="font-weight: bold;margin-right:5px">办理步骤: <span style="font-weight:normal;">{{item.taskName}}</span></view>
				<view style="font-weight: bold;margin-right:5px">意见: <span style="font-weight:normal;">{{item.fullMessage}}</span></view>
			</view>
		</view> -->
<!-- 		<dynamic-page
			 :API="api"
			 :LastKey="processDefineKey"
		></dynamic-page> -->
	</view>
</template>

<script>
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
				taskId:"",
				config:null,
				method:"POST",
				data:{
				},
				formData:null,
				header:{
					Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
				},
				confirmList:[],
				pageName:""
				// api: globalConfig.formHost + '?id=66000',
				// processDefineKey:{}
			}
		},
		methods: {
			getPiId(e){
				let decode = JSON.parse(decodeURIComponent(e))
				this.piId=decode.piId
				this.taskId=decode.taskId
				// console.log("taskId",this.taskId)
				this.data = {
					"processInstanceId": this.piId
				}
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
							that.pageName = res.data.data.customValues.companyName||""
							// console.log(that.pageName)
							uni.setNavigationBarTitle({
								title:that.pageName
							})
							// that.processDefineKey ={
							// 	"processDefineKey":res.data.data.processDefineKey,
							// 	"fileno":res.data.data.customValues.fileno,
							// 	"processDefinitionId":res.data.data.processDefinitionId,
							// 	"taskId":that.taskId
							// }
							let jsonDefine = form.jsonDefine
							that.config = convert(JSON.parse(Base64.decode(jsonDefine)))
							// console.log(that.processDefineKey)
							// console.log(that.taskId)
							that.getConfim(that.piId)
							// console.log(that.config)
						}
					}
				})
			},
		}
	}
</script>

<style>
	.ConfirmBox{
		border: 2px double #1A5EB5;
		padding: 10px;
	}
</style>
