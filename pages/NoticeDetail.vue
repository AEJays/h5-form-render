<!-- 跳转标准配置页面，纯配置页面都可以跳转到这，需要带参数！ -->
<template>
	<view>
		<view v-if="srvFormData" class="page">
			<!-- <dynamic-page :API="api" :srvFormData="srvFormData" Details="true" v-if="api"></dynamic-page> -->
			<view class="title">{{srvFormData.title}}</view>
			<view class="author">发布人：{{srvFormData.author}}</view>
			<view class="time">发布时间：{{srvFormData.create_time}}</view>
			<view class="content" v-html="Debug(srvFormData.content)">
			</view>
		</view>
		<view v-if="Array.isArray(attachment)&&attachment.length>0" class="attachmentBox">
			<span style="font-size: 18px;font-weight: bolder;margin-left: 10px;">附件：(点击下载)</span>
			<view v-for="(item,index) in attachment" @click="DownLoad(item.url,item.type,index)" class="attachmentBox_item">
				<image mode="aspectFit" :src="'https://ai.hdqmjs.com/attachments/type/'+returnType(item.name)+'.png'" class="attachmentImage"></image>
				<span class="attachment_title">{{item.name||"附件"}}</span>
				<image src="https://ai.hdqmjs.com/attachments/map/MapSuccess.png" v-if="successGroup.indexOf(index)!==-1" class="attachmentBox_rightImage"></image>
				<view :style="{'background-color': '#07C160','width':`${downLoadGroup[index]}%`,'position':'absolute'}"></view>
			</view>
		</view>
	</view>

</template>

<script>
	import {globalConfig} from '@/config.js'
	import dynamicPage from '@/components/dynamic-page/index.vue'
	export default {
		components:{
			dynamicPage
		},
		onLoad(e) {
			let decode
			decode = e.query?JSON.parse(decodeURIComponent(e.query)):e
			// console.log(decode)
			this.api=`${globalConfig.formHost}?id=66661`
			// this.id=decode.id
			this.getData(decode.id)
			// console.log("进来",this.srvFormData)
		},
		data() {
			return {
				api:null,
				srvFormData:null,
				attachment:[],
				successGroup:[],//下载成功列表
				downLoadGroup:{}
			}
		},
		methods: {
			// 返回类型
			returnType(name){
				// let allTypeGroup = ["avi","dll","doc","exe","gif","jpg","html","mp3","mkv","mp4","mpg","pdf","png","ppt","txt","psd","zip"]
				let type = name.split(".")[1]
				if(type.indexOf("xls")!==-1){
					type = "xls"
				}else if(type.indexOf("doc")!==-1){
					type = "doc"
				}else if(type.indexOf("ppt")!==-1){
					type = "ppt"
				}else if(type === "jpeg"){
					type = "jpg"
				}
				console.log(type)
				return type
			},
			// 下载
			DownLoad(url,type,index){
				let that = this
				const downloadTask = uni.downloadFile({
					url:url,
					header:{
						Authorization:`${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
					},
					success(res){
						if(res.statusCode === 200){
							if(type.indexOf("image")!==-1){
								uni.saveImageToPhotosAlbum({
									filePath:res.tempFilePath,
									success(save){
										that.successGroup.push(index)
										uni.showToast({
											title:"文件已保存"
										})
									},
									fail(fail){
										uni.showToast({
											title:"文件未保存",
											icon:"error"
										})
									}
								})
							}else{
								uni.saveFile({
									tempFilePath:res.tempFilePath,
									success(save){
										that.successGroup.push(index)
										uni.showToast({
											title:"文件已保存"
										})
										setTimeout(()=>{
												uni.openDocument({
													filePath:save.savedFilePath,
													success(open){
														console.log("打开成功")
													},
													fail(error){
														uni.showToast({title:"打开失败",icon:"error"})
														
													}
												})
										},1000)
									},
									fail(fail){
										uni.showToast({
											title:"文件未保存",
											icon:"error"
										})
									}
								})
							}
						}else{
							uni.showToast({
								title:"文件下载失败",
								icon:"error"
							})
						}
					}
				})
				downloadTask.onProgressUpdate(res=>{
					this.downLoadGroup[index] = res.progress
				})
			},
			Debug(item){
				// console.log()
				item = item.replace(/src="/g, 'src="https://images.weserv.nl/?url=')
				//清除background样式
				let str = item.split(";")
				// console.log("STR",str)
				for(var i in str){
					// console.log("TEST",i)
					if(str[i].indexOf("background")!==-1){
						// console.log("I",str[i])
						str[i]=null
					}
				}
				str = str.join(";")
				str = str.replace(/;;/g,';')
				item = str
				// console.log(str)
				return item
			},
				getData(id){
					let that = this
					uni.request({
						url:`${globalConfig.workflowEP}/api.page.design.form/loadFormInfo`,
						method:"POST",
						header:{
							Authorization:`${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
						},
						data:{
							code:"tz",
							dataId:id
						},
						complete(res) {
							// console.log(res)
							that.srvFormData=res.data.data.formData
							that.attachment = that.srvFormData.attachment?JSON.parse(that.srvFormData.attachment):[]
							// console.log("noticeSrv",that.srvFormData)
						}
					})
				}
		}
	}
</script>

<style lang="less">
	.page{
		padding: 20rpx;
		margin: 20rpx;
		box-shadow: 0px 0px 10px #aaa;
		.title{
			font-size: 40rpx;
			text-align: center;
			font-weight: bolder;
			margin-bottom: 1em;
		}
		.author{
			// font-weight: bold;
			text-align: center;
			font-size: 25rpx;
		}
		.time{
			color: #999;
			text-align: center;
			font-size: 25rpx;
		}
		.content{
			margin-top: 1em;
			
		}
	}
	.attachmentBox{

	}
	.attachmentImage{
		width: 30px;
		height: 30px;
		margin: 0px 10px;
	}
	.attachmentBox_rightImage{
		width: 30px;
		height: 30px;
		position: absolute;
		right: 20px;
	}
	.attachment_title{
		max-width: 20em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.attachmentBox_item{
		width: 100%;
		margin: 5px auto;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		font-size: 14px;
		font-weight: bolder;
		position: relative;
	}
</style>
