<template>
	<view class="venue_list_container">
<!--        <view class="tab_list" v-if="typeList.length > 0">
            <ms-tabs 
                :list="typeList" 
                v-model="tabActive"
                @selected="handleSelectTab"
            />
        </view> -->
				<view style="background-color: #fff;padding: 10px 15px;">
					<view class="search_list_box">
						<image :src="icon.navSearch" style="width: 16px;height: 16px;position: absolute;top: 7px;left: 14px;" mode="aspectFit"></image>
						<input v-model="search" @input="fetchSearchList"/>
					</view>
				</view>
		<load-refresh
            ref="loadRefresh"
            :isRefresh="false"
            refreshType="hollowDots"
            color="#04C4C4"
            :heightReduce="typeList.length > 0 ? 96 : 0"
            backgroundCover="#F3F5F5"
            :currentPage="listCurrentPage"
            :totalPages="listTotalPages" 
            @loadMore="loadMore" 
            @refresh="refresh"
		 >
		  <view slot="content-list" class="list_content">
		    <view 
				v-for="(item, index) in list" 
				:key='index' 
				class="list_item"
			>
<!-- 				<img
					:src="(item.houseOwershipImages.toString()===''?undefined:item.houseOwershipImages) || '../../../static/images/empty.png'"
					class="image"
				/> -->
				<view class="message_content">
					<view class="title_status">
						<text class="title">{{item.name}}</text>
<!-- 						<view 
                            class="status" 
                            :style='{
                                color: getStatusColor(item.status),
                                borderColor: getStatusColor(item.status)
                            }'
                        >
                            {{item.status}}
                        </view> -->
					</view>
					<view class="message_content_box">
						<view style="flex: 1;">
							<view v-if="item.address">所在位置:{{item.address}}</view>
							<view v-if="item.streetName">所在街道:{{item.streetName}}</view>
							<view v-if="item.realOpAddress">真实地址:{{item.realOpAddress}}</view>
							<view v-if="item.personPhone">联系电话:{{item.personPhone}}</view>
						</view>
						<view style="display: flex;">
							<view class="message_button" v-if="item.personPhone">
								<image :src="icon.phone" class="message_button_image" mode="aspectFit" @click="handleCallPhone(item.personPhone)"></image>
								<text>电话</text>
							</view>
							<view class="message_button" v-if="item.latitude&&item.longitude">
								<image :src="icon.go" class="message_button_image map" mode="aspectFit" @click="handleToMap(item)"></image>
								<text>到这去</text>
							</view>
						</view>
					</view>
<!-- 					<view class="address">
                        <image src="@/static/icons/nav/address.svg" class="address_icon" />
                        <view class="address_text">{{item.address}}</view>
                    </view>
					<view class="phone">
                        <image src="@/static/icons/nav/phone.svg" class="phone_icon"/>
                        <view class="phone_text" @click.stop="handleCallPhone(item.personPhone)">{{item.personPhone}}</view>
                    </view> -->
				</view>
			</view>
		  </view>
		</load-refresh>
	</view>
</template>

