<template>
	<view>

		<van-steps 
			:steps="item.recordSteps" 
			:active="active" 
			direction="vertical" 
			active-color="#ee0a24" 
			@click-step="onItemClick"
		/>

	</view>
</template>
<script>
	import qs from 'qs'
	export default {
		name: 'RecordStepsItem',
		data(){
			return {
				active: -1
			}
		},
		props: {
			item: Object,
			// ext: Object,
			// itemNavigation: String
		},
		computed: {

		},
		methods: {
			onItemClick(e){
				const itemIndex = e.detail
				let path = ''
				let query = {}
				if(this.item.recordSteps && this.item.recordSteps.length > 0){
					this.item.recordSteps.map((item, index) => {
						if(itemIndex === index){
							path = item.path
							query.id = item.id
						}
					})
					path = path + '?query=' + encodeURIComponent(JSON.stringify(query))
					if(path){
						uni.navigateTo({
							url: path 
						})
					}
				}else{
					// console.log("列表数据异常")
				}
				
			}
		},
		mounted(){
			// console.log('this.item = ', this.item)
		}
	}
</script>
<style lang="less" scoped>

</style>
