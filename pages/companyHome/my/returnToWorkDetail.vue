<template>
	<view>
		<dynamic-form
			:config="config"
			:srvFormData="formData"
			workflow="true"
			:ConfirmConfig="ConfirmConfig"
			:piId="piId"
			:LastKey="processDefineKey"
			:Details="true"
			:hideLast="true"
		></dynamic-form>
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
				api: globalConfig.formHost + '?id=66000',
				processDefineKey:{},
				confirmList:[],
				ConfirmConfig:{
					
				}
			}
		},
		methods: {
			getPiId(e){
				let decode = JSON.parse(decodeURIComponent(e))
				this.piId=decode.piId
				this.taskId=decode.taskId
				// console.log(this.taskId)
				this.data = {
					"processInstanceId": this.piId
				}
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
							// console.log(form)
							// console.log("enforcementSeq",res.data.data.customValues.fileseq)
							// that.processDefineKey ={
							// 	"processDefineKey":res.data.data.processDefineKey,
							// 	"fileno":res.data.data.customValues.fileno,
							// 	"fileseq":res.data.data.customValues.fileseq||0,
							// 	"processDefinitionId":res.data.data.processDefinitionId,
							// 	"taskId":that.taskId
							// }
							let jsonDefine = form.jsonDefine
							that.config = convert(JSON.parse(Base64.decode(jsonDefine)))
							// console.log(that.processDefineKey)
							// console.log(that.config)
							that.getConfim(that.piId)
						}
					}
				})
			},
		}
	}
</script>

<style>

</style>


<!-- <template>
	<view>
		<dynamic-page
		   :API="getPageApi"
		   :requsetParam="requsetParam"
		/>
	</view>
</template>

<script>
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'

	export default {
		components: {
			dynamicPage
		},
		onLoad(e) {
			var query = {};
			if (e.query) {
				query = { ...JSON.parse(decodeURIComponent(e.query)) }
				this.requsetParam =  query
			}else {
				// console.error('获取请求参数异常')
			}
		},
		data() {
			return {
				requsetParam: '',
				getPageApi: globalConfig.formHost + '?id=121',
			}
		},
		methods: {
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
		background-color: #E5E5E5;
	}

</style>
 -->