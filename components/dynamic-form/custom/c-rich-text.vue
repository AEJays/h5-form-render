<template>
	<view style="background-color: white;" v-if="param.readonly">
		<view class="c-rich-text-label"><span style="color: red;margin-right: 2px;" v-if="param.required">*</span>{{param.label}}</view>
	<!-- <rich-text :nodes="param.value"></rich-text> -->
		<view class="c-rich-text-box" v-html="Debug(param.value)" ></view>
	</view>
</template>

<script>
	export default {
		name:"c-rich-text",
		data(){
			return{
				value:""
			}
		},
		components:{
		},
		created() {
			// console.log("param",this.param)
		},
		props:{
			param:{
				type:Object
			}
		},
		methods:{
			Debug(item){
				// console.log()
				item = item.replace(/src="/g, 'src="https://images.weserv.nl/?url=')
				return item
			}
		}
	}
</script>

<style lang="less">
	.c-rich-text-label{
		font-weight: bolder;
		font-size: 14px;
		width: 110px;
		margin-top: 10px;
		margin-left: 10px;
		color: #333;
	}
	img{
		max-width: 50px;
	}
	.c-rich-text-box{
		width: 90%;
		min-height: 900rpx;
		margin: 30rpx auto;
		border: 5px double #666;
		// box-shadow: 0px 0px 4px 2px #aaa;
		// border-radius: 20rpx;
		padding: 20rpx;
	}
</style>
