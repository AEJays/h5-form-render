<!-- 跳转标准配置页面，纯配置页面都可以跳转到这，需要带参数！ -->
<template>
	<view>
		<dynamic-page :API="api" v-if="api" :otherSearch="otherSearch" :otherSumbitData="otherSumbitData" :hideConfirm="true"></dynamic-page>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	import dynamicPage from '@/components/dynamic-page/index.vue'
	export default {
		components:{
			dynamicPage
		},
		onLoad(e) {
			// console.log(e)
			let decode
			decode = e.query?JSON.parse(decodeURIComponent(e.query)):e
			// console.log(decode)
			this.api=`${globalConfig.formHost}?id=${decode.id}`
			let companyInfo = uni.getStorageSync("companyInfo")
			let stringCompany = JSON.stringify(companyInfo)
			console.log(companyInfo)
			if(decode.type==="yyzz"){

			}else{
				console.log(decode.type,"type")
				this.otherSumbitData = {
					"companyId":companyInfo.id,
					"companyName":companyInfo.name,
					"companyType":companyInfo.type,
					"businessLicense":companyInfo.licenceNo,
					"companyLegalPerson":companyInfo.personName,
					"companyPhone":companyInfo.personPhone,
					"companyAddress":companyInfo.address
				}
			}
			if(decode.id==564064){
				this.otherSearch = {
					"listWheres":[{
					"O_CODE":"equal",
					"F_CODE":"companyId",
					"VALUE":companyInfo.id
				}]}
			}
			if(decode.id==53125){
				uni.removeStorageSync("isOneCompanyRegister")
			}
		},
		data() {
			return {
				api:null,
				otherSumbitData:{},
				otherSearch:{}
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
