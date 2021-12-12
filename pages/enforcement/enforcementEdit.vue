<template>
	<view>
		<dynamic-page
           :API="api"
					 :srvFormData="data"
					 isCompany="true"
					 v-if="data"
        />
	</view>
</template>

<script>
	import dynamicPage from '../../components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	import {getSearchALL} from '@/common/api.js'
	let Modeldata;
	// import { Base64 } from '../../utils/tools.js'
	export default {
		components: {
			dynamicPage
		},
		data() {
			return {
				api: globalConfig.formHost + '?id=68652',
				data:null,
				dataApi:`${globalConfig.workflowEP}/admin/companyinfo`,
				id:"",
				method:"GET",
				reload:false
			}
		},
		onLoad(e) {
			// let query = Base64.decode(e.query)
			// console.log(query)
			// ModelData = this.getList(e.id)
			uni.showLoading({
				title:"加载中"
			})
			// console.log(e.id)
			this.getValue(e.id)
			// this.data = Modeldata
			// console.log("md",Modeldata)
			// console.log("this",this.data)
			// this.getValue(e.id)
		},
		methods:{
			getValue(id){
				let that = this
				uni.request({
					url:this.dataApi+"/"+id,
					method:this.method,
					header:{
							Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
					},
					complete(res) {
						// console.log(res)
						that.data = res.data.data
						uni.hideLoading()
						// console.log("data",res.data.data)
					}
				})
			}
			// getValue(id){
			// 	this.reload = true
			// 	this.getList(id)
			// 	this.data = Modeldata
			// 	this.reload = false
			// },
			// async getList(id){
			// 	let res = await getSearchALL(id)
			// 	// console.log(res)
			// 	let data = res.data
			// 	// console.log("data",res.data)
			// 	Modeldata =  data
			// 	return data
			// }
		}
	}
</script>

<style>
</style>
