<template>
	<view class="SelectBox">
		<view class="Content">
			<view class="Content_Value"><span v-if="param.required" style="color: #EE0A87;">*</span>{{param.label}}</view>
			<view class="Content_Box">
				<span v-show="content" style="float: left;padding: 0 10px;max-width: 12em;overflow: hidden;margin-right: 5px;">{{content}}</span>
				<image @click="showView()" class="SelectBtn" style="height: 30px;width: 30px;" :src="icon.select" v-if="!param.disabled"></image>
			</view>
		</view>
		<scroll-view @scrolltolower="loadMore" scroll-y="true" show-scrollbar="true" class="windows" v-show="show">
			<view class="WindowTitle" style="z-index: 30000;background-color: white;">
				请选择
			<span class="EXITIcon exit" @click="save()">&#xe642;</span></view>
			<!-- 搜索框 -->
			<view :class="'search '+activeClass" @click="addClass()">
				<img :src="icon.search" style="width: 30px;height: 30px;float: left;"/>
				<input type="text" class="search-input" v-show="showInput" v-model="SearchData" @input="getSearchData()" @blur="removeClass()" @confirm="removeClass()"/>
			</view>
			<!-- 列表 -->
			<view class="listBody" style="background-color: white;">
				<view v-for="(item,i) in list" class="allList" :key="i">
					<view @click="hide(i),isCheck(i)" class="SelectList" >
						<view class="title">{{item[options.nameField]||item.name}}</view>
						<view class="subtitle">{{item[options.addressField]||item.address}}</view>
						<view class="radio">
							<radio color="#1A5EB5" :checked="radioSelect===i"></radio>
						</view>
					</view>
				</view>
			</view>
			<view class="footer">
				<button class="button clear" @click="clear()">清除</button>
				<button class="button sumbit" @click="save()">保存</button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
		import {getselectList} from '../../../../common/api.js'
		import {globalConfig} from '@/config.js'
	export default {
		name:"c-select",
		data(){
			return{
				list:[],
				show:false,
				content:"",
				radioSelect:null,
				pz:10,
				pn:1,
				icon:{},
				SearchData:"", //搜索栏输入内容
				activeClass:null,
				showInput:false
			}
		},
		// onPageScroll(e) {
		// 	// console.log(e)
		// },
		created() {
			this.icon=globalConfig.icon
			// console.log(this.icon.search)
			this.getValue()
			this.pz=10
			this.pn=1
		},
		methods:{
			// 获取搜索数据
			getSearchData(){
				let data = {
					name:this.SearchData
				}
				let _this=this
				if(this.loadAPI===""||this.loadAPI===undefined){
					this.loadAPI = `${globalConfig.workflowEP}/api.flow.examine/queryNextExamineUser`
				}
				let url = this.loadAPI
				this.pn = 1
				uni.showLoading({
					title:"加载中"
				})
				uni.request({
					url:url,
					data:{
						...data,
						...this.data,
						"current":this.pn,
						"size":this.pz
					},
					method:this.method||"GET",
					header:{
							Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
					},
					complete(res) {
						_this.list = []
						// console.log("records",res.data)
						if(res.data.code===0){
							for(var i in res.data.data.records){
								// console.log("this is i",i)
								_this.list.push(res.data.data.records[i])
							}
							// console.log("thisList",_this.list)
							uni.hideLoading()
						}else{
							uni.hideLoading()
							// console.log(res.data.data.msg)
						}
					}
				})
			},
			addClass(){
				this.activeClass="active"
				this.showInput=true
			},
			removeClass(){
				this.activeClass=null
				this.showInput=false
			},
			loadMore(){
				let data;
				if(this.SearchData!==""){
					data = {
						name:this.SearchData
					}
				}else{
					data = {
						
					}
				}		
				let _this=this
				if(this.loadAPI===""||this.loadAPI===undefined){
					this.loadAPI = `${globalConfig.workflowEP}/api.flow.examine/queryNextExamineUser`
				}
				let url = this.loadAPI
				this.pn=this.pn+1
				uni.showLoading({
					title:"加载中"
				})
					uni.request({
						url:url,
						data:{
							...data,
							...this.data,
							"current":this.pn,
							"size":this.pz
						},
						method:this.method||"GET",
						header:{
								Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
						},
						complete(res) {
							// console.log("records",res.data)
							if(res.data.code===0){
								for(var i in res.data.data.records){
									// console.log("this is i",i)
									_this.list.push(res.data.data.records[i])
								}
								// console.log("thisList",_this.list)
							}else{
								// console.log(res.data.data.msg)
							}
						}
					})
				uni.hideLoading()
			},
			async getValue(){
				if(this.loadAPI===""||this.loadAPI===undefined){
					this.loadAPI = `${globalConfig.workflowEP}/api.flow.examine/queryNextExamineUser`
				}
				let url = this.loadAPI
				// console.log(url)
				let _this = this
				// console.log(data)
				uni.request({
					url:url,
					data:{
						...this.data,
						"current":this.pn,
						"size":this.pz
					},
					method:this.method||"GET",
					header:{
							Authorization: `Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
					},
					complete(res) {
						// console.log("records",res.data)
						if(res.data.code===0){
							for(var i in res.data.data.records){
								// console.log("this is i",i)
								_this.list.push(res.data.data.records[i])
								// console.log("this is list",_this.list)
							}
							// console.log("thisList",_this.list)
						}else{
							// console.log(res.data.data.msg)
						}
					}
				})
				// const res = await getselectList(url,data);
				// console.log(res)
				// this.list = res.data.userList
			},
			showView(){
				this.show = true
			},
			hide(i){
				let list = this.list[i]
				this.content = this.options?list[this.options.nameField]:this.list[i].name
				let change = this.options?list[this.options.changeField]:this.list[i].id
				this.$emit("change",change)
				this.$emit("list",this.list[i])
			},
			isCheck(i){
				this.radioSelect = i
			},
			save(){
				this.show = false
				// uni.pageScrollTo({
				// 	scrollTop: 0, 
				// 	duration: 300	
				// });
			},
			clear(){
				this.content = null
				this.$emit("change",null),
				this.$emit("list",null),
				this.radioSelect = null,
				this.content = ""
			}
		},
		props:{
			loadAPI:{
				type:String,
				default(){
					return `${globalConfig.workflowEP}/api.flow.examine/queryNextExamineUser`
				}
			},
			options:Object,
			data:null,
			method:null,
			param: {
			    type: Object,
			    default: function() {
			        return {
			        }
			    }
			}
		}
	}
</script>

<style lang="less">
	@font-face {
	  font-family: 'EXIT';  /* Project id 2631740 */
	  src: url('//at.alicdn.com/t/font_2631740_fye2y3e3e0e.woff2?t=1625471527433') format('woff2'),
	       url('//at.alicdn.com/t/font_2631740_fye2y3e3e0e.woff?t=1625471527433') format('woff'),
				        url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAASEAAsAAAAACVAAAAQ4AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDSAqFKIRqATYCJAMYCw4ABCAFhG0HWRs9CMgOJQUGiYAhEQBAPHzN/Xvu7ia/SKQIFUhACZznCqxQmE5tLev6smUJOvOfl/1CmRoZuL5ByGTB35mfNB1kXvKn1gI4ibdCx4UKH3d9uPh/DpfW1gKbv225rDlpTYx6WXFAafvG3sJ34ngP8AwXJvAhAj3Mk815U3ElBXxPQmwDkVwJg4FdGCc5FgLPu0mJIYZu2jrtgUX8U5Gup/e4q/99/LEgupFUmXCpnYeLTGDu1O/vbW7axoG8pSmvBTdOqJAxq2WWuBTvOsPFTM3iokfYalebAb10k5RS833f8Mn26b/QB5cMfaGX+C+PShGSTNRQ1YuxWw2VERTLXCq+41L4voFL8P204Ov2vUWTjLq6xPqe+EjMROys24aQFWlSPXVggN/gPjFolLjrQn9o6PmJYIpWWILP9oUYKJaQc0fCdhkUYVEnhjTL7OI6j9wFDbW0RIG+Oy/uhdIrK5LTqfM8RG9YFglHdq0K3Kdljiy/XwaapaWJlRWn6Hz4uGqYeDV3J8+/PvJ2Mf7ujfnIsoBYQqyUrK5WvGyYoJa4pQRDP13s3u0TofT5K/ePhBjOXbp4lrjo/0LWRkn/O7JryX4CNFMTM07RQyH1z0p6BunINNBzr74pzZ21tdawNtA6rHVtzcKP8jUfGA1DofyjJVfFjt6x490d3b9YvGs58FoATKD09Ve4g8TugFanc2PB/kNeV47r6xMoGDAmHwuo0xSpC/JVRZrbEp/5zHeepC5grKBXVx03GVetW05fBmEaZj7b05d1Hvlk0GZaSn4rUr4sH3GrWH8p8PJ1Ic4ut3mPLGxHhqGIHuXBA+q+iIF6dl15cG9lQrleXxZf9Vzia3zLXhn/gjr4lieENER6P3x6ddyz//Axvg5KtX8jLMuNiQ+0ciCfflpuTno7Z24uZkK6LAbdoIuwY+6ZXtA2eVVuaJ+py/J+ANq/+U7u3WKmKZE759TV3OQOdR/yy/zfrWcB37odn9Zl6VTOCbXUojMooGiFfiW+Yeqy0DvJG7WtQG2LShIJPcQeThnfADtlqQfXJFI93Qy2IekyGrJuJiELdhZUeloEtW7WQg8zlRze00ACF1G6Y4ZhgNDPY0j6eA1ZP6+RBbsNlSF+Qq1fZOhhfwSdsKcpcYwoEBDEyEQ2tpOckbcxkhUTRmE9Yh0WKDilOolGgshFyZTEZG+2BNmQUMYuYgubijFDMgJvJYvhcshi4Um7wDcjI05swtienpTEhL1TopG3AsJGAgTCEBNSo3YkjhHPhlGHY4Tv9+shLAcLSIjp+OGlIQIRNz4pRaLkFMgSlS1Vx7asFrVgpcIwhjdjCHhWpGJ0IBYxxSPZw9drhhhhiZpyJOzSJVE3Jq0qsX6NdSmPQA/CrepIkaNEFXV0qY84oK2R88Ic5Dua7HIJZzzUzEEbe13bXeQdooN3gSYTAA==') format('woff2'),
	       url('//at.alicdn.com/t/font_2631740_fye2y3e3e0e.ttf?t=1625471527433') format('truetype');
	}
	.EXITIcon {
	  font-family: "EXIT" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
		&.exit{
			position: absolute;
			right: 30px;
			top: 0px;
			&:hover{
				opacity: .8;
			}
		}
	}

	.SelectBox{
		background-color: white;
		border-bottom: 1px solid #eee;
	}
	.Content{
		padding: 10px;
		height: auto;
		line-height: 30px;
		display: flex;
		.Content_Value{
			text-align: left;
			font-size: 14px;
			font-weight: bolder;
			width: 7em;
			// float: left;
			// flex: 1;
		}
		.Content_Box{
			// flex: 1;
			padding: 0 10px;
			// display: flex;
			// width: 80%;
			width: 80%;
		}
		.SelectBtn{
			position: absolute;
			right: 20px;
			&:hover{
				opacity: .8;
			}
			// width: 60px;
			// width: 120px;
			// padding: 0px 10px;
			height: auto;
			line-height: 30px;
			font-size: 16px;
			// background-color: #1A5EB5;
			// color: white;
		}
	}
	.windows{
		position: fixed;
		width: 100%;
		box-shadow: 0px 0px 5px #333;
		// bottom: 0;
		min-height: 100%;
		background-color: white;
		top: 0;
		right: 0;
		max-height: 100vh;
		z-index: 20000;
		background-color: #fff;
		.WindowTitle{
			position: fixed;
			top: 0;
			left: 0;
			text-align: center;
			font-size: 15px;
			width: 100%;
			height: 50px;
			line-height: 50px;
			border: 1px solid #DDD;
			font-weight: bolder;
			padding: 10px auto;
			z-index: 20001;
		}
		.search{
			// margin-top: 50px;
		width: 30px;
    z-index: 20002;
    height: 30px;
    overflow: hidden;
    padding: 5px;
		// overflow: ;
    position: fixed;
    top: 20%;
    left: 0;
		float: left;
    box-shadow: 0px 0px 5px #aaa;
    /* border: 1px solid #000000; */
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #fff;
			&.active{
				transition: all 2s ease;
				width: 60%;
			}
			// background-color: #000000;
		}
		.search-input{
			width: 80%;
			float: left;
			text-indent: 1em;
			line-height: 30px;
			height: 30px;
			// padding-left: 5px;
		}
		.listBody{
			margin-top: 50px;
			padding-bottom: 50px;
		}
		.allList{
			background-color: #FDFDFD;
			position: relative;
			overflow: scroll;
			&:hover{
				background-color: #EFEFEF;
			}
			.SelectList{
				width: auto;
				// height: 60px;
				border: 1px solid #EEEEEE;
				padding: 15px;
				z-index: initial;
				.title{
					max-width: 80%;
					font-size: 15px;
					font-weight: bolder;
				}
				.subtitle{
					max-width: 80%;
					font-size: 12px;
					color: #666;
				}
				.radio{
					position: absolute;
					top: 50%;
					right: 30px;
					transform: translate(0%,-50%)
				}
			}
		}
		.footer{
			z-index: 30005;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			display: flex;
			.button{
				flex: 1;
				border-radius: 0;
				&:hover{
					opacity: .8;
				}
			}
			.button:last-child{
				background-color: #1A5EB5;
				color: white;
			}
		}
	}
</style>
