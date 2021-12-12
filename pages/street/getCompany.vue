<template>
	<view>
		<search :config="config" v-if="config.params"></search>
	</view>
</template>

<script>
	import search from '@/components/search/search.vue'
	import {globalConfig} from '@/config.js'
	export default {
		data() {
			return {
				config:{
				}
			}
		},
		created() {
			this.getData()
			this.getParam()
		},
		components:{
			search
		},
		methods: {
			getData(){
				let that = this
				uni.request({
					url:`${globalConfig.dataHost}?id=45153`,
					method:"GET",
					success(res) {
						uni.setNavigationBarTitle({
							title:res.data.data.title
						})
						// console.log("data",res.data)
						that.config=res.data.data.moduleData
					}
				})
			},
			getParam(){
				let userInfo = uni.getStorageSync(globalConfig.userInfo)
				let that = this
				// console.log("userInfo",userInfo)
				let id = userInfo.deptId
				uni.request({
					url:`${globalConfig.workflowEP}/admin/dept/${id}`,
					header:{
						Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
					},
					success(res) {
						// console.log("name",res.data.data.name)
						that.config.params={
							"streetName":res.data.data.name
						}
						// console.log("config",that.config)
					}
				})
			}
		}
	}
</script>

<style>

</style>
