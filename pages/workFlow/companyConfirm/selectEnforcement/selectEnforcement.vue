<template>
	<view>
		<c-select @change="isSelect" :data="data" :method="method" :param="param" v-if="data.processDefineKey"></c-select>
		<c-button :config="config"></c-button>
	</view>
</template>

<script>
	import cSelect from '@/components/dynamic-form/custom/c-select/c-select.vue'
	import cButton from '@/components/other/C-Button.vue'
	import {globalConfig} from '@/config.js'
	export default {
		data() {
			return {
				// API:`${globalConfig.workflowEP}/executive/companyinfo/page`,
				param:{
					label:"选择执法人员"
				},
				config:{
					type:"jump",
					url:"",
					content:"确定"
				},
				data:{
					processDefineKey:null,
					taskId:null
				},
				method:"POST",
				selectId:null
			}
		},
		methods: {
			isSelect(e){
				// console.log("select!",e)
				this.selectId=e
				this.config.url=this.config.url+"&selectId="+this.selectId
				// console.log("url",this.config.url)
			}
		},
		onLoad(e) {
			let decode = JSON.parse(decodeURIComponent(e.query))
			// console.log("子项",)
			this.data.processDefineKey = decode.processDefineKey
			this.data.taskId = decode.taskId
			this.config.url="/pages/companyConfirm/companyConfirm?query="+e.query
			// console.log(this.data)
		},
		components:{
			cSelect,cButton
		}
	}
</script>

<style>

</style>
