<template>
	<view>
		<avatar :theme="theme" :item="item"></avatar>
		<view class="ListBody">
			<view @click="jump(listitem.nav)" class="ListChild" v-for="(listitem,i) in list">
				<image class="icon" :src="icon[listitem.icon]" v-if="listitem.icon"></image>
				<view class="ListTitle">{{listitem.title}}</view>
				<image :src="icon.arrowRight" class="icon"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import Avatar from '../../../components/Avatar.vue'
	import {globalConfig} from '@/config.js'
	export default {
		name:"my",
		data() {
			return {
				icon:{
					
				},
				Noticelist:[]
			}
		},
		created() {
			this.icon = globalConfig.icon
			// console.log("list",this.list)
			// console.log("icon",this.icon[this.list.icon])
		},
		mounted() {
			
		},
		methods: {
			jump(nav){
				uni.navigateTo({
					url:'/pages'+nav
				})
			}
		},
		props:{
			item:Object,
			theme:{
				type:String,
				default(){
					return "enforcement"
				}
			},
			list:{
				type:Array,
				default(){
					return [
						// {"title":"我的执法记录","nav":"/enforcement/myEnforcement"}
					]
				}
			}

		},
		components:{
			Avatar
		}
	}
</script>

<style>
	page{
		background-color:#eee;
	}
	.ListBody{
		margin: 20px 10px;
/* 		box-shadow: 0px 5px 5px 10px #aaa; */
	}
	.ListChild{
		height: 50px;
		line-height: 50px;
		background-color: white;
		border-bottom: 1px solid #EEEEEE;
		display: flex;
	}
	.ListTitle{
		height: 50px;
		line-height: 50px;
		flex: 1;
		/* margin-left: 10px; */
		font-weight: bolder;
		font-size: 18px;
	}
	.icon{
		padding: 15px;
		width: 20px;
		height: 20px;
	}
</style>
