<template>
	<view>
		<view class="banners">
			<banner :list="item"></banner>
		</view>
		<card :title="cardTitle" :Style="cardStyle" v-if>
			<magic-nav :item="NavItem" :moduleData="NavData"></magic-nav>
		</card>
	</view>
</template>

<script>
	import banner from '../../components/swiper-images/index.vue'
	import card from '../../components/other/Card.vue'
	import MagicNav from '../../components/other/MagicNav.vue'
	import { getDynamicFormField } from '../../common/api.js'
	import _ from 'lodash'
	export default {
		components:{banner,card,MagicNav},
		data(){
			return {
				// banner --- 缺少Vant轮播图组件
				config:{},
				item:{},
				moduleData:{},
				// MagicNav
				NavItem:{},
				NavData:{},
				// card
				cardStyle:{},
				cardTitle:'',
			}
		},
		onLoad() {
		    this.fetchData();
				this.fetchNavData();
		},
		methods:{
			async fetchData(){
				const res = await getDynamicFormField({ id:105 })
				let key
				if (_.get(res, 'code') === 200) {
					let modules;
					let moduleData;
					let banners;
					this.config = _.cloneDeep(_.get(res, 'data', {}))
					// console.log(this.config)
					modules = _.get(this.config,'modules',{})
					key = _.get(modules[0],'key','')
					moduleData = _.get(_.get(this.config,'moduleData',{}),key,{})
					banners = _.get(moduleData,'banners',{})
					this.item = banners
					this.moduleData = moduleData
					// console.log(this.item)
					// console.log(this.moduleData)
				}
			},
			async fetchNavData(){
				const res = await getDynamicFormField({ id:105 })
				let key
				if (_.get(res, 'code') === 200) {
					let modules;
					let moduleData;
					let NavList;
					let container;
					let style;
					let title;
					this.config = _.cloneDeep(_.get(res, 'data', {}))
					// console.log(this.config)
					modules = _.get(this.config,'modules',{})
					key = _.get(modules[1],'key','')
					moduleData = _.get(_.get(this.config,'moduleData',{}),key,{})
					NavList = _.get(moduleData,'navList',{})
					container = _.get(modules[1],'container',{})
					style = _.get(container,'Style',{})
					title = _.get(container,'title','')
					this.NavItem = NavList
					this.NavData = moduleData
					this.cardStyle = style
					this.cardTitle = title
					// console.log(this.cardStyle)
					// console.log(this.cardTitle)
					// console.log(this.NavItem)
					// console.log(this.NavData)
			}
		}
		},
		}
</script>

<style>
</style>
