<template>
	<view>
		<dynamic-page style="margin-bottom: 50px;" :API="api" v-if="current===0&&loading===false">
		</dynamic-page>
<!-- 		<view v-if="current===0">
			<view class="title-box">
				<view class="title">
					<image :src="query.avatar" class="avatar"></image>
					<view class="title-name">欢迎您,{{query.nickName}}</view>
				</view>
				<view class="circle"></view>
			</view>
			<dynamic-page :API="newAPI" v-if="loading===false">
				
			</dynamic-page>
		</view> -->

		
		<DataBase v-if="current===1"></DataBase>
		
		<my :item="query" :list="list" v-if="current===2"></my>
		
		<van-tabbar :active="current" @change="onChange">
					<van-tabbar-item>
					  <image
						slot="icon"
						:src="icon.tabbarEnforcement"
						mode="aspectFit"
						style="width: 30px; height: 18px;"
					  />
					  <image
						slot="icon-active"
						:src="icon.tabbarEnforcementActive"
						mode="aspectFit"
						style="width: 44rpx; height: 44rpx;"
					  />
					  执法
					</van-tabbar-item>
					
					<van-tabbar-item>
					  <image
						slot="icon"
						:src="icon.tabbarCompanyData"
						mode="aspectFit"
						style="width: 44rpx; height: 44rpx;"
					  />
					  <image
						slot="icon-active"
						:src="icon.tabbarCompanyDataActive"
						mode="aspectFit"
						style="width: 44rpx; height: 44rpx;"
					  />
					  企业库
					</van-tabbar-item>
					
					<van-tabbar-item>
					  <image
						slot="icon"
						:src="icon.tabbarMy"
						mode="aspectFit"
						style="width: 44rpx; height: 44rpx;"
					  />
					  <image
						slot="icon-active"
						:src="icon.tabbarMyActive"
						mode="aspectFit"
						style="width: 44rpx; height: 44rpx;"
					  />
					  我的
					</van-tabbar-item>
				</van-tabbar>
	</view>
</template>

<script>
	import _ from 'lodash'
	import card from '../../components/other/Card.vue'
	import DynamicPage from '../../components/dynamic-page/index.vue'
	import DataBase from '../enforcement/enterpriseDatabase.vue'
	import my from '../enforcement/my/my.vue'
	import { globalConfig } from '@/config.js'
	export default {
		data() {
			return {
				// api: globalConfig.formHost + '?id=2000',
				api: globalConfig.formHost + '?id=3456789',
				icon:"",
				current: 0,
				query:"",
				loading:false,
				list:[],
				newAPI: globalConfig.formHost + '?id=333333'
			}
		},
		// onShow() {
		// 	uni.hideHomeButton()
		// },
		created() {
			uni.hideHomeButton()
			this.icon=globalConfig.icon
			this.getList()
		},
		onInit() {
			uni.hideHomeButton()
			this.icon=globalConfig.icon
		},
		onPullDownRefresh() {
			uni.showLoading({
				title:"加载中..."
			})
			this.loading=true
			// console.log(this.loading)
			// this.$forceUpdate()
			this.loading=false
			uni.hideLoading()
		},
		onLoad(e){
			let query = JSON.parse(decodeURIComponent(e.query))
			this.query = query
			// console.log(query)
			this.icon=globalConfig.icon
			uni.hideHomeButton()
			this.$reload()
		},
		methods: {
			onChange(event) {
				// console.log('event = ', event.detail)
				this.current = event.detail
				this.getList()
			},
			getList(){
				let that = this
				uni.request({
					url:`${globalConfig.dataHost}?id=5557`,
					method:"GET",
					success(res) {
						// console.log("res",res)
						that.list = res.data.data.list
					}
				})
			}
		},
		components:{
			DynamicPage,
			my,
			DataBase
		}
	}
</script>

<style lang="less">
	.title-box{
		height: 250rpx;
		width: 100%;
		background: linear-gradient(#1A5EB5,#7091b5);
		.title{
			display: flex;
			align-items: center;
			height: 250rpx;
			line-height: 250rpx;
			width: 90%;
			margin: 0 auto;
			.avatar{
				width: 50px;
				height: 50px;
				// line-height: 250rpx;
				border-radius: 10px;
			}
			.title-name{
				margin-left: 20px;
				// height: 50px;
				color: white;
				// font-weight: bolder;
				// line-height: 250rpx;
				// line-height: 50px;
				text-align: center;
			}
		}
		.circle{
			position: relative;
			bottom: 50rpx;
			background-color: white;
			height: 50rpx;
			border-top-left-radius: 25rpx;
			border-top-right-radius: 25rpx;
		}
	}
</style>
