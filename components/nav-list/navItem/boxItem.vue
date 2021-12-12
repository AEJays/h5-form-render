<template>
	<view 
		class="magic_item_container"
		:style="[_get(item, 'container', {})]"
	>
	  <navigator :url="getNavigationUrl(item.nav || item.url)" hover-class="navigator-hover">
	      <view class="magic_item" :style="{background: item.background||'#fff'}">
					<image :src="item.img" v-if="item.img!==undefined&&item.svg===undefined" mode="aspectFit" class="image" ></image>
					
					<block v-if="item.svg!=undefined">
						<image :src="getVal(item.svg.icon)" v-if="item.svg.icon!==undefined" mode="aspectFit" class="image" ></image>
<!-- 						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='export'" :style="{'color':item.svg.color}">&#xe703;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='warning'" :style="{'color':item.svg.color}">&#xe7a5;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='instructions'" :style="{'color':item.svg.color}">&#xe622;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='radio'" :style="{'color':item.svg.color}">&#xe656;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='rules'" :style="{'color':item.svg.color}">&#xe60d;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='adminLicence'" :style="{'color':item.svg.color}">&#xe65a;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='drill'" :style="{'color':item.svg.color}">&#xe6a7;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='licence'" :style="{'color':item.svg.color}">&#xe793;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='publicity'" :style="{'color':item.svg.color}">&#xe621;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='lifeguard'" :style="{'color':item.svg.color}">&#xe68c;</i>
						<i mode="aspectFit" class="navIcon image" v-if="item.svg.icon==='employees'" :style="{'color':item.svg.color}">&#xe6b0;</i>
						<image :src="icon[item.svg.icon]" v-if="icon[item.svg.icon]" mode="aspectFit" class="image"/> -->
						<!-- <image :src="icon[item.svg.icon]" mode="widthFix" class="swiper_image" /> -->
					</block>
					<view class="title" :style="{color:item.textColor}"><span v-if="item.required===true" style="color: #F62D2D;margin-right: 2px;font-weight: bolder;">●</span>{{item.title}}</view>
	      </view>
	  </navigator>
	</view>
</template>

<script>
	import {globalConfig} from '../../../config.js'
	import _ from 'lodash'
	import qs from 'qs'
	export default {
		name:'boxItem',
		props: {
			item: {
				type: Object,
				default: function () {
					return {}
				}
			}
		},
		data(){
			return{
				icon:globalConfig.icon
			}
		},
		created() {
			// console.log(this.icon[this.item.svg.icon])
		},
		methods: {
			_get (data, field, value) {
				return _.get(data, field, value)
			},
			getVal(string){
				string = "nav"+string.replace(string[0],string[0].toUpperCase())
				// console.log(string)
				// console.log(this.icon)
				// console.log(this.icon[string])
				return this.icon[string]
			},
			getNavigationUrl (str) {
			    let text = ''
			    if (str) {
			       const route = str.split('?')[0]
			       const query = str.split('?')[1] ? qs.parse(str.split('?')[1]) : {}
			       text += (`/pages${route.charAt(0) !== '/' ? '/' : ''}` + route)
			       if (Object.keys(query).length > 0) {
			           for (const i in query) {
			               if (query[i] === '') {
			                   query[i] = this.item[i] || ''
			               }
			           }
			           text += '?query=' + encodeURIComponent(JSON.stringify(query))
			       }
			    }
			    return text
			},
		}
	}
</script>

<style lang="less">
	@font-face {
	  font-family: "navlist"; /* Project id 2620954 */
		src: 
					url('//at.alicdn.com/t/font_2620954_mi9tq7550j.woff2?t=1624106900977') format('woff2'),
					url('//at.alicdn.com/t/font_2620954_mi9tq7550j.woff?t=1624106900977') format('woff'),
					url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
					url('//at.alicdn.com/t/font_2620954_mi9tq7550j.ttf?t=1624106900977') format('truetype');
		}
	
		.navIcon {
			font-family: "navlist" !important;
			font-size: 16px;
			font-style: normal;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
	
	.magic_item_container {
		transition: all .2s;
		// background-color: white;
		.magic_item {
			margin: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 28rpx;
			border-radius: 6rpx;
			padding: 50rpx 0;
			.image {
			    width: 60rpx;
			    height: 60rpx;
					line-height: 60rpx;
					font-size: 60rpx;
					margin: 0 auto;
			    border-radius: 50%;
			    padding: 30rpx;
					text-align: center;
			}
			>.title {
			    white-space: wrap;
					// width: 5em;
					height: 2em;
					text-align: center;
			    text-overflow: ellipsis;
			    overflow: hidden;
			}
		}
	}
	.magic_item_container:active {
		// background-color: #f2f2f2;
		.magic_item{
			opacity: .7;
			transition: all .2s;
		}
	}
</style>
