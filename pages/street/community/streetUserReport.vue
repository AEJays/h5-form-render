<template>
	
	<view>
		<dynamic-page
		   :API="getPageAapi"
			 workflow="true"
			 :ConfirmConfig="ConfirmConfig"
			 processDefineKey="jdsb"
			 :custom="customValues"
			 :hideLast="true"
		/>
	</view>

</template>

<script>
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	
	export default {
		components:{ dynamicPage },
		onLoad (e){
		},
		created() {
			this.getConfirmConfig(this.api)
			this.userInfo = uni.getStorageSync("userInfo")
			this.getStreetName()
		},
		data() {
			return {
				// getPageAapi: globalConfig.formHost + '?id=510',
				getPageAapi: globalConfig.formHost + '?id=5600',
				api: globalConfig.formHost + '?id=66001',
				ConfirmConfig:{
					
				},
				userInfo:null,
				customValues:{
					
				}
			}
		},
		methods:{
			getStreetName(){
				let that = this
				uni.request({
					url:`${globalConfig.workflowEP}/admin/dept/${this.userInfo.deptId}`,
					header:{
						Authorization:`Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
					},
					success(res) {
						// console.log(res)
							that.customValues = {
								"streetName":res.data.data.name
							}
					}
				})
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
	page {
		height: 100%;
		background-color: #E5E5E5;
		padding: 6rpx 0;
	}
	
</style>
