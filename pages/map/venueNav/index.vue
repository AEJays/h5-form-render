<template>
	<view class="venue_container">
		<map 
			id="nav_map"
			:latitude="latitude" 
			:longitude="longitude" 
			:markers="markers"
			:show-location="true"
            @callouttap='handleCallouttap'
            :style="{width: `${bodyWidth}px`, height: `${bodyHeight}px`}" 
		>
			<cover-view slot="callout">
				<cover-view 
					v-for="item in markers" 
					:key="item.id" 
					:marker-id="item.id"
                    :style="{
                        width: '116rpx',
                        height: '116rpx',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10rpx',
						boxShadow: '0 0 10px 0 #c1c1c1',
                        background: item.colour||'#333',
                    }"
				>
					<button 
                        class="map_customCallout"
                        :style="{
													background: item.colour||'#333',
                        }"
                    >
                      {{item.title}}
                    </button>
				</cover-view>
			</cover-view>
            <cover-view class="map_control_local">
                <cover-image 
					src="/static/icons/nav/local.png" 
					style="width: 40rpx;height: 40rpx;" 
					@click="handleToLocal"
				/>
            </cover-view>
		</map>
		<view class="tag_content">
			<view class="my_localtion" v-if="myAddress">
				<view class="local_text">我的位置：</view>
				<view class="local_value">{{myAddress}}</view>
			</view>
            <view class="top_action">
                <view class="text">执法对象</view>
                <view class="action" @click="handleToList">更多...</view>
            </view>
			<view class="tag_list">
                <icon-text
                    v-for="(item, index) in typeList.slice(0,5)" 
                    :key="index" 
                    :url="item.url" 
                    :title="item.title"
										:type="item.type"
                    :imageBg="`rgb(${item.colour})` || '#333'"
                    :selectTitle="currentType"
                	@onClick="handleClick"
                />
            </view>
		</view>
	</view>
</template>

