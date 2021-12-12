<template>
	<view class="workflow">
		<view class="getWorkFlow" v-for="(item,i) in param.workflow">
			<button @click="ReturnWork(item.url,item.query)" class="button"><img style="width: 20px;height: 20px;margin-right: 8px;position: relative;top: 5px;" mode="aspectFit" :src="getVal(item.icon)"/>{{item.title}}</button>
		</view>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	export default {
		name:"GetWorkFlow",
		data() {
			return {
				icon:null
			};
		},
		props:{
			param:Object
		},
		created() {
			this.icon=globalConfig.icon
		},
		methods:{
			getVal(string){
				string = "button"+string.replace(string[0],string[0].toUpperCase())
				// console.log(string)
				// console.log(this.icon)
				// console.log(this.icon[string])
				return this.icon[string]
			},
			ReturnWork(url,query){
				uni.navigateTo({
					url:"/pages"+url+"?query="+encodeURIComponent(JSON.stringify(query))
				})
			}
		}
	}
</script>

<style lang="less">
	.workflow{
		display: flex;
		.getWorkFlow{
			flex: 1;
			.button{
				background-color: #FCA130;
				font-weight: bolder;
				font-size: 14px;
				color: white;
				width: 80%;
				margin: 10px auto;
			}
		}
	}
</style>
