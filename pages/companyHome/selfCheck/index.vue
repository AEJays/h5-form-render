<template>
	
	<view>
<!-- 		<dynamic-page
		   :API="getPageAapi"
		   contentType="json"
		   contentPayload="data.formInfo.appDesignData"
		/> -->
		<dynamic-page
		   :API="getPageAapi"
			 processDefineKey="zc"
			 hideLast="true"
			 :ConfirmConfig="ConfirmConfig"
			 :srvFormData="srvFormData"
			 workflow="true"
			 :company="true"
			 :hideConfirm="true"
			 :nextUrl="nextUrl"
			 :nextText="nextText"
			 v-if="srvFormData"
		/>
	</view>

</template>

<script>
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	import {getFormNo} from '@/common/api.js'
	export default {
		components:{ dynamicPage },
		onLoad (e){
			if(e.next){
				this.nextText = "下一步",
				this.nextUrl = decodeURIComponent(e.next)
				// console.log(this.nextUrl)
			}
		},
		data() {
			return {
				// 旧工作流
				// getPageAapi: 'https://api.mock.smallsaas.cn/api/u/workflow/process/code?id=e84ffab7c2ed22f86fffd99d62b1fd5d',
				// getPageAapi: 'https://api.uat.smallsaas.cn/api/u/workflow/process/code?id=e84ffab7c2ed22f86fffd99d62b1fd5d',
				// getPageAapi: globalConfig.formHost + '?id=800',
				// 外部工作流
				getPageAapi: globalConfig.formHost + '?id=10086',
				api: globalConfig.formHost + '?id=66000',
				ConfirmConfig:{
					
				},
				srvFormData:null,
				nextText:null,
				nextUrl:null
			}
		},
		created() {
			this.getConfirmConfig(this.api)
			this.FormNo()
			// console.log(new Date().toLocaleDateString(),"DATE")
			// console.log(this.srvFormData,"SRVFORMDATA")
		},
		methods:{
			// 获取配置
			
			async FormNo(){
				let number = await getFormNo()
				let date = new Date()
				let day = date.getDate();
				let month = date.getMonth()+1
				let hour = date.getHours()<10?"0"+date.getHours():date.getHours()
				let min = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()
				if(month<10){
					month = "0"+month
				}
				let year = date.getFullYear()
				this.srvFormData = {}
				this.srvFormData["number"] = number.data
				this.srvFormData["time"] = `${year}-${month}-${day} ${hour}:${min}`
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