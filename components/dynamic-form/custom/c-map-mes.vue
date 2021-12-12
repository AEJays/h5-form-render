<template>
	<view>
		<view class="c-Map" v-if="param.disabled">
				<view class="c-Map-label"><span style="color: red;margin-right: 2px;" v-if="param.required">*</span>{{param.label}}</view>
				<map
					id="mapMes"
					:latitude="latitude" 
					:longitude="longitude" 
					:markers="markers"
					:show-location="true"
					:style="{width:'200px',height:'100px','z-index':zIndex,'background-color':'white'}"
					@click="handleToMap"
				/>
		</view>

		<view class="c-Map" v-if="!param.disabled">
			<view class="c-Map-label"><span style="color: red;margin-right: 2px;" v-if="param.required">*</span>{{param.label}}</view>
			<map
			v-show="!showButton"
				id="mapMes"
				:latitude="latitude" 
				:longitude="longitude" 
				:markers="markers"
				:show-location="true"
				:style="{width:'200px',height:'100px','z-index':zIndex,'background-color':'white'}"
				@click="Bigsize()"
			>
	<!-- 		<cover-view slot="callout">
				<cover-image
					:marker-id="markers[0].id"
					:style="{
											width: '116rpx',
											height: '116rpx',
											borderRadius: '50%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											padding: '10rpx',
					boxShadow: '0 0 10px 0 #c1c1c1',
											backgroundColor: 'rgba('+item.colour+')' || '#333',
											"z-index":10001
									}"
					:src="icon.MapCompany"
				></cover-image>
			</cover-view> -->
			<cover-view v-show="showButton" class="c-Map-buttonbox">
				<cover-image class="c-Map-button" :src="icon.MapMy" @click="moveMy()">
				</cover-image>
				<cover-image class="c-Map-button" :src="icon.MapSuccess" @click="smallsize()">
				</cover-image>
			</cover-view>
			<cover-view></cover-view>
			</map>
			<map
			v-show="showButton"
						id="mapMes"
						:latitude="latitude" 
						:longitude="longitude" 
						:markers="markers"
						:show-location="true"
						:style="{width:width,height:height,position:position,top:0,left:0,'z-index':zIndex,'background-color':'white'}"
						@tap="tap"
						@controltap="Bigsize()"
					>
			<!-- 		<cover-view slot="callout">
						<cover-image
							:marker-id="markers[0].id"
							:style="{
													width: '116rpx',
													height: '116rpx',
													borderRadius: '50%',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													padding: '10rpx',
							boxShadow: '0 0 10px 0 #c1c1c1',
													backgroundColor: 'rgba('+item.colour+')' || '#333',
													"z-index":10001
											}"
							:src="icon.MapCompany"
						></cover-image>
					</cover-view> -->
					<cover-view v-show="showButton" class="c-Map-buttonbox">
						<cover-image class="c-Map-button" :src="icon.MapMy" @click="moveMy()">
						</cover-image>
						<cover-image class="c-Map-button" :src="icon.MapSuccess" @click="smallsize()">
						</cover-image>
						<cover-view class="c-Map-text">
							请在地图上点击选择企业地址
						</cover-view>
					</cover-view>
					</map>
		</view>
	</view>
</template>

<script>
	import _ from 'lodash'
	import { getAddress } from '@/utils/mapTools.js'
	import { globalConfig } from '@/config.js'
	export default {
		name:"c-map-mes",
		data() {
			return {
				latitude:0,
				longitude:0,
				myLatitude:0,
				myLongitude:0,
				markers:[
				],
				icon:null,
				width:"200px",
				height:"100px",
				position:"static",
				showButton:false,
				value:null,
				myAddress:null,
				zIndex:5
			}
		},
		props: {
		    param: {
		        type: Object
		    }
		},
		created() {
			this.icon = globalConfig.icon
		},
		async mounted(){
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					// console.log("res",res)
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
				},
				fail(res){
					// console.log("err",res)
				}
			})
			// console.log("value",this.param.value)
			// console.log("param",this.param)
			this.value = {
				...this.param.value,
				id:1,
				scale:5,
				iconPath:this.icon.MapCompany,
				width:"50px",
				height:"50px",
				title:"公司所在地"
			}
			let defaultValue = {
				latitude:0,
				longitude:0,
				id:1,
				scale:5,
				iconPath:this.icon.MapCompany,
				width:"50px",
				height:"50px",
				title:"公司所在地"
			}
			if(this.param.value){
				uni.createMapContext("mapMes",this).moveToLocation({
					longitude:this.param.value.longitude,
					latitude:this.param.value.latitude
				})
			}else{
				uni.createMapContext("mapMes",this).moveToLocation({
					longitude:this.longitude,
					latitude:this.latitude
				})
			}

			this.markers.push(this.value)

		},
		methods: {
			handleToMap(){
				uni.openLocation({
					longitude:this.param.value.longitude,
					latitude:this.param.value.latitude,
					name:"公司所在地"
				})
			},
			Bigsize(){ 
				this.width=uni.getSystemInfoSync().windowWidth+'px',
				this.height=uni.getSystemInfoSync().windowHeight+'px',
				this.position="fixed"
				this.showButton=true
				this.zIndex=10000
			},
			
			smallsize(){
				this.width='200px',
				this.height='100px',
				this.position=""
				this.showButton=false
				this.zIndex=1
			},
			//点击地图触发
			tap(e){
				this.markers = []
				let detail = e.detail
				this.latitude = detail.latitude
				this.longitude = detail.longitude
				// console.log(e.detail)
				this.value = {
					id:1,
					scale:5,
					latitude:this.latitude,
					longitude:this.longitude,
					iconPath:this.icon.MapCompany,
					width:"50px",
					height:"50px",
					title:"公司所在地"
				}
				let that = this
				uni.showModal({
					title:"是否确定选择该地点为公司地址？",
					confirmText:"确定",
					confirmColor:"#FC1944",
					success(button) {
						// console.log(button)
						if(button.confirm){
							that.markers.push(that.value)
							uni.createMapContext("mapMes",that).moveToLocation({
								longitude:that.longitude,
								latitude:that.latitude
							})
							that.$emit("map",that.value)
						}
					}
				})

				// console.log("Marker",this.markers)
			},
			moveMy(){
				uni.createMapContext("mapMes",this).moveToLocation({
					longitude: this.myLongitude,  
					latitude: this.myLatitude,  
				})
			}
			// callouttap(e){
			// 	this.markers = []
			// 	let detail = e.detail
			// 	this.latitude = detail.latitude
			// 	this.longitude = detail.longitude
			// 	// console.log(e.detail)
			// 	let value = {
			// 		id:1,
			// 		latitude:this.latitude,
			// 		longitude:this.longitude
			// 	}
			// 	this.markers.push(value)
			// 	// console.log("Marker",this.markers)
			// }
		}
	}
</script>

<style lang="less">
	.c-Map{
		display: flex;
		background-color: white;
		padding: 10px 0;
		.c-Map-label{
			font-weight: bolder;
			font-size: 14px;
			width: 110px;
			margin-left: 10px;
			color: #333;
		}
		.c-Map-button{
			background-color: white;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			padding: 10px;
			margin: 10px;
		}
		.c-Map-text{
			position: absolute;
			right: 5px;
			bottom: 5px;
			color: #777;
			font-weight: bolder;
		}
	}
</style>
