<template>
	<view>
		<dynamic-page :API="api" :Details="true" :srvFormData="srvFormData"></dynamic-page>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	import dynamicPage from '@/components/dynamic-page/index.vue'
	export default {
		components:{
			dynamicPage
		},
		data() {
			return {
				api:`${globalConfig.formHost}?id=53125`,
				srvFormData:null
			}
		},
		methods: {
			
		},
		onLoad(e) {
			let query = JSON.parse(decodeURIComponent(e.query))
			// console.log(query,"QUERY")
			this.srvFormData = query
		}
	}
</script>

<style>

</style>
