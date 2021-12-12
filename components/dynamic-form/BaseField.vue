<template>
    <view :class="[`base_field_containe ${param.inputBlock ? 'van_field_input_block' : ''}`]">
        <van-field
           autosize
		  :focus="focus"
          :label="param.label"
          :size="param.size"
          :type="param.type"
          :required="param.required"
          :value="param.value"
          :placeholder="param.placeholder"
          :clearable="param.clearable"
          :password="param.password"
          :left-icon="param['left-icon']"
          :right-icon="param['right-icon']"
          :maxlength="param.maxlength || -1"
          :show-word-limit="param['show-word-limit']"
          :readonly="param.readonly"
          :disabled="param.disabled"
          :error="param.error === true"
          :error-message="param['error-message'] || ''"
          :style="param.style"
          label-class="van_field_label"
          @input="handleInput"
          @clear="handleClear"
		  @blur="handleBlur"
		  @focus="handleFocus"
        />
    </view>
</template>

<script>
    import _ from 'lodash'
    export default {
        props: {
            param: {
                type: Object,
                default: function() {
                    return { 
                        inputBlock: false,
                        type: 'text',
                        value: '',
                        placeholder: '请填写',
                        required: false,
                        clearable: false,
                        maxlength: -1,
                        "show-word-limit": false,
                        readonly: false,
                        disabled: false,
                        password: false,
                        error: false,
                        "error-message": "",
                        style: ""
                    }
                }
            }
        },
		data() {
			return {
				focus: false
			}
		},
        methods: {
            handleInput (e) {
               this.$emit("input", e.detail)
            },
            handleClear (e) {
                this.$emit("clear", e)
            },
			handleBlur () {
				this.focus = false
			},
			handleFocus () {
				this.focus = true
			}
        },
    }
</script>

<style lang="less">
    @import "./common.less";
    .base_field_container {
        
    }
</style>