<script>	
    import iconText from '../../../components/nav/iconText.vue'
	import { getNavList, getNavTypeList } from '@/common/api.js'
	import _ from 'lodash'
	import { getAddress } from '@/utils/mapTools.js'
	
	
	const customCallout = {
		anchorX: 0,
		anchorY: 0,
		display: "ALWAYS"
	}
	export default {
        components: {
            iconText
        },
		data() {
			return {
				bodyWidth: uni.getSystemInfoSync().windowWidth,
				bodyHeight: uni.getSystemInfoSync().windowHeight,
                latitude: 0.00,  // 地图纬度
                longitude: 0.00, // 地图经度
                myLatitude: 0.00,  // 用户当前的纬度
                myLongitude: 0.00,  // 用户当前的纬度
                myAddress: '', // 用户详细位置
                list: [], // 所有数据源
				markers: [],
                allmarkers: [], // 存起所有的标注信息
				typeList: [],
                currentType: ''
			}
		},
		created() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					getAddress(
						{
							latitude:  _.get(res, 'latitude'), 
							longitude: _.get(res, 'longitude')
						},
						(res) => {
							// console.log('localcurrent', res)
							this.myAddress = _.get(res, 'address')
						}
					)
					this.latitude = _.get(res, 'latitude')
					this.longitude = _.get(res, 'longitude')
					this.myLatitude = _.get(res, 'latitude')
					this.myLongitude= _.get(res, 'longitude')
				}
			})
			      this.fetchTypeList()
			      this.fetchList()
		},
		async mounted() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					getAddress(
						{
							latitude:  _.get(res, 'latitude'), 
							longitude: _.get(res, 'longitude')
						},
						(res) => {
							// console.log('localcurrent', res)
							this.myAddress = _.get(res, 'address')
						}
					)
					this.latitude = _.get(res, 'latitude')
					this.longitude = _.get(res, 'longitude')
					this.myLatitude = _.get(res, 'latitude')
					this.myLongitude= _.get(res, 'longitude')
				}
			})
            this.fetchTypeList()
            this.fetchList()
		},
		methods: {
            // 获取类别数据
            async fetchTypeList () {
                const res = await getNavTypeList({pageSize:100})
								// console.log(res)
                if (res.code === 200) {
                    this.typeList = _.cloneDeep(_.get(res, 'data.records', []))
                }
            },
			async fetchList () {
                uni.showLoading({title: '',mask: true})
				const res = await getNavList({
                    // size: 9007199254740992,
                    // type:"EDU"
										searchAll:true
                })
                uni.hideLoading()
								// console.log("加载完成",res)
				if (res.code === 0) {
					// console.log("地图数据",res)
					this.list = _.get(res, 'data.records', [])
					// console.log(this.list)
                    const markersList = []
					this.list.map((item, index) => {
                        markersList.push({
                        	id: index + 1,
                            // latitude: 23.12463,
                            // longitude: 113.36199,
                        	latitude: item.latitude,
                        	longitude: item.longitude,
                        	title: item.name,
                        	customCallout: {...customCallout},
                            colour: this.getCustomCalloutBgColor(item.type),
                            type: item.type,
                            address: item.address
                        })
					})
                    this.markers = [...markersList]
                    this.allmarkers = [...markersList]
				}
			},
			getCustomCalloutBgColor (title) {
				let color = '#333'

					
					if(title.indexOf("[")!==-1){
						let firstColor
						let lastColor
						if(this.typeList.some(x=>x.type === JSON.parse(title)[0])){
							let value = this.typeList.find(x => x.type === JSON.parse(title)[0])
							// console.log(value)
							firstColor = `rgb(${value.colour})`
						}else{
							firstColor = "#333"
						}
						if(this.typeList.some(x=>x.type === JSON.parse(title)[JSON.parse(title).length-1])){
							let value = this.typeList.find(x => x.type === JSON.parse(title)[JSON.parse(title).length-1])
							lastColor = `rgb(${value.colour})`
						}else{
							lastColor = "#333"
						}
						color = `${firstColor}` //渐变用不了 弃用
						
					}else{
						if (this.typeList.some(x => x.type === title)) {
							// console.log('typeList',this.typeList)s
						 const item = this.typeList.find(x => x.type === title)
						 // console.log("item",item)
						 color = `rgb(${item.colour})`
						}
					}
					
					// console.log(color)
				return color
			},
			handleClick (title) {
				// console.log(this.latitude,'lat')
				// console.log(this.longitude,'long')
                this.currentType = title
								let newMarkers = []
                this.allmarkers.map((item,i)=>{
									if(item.type.indexOf("[")!==-1){
										JSON.parse(item.type).map((marker,m)=>{
											if(marker === title){
												newMarkers.push(item)
											}
										})
									}else{
										if(item.type === title){
											newMarkers.push(item)
										}
									}
								})
								this.markers = newMarkers
				if (this.markers.length > 0) {
					// for(let i=0;i<this.markers.length;i++){
						// this.latitude = _.get(this.markers, '['+i+'].latitude')
						this.latitude = _.get(this.markers, '[0].latitude')
						this.longitude = _.get(this.markers, '[0].longitude')
						uni.createMapContext("nav_map", this).moveToLocation({
							longitude: this.longitude,  
							latitude: this.latitude,  
						});  
					// }

				}
			},
            handleToList () {
                uni.navigateTo({
                	url: '../venueList/index',
                })
            },
            handleCallouttap(e) {
				uni.showLoading({ title: '', mask: true })
                const markerId = Number(_.get(e, 'detail.markerId', 0))
                if (markerId === 0) {
                    return
                }
                const item = this.allmarkers.find(x => x.id === markerId)
				getAddress(
					{
						latitude:  _.get(item, 'latitude'), 
						longitude: _.get(item, 'longitude')
					},
					(res) => {
						// console.log('localcurrent', res)
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
            // 回到当前位置
            handleToLocal () {
                uni.createMapContext("nav_map", this).moveToLocation({
                	longitude: this.myLongitude,  
                	latitude: this.myLatitude,  
                }); 
            }
		}
	}
</script>

<style lang="less">
    .baseFlex {
      display: flex;
      justify-content: center;
      align-items: center;
    }
	.venue_container {
		.baseFlex();
        position: relative;
		height: 100vh;
        overflow: hidden;
		.map_customCallout {
			.baseFlex();
			text-align: center;
			color: #fff;
			font-size: 22rpx;
			display: -webkit-box; /*弹性伸缩盒子模型显示*/
			-webkit-box-orient: vertical; /*排列方式*/ 
			-webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
			overflow: hidden; /*溢出隐藏*/
            line-height: unset;
            margin: 0;
            padding: 5rpx;
            position: relative;
            z-index: 999;
		}
        .map_customCallout::after {
            content: none;
        }
        
        .map_control_local {
            .baseFlex();
            margin-top: 30rpx;
            margin-left: 30rpx;
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			background-color: #fff;
        }
        
		.tag_content {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			background-color: #fff;
            padding: 40rpx 12rpx;
			box-shadow: 0 0 20px rgba(158, 158, 158, 0.3);
			border-top-left-radius: 14rpx;
			border-top-right-radius: 14rpx;
			
			.my_localtion {
				font-size: 28rpx;
				display: flex;
				margin: 0 30rpx 20rpx 30rpx;
				transform: translateY(-8rpx);
				.local_text {
					color: #1296db;
				}
				.local_value {
					flex: 1;
				}
			}
			
            .tag_list {
                display: grid;
                grid-template-columns: repeat(5, 20%);
                grid-row-gap: 30rpx;
            }
            .top_action {
                margin: 0 30rpx 34rpx 30rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28rpx;
                line-height: 1.5;
                >.text {
                    color: rgba(80, 80, 80, 1);
                    font-size: 32rpx;
                    text-align: left;
                    font-weight: bold;
                }
                >.action {
                    color: rgba(80, 80, 80, 1);
                    padding: 0 5px;
                    border-radius: 3px;
					transition: all .2s;
                }
                >.action:active {
                    background: #f2f2f2;
					transition: all .2s;
                }
            }
		}
	}
</style>


