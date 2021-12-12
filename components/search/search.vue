<!-- 搜索功能已完成，差样式及子项 -->
<!-- 默认可直接调用，使用stateSearchItem列表子项，调用的api对应的字段通过field来定义 -->
<template>
	<view>
		<view :class="'search-box '+searchType">
			<view class="searchIcon search_Icons">&#xe600;</view>
			<view class="search-input">
				<input type="text" class="SearchinputBox" v-model="inputValue" @input="getList()" @change="getList()" adjust-position="false" placeholder="请输入....."/>
			</view>
			<!-- <view class="talkIcon search_Icons">&#xe6ff;</view> -->
			<!-- 语音输入按钮 -->
			<view class="talkIcon search_Icons" style="color: #2C405A;" v-if="config.addIcon" @click="additems()">&#xe7fe;</view>
		</view>
		<view :class="'search-list '+searchType" @touchstart="touchStart" @touchend="loadMore">
			<view v-for="(item,i) in listData" v-if="inputValue===''" style="position: relative;">
				<navigator :url="url[i]">
					<state-search-item v-if="config.itemModule.name==='stateSearchItem'"
						:item="item"
					></state-search-item>
<!-- 					<radio-select v-if="config.itemModule.name==='radioItem'"
						:item="item"
						@getAddress="getAddress"
						@getName="getName" 
					></radio-select> -->
					<!-- 有bug -->
				</navigator>
				<view class="EditButton" v-if="config.hasEdit" @click="jump(item.id)" >
					<image mode="widthFix" style="width: 24px;" :src="icon.setting"></image>
				</view>
			</view>
			<view v-for="(item,i) in searchlist" v-if="inputValue!==''" style="position: relative;">
				<navigator :url="url[i]">
					<!-- 子项添加处 -->
				<state-search-item v-if="config.itemModule.name==='stateSearchItem'"
					:item="item"
				></state-search-item>
<!-- 				<radio-select v-if="config.itemModule.name==='radioItem'"
					:item="item"
					@getAddress="getAddress"
					@getName="getName"
				></radio-select> -->
				</navigator>
				<view class="EditButton" v-if="config.hasEdit" @click="jump(item.id)">
					<image mode="widthFix" style="width: 24px;" :src="icon.setting"></image>
				</view>
			</view>
		</view>
		<view style="width: auto;color: #ccc;font-size: 12px; font-weight: bolder;margin: 10px;text-align: center;">{{text}}</view>
	</view>
</template>

