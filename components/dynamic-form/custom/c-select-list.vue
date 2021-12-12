<template>
	<view>
		<view v-if="selectValue" @change="getValue()">{{selectValue}}</view>
		<button @click="SplitValue()" @click.native="getValue()">请选择</button>
		<button @click="getValue()">获取值</button>
	</view>
</template>

<script>
	import search from '../../search/search.vue'
	export default {
		name:"c-select-list",
		data(){
			return{
				selectValue:null,
				show:true
			}
		},
		mounted() {
			// console.log(this.selectValue)
			this.getValue()
		},
		onReady(){
			this.getValue()
		},
		renderTracked() {
			this.getValue()
		},
		methods:{
			SplitValue(){
					uni.navigateTo({
						url:"/components/dynamic-form/custom/selectBox/selectBox",
						animationType:"slide-in-left",
						animationDuration:300,
						success() {
							this.getValue()
							// console.log(this.selectValue)
						},
						fail(e) {
							// console.log(e)
						}
					})
			},
			shows(){
				this.show=!this.show;
			},
			getValue(){
				let value;
				let that = this
				let va = uni.getStorage({
					key:"selectName",
					success(e) {
						// console.log(e.data)
						that.selectValue = e.data
					}
				})
				// console.log(va.data)
			}
		}
	}
</script>

<style>
	.Modal{
		position: fixed;
		overflow: scroll;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: auto;
		height: 100%;
		z-index: 10000;
		background-color: white;
	}
</style>
