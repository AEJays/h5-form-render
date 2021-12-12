<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				requestUrl:null
			}
		},
		methods: {
			// 扫描
			scan(){
				let that = this
				uni.scanCode({
					scanType:"qrcode",
					success(res) {
						// console.log(res)
						that.requestUrl = res.result
						that.jump()
					},
					fail() {
						uni.showModal({
							title:"未识别到二维码！",
							showCancel:false,
							confirmColor:"#ff0000",
							success(button) {
								if(button.confirm){
									uni.navigateBack({
										delta:10
									})
								}
							}
						})
					}
				})
			},
			// 跳转
			jump(){
				let that = this
				uni.request({
						url:that.requestUrl,
						header:{
							"REQ-CODE":"hdqm_js"
						},
						complete(res) {
							// console.log(res)
							if(res.data.code === 200){
								that.$cache("YyzzCode",res.data.data.id,2*60)//营业执照号码保存两分钟
								uni.redirectTo({
									url:res.data.data.url
								})
							}else{
								uni.showModal({
									title:res.data.msg
								})
							}
						}
				})
			}
		},
		created() {
			this.scan()
		}
	}
</script>

<style>

</style>
