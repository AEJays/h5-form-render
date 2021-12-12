<template>
    <view :class="[`base_checkbox_container ${param.inputBlock ? 'van_field_input_block' : ''}`]">
        <van-field
          name="checkboxGroup"
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
						<view v-if="param.readonly">
								{{textValue(param.value)}}
						</view>
						<view v-else>
							<van-checkbox-group
							  direction="horizontal"
							  :readonly="param.readonly"
							  :disabled="param.disabled"
							  :value="returnValue(param.value)"
							  @change="handleChange"
							>
							  <view v-if="param.options && param.options.length > 0" class="checkbox_options">
							      <van-checkbox
							        v-for="(item, index) in param.options"
							        :key="index"
							        shape="square"
							        :name="item.value"
							        @click="handleClick"
							        style="margin: 10rpx 30rpx 10rpx 0"
							        label-class="checkbox_options_label"
							      >{{item.label}}
							      </van-checkbox>
							  </view>
							</van-checkbox-group>
						</view>
          </template>
        </van-field>
    </view>
</template>

<script>
    export default {
			mounted(){
				console.log(this.param)
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
            }
        },
        methods: {
            handleChange (e) {
               this.$emit("change", JSON.stringify(e.detail))
            },
						returnValue(value){
							let newValue
							// console.log(value)
							if(typeof value === "string"){
								if(value.indexOf("[")!==-1&&value.indexOf("]")!==-1){
									newValue = JSON.parse(value)
								}else{
									newValue = value
								}
							}else{
								newValue = value
							}
							return newValue
						},
						textValue(value){
							let json = this.returnValue(value)
							// console.log(this.param,"param")
							// console.log(json)
							let newJson = {}
							let newValue = {}
							let String = "";
							let options = this.param.options
							options.map((item,i)=>{
								newJson[item.value] = item.label
							})
							if(Array.isArray(json)){
								json.map((item,i)=>{
										newValue[item] = newJson[item]
								})
								// console.log(newValue,"NEWValue")
								// console.log(newValue)
								let allValue = Object.values(newValue)
								// console.log(allValue,"ALLVALUE")
								for(var i in allValue){
									// console.log(i)
									if(i == allValue.length-1){
										String += allValue[i]
									}else{
										String += allValue[i] + "，"
									}
								}
							}else{
								String = ""
							}

							return String
						}
        }
    }
</script>

<style lang="less">
    @import "./common.less";
    .base_checkbox_container {
      .checkbox_options {
          display: flex;
          flex-wrap: wrap;
          .checkbox_options_label {
             margin-left: 10rpx;
          }
      }  
    }
</style>
