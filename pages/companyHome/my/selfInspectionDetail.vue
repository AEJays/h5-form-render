<template>
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
				getPageApi: globalConfig.formHost + '?id=300',
			}
		},
		methods: {
		}
	}
</script>

<style lang="less">
	// page {
	// 	height: 100%;
	// 	background-color: #E5E5E5;
	// 	padding: 18rpx 0;
	// }
	
</style>
