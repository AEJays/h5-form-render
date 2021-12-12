<template>
	
	<view>
		<dynamic-page
			v-if="current == 0"
		   :API="getPageAapi"
		/>
		
<!-- 		<law-enforcement v-if="current == 1" />
		<
		<return-to-work v-if="current == 2"/> -->
		<notice v-if="current == 1"/>
		<my theme="company" :item="query" :list="list" v-if="current == 2"></my>
		
		<!-- <my-page v-if="current == 1"/> -->
		
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
			  首页
			</van-tabbar-item>
			
<!-- 			<van-tabbar-item>
			  <image
				slot="icon"
				src="/static/tabbar/work.png"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  <image
				slot="icon-active"
				src="/static/tabbar/work-on.png"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  执法
			</van-tabbar-item>
			
			<van-tabbar-item>
			  <image
				slot="icon"
				src="/static/tabbar/work.png"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  <image
				slot="icon-active"
				src="/static/tabbar/work-on.png"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  复工
			</van-tabbar-item> -->
			<van-tabbar-item>
			  <image
				slot="icon"
				:src="icon.tabbarPolicy"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  <image
				slot="icon-active"
				:src="icon.tabbarPolicyActive"
				mode="aspectFit"
				style="width: 44rpx; height: 44rpx;"
			  />
			  公告
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
	import dynamicPage from '@/components/dynamic-page/index.vue'
	import notice from '@/pages/notice.vue'
	import my from '../enforcement/my/my.vue'
	import myPage from '@/pages/companyHome/my/index.vue'
	import returnToWork from '@/pages/companyHome/my/returnToWork.vue'
	import lawEnforcement from '@/pages/companyHome/lawEnforcement/index.vue'
	import { globalConfig } from '@/config.js'
	
	
	export default {
		components:{ 
			dynamicPage,
			myPage,
			returnToWork,
			lawEnforcement,
			my,
			notice
		},
		onInit() {
			this.icon=globalConfig.icon
			uni.hideHomeButton()
		},
		created() {
			this.icon=globalConfig.icon
			uni.hideHomeButton()
			this.getList()
			this.isOnceBinding()
		},
		onLoad (e){
			let query = JSON.parse(decodeURIComponent(e.query))
			this.query = query
			this.icon=globalConfig.icon
			uni.hideHomeButton()
		},
		data() {
			return {
				getPageAapi: globalConfig.formHost + '?id=109',
				current: 0,
				icon:{},
				query:{},
				list:[]
			}
		},
		methods:{
			// 是否初次绑定
			isOnceBinding(){
				let isOne = uni.getStorageSync("isOneCompanyRegister")
				// console.log(isOne,"isOne")
				if(!isOne){
				}else{
					uni.showModal({
						title:"是否初次上报？",
						cancelText:"否",
						confirmText:"去上报",
						success(button){
							if(button.confirm){
								uni.navigateTo({
									url:`/pages/companyHome/selfCheck/index?next=${encodeURIComponent(`/pages/workFlow/ReturnWork?next=/pages/defaultPage/defaultPage`)}`,
									fail(err){
										// console.log(err)
									}
								})
							}else{
								uni.removeStorageSync("isOneCompanyRegister")
							}
						},
						fail(err){
							// console.log(err)
						}
					})
				}
			},
			onChange(event) {
				// console.log('event = ', event.detail)
				this.current = event.detail
				this.getList()
			},
			getList(){
				let that = this
				uni.request({
					url:`${globalConfig.dataHost}?id=5555`,
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
	// page {
	// 	height: 100%;
	// 	background-color: #E5E5E5;
	// 	padding: 6rpx 0;
	// }
	
</style>
