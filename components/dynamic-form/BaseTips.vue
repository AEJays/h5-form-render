<template>
	<view class="base-tips" v-if="!param.readonly&&!param.disbled">
		<text class="base-tips-title">提示：</text><text class="base-tips-content">{{param.label||"-"}}</text>
	</view>
</template>

<script>
	export default {
		name:"baseTips",
		props:{
			param:{
				type:Object,
				default:function(){
					return {
						label:""
					}
				}
			}
		}
	}
</script>

<style scoped>
	.base-tips{
		width: 100%;
		background-color: #FFFFFF;
		padding: 15rpx;
		text-align: center;
		color: #A2A2A2;
	}
	.base-tips-title{
		font-weight: bolder;
	}
</style>
