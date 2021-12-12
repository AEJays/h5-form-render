<template>
    <view :class="[`base_radio_container ${param.inputBlock ? 'van_field_input_block' : ''}`]">
        <van-field
          name="radio"
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
						<view>
							<!-- <view v-if="param.title">{{param.title}}</view> -->
							<van-radio-group
							  direction="horizontal"
							  :readonly="param.readonly"
							  :disabled="param.disabled"
							  :value="param.value"
							  @change="handleChange"
							>
							     <view v-if="param.options && param.options.length > 0" class="radio_options">
										 <van-radio
										 v-if="!isReadOnly"
											 v-for="(item, index) in param.options"
											 :key="index"
											 :name="item.value"
											 style="margin: 10rpx 30rpx 10rpx 0"
											 label-class="radio_options_label"
										 >{{item.label}}
										 </van-radio>
											 <van-radio
											 v-if="isReadOnly"
											   v-for="(item, index) in param.options"
											   :key="index"
											   :name="item.value"
												 disabled
											   style="margin: 10rpx 30rpx 10rpx 0"
											   label-class="radio_options_label"
											 >{{item.label}}
											 </van-radio>
							     </view>
							</van-radio-group>
						</view>
          </template>
        </van-field>
    </view>
</template>

<script>
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
                        "error-message": "",
                        style: ""
                    }
                }
            }
        },
				data(){
					return {
						isReadOnly:false
					}
				},
        methods: {
            handleChange (e) {
               this.$emit("change", e.detail)
            },
						readonly(){
							// console.log(this.param.readonly)
							if(this.param.readonly){
								this.isReadOnly = true
							}else if(this.param.disabled){
								this.isReadOnly = true
							}
						}
        },
				mounted() {
					this.readonly()
				}
    }
</script>

<style lang="less">
    @import './common.less';
    .base_radio_container {
        .radio_options {
            display: flex;
            flex-wrap: wrap;
            margin-right: 10rpx;
            .radio_options_label {
                margin-left: 10rpx;
            }
        }
    }
</style>
