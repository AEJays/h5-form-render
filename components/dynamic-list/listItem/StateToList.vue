<template>
	<view class="self-item">
		<view class="flex">
			<view style="margin-right: 15px;">
				<image class="icon" :src="getIcon(item.formCode)||icon.street"></image>
			</view>
			<view class="left flex1">
				<!-- <view class="title text-line-1">{{ _get(custom,"fileno","") }}</view> -->
				<view class="title text-line-1">
					{{ item[options.formName]||item.workName }}
				</view>
				<view class="submit-time">提交时间: {{ item.actApplyTime }}</view>
			</view>
			<view class="right">
<!-- 				<view v-if="item.finishState === '3'" class="status">
					待审核
				</view>
				<view v-else-if="item.finishState === '2'" class="status" style="background-color: #F5A623;">
					审核中
				</view> -->
				<view v-if="item.finishState === '1'" class="status" style="background-color: #2dffab;">
					{{options.finishText||"已完成"}}
				</view>
				<view v-else-if="item.finishState === '0'" class="status" style="background-color: #F5A623;">
					{{options.waitText||"进行中"}}
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import _ from 'lodash'
	import {Base64} from '../../../utils/tools.js'
	import {globalConfig} from '@/config.js'
	export default {
		name: 'stateToList',
		props: {
			item: Object,
			ext: Object,
			options:Object
		},
		created() {
			// console.log(this.item)
			this.getCustomData()
			this.icon = globalConfig.icon
			// console.log(this.custom)
		},
		data(){
			return {
				custom:null,
				icon:null
			}
		},
		methods:{
			 _get (item, str, defauleValue = '') {
					return _.get(item, str, defauleValue)
			 },
			getCustomData(){
				// this.custom=JSON.parse(Base64.decode(this.item.customValues))
				this.custom=this.item.customValues
			},
			getIcon(code){
				let value = "type"+code.slice(0,1).toUpperCase()+code.slice(1)
				return this.icon[value]
			}
		}
	}
</script>
<style lang="less" scoped>
	.self-item {
		padding: 26rpx;
		background: #fff;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
		transition: all .4s;
		margin: 0 4rpx;

		.flex {
			display: flex;
			justify-content: space-between;
				.icon{
					width: 25px;
					height: 25px;
					// padding: 5rpx;
					// mr
					position: relative;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
			.left {
				.title {
					color: #333;
					font-weight: 700;
					font-size: 32rpx;
				}

				.times {
					margin: 10rpx 0;
					color: #505050;
				}

				.text-line-1 {
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.submit-time {
					color: #a6a6a6;
				}
			}

			.flex1 {
				flex: 1;
				max-width: calc(100% - 200rpx);
				margin-top: 15rpx;
				// position: relative;
				// top: 50%;
				// left: 50%;
				// transform: translate(-50%,-50%);
			}

			.right {
				width: 164rpx;
				height: 85rpx;

				.status {
					width: 170rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 28rpx;
					background-color: #43CF7C;
					color: #ffffff;
					border-radius: 12rpx;
					font-weight: bolder;
					// display: flex;
					// margin-top: 20rpx;
					// align-items: center;
					position: relative;
					top: 50%;
					transform: translate(0, -50%);
				}
			}
		}
	}

	.self-item:active {
		background-color: #f2f2f2;
		transition: all .4s;
	}
</style>
