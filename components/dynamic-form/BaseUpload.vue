<template>
	<view style="background-color: white;">
		<view :class="[`.base_upload_containe ${param.inputBlock ? 'van_field_input_block' : ''}`]" v-if="!param.readonly">
			<van-field
				name="upload"
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
					<van-uploader 
					:file-list="fileList"
					:max-count="param['max-count'] || 9007199254740992"
					:deletable="param.deletable === false ? false : true"
									:accept="param.accept || 'image'"
									@after-read="handleAfterRead"
									@delete="handleDelete"
									v-if="param.accept !== 'file'"
				/>
							<van-uploader 
									v-else
									:file-list="fileList"
									:max-count="param['max-count'] || 9007199254740992"
									:deletable="param.deletable === false ? false : true"
									:accept="param.accept || 'image'"
									@after-read="handleAfterRead"
							>
								<van-button size="small" icon="upgrade" type="default">上传文件</van-button>
							</van-uploader>
				</template>
			</van-field>
			</view>
			<view v-if="param.readonly" class="Detail-Box" >
				<view class="label"><span style="color: red;" v-if="param.required">*</span>{{param.label}}</view>
				<view class="image-Box" v-if="param.value">
					<view v-for="(item,i) in JSON.parse(param.value)" :key="i">
						<img :src="item.url||icon.empty" mode="aspectFit" @click="handleWatch(i)" :style="{width:'80px',height:'80px','z-index':'0'}" class="Detail-image" />
						<img :src="item.url||icon.empty" v-if="isShow==i" mode="aspectFit" @click="hideWatch()" :style="{width:'auto',height:'auto',position:'fixed',top:0,left:0,right:0,bottom:0,'z-index':'10000'}"/>
						<view style="width: auto;height: auto;top: 0;left: 0;right: 0;bottom: 0;position: fixed;z-index: 9999; background-color: #AAAAAA;" @click="isShow===i" v-if="isShow==i"></view>
					</view>

				</view>
				<view class="image-Box" v-if="!param.value">
						<img :src="item.url||icon.empty" mode="aspectFit" @click="handleWatch(0)" :style="{width:'80px',height:'80px','z-index':'0'}" class="Detail-image" />
						<img :src="item.url||icon.empty" v-if="isShow==0" mode="aspectFit" @click="hideWatch()" :style="{width:'auto',height:'auto',position:'fixed',top:0,left:0,right:0,bottom:0,'z-index':'10000'}"/>
						<view style="width: auto;height: auto;top: 0;left: 0;right: 0;bottom: 0;position: fixed;z-index: 9999; background-color: #AAAAAA;" @click="isShow===null" v-if="isShow===0"></view>
				</view>
			</view>
		</view>
</template>

<script>
    import { globalConfig } from '@/config.js'
		import cImage from './custom/c-image.vue'
		import _ from 'lodash'
    export default {
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
                        "error-message": '',
                        style: ""
                    }
                }
            }
        },
				components:{
					cImage
				},
        data() {
          return {
              fileList: [],
							icon:null,
							big:false,
							isShow:null
          }  
        },
        watch: {
            param: {
                handler(val, oldVal) {
                  if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
                    if (_.has(val, 'value')) {
                        this.fileList = [...JSON.parse(_.get(this.param, 'value', ''))]
                    }
                  }
                },
                deep: true
             },
        },
		mounted() {
			this.icon = globalConfig.icon
            if (_.get(this.param, 'value', []).length > 0) {
                this.fileList = [...JSON.parse(this.param.value)]
            }
		},
        methods: {
					// 关闭
					hideWatch(){
						this.isShow = null
					},
					// 查看
					handleWatch(i){
						this.big=!this.big
						this.isShow = i
						// console.log(this.isShow)
						// let style;
						// if(this.big===true){
						// 		this.position=""
						// 		this.width="auto"
						// 		this.height="auto"
						// 		this.zIndex="10000"
						// }else{
						// 		this.position="",
						// 		this.width="80px",
						// 		this.height="80px"
						// 		this.zIndex="1"
						// }
					},
            // 删除
            handleDelete (e) {
               const index = e.detail.index
               this.fileList.splice(index, 1)
               this.fileList = [...this.fileList.splice(index, 1)]
               // console.log('change', e, this.fileList)
               this.$emit('change', this.fileList)
            },
            handleAfterRead (event) {
                const { file } = event.detail
                uni.uploadFile({
                    url: globalConfig.workflowEP + '/api/fs/uploadfile',
										header:{
											Authorization:`Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`)}`
										},
                    filePath: file.url,
                    name: 'file',
                    success: (res) => {
                        const list = this.fileList
												let Resdata = JSON.parse(res.data)
												let resUrl = Resdata.data
            //             // const resUrl = res.data.data.substr(0, 5).includes('http') ? res.data.data :  globalConfig.workflowEP + res.data.data
												// console.log("resUrl",resUrl)
												// console.log("list",list)
												// console.log()
                        if (_.has(this.param, 'accept') && this.param.accept === 'file') {
                            const index = resUrl.lastIndexOf('.')
                            const str = resUrl.substr(index + 1)
                            if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'psd', 'svg'].some(x => resUrl.includes(x))) {
                                this.fileList.push({ url: globalConfig.workflowEP+resUrl.url })
                            } else {
                                this.fileList.push({ url: globalConfig.workflowEP+resUrl.url, name: resUrl.name })
                            }
                        } else {
                            this.fileList.push({ url: globalConfig.workflowEP+resUrl.url })
                        }
                        // this.fileList = [...list]
												// console.log("fileList",this.fileList)
                        this.$emit('change', JSON.stringify(this.fileList))
                    },
										fail(e) {
											// console.log("error",e)
										}
                })
            }
        }
    }
</script>

<style lang="less">
    @import './common.less';
    .base_upload_containe {

    }
		.Detail-Box{
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			.label{
				width: 100px;
				// text-align: ;
				margin-left: 15px;
				font-size: 14px;
				font-weight: bolder;
			}
		}
		.image-Box{
			// width: 80px;
			// height: 80px;
			background-color: #aaa;
			// padding: 5px;
		}
		.Detail-image{
			width: 80px;
			height: 80px;
			padding-top: 5px;
		}
</style>
