<template>
	<button class="c-button" @click="switchTo()">{{get(config,'content',"跳转")}}</button>
</template>

<script>
	import _ from 'lodash'
	export default {
		name:"c-button",
		props:{
			config:{
				type:Object,
				default(){
					return {
						type:"",
						url:"",
						value:null
					}
				}
			}
		},
		methods:{
			get(config,content,value){
				return _.get(config,content,value)
			},
			switchTo(){
				if(this.config.type){
					if(this.config.type==="back"){
						this.back();
					}else if(this.config.type==="exit"){
						this.exitThis();
					}else if(this.config.type==="jump"){
						this.jump();
					}else if(this.config.type==="reLaunch"){
						this.reLaunch();
					}else if(this.config.type==="tab"){
						this.tab();
					}else{
						this.jump();
					}
				}else{
					this.jump();
				}
			},
			back(value){
				// console.log("back")
				// console.log(this.config)
				uni.navigateBack({
					delta:this.config.value||1
				})
			},
			exitThis(url){
				// console.log("exitThis")
				uni.redirectTo({
					url:this.config.url
				})
			},
			jump(url,value){
				uni.navigateTo({
					url:this.config.url,
					fail(e) {
						// console.log(e)
					}
				})
			},
			reLaunch(url){
				// console.log("reLanch")
				uni.reLaunch({
					url:this.config.url
				})
			},
			tab(url){
				// console.log("tab")
				uni.switchTab({
					url:this.config.url
				})
			}
		}
	}
</script>

<style>
	.c-button{
		background-color: #1A5EB5;
		width: 50%;
		color: white;
	}
</style>
