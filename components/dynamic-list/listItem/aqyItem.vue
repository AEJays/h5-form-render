<template>
	<view class="aqyItem_content">
		<view class="aqyItem_image">
			<image :src="getIcon()"></image>
		</view>
		<view class="aqyItem_text">
			<view class="aqyItem_startTime"><span class="aqyItem_label">{{options.TimeText||"发起时间"}}:</span>{{item.create_time}}</view>
			<view class="aqyItem_company"><span class="aqyItem_label">{{options.CompanyText||"发起公司"}}:</span>{{item.companyName}}</view>
		</view>
	</view>
</template>

<script>
	import {globalConfig} from '@/config.js'
	export default {
		name:"aqyItem",
		data(){
			icon:null
		},
		created() {
			this.icon = globalConfig.icon
			// console.log(this.icon)
		},
		props:{
			item:Object,
			options:Object
		},
		methods:{
			getIcon(){
				// console.log(this.icon.typeAqy)
				return this.icon.typeAqy
			}
		}
	}
</script>

<style>
	.aqyItem_content{
		display: flex;
		border-bottom: 1px solid #EFEFEF;
	}
	.aqyItem_image{
		/* width: 70px; */
		padding: 10px 15px;
	}
	.aqyItem_image>image{
		width: 40px;
		height: 40px;
	}
	.aqyItem_text{
		margin-top: 5px;
		margin-bottom: 10px;
		font-size: 14px;
	}
	.aqyItem_label{
		color: #666;
		font-weight: bolder;
		margin-right: 3px;
	}
</style>
