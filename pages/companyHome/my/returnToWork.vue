<template>
	<view class="company_check_container">
		<view class="top_content">
		  <view class="item" style="font-size: 16px;">
			<view style="font-size: 16px;">距离复工上报结束还有 </view>
			<view style="font-size: 30px; color: #D43030; margin: 0 6px;"> {{formData.days ? formData.days: 0}} </view>
			<view style="font-size: 16px;"> 天 </view>
		  </view>
			<view class="item" style="margin-top: 7px; color: #07C160;">
				<view>继续保持</view>
			</view>
		</view>
		<divider />
		<view class="center_content">
<!-- 			<dynamic-form :config="config" :ifManualSubmit="true" @submit="handleSubmit"
			 /> -->
			 
			 <dynamic-page
			    :API="getPageApi"
			    :dynamicLoadUrl="dynamicLoadUrl"
			 />
			 
		</view>
	</view>
</template>

<script>
    import _ from 'lodash';
	import divider from "@/components/custom-c/divider.vue";
	import { getDynamicFormField, getReturnToWork } from '@/common/api.js'
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	export default {
		components: {
			divider,
			dynamicPage
		},
		onLoad (e){
			if (e.id) {
				this.dynamicLoadUrl =  globalConfig.dataHost + '?id=' + e.id
				this.initData(e.id);
			}else {
				// console.error('获取id异常')
			}
		},
		data() {
			return {
				config: {},
				formData: {},
				
				dynamicLoadUrl: '',
				getPageApi: globalConfig.formHost + '?id=11',
			}
		},
		methods: {

			async initData(id){
				const res = await getReturnToWork({id: id})
				if (_.get(res, 'code') === 200) {
				    this.formData = { ..._.get(res, 'data', {}) };
				}
			},
			handleSubmit() {
				// uni.navigateTo({
				//     url: ""
				// })
			},
			// formatLoadDataa (data) {
   //              let obj = {}
   //              data.map(x => {
   //                  obj = {...obj, ...x }
   //              })
   //              return obj
   //          }
		}
	}
</script>

<style lang="less">
	.company_check_container {
		position: relative;
		font-size: 28rpx;

		.top_content {
			background-color: rgba(255, 255, 255, 1.0);
			width: 100%;
			height: 280rpx;
			color: #000000;
			display: flex;
			flex-direction: column;
			justify-content: center;
			justify-items: center;

			.item {
				display: flex;
				flex-direction: row;
				justify-content: center;

				// >view:last-child {
				// 	font-weight: 700;
				// 	flex: 1;
				// }
				>view{
					display: flex;
					align-items: center;
				}
			}
		}

		.center_content {
			// position: relative;
			// top: -16rpx;
			// // box-shadow: 0 0 8rpx #c7c7c7;
			// border-top-left-radius: 24rpx;
			// border-top-right-radius: 24rpx;
			background-color: #fff;
			padding: 20rpx 0;
		}
	}
</style>
