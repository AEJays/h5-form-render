<template>
	<view>
		<van-field
			name="cViewUpload"
			:label="param.label"
			:required="param.required"
			:readonly="param.readonly"
			:disabled="param.disabled"
			:style="param.style"
			:error="param.error"
			:error-message="param.error ? param['error-message'] ? param['error-message'] : '' : ''"
			label-class="van_field_label"
		>
		<template slot="input">
			<view class="cViewUpload_content">
				<!-- 加载图片 -->
				<view class="cViewUpload_imageBox" v-for="(item,i) in fileList" v-if="!isHide(item)">
					<mask v-show="isMock === i">
						<image :src="item.url" :style="[style]" mode="aspectFit" @click="hideMockImage"></image>
					</mask>
					<image :src="icon.delete" class="cViewUpload_delete" mode="widthFix" @click="handleDelete(i)" v-if="!isReadOnly"></image>
					<image :src="item.url" :style="[defaultStyle]" class="cViewUpload_image" mode="aspectFit" @click="showMockImage(i)" @longpress="showSelect(i)" v-if="!isReadOnly">
					<image :src="item.url" :style="[defaultStyle]" class="cViewUpload_image" mode="aspectFit" @click="showMockImage(i)" v-if="isReadOnly">
					</image>
					<view class="cViewUpload_buttonGroup" v-show="showButton === i" @click="hideSelect(i)">
						<view class="cViewUpload_button agree" @click="agree(i)">显示</view>
						<view class="cViewUpload_button DisAgree" @click="DisAgree(i)">隐藏</view>
					</view>
				</view>
				<view class="cViewUpload_UploadBox" @click="upload()" v-show="showAdd">
					<image :src="icon.loading" class="cViewUpload_loading" mode="widthFix" v-if="loading"></image>
					<image :src="icon.add" class="cViewUpload_add" mode="widthFix" v-if="!loading"></image>
				</view>
			</view>
		</template>
		</van-field>
	</view>
</template>

