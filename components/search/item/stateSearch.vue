<template>
	<view class="stateSearchlist">
		<view class="titleBox">
			<span class="title">{{item.name}}</span>
			<span class="state-high" v-if="isHigh(item.type)">高危</span>
			<span class="state state-example" v-if="item.state.example.status">检查 {{item.state.example.number}}</span>
			<span class="state state-self" v-if="item.state.self.status">自查 {{item.state.self.number}}</span>
		</view>
		<view class="subTitleBox">
			{{item.address}}
		</view>

	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				default(){
					return {}
				}
			},

		},
		methods:{
			//是否高危
			isHigh(type){
				let that = this
				let typeGroup = JSON.parse(type)
				let high;
				let highGroup = ["游泳","滑雪","潜水","攀岩"]
				typeGroup.map((item,i)=>{
						let company = that.$whatCompany(item)
						if(highGroup.indexOf(company)!==-1){
							high = true
						}
				})
				return high
			}
		}
	}
</script>

<style lang="less">
	.stateSearchlist{
		position: relative;
		border-bottom: 1px solid #EEE;
		padding: 10px;
		>.titleBox{
			width: 100%;
			height: 2em;
			line-height: 2em;
			>.title{
				font-size: 14px;
				width: auto;
				/* max-width: 20px; */
				max-width: 20em;
				overflow: hidden;
				white-space: nowrap;
				display: block;
				float: left;
				text-overflow: ellipsis;
				font-weight: bolder;
			}
			>.state{
				border: 1px solid #B7CEE5;
				color: #B7CEE5;
				font-size: 8px;
				padding: 1px 4px;
				&:hover{
					background-color: #B7CEE5;
					color: #fff;
				}
			}
			>.state-high{
				border: 1px solid #FF6034;
				color: #FF6034;
				margin-right: 5px;
				margin-left: 10px;
				font-size: 8px;
				padding: 2px 4px;
				&:hover{
					background-color: #FF6034;
					color: #fff;
				}
			}
			>.state-example{
				margin-right: 5px;
				margin-left: 20px;
				line-height: 20px;
			}
		}
		>.subTitleBox{
			color: #A6A6A6;
			font-size: 12px;
		}
	}

	
</style>
