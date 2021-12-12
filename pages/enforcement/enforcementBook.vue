<template>
	<view>
		<dynamic-form
			:config="config"
			:srvFormData="formData"
			:Details="true"
			:hideConfirm="true"
		></dynamic-form>
		<button class="got_form_button" @click="jump()" v-if="piId">前往打印页</button>
<!-- 		<dynamic-page
			 :API="api"
			 :LastKey="processDefineKey"
		></dynamic-page> -->
		<button class="showCompany" @click="showCompanyInfo" v-if="companyId">企业详情</button>
	</view>
</template>

<script>
	import {Base64} from '../../utils/tools.js'
	import {globalConfig} from '@/config.js'
	import {convert} from '@/utils/customTools.js'
	import dynamicForm from '../../components/dynamic-form/index.vue'
	// import confirm from '../../components/confirm.vue'
	// import dynamicPage from '../../components/dynamic-page/index.vue'
	export default {
		onLoad(e) {
			// console.log(e)
			this.getPiId(e.query)
			this.getConfig()
		},
		components:{
			dynamicForm
			// dynamicPage
		},
		onReady() {
			// console.log(this.config)
		},
		data() {
			return {
				loadApi:`${globalConfig.workflowEP}/api.flow.examine/processDetail`,
				piId:null,
				taskId:"",
				config:null,
				method:"POST",
				data:{
				},
				formData:null,
				header:{
					Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
				},
				api: globalConfig.formHost + '?id=2002',
				processDefineKey:{},
				companyId:null
			}
		},
		methods: {
			jump(){
				uni.redirectTo({
					url:`/pages/print?processInstanceId=${this.piId}`,
					success(e) {
						// console.log(e)
					}
				})
			},
			showCompanyInfo(){
				uni.navigateTo({
					url:`/pages/enforcement/enforcementDetails?id=${this.companyId}`
				})
			},
			getPiId(e){
				let decode = JSON.parse(decodeURIComponent(e))
				this.piId=decode.piId
				this.taskId=decode.taskId
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
	page{
		background-color: #EEEEED;
	}
	@keyframes show{
		from{opacity: 0;}
		to{opacity: 1;}
	}
	.got_form_button{
		width:80%;
		margin: 5px auto;
		background-color: #1A5EB5;
		color: white;
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