<script>
	import { globalConfig } from '@/config.js'
	import mask from '@/components/mask/index.vue'
	export default {
		name:"c-View-Upload",
		components:{
			mask
		},
		data() {
			return {
				fileList:[],
				loading:false,
				icon:null,
				style:{
					"width": "120px",
					"height": "120px"
				},
				defaultStyle:{
					"width": "120px",
					"height": "120px"
				},
				isMock:null,
				showAdd:true,
				showButton:null,
				isReadOnly:false
			}
		},
		props:{
			param:{
				type:Object,
				default(){
					return {
						required: false,
						readonly: false
					}
				}
			}
		},
		methods: {
			// 初始化
			init(){
				this.icon = globalConfig.icon
				// console.log(this.param,"param")
				if(this.param.readonly){
					this.showAdd = false
					this.isReadOnly = true
				}else if(this.param.disabled){
					this.showAdd = false
					this.isReadOnly = true
				}
				if(this.param.value){
					if(Array.isArray(this.param.value)){
						this.fileList = this.param.value
					}else{
						this.fileList = JSON.parse(this.param.value)
						// console.log(this.fileList,this.param.value)
					}
				}
				// console.log(this.param)
				this.transformHide()
			},
			// 转换hide为false
			transformHide(){
				let userType = uni.getStorageSync("userType")
				let that = this
				this.fileList.map((item,i)=>{
					// console.log(userType,item.hide)
					if(userType == 2&&item.hide){
						that.fileList[i].hide = false
						// console.log(that.fileList)
					}
					// console.log("没进去")
				})
				// console.log(this.fileList)
			},
			// 展开选择框
			showSelect(i){
				// console.log("长按了")
				this.showButton = i
				// console.log(this.showButton)
			},
			// 隐藏选择框
			hideSelect(i){
				this.showButton = null
			},
			agree(i){
				this.fileList[i].hide = false
				this.hideSelect(i)
				this.$emit("change",JSON.stringify(this.fileList))
				uni.showModal({
					title:"该附件对企业、街镇角色已设为可见状态！",
					showCancel:false,
					confirmColor:"#FC1944",
					confirmText:"我知道了"
				})
			},
			DisAgree(i){
				this.hideSelect(i)
				let fileList = {...this.fileList}
				fileList[i].hide = true
				// console.log(this.fileList)
				this.$emit("change",JSON.stringify(fileList))
				uni.showModal({
					title:"该附件对企业、街镇角色已设为不可见状态！",
					showCancel:false,
					confirmColor:"#FC1944",
					confirmText:"我知道了"
				})
			},
			// 判断初始化是否隐藏
			isHide(item){
				let hideImage = false
				if(this.isReadOnly){
					if(Array.isArray(this.fileList)&&this.fileList.length>0){
						if(item.hide){
							hideImage = true
						}
					}
				}
				return hideImage
			},
			// 将图片覆盖全屏
			showMockImage(i){
				this.isMock = i
				this.style = {
					"position":"fixed",
					"width":"100vw",
					"height":"100vh"
				}
			},
			// 隐藏图片
			hideMockImage(i){
				this.isMock = i
				this.style = {
					"width": "120px",
					"height": "120px"
				}
			},
			// 删除
			handleDelete(i){
				this.fileList.splice(i,1)
				this.showAdd = true
				// console.log(this.fileList),
				this.$emit("change",JSON.stringify(this.fileList))
			},
			// 上传函数 直接调用即可
			upload(){
				let that = this
				if(!this.loading){
					uni.chooseImage({
						count:1,
						success(path) {
							// console.log(path)
							let pathList = path.tempFilePaths
							// console.log(pathList)
							pathList.map((itemPath,i)=>{
								that.loading = true
								uni.uploadFile({
									url:globalConfig.workflowEP + '/api/fs/uploadfile',
									header:{
										Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
									},
									filePath:itemPath,
									name:"file",
									success(webPath) {	//获取上传之后返回的网页地址
									that.loading = false
									let newPath = webPath.data;
										if(typeof webPath.data==="string"){
											newPath = JSON.parse(webPath.data)
										}
										// console.log(newPath)
										// console.log(globalConfig.workflowEP,newPath.data.url)
										if(newPath.code === 200){
											let newFilePath = globalConfig.workflowEP + newPath.data.url
											// console.log(newFilePath)
											let fileList = that.fileList
											if(that.param["max-count"]){
												if(that.fileList.length>=that.param["max-count"]){
													that.showAdd = false
												}else{
													that.showAdd = true
												}
											}
											fileList.push({url:newFilePath,hide:false})
											// console.log(fileList)
											that.fileList = fileList
										}
										that.$emit("change",JSON.stringify(that.fileList))
									}
								})
							})
						}
					})
				}
			}
		},
		created() {
			this.init()
		},
		mounted() {
			this.init()
		}
	}
</script>

<style>
	@keyframes loading{
		from{
			transform: rotate(0deg);
		}
		to{
			transform: rotate(360deg);
		}
	}
	.van_field_label {
			color: rgba(80, 80, 80, 1);
			font-weight: bold;
			margin-bottom: 10rpx;
	}
	.cViewUpload_content{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}
	.cViewUpload_imageBox{
		/* flex: 1;s */
		position: relative;
	}
	.cViewUpload_delete{
		position: absolute;
		top: 0;
		right: 0;
		width: 20px;
	}
	.cViewUpload_image{
		box-shadow: 0px 0px 5px #aaa;
		border: 1px solid #aaa;
	}
	.cViewUpload_delete,.cViewUpload_image{
		margin: 0px 5px 0px 0px;
	}
	.cViewUpload_UploadBox{
		width: 120px;
		height: 120px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px dotted #aaa;
		background-color: #DDD;
	}
	.cViewUpload_loading,.cViewUpload_add{
		width: 25px;
	}
	.cViewUpload_loading{
		animation: loading 2s linear 0s infinite;
	}
	.cViewUpload_buttonGroup{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 5px;
		right: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,.6);
	}
	.cViewUpload_button{
		/* flex: 1; */
		width: 45px;
		height: 20px;
		color: white;
		font-weight: bolder;
		text-align: center;
		padding: 5px;
	}
	.agree{
		background-color: green;
		margin-right: 5px;
	}
	.DisAgree{
		background-color: red;
	}
</style>
