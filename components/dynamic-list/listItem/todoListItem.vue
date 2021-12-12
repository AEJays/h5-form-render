<template>
	<view class="ToDoListItem">
		<image :src="getVal(item.processDefineKey)" mode="aspectFit" v-if="item.processDefineKey" style="margin:auto 15px;min-width:40px;min-height: 40px;width: 40px;height: 50px;"></image>
		<view class="ToDoBody">
			<view v-if="item.instanceEntityVo.customValues.companyName||item.instanceEntityVo.formData.companyName">
				<span class="Title">企业名称：</span>{{item.instanceEntityVo.customValues.companyName||item.instanceEntityVo.formData.companyName}}
			</view>
			<view class='taskName'>
				<span class="Title">工作名称：</span>{{item.instanceEntityVo.workName}}
			</view>
			<view class='createTime' v-if="item.instanceEntityVo.customValues.streetName">
				<span class="Title">街道名称：</span>{{item.instanceEntityVo.customValues.streetName}}
			</view>
		</view>
	</view>
	<!-- <button @click="getZc">测试</button> -->
</template>
<script>
	import { globalConfig } from '@/config.js'
	export default {
		name:"toDoListItem",
		created() {
		},
		props:{
			item: Object,
			options:Object
		},
		data(){
			return {
				iconList:globalConfig.icon
			}
		},
		methods:{
			getVal(string){
				string = "type"+string.replace(string[0],string[0].toUpperCase())
				// console.log(this.iconList[string])
				return this.iconList[string]
			},
			DateToString(val){
				let Date = val.split(" ")[0]
				let DateJson = Date.split("-")
				let DateString = DateJson[1]+DateJson[2]
				return DateString
			}
		}
	}
</script>

<style lang="less">
	.ToDoListItem{
		height: 100px;
		position: relative;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eee;
		&:hover{
			background-color: #eee;
		}
		.ToDoBody{
			font-size: 14px;
			.taskName{
				font-size: 14px;
			}
			.createTime{
				font-size: 14px;
			}
		}
	}
		.ToDoBody{
			.Title{
				font-weight: bolder;
			}
		}

</style>
