<!-- options值：
hideTime:true 隐藏时间字段
hideUser:true 隐藏user字段
hideNext:true 隐藏下一步字段
hideForm:true 隐藏表单字段

timeText: 时间文本
userText: 用户文本
nextText: 下一步文本
formText: 表单文本
workText

timeField: 时间字段
userField: 用户字段
nextField: 下一步字段
formField: 表单字段

hideState: 隐藏状态
noSuccess: 未完成文本
success: 完成文本
wait: 待完成文本
 -->
<template>
	<!-- <navigator :url="navigationUrl" hover-class="navigator-hover"> -->
		<view class="state_allcontent">
			<view class="AvatarStateList">
				<view class="formNumber" >
					{{options.workText||"工作名称"}}:
					<span>{{item[options.workField]||item.workName}}</span>
					<!-- <span class="enforcementState enforcement" v-if="item.finishState==='enforcement'">执法中</span> -->

				</view>
				<view class="body">
					<view class="avatar" v-if="item.pdKey">
						<image :src="getVal(item.pdKey)" mode="widthFix" class="avatar-img" />
					</view>
					<view class="content">
						<view class="titleBox">
							<view class="time" v-if="item.actApplyTime&&!options.hideTime"><span class="content-title">{{options.timeText||"开始时间"}}:</span>{{_get(item,options.timeField)||item.actApplyTime}}</view>
							<view class="object" v-if="item.actApplyUserName&&!options.hideUser"><span class="content-title">{{options.userText||"执法人员"}}:</span>{{_get(item,options.userField)||item.actApplyUserName}}</view>
							<view class="company" v-if="item.actCurrDualUserName&&!options.hideNext"><span class="content-title">{{options.nextText||"下一步办理人"}}:</span>{{_get(item,options.nextField)||item.actCurrDualUserName}}</view>
							<!-- <view class="department" v-if="item.department"><span class="content-title">执法科室:</span>{{item.department}}</view> -->
							<!-- <view class="remarks" v-if="item.formName&&!hideForm"><span class="content-title">{{optons.formText||"表单名"}}:</span>{{item[options.formField]||item.formName}}</view> -->
						</view>
					</view>
					<view style="position: relative;width: 90px;" v-if="options.showDelete">
						<view v-if="item.finishState==='0'" style="color: #FFFFFF;position: absolute;z-index:88888;bottom: 0px;right: 5px;background-color: #EB3941;padding: 5px 10px;" @click="handleDelete">删除</view>
					</view>
					<view style="position: relative;width: 90px;" v-if="!options.hideState">
						<span class="enforcementState rectification" v-if="item.finishState==='0'">{{options.noSuccess||"未完成"}}</span>
						<span class="enforcementState closeCase" v-if="item.finishState==='1'">{{options.success||"已完成"}}</span>
						<span class="enforcementState closeCase" v-if="item.finishState==='2'">{{options.wait||"待完成"}}</span>
					</view>
<!-- 					<view class="state" v-if="item.state">
							<view v-if="item.state.modify" class="modify">修改</view>
							<view v-if="item.state.approval" class="approval">审批</view>
					</view> -->
				</view>
			</view>
		</view>
	<!-- </navigator> -->
</template>

<script>
	import qs from 'qs'
	import _ from 'lodash'
	import {globalConfig} from '@/config.js'
	export default {
		name:"companyStateToEnforcement",
		props:{
			item:Object,
			itemNavigation:String,
			options:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data(){
			return {
				iconList:{}
			}
		},
		created() {
			this.iconList = globalConfig.icon
			// console.log("iconList",this.iconList)
		},
		onLoad(){
			// this.navigationUrl()
			// console.log(this.navigationUrl())
		},
		methods:{
			_get(data,field){
				return _.get(data,field)
			},
			DateToString(val){
				let Date = val.split(" ")[0]
				let DateJson = Date.split("-")
				let DateString =DateJson[1]+DateJson[2]
				return DateString
			},
			getVal(string){
				// console.log(string)
				string = "type"+string.replace(string[0],string[0].toUpperCase())
				// console.log(this.iconList[string])
				return this.iconList[string]
			},
			handleDelete(){
				this.$emit("delete",true)
				let data = {
				  "processInstanceId":this.item.piId, 
					"delReason":"删除",
					"history": false
				}
				let that = this
				uni.showModal({
					title:"您确定要删除该流程吗？",
					confirmColor:"#FF0000",
					success(button) {
						if(button.confirm){
							uni.request({
								url:`${globalConfig.workflowEP}/api.flow.examine/deleteProcessInstance`,
								method:"POST",
								data:data,
								header:{
									Authorization:`Bearer ${uni.getStorageSync(globalConfig.tokenStorageKey)}`
								},
								success(res) {
									that.$emit("delete",false)
									if(res.data.code === "00000"){
										that.$reload()
										uni.showToast({
											title:"删除成功",
											icon:"success"
										})
									}else{
										uni.showToast({
											title:"删除失败",
											icon:"error"
										})
									}
								}
							})
						}else{
							that.$emit("delete",false)
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.state_allcontent{
		background-color: #F4F4F4;
		padding: 2px 0 5px 0;
	}
	.enforcementState{
    padding: 5px 10px;
    position: absolute;
    bottom: 0px;
    /* width: 100%; */
    right: 0px;
    font-weight: bolder;
    font-size: 10px;
    border-radius: 5px;
		&.enforcement{
			color: #77DCA0;
			border: 1px solid #77DCA0;
		}
		&.enforcement:hover{
			background-color: #77DCA0;
			color: white;
		}
		&.rectification{
			color: #E06969;
			border: 1px solid #E06969;
		}
		&.rectification:hover{
			color: white;
			background-color: #E06969;
		}
		&.closeCase{
			color: #A1A1A1;
			border: 1px solid #A1A1A1;
		}
		&.closeCase:hover{
			color: white;
			background-color: #A1A1A1;
		}
	}
	.AvatarStateList{
		background-color: white;
		width: 98%;
		margin: 0 auto;
		padding: 5px 0px 20px 0px;
		.formNumber{
			width: auto;
			text-align: left;
			font-size: 14px;
			border-bottom: 1px solid #EBEBEB;
			padding: 5px 0px;
			margin: 5px 10px 10px 10px;
		}
		.body{
			display: flex;
			width: 100%;
			.avatar{
				width: 70px;
				.avatar-img{
					// border-radius: 50%;
					width: 40px;
					height: 40px;
					position: relative;
					left: 50%;
					transform: translate(-50%);
				}
			}
			.content{
				width: 58%;
				.titleBox{
					margin-bottom: 10px;
					font-size: 14px;
				}
				.content-title{
					color: #666;
					font-weight: bolder;
					margin-right: 3px;
				}
			}
			.state{
				font-size: 10px;
				.modify{
					color: #5FA1EB;
					border: 1px solid #5FA1EB;
					border-radius: 2px;
					padding: 3px 8px;
					float: left;
					margin-right: 5px;
					&:hover{
						color: #fff;
						background-color: #5FA1EB;
					}
				}
				.approval{
					color: #D18FDD;
					border: 1px solid #D18FDD;
					border-radius: 2px;
					padding: 3px 8px;
					float: left;
					&:hover{
						color: #fff;
						background-color: #D18FDD;
					}
				}
			}
		}
	}
	.formNumber{
		width: 80%;
		margin: 0 auto;
		border-bottom: 1px solid #FEFEFE;
	}
</style>