<script>
	// import { getSearchList } from '../../common/api.js'
	import { request } from '../../common/request.js'
	import { globalConfig } from '@/config.js'
	import stateSearchItem from './item/stateSearch.vue'
	// import RadioSelect from './item/RadioSelect.vue'
	export default {
		name:"search",
		components:{
			stateSearchItem,
			// RadioSelect
		},
		data() {
			return {
				inputValue:"",
				listData:[],
				allListData:[],
				searchlist:[],
				url:null,
				RadioValue:{
					name:null,
					address:null
				},
				num:1,
				size:10,
				touchData:{},
				total:null,
				text:"下拉刷新",
				icon:null
			};
		},
		onLoad() {
			this.getChecked()
		},
		props:{
			config:{
				type:Object,
				default(){
					return {
						loadAPI:null,
						itemModule:{
							name:"stateSearchItem"
						},
						field:"",
						itemNavigation:"",
						id:null,
						settingUrl:"",
						hasEdit:false
					}
				}
			},
			searchType:{
				type:String,
				default(){
					return "top"
				}
			}
		},
		
		created() {
			this.icon = globalConfig.icon
			uni.removeStorage({
			    key: 'selectName',
			    success: function (res) {
			        // console.log("清除缓存成功");
			    }
			});
			// console.log(this.config.params)
			this.getData(this.config.params)
			this.getAllData({
				...this.config.params,
				searchAll:true
			})
			
			// console.log(this.searchlist)
		},
		methods:{
			jump(id){
				// console.log(id)
				uni.navigateTo({
					url:this.config.settingUrl + "?id=" + id
				})
			},
			getAddress(e){
				this.address = e
				 // console.log(this.address)
			},
			additems(){
				if(this.config.addUrl){
					uni.navigateTo({
						url:this.config.addUrl
					})
				}
			},
			getName(e){
				this.name = e
				let name = this.name
				// console.log(this.name)
				uni.navigateBack({
					success(e){
						// console.log(e)
						uni.setStorage({
							key:"selectName",
							data:name,
							success(e) {
								// console.log("保存缓存成功",name)
							}
						})
					},
					"Name" : name
				})
			},
			getSearchList(params){
				let url=this.config.loadAPI||`${globalConfig.dataHost}`
				let header = {
					Authorization:`Bearer ${globalConfig.enforcementKey}`
				}
				return request('GET', url, params,header)
			},
			// 记录滑动
			touchStart(e){
				// this.touchData.clientX = e.changeTouches[0].clientX;//X轴滑动
				// console.log(e)
				this.touchData.clientY = e.changedTouches[0].clientY;//Y轴滑动
				this.value=this.size
			},
			// 加载更多
			loadMore(e){
				// 移动
				// console.log("end",e)
				const subY = e.changedTouches[0].clientY - this.touchData.clientY
				// console.log(subY)
				if(subY<=-200){
					uni.showLoading({
						title:"加载中"
					})
						let params;
						if(this.config.pz&&this.config.pn){
							this.num=this.num+1
							params={
								...this.config.params,
								"size":this.value,
								"current":this.num
							}
						}else{
							params = this.config.params
						}
							if(this.num<=this.total){
								this.getData(params)
							}else{
								this.text = "没有更多数据了"
						}
						uni.hideLoading()
				}
			},
			async getData(params){
					const res = await this.getSearchList(params);
					let list;
					// console.log(res)
					list = res.data.records
					for(var i in list){
						// console.log(list[i])
						this.listData.push(list[i])
					}
					// console.log("listData",this.listData)
					this.url = this.getID(this.listData)
					this.total = res.data.pages
					// this.size = res.data.records.length
					this.num = res.data.current
			},
			async getAllData(params){
					const res = await this.getSearchList(params);
					let list;
					// console.log(res)
					list = res.data.records
					for(var i in list){
						// console.log(list[i])
						this.allListData.push(list[i])
					}
					// console.log("allListData",this.allListData)
					// this.url = this.getID(this.allListData)
					// this.total = res.data.pages
					// this.size = res.data.records.length
					// this.num = res.data.current
			},
			getList(){
				this.searchlist = []
				// console.log(this.searchlist)
				if(this.inputValue!==""){
					for(let i=0;i<this.allListData.length;i++){
						let list = this.allListData[i]
						if(list[this.config.field||'name'].indexOf(this.inputValue)!==-1){
							// console.log(this.searchlist)
							this.searchlist.push(list)
							this.url=this.getID(this.searchlist)
							
						}else if(list[this.config.otherField||'operationName'].indexOf(this.inputValue)!==-1){
							this.searchlist.push(list)
							this.url=this.getID(this.searchlist)
						}
					}
				}
				// console.log(this.searchlist)
				// console.log(this.inputValue)
			},
			getID(list){
				let urlList=[];
				let url = this.config.itemNavigation;
				// console.log(this.config.itemNavigation)
				for(let j=0;j<list.length;j++){
					let query = encodeURIComponent(JSON.stringify(list[j]))
					if(list[j].id){
						url = this.config.itemNavigation + "?id=" + list[j].id +"&query=" + query
						
					}
					// console.log(url)
					urlList.push(url)
				}
				return urlList
			}
		}
	}
</script>

<style lang="less">
	// 图标文件
	@font-face {
		font-family: 'search';  /* Project id 2631740 */
		src: url('//at.alicdn.com/t/font_2631740_0t7xyvzf3dk.woff2?t=1625558763632') format('woff2'),
       url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
       url('//at.alicdn.com/t/font_2631740_1hmbob4mchq.woff?t=1625558734873') format('woff'),
       url('//at.alicdn.com/t/font_2631740_1hmbob4mchq.ttf?t=1625558734873') format('truetype');
	}
	.search_Icons{
		font-family: "search" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		position: absolute;
		text-align: center;
		top:20px
	}
	.searchIcon{
		left: 25px;
	}
	.talkIcon{
		right: 25px;
	}
	
	.search-box{
		position: fixed;
		left: 0;
		width: 100%;
		background-color: white;
		opacity: .8;
		z-index: 10000;
		&.top{
			top: 0;
		}
		&.bottom{
			bottom: 0;
			left: 0;
		}
	}
	.search-list{
		&.top{
			margin-top: 50px;
		}
		&.bottom{
			margin-top: 64px;
		}
	}
	
	.search-input{
		margin: 10px 10px;
		width: auto;
		height: 30px;
		border-radius: 30px;
		border: 2px solid #ccc;
	}
	.SearchinputBox{
		margin: 0 auto;
		width: 80%;
		height: 30px;
		font-size: 14px;
		color: #333;

	}
	.inputTextBox{
		position: relative;
		top: 0;
		width: 90%;
		height: 300px;
		margin: 0 auto;
		background-color: #DCDEE0;
	}
	.EditButton{
		position: absolute;
		top:5px;
		right: 5px;
		// z-index: 500;
	}
</style>