<script>
    import _ from 'lodash'
	import loadRefresh from '@/components/load-refresh/map-load-refresh.vue'
	import { getNavList, getNavTypeList } from '@/common/api.js'
    import msTab from '../../../components/ms-tabs/ms-tabs.vue'
	import { getAddress } from '@/utils/mapTools.js'
    import {globalConfig} from '@/config.js'
    
	export default {
		components: {
		  loadRefresh,
          msTab
		},
		data () {
			return {
				listCurrentPage: 1,
				listTotalPages: 10,
				list: [],
				listPages:2,
				typeList: [],
				tabActive: 0,
				currentType: '全部'  ,// 当前所选类别
				search:"",
				icon:{}
			}
		},
		onLoad() {            
            this.fetchTypeList()
			this.fetchList()
		},
		created() {
			this.icon = globalConfig.icon
		},
		methods: {
            getStatusColor (title) {
              const obj = {
                   '已检查': 'rgba(67, 207, 124, 1)',
                   '未检查': 'rgba(227, 60, 100, 1)'
              }
              return obj[title] ? obj[title] : '#333'
            },
            
            // 获取类别数据
            async fetchTypeList () {
                const res = await getNavTypeList(
                    )
                if (res.code === 200) {
                    const list = _.cloneDeep(_.get(res, 'data.records', []))
                    list.unshift({ title: '全部'})
                    this.typeList = [...list]
                }
            },
						async fetchSearchList(data){
							uni.showLoading({ title: 'loading...', mask:true })
											// console.log(this.currentType)
											// if(this.search===""){
											// 	this.search = null
											// }
											let searchList = this.search?{
												name:this.search
											}:{}
							const res = await getNavList({ 
							            size: this.listTotalPages, 
							            current: 1,
							            ...this.currentType===undefined?{}:this.currentType !== '全部' ? { type: this.currentType } : {},
													...searchList
							         })
							        uni.hideLoading()		
							this.list = [..._.get(res, 'data.records', [])]
							this.listCurrentPage = 1+1
							// this.listTotalPages = this.listTotalPages
							this.listPages = _.get(res, 'data.pages', 1)
							        this.$refs.loadRefresh.completed()
						},
            
			async fetchList (data) {
                uni.showLoading({ title: 'loading...', mask:true })
								// console.log(this.currentType)
								let searchList = this.search?{
									name:this.search
								}:{}
				const res = await getNavList({ 
                    size: this.listTotalPages, 
                    current: this.listCurrentPage,
                    ...this.currentType===undefined?{}:this.currentType !== '全部' ? { type: this.currentType } : {},
										...searchList
                 })
                uni.hideLoading()		
				this.list = this.list.concat([..._.get(res, 'data.records', [])])
				this.listCurrentPage = this.listCurrentPage+1
				// this.listTotalPages = this.listTotalPages
				this.listPages = _.get(res, 'data.pages', 1)
                this.$refs.loadRefresh.completed()
			},
			loadMore () {
				// this.listCurrentPage = this.listCurrentPage + 1
				if(this.listCurrentPage<=this.listPages){
					this.fetchList()
				}
			},
			handleToMap (item) {
				uni.showLoading({ title: '', mask: true })
				getAddress(
					{
						latitude:  _.get(item, 'latitude'), 
						longitude: _.get(item, 'longitude')
					},
					(res) => {
						uni.hideLoading()
						uni.openLocation({
						    latitude: item.latitude,
						    longitude: item.longitude,
							name: item.address,
						    address: _.get(res, 'address'),
						})
					}
				)
			},
            
            // 选中tab时
            handleSelectTab (e) {
                this.tabActive = e
                const type = this.typeList[e].type
                if (this.currentType === type) {
                    return
                }
				this.currentType = type
                this.listCurrentPage = 1
                this.listTotalPages = 10
				setTimeout(() => {
					this.list = []
					this.fetchList()
				}, 200)
            },
            
            // 拨打电话
            handleCallPhone (phone) {
                if (!phone) {
                    return
                }
                uni.showModal({
                    content: '是否拨打号码？',
                    success: (e) => {
                        if (e.confirm) {
                          uni.makePhoneCall({
                              phoneNumber: phone
                          })  
                        }
                    },
                })
            }
		}
	}
</script>

<style lang="less" scoped>
	.venue_list_container {
		background-color: #e5e5e5;
        font-size: 24rpx;
        .tab_list {
            border-bottom: 1px solid #f2f2f2;
			font-family: Microsoft YaHei;
        }
	}
	.message_content_box{
		display: flex;
		
	}
	.search_list_box{
    /* margin: 10px 10px; */
    width: auto;
    height: 30px;
    background: #D9D9D9;
    border-radius: 30px;
    border: 2px solid #ccc;
		position: relative;
		&>input{
			margin: 0 auto;
			width: 80%;
			height: 30px;
			font-size: 14px;
			color: #333;
		}
	}
	.list_content {
		background-color: #fff;
		.list_item {
			display: flex;
			padding: 30rpx 16rpx;
			border-bottom: 1px solid #f2f2f2;
            transition: all .3s;
            line-height: 1.5;
			>.image {
				width: 248rpx;
				height: 194rpx;
				background-position: center;
				background-size: cover;
				background-repeat: no-repeat;
			}
			.message_content {
				flex: 1;
				margin-left: 28rpx;
				font-size: 28rpx;
                .title_status {
                    display: flex;
                    align-items: center;
                    .title {
                        color: rgba(80, 80, 80, 1);
                    	font-size: 32rpx;
                    	font-weight: bold;
                    	margin-right: 10rpx;
                        max-width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        // display: box;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .status {
                    	color: rgba(42, 130, 228, 1);
                    	border-radius: 20px;
                    	font-size: 16rpx;
                    	border: 1px solid rgba(42, 130, 228, 1);
                    	padding: 4rpx 12rpx;
                    	margin-left: 10rpx;
                        height: fit-content;
                        margin-top: 2rpx;
                    }
                }
				.address {
					color: rgba(80, 80, 80, 1);
					margin: 10rpx 0;
                    display: flex;
                    .address_icon {
                        width: 32rpx;
                        height: 32rpx;
                        margin-right: 10rpx;
                        transform: translate(-2rpx, 6rpx);
                    }
                    .address_text {
                        flex: 1;
                    }
				}
                .phone {
                    color: rgba(80, 80, 80, 1);
                    font-size: 24rpx;
                    display: flex;
                    .phone_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 14rpx;
                    }
                    .phone_text {
                        // flex: 1;
                        display: inline-block;
                    }
                }
			}
		}
		.message_button{
			width: 40px;
			margin: 10px 5px;
			font-size: 10px;
			text-align: center;
			.message_button_image{
				width: 30px;
				height: 30px;
				border-radius: 50%;
				border: 1px solid #637082;
				padding: 5px;
				&>text{
					font-size: 14px;
				}
			}
			.phone{
				
			}
			.map{
					background-color: #637082;
			}
		}
        .list_item:active {
            background-color: #f2f2f2;
            transition: all .3s;
        }
	}
</style>
