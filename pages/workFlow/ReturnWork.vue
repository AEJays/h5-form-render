<template>
	
	<view>
<!-- 		<dynamic-page
		   :API="getPageAapi"
		   contentType="json"
		   contentPayload="data.formInfo.appDesignData"
		/> -->
		<dynamic-page
		   :API="getPageAapi"
			 :srvFormData="list"
			 processDefineKey="fg"
			 :hideConfirm="true"
			 :company="true"
			 hideLast="true"
			 :nextUrl="nextUrl"
			 :nextText="nextText"
			 :ConfirmConfig="ConfirmConfig"
		/>
	</view>

</template>

<script>
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	
	export default {
		components:{ dynamicPage },
		mounted() {
			let list = globalConfig.companyInfo
			// this.list = globalConfig.companyInfo
			this.list["businessLicense"]=list["licenceNo"]
			this.list["companyName"]=list["name"]
			this.list["companyType"]=list["type"]
			this.list["companyAddress"]=list["address"]
			this.list["companyLegalPerson"]=list["personName"]
			this.list["companyPhone"]=list["personPhone"]
			
			// console.log("companyInfo",this.list)
		},
		onLoad (e){
			// console.log(e)
			if(e.next){
				this.nextText = "下一步",
				this.nextUrl = e.next+"?id=53125"
				// console.log(this.nextUrl,"returnWork")
			}
		},
		onUnload(e) {
			// console.log("unload",e)
		},
		data() {
			return {
				list:{},
				// 旧工作流
				// getPageAapi: 'https://api.mock.smallsaas.cn/api/u/workflow/process/code?id=e84ffab7c2ed22f86fffd99d62b1fd5d',
				// getPageAapi: 'https://api.uat.smallsaas.cn/api/u/workflow/process/code?id=e84ffab7c2ed22f86fffd99d62b1fd5d',
				// getPageAapi: globalConfig.formHost + '?id=800',
				// 外部工作流
				getPageAapi: globalConfig.formHost + '?id=10087',
				api: globalConfig.formHost + '?id=66000',
				ConfirmConfig:{
					
				},
				nextText:null,
				nextUrl:null
			}
		},
		created() {
			this.getConfirmConfig(this.api)
		},
		methods:{
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
		}
	}
</script>

<style lang="less">
	// page {
	// 	height: 100%;
	// 	background-color: #E5E5E5;
	// 	padding: 6rpx 0;
	// }
	
</style>