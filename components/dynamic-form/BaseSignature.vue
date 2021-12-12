<template>
    <view :class="[`base_signature_container ${param.inputBlock ? 'van_field_input_block' : ''}`]">
        <van-field
          name="signature"
          readonly
          :label="param.label"
          :required="param.required"
          :disabled="param.disabled"
          :style="param.style"
          :error="param.error"
          :error-message="param.error ? param['error-message'] ? param['error-message'] : '' : ''"
          label-class="van_field_label"
        >
          <template slot="input">
              <view class="field_input">
					<button size="mini" type="primary" @click="getSignuteList" v-if="!param.readonly&&(userType == 2&&!hideSelect)" style="margin-right: 5px;">{{param.value ? '重新选择' : '选择常用签章'}}</button>
				  <button size="mini" type="primary" @click="handleSignture" v-if="!param.readonly">
					  {{param.value ? '修改' : '填写'}}
				  </button>
				  <view 
					  :style="{
						  backgroundImage: `url(${param.value})`
					  }"
					  class="image"
					  v-if="param.value" 
						style="transform: rotate(-90deg);"
					  @click="handlePreview" 
				  />
					<view v-if="!param.value&&param.readonly">未签章</view>
			  </view>
          </template>
        </van-field>
				<!-- 获取 -->
				<mask v-show="showHistory">
					<view class="history-imageBox" @touchstart="listTouchStart" @touchend="listTouchEnd" @touchmove="listTouchMove">
						<view v-for="(item,i) in signlist">
							<image :src="item.url" style="background-color: white;border: 1px dotted #555;transform: rotate(-90deg);transform-origin: center center;" mode="aspectFit" class="history-image" @click="handleImage(i)"></image>
							<view class="history-name">{{item.name}}</view>
							<view v-show="isImage===i" class="bigImage">
								<image style="width: 100vw;height: 100vw;background-color: white;border: 1px solid #555;transform: rotate(-90deg);transform-origin: center center;" :src="item.url" mode="aspectFit"></image>
								<view class="buttonGroup">
									<button class="bigImage_button" @click="selectReturn">重新选择</button>
									<button class="bigImage_button" @click="selectSucess(item.id)">确定</button>
								</view>
							</view>
						</view>
						<view class="ListbuttonGroup" style="background-color: white;">
							<button @click="hideHistory" size="mini" type="primary">返回</button>
						</view>
					</view>
				</mask>
				<!-- 校检密码 -->
				<mask v-if="isRight">
					<view class="signature_passwordBox">
						<view class="labeltitle">请输入签章密码:</view>
						<input type="password" v-model="password" class="password"/>
						<view class="buttonBox">
							<button @click="handlePassword">确定</button>
							<button @click="hideRight">关闭</button>
						</view>
					</view>
				</mask>
				<!-- 写入 -->
				<mask v-show="showWriteHistory">
					<view class="signature_passwordBox" style="height: 60%;">
						<view class="labeltitle">请输入签章名称:</view>
						<input type="text" v-model="name" class="password"/>
						<view class="labeltitle">请输入签章密码:</view>
						<input type="password" v-model="password" class="password"/>
						<view class="buttonBox">
							<button @click="handleHistory(url)">确定</button>
							<button @click="hideWriteHistory">关闭</button>
						</view>
					</view>
				</mask>
				<!-- 旋转提示 -->
				<view v-if="showTips" class="signature_tips">
					<view class="signature_tipsContent">
						<image :src="icon.rotatePhone" mode="aspectFit" class="signature_tipsImage"></image>
						<view class="signature_tipsText">旋转手机</view>
					</view>
				</view>
				<!-- 显示签章 -->
        <mask v-if="showModal">
        	<view class="signature_content">
        		<view class="content-box">
                    <canvas 
                        class="mycanvas"
                        canvas-id="signature_canvas"  
                        disable-scroll="true" 
                        @touchstart="handleTouchstart"
                    	@touchmove="handleTouchmove" 
                        @touchend="handleTouchend"
                    />
										<view class="Tips">请使用楷体签字</view>
                    <view class="buttons">
						<view class="but" @click="handleClear">重绘</view>
						<view class="but" @click="handleBack">返回</view>
						<view class="but primary" @click="finish">保存</view>
                    </view>
        		</view>
        	</view>
        </mask>
		<mask v-if="preViewModal">
			<view class="preview_image_content" @click="handleClosePreviewModal">
				<image mode="aspectFit" :src="param.value" style="width: 100vw;height: 100vw;background-color: white;border: 1px solid #555;transform: rotate(-90deg);transform-origin: center center;background-color: white;" />
			</view>
		</mask>
	</view>
</template>

<script>
    import _ from 'lodash'
		import {globalConfig} from '@/config.js'
	import { pathToBase64 } from 'image-tools'
    import mask from '../mask/index.vue'
    export default {
        components: {
           mask 
        },
        data () {
            return {
                showModal: false,
                icon:null,
                canvasContext: "",
                points: [], //路径点集合 
                image: "",
								selectId:"",//选择的id
								preViewModal: false,
								showHistory:false,
								showWriteHistory:false,
								showTips:false,
								signlist:[],
								password:"",
								isImage:null,
								url:null,
								isRight:false,
								userInfo:null,
								name:"",
								startX:"",
								endX:"",
								size:10,
								current:1,
								total:0,
								userType:null
            } 
        },
				created() {
					this.userType = uni.getStorageSync("userType")
					this.icon = globalConfig.icon
					this.userInfo = uni.getStorageSync(globalConfig.userInfo)
					// console.log(this.userInfo)
				},
        props: {
            param: {
                type: Object,
                default: function() {
                    return { 
                        inputBlock: false,
                        checked: false,
                        required: false,
                        readonly: false,
                        error: false,
                        "error-message": "",
                        style: ""
                    }
                }
            },
						hideSelect:{
							default(){
								return true
							}
						}
        },
        methods: {
					/* 列表滑动模块逻辑 */
					// 滑动列表动作开始
					listTouchStart(touch){
						// console.log(touch,"start")
						this.startX = touch.changedTouches[0].clientX
					},
					// 滑动列表动作中
					listTouchMove(touch){
						// console.log(touch,"move")
					},
					// 胡丹列表动作结束
					listTouchEnd(touch){
						this.endX = touch.changedTouches[0].clientX
						if(this.startX-this.endX>100){
							if(this.current*this.size<this.total){
								this.current = this.current+1
								this.getSignuteList()
							}
						}
						// console.log(touch,"end")
					},
					
					/* 其他逻辑 */ 
					selectReturn(){
						this.isImage = null
					},
					selectSucess(id){
						this.isImage = null
						this.hideHistory()
						this.showRight()
						this.selectId = id
						// this.$emit("change",url)
					},
					/* 历史签章模块 */
					// 选择历史签章
					selectSignture(){
						this.showHistory = true
					},	
					// 显示校检密码框
					showRight(){
						this.isRight = true
					},
					// 隐藏校检密码框
					hideRight(){
						this.isRight = false
					},
					handleHistory(url){
						let that = this
						uni.request({
							url:`${globalConfig.workflowEP}/admin/userseal?url=${url}&name=${this.name}&password=${this.password}&userId=${this.userInfo.userId}`,
							header:{
								Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
							},
							method:"POST",
							success(res) {
								// console.log("成功",res)
								that.hideWriteHistory()
								that.password = null
							}
						})
					},
					// 校检密码
					handlePassword(){
						let that = this
						// if(this.selectPassword === this.password){
						// 	this.hideRight()
						// 	this.$emit("change",this.selectUrl)
						// }else{
						// 	uni.showModal({
						// 		title:"选择的签章对应的密码错误，请重新输入！",
						// 		showCancel:false,
						// 		confirmColor:"#FC1944"
						// 	})
						// }
						uni.request({
							url:`${globalConfig.workflowEP}/admin/userseal/use?id=${this.selectId}&password=${this.password}`,
							header:{
								Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
							},
							method:"POST",
							success(res){
								// console.log(res)
								if(res.data.code == 0){
									that.isRight = null
									that.$emit("change",res.data.data.url)
								}else{
									uni.showModal({
										title:res.data.msg,
										showCancel:false,
										confirmColor:"#FC1944"
									})
								}
							}
						})
					},
					handleImage(i){
						this.isImage = i
					},
					hideHistory(){
						this.showHistory = false
					},
					hideWriteHistory(){
						this.showWriteHistory = false
					},
					getSignuteList(){
						uni.showLoading({
							title:"获取列表中"
						})
						let that = this
						let data = {};
						data = {
							"size":this.size,
							"current":this.current
						}
						// this.showHistory = false
						uni.request({
							url:`${globalConfig.workflowEP}/admin/userseal/valid`,
							data:data,
							header:{
								Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
							},
							method:"GET",
							success(res) {
								uni.hideLoading()
								// console.log(res)
								if(res.data.code===0){
										// console.log(res.data.data.records)
										that.signlist.push(...res.data.data.records)
										// console.log(that.signlist)
										that.showHistory = true
										that.total = res.data.data.total
								}else{
									uni.showModal({
										title:res.data.msg,
										confirmColor:"#FC1944"
									})
								}
							}
						})
					},
					
					//签章组件原模块
			handlePreview () {
				if (!_.get(this.param, 'value')) {
					return
				}
				this.preViewModal = true
			},
            handleSignture () {
								this.showTips = true
								setTimeout(()=>{
									this.showTips = false
									this.showModal = true
									this.initCanvas()
								},3000)
            },
            initCanvas() {
            	this.canvasContext = uni.createCanvasContext('signature_canvas', this);
            	//设置画笔样式
            	this.canvasContext.setLineWidth(4);
            	this.canvasContext.setLineCap('round');
            	this.canvasContext.setLineJoin('round');
            	// this.oc.setStrokeStyle("#ffffff");
            },
            
            //触摸开始，获取到起点
            handleTouchstart(e) {
            	// debugger
            	//   ctx.beginPath();
            	const startX = e.changedTouches[0].x;
            	const startY = e.changedTouches[0].y;
            	//   let startX = e.changedTouches[0].x;
            	//   let startY = e.changedTouches[0].y;
            	//   debugger
            	let startPoint = {
            		X: startX,
            		Y: startY
            	};
            	this.points.push(startPoint);
            	//每次触摸开始，开启新的路径
            	this.canvasContext.beginPath();
            },
            //触摸移动，获取到路径点
            handleTouchmove(e) {
            	let moveX = e.changedTouches[0].x;
            	let moveY = e.changedTouches[0].y;
            	let movePoint = {
            		X: moveX,
            		Y: moveY
            	};
            	this.points.push(movePoint); //存点
            	let len = this.points.length;
            	if (len >= 2) {
            		this.draw(); //绘制路径
            	}
            },
            // 触摸结束，将未绘制的点清空防止对后续路径产生干扰
            handleTouchend() {
            	this.points = [];
            },
            draw() {
            	let point1 = this.points[0]
            	let point2 = this.points[1]
            	this.points.shift()
            	this.canvasContext.moveTo(point1.X, point1.Y)
            	this.canvasContext.lineTo(point2.X, point2.Y)
            	this.canvasContext.stroke()
            	this.canvasContext.draw(true)
            },
            //清空画布
            handleClear() {
            	uni.getSystemInfo({
            		success: (res) => {
						const canvasw = res.windowWidth;
						const canvash = res.windowHeight;
						this.canvasContext.clearRect(0, 0, canvasw, canvash);
						this.canvasContext.draw(true);
						// this.canvasContext.get
					},
            	})
            },
            //保存
            finish() {
                if (_.get(this.canvasContext, 'subpath', []).length === 0) {
                    uni.showToast({
                        title: '请先写入签章',
                        icon: 'none'
                    })
                    return
                }
            	uni.showModal({
            		title: '温馨提示',
            		content: '确定保存签章吗？',
            		success: (response) => {
                        if (response.confirm) {
                            this.handleGenerate()
                        }
            		}
            	})
            },
            
            // 生成图片
            handleGenerate () {
							let that = this
                uni.canvasToTempFilePath({
                	x: 0,
                	y: 0,
                	canvasId: 'signature_canvas',
                	success: (resp) => {
										// console.log("生成图片",resp)
										// pathToBase64(resp.tempFilePath).then(url => {
										// 	this.$emit('change', url)
										// 	this.showModal = false
										// })		
										//上传到服务器
										// let name = resp.tempFilePath.split("http://tmp/")[1]
										uni.uploadFile({
											url:`${globalConfig.workflowEP}/api/fs/uploadfile`,
											filePath:resp.tempFilePath,
											name:'file',
											header:{
												Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
											},
											success(res){
												that.showModal=false
												let url = JSON.parse(res.data).data.url
												that.url = globalConfig.workflowEP+url
												that.$emit('change',globalConfig.workflowEP+url)
												// if(that.userType === "2"&&!that.hideSelect){
												// 	uni.showModal({
												// 		title:"是否保存为常用签章？",
												// 		success(button) {
												// 			if(button.confirm){
												// 				that.showWriteHistory = true
												// 				that.password = null
												// 			}
												// 		}
												// 	})
												// }
											},
											fail(e) {
												// console.log("失败",e)
											}
										})
                		//保存图片到本地
                		// this.saveImgToLocal(resp.tempFilePath);
                	},
                	fail: (response) => {
                		// console.log('签章失败 = ', response);
                	}
                }, this)
            },
            
            //保存图片到本地
            saveImgToLocal(url){
            	uni.saveImageToPhotosAlbum({
            		filePath: url,
            		success: (response) => {
            			uni.showModal({
            				title: '提示',
            				content: '保存成功',
            				showCancel: false
            			})
            		},
            		fail: (response) => {
            			uni.openSetting({
            				success: (response) => {
            					if (!response.authSetting[
            							'scope.writePhotosAlbum'
            						]) {
            						uni.showModal({
            							title: '提示',
            							content: '获取权限成功，再次点击图片即可保存',
            							showCancel: false
            						})
            					} else {
            						uni.showModal({
            							title: '提示',
            							content: '获取权限失败，无法保存',
            							showCancel: false
            						})
            					}
            				}
            			})
            		}
            	})
            },
            
            handleBack () {
                this.showModal = false
                this.canvasContext = null
            },
			handleClosePreviewModal () {
				this.preViewModal = false
			}
        },
		beforeDestroy() {
			this.canvasContext = null
		}
	}
