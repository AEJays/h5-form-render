<template>
	
	<view style="margin-top:-3px">
		<dynamic-page
		:style="{
			'padding':0
		}"
		   :API="getPageAapi"
		    v-if="current == 0"
		/>
		
		<!-- <street-user-report v-if="current == 1" /> -->
		<my theme="street" :item="query" :list="list" v-if="current == 1"></my>
		
		<!-- <my-page v-if="current === 1" /> -->
		
		<van-tabbar :active="current" @change="onChange">
			<van-tabbar-item>
			  <image
				slot="icon"
				:src="icon.tabbarCompanyData"
				mode="aspectFit"
				style="width: 30px; height: 18px;"
			  />
			  <image
				slot="icon-active"
				:src="icon.tabbarCompanyDataActive"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  街道
			</van-tabbar-item>
				<span
				style="background-color: #1A5EB5;color: white;width: 50px;height: 40px;line-height: 40px;
				box-shadow: 0px 0px 0px #666;margin: 5px auto;font-weight: bolder;border-radius: 15px;font-size: 25px;
				text-align: center;
				" @click="add()"
				>
					+
				</span>
			
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
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import { globalConfig } from '@/config.js'
	import streetUserReport from '@/pages/street/community/streetUserReport'
	import myPage from '@/pages/street/my/index'
	import my from '../enforcement/my/my.vue'
	
	export default {
		components:{ 
			dynamicPage,
			streetUserReport,
			myPage,
			my
		},
		onInit() {
			this.icon=globalConfig.icon
			uni.hideHomeButton()
		},
		created() {
			this.icon=globalConfig.icon
			uni.hideHomeButton()
			this.getList()
		},
		onLoad (e){
			let query = JSON.parse(decodeURIComponent(e.query))
			this.query = query
			this.icon=globalConfig.icon
			uni.hideHomeButton()
		},
		data() {
			return {
				getPageAapi: globalConfig.formHost + '?id=108',
				// getSPageApi: globalConfig.formHost + '?id=5600',
				current: 0,
				icon:{},
				query:{},
				list:[]
			}
		},
		
		methods:{
		  onChange(event) {
				// console.log('event = ', event.detail)
				this.current = event.detail
				this.getList()
		  },
			add(){
				uni.navigateTo({
					url:'/pages/street/community/streetUserReport'
				})
			},
			getList(){
				let that = this
				uni.request({
					url:`${globalConfig.dataHost}?id=5556`,
					method:"GET",
					success(res) {
						// console.log("res",res)
						that.list = res.data.data.list
					}
				})
			}
		}
	}
</script>

<style lang="less">
	
	
	
</style>