</script>

<style lang="less">
    @import './common.less';
		@keyframes rotatePhone{
			from {
				transform:rotate(0deg),
			}to{
				transform:rotate(90deg),
			}
		}
    .base_signature_container {
        .field_input {
			.image {
				width: 170rpx;
				height: 170rpx;
				background-position: center;
				background-repeat: no-repeat;
				background-size: contain;
				border: 1px solid #f2f2f2;
			}
		}
    }
		.history-imageBox{
			display: flex;
			// flex-wrap: wrap;
			align-items: center;
			overflow: scroll;
			width: 100%;
			height: 90%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #EEE;
		}
		.history-name{
			text-align: center;
			font-size: 16px;
			font-weight: bolder;
		}
		.ListbuttonGroup{
			display: flex;
			width: 100%;
			position: fixed;
			bottom: 0px;
			align-items: center;
			height: 10%;
			&>button{
				height: 30px;
			}
		}
		.buttonGroup{
			display: flex;
			width: 100%;
			position: fixed;
			bottom: 50px;
			&>.bigImage_button{
				background-color: #1A5EB5;
				color: white;
			}
		}
		.history-image{
			width: 100px;
			height: 100px;
			&:first-child{
				margin-left: 5px;
			}
			margin-right: 5px;
			margin-top: 5px;
			// border-radius: 5px;
		}
		.bigImage{
			position: fixed;
			top:0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 100000;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #EEE;
		}
		.signature_passwordBox{
			width: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 30%;
			background-color: white;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			font-size: 18px;
			font-weight: bolder;
			text-align: center;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			&>.labeltitle{
				width: 100%;
				height: 0px;
				padding: 20px;
				text-align: center;
			}
			&>.password{
				background-color: #ccc;
				margin: 0 auto;
				width: 80%;
				height: 50px;
				padding: 10px;
				border-radius: 10px;
				text-align: center;
			}
			&>.buttonBox{
				/* position: absolute; */
				/* bottom: 0; */
				height: 50px;
				width: 90%;
				/* margin: 0 auto; */
				// background-color: #1A5EB5;
				color: white;
				display: flex;
				&>button{
					margin: 5px;
					background: #1A5EB5;
					color: white;
					flex: 1;
					line-height: 40px;
					height: 40px;
				}
			}
		}
    .signature_content {
        width: 100vw;
        height: 100vh;
        background-color: white;
        .content-box {
            background-color: #fff;
            .mycanvas {
            	width: 75%;
							position: fixed;
							right: 0;
            	height: 100vh;
            	background-color: aliceblue;
            }
						.Tips{
							position: fixed;
							right: -20%;
							color: #aaa;
							font-weight: bolder;
							top: 10%;
							width: 50%;
							text-align: center;
							transform: rotate(90deg);
						}
            .buttons {
								transform: rotate(90deg);
								position: fixed;
								bottom: 10%;
								width: 50%;
								left: -10%;
								// transform: translate(-50%);
								// bottom: 0;
								// right: 0;
                display: flex;
                justify-content: center;
                text-align: center;
                padding: 40rpx 0;
								z-index: 9999999;
                .but {
                    width: 80px;
										// height: 10%;
                    border: 1px solid #f2f2f2;
                    padding: 20rpx 0;
                    border-radius: 12rpx;
                    font-size: 28rpx;
					margin: 0 5%;
                }
                .primary {
                    background-color: #2196f3;
                    color: #fff;
                }
                .but:active {
                    box-shadow: 0 0 16rpx rgba(0, 0, 0, 0.14);
                    transition: all .2s;
                }
            }
        }
    }
	.signature_tips{
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 50000000;
		background-color: #eee;
		flex-direction: row;
		flex-wrap: wrap;
		.signature_tipsContent{
			
			.signature_tipsImage{
					width: 80px;
					animation: rotatePhone 1.5s linear 0s infinite;
			}
			.signature_tipsText{
				width: 100%;
				text-align: center;
				font-weight: bolder;
				font-size: 20px;
				flex: 1;
			}
		}
	}
	.preview_image_content {
		background-color: #aaa;
		height: 100vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 100%;
			height: 100vh;
		}
	}
</style>
