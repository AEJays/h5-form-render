<template>
    <view :class="[`base_select_container ${param.inputBlock ? 'van_field_input_block' : ''}`]">
        <van-field
          readonly
          :required="param.required"
          :disabled="param.disabled"
          :style="param.style"
          :placeholder="param.placeholder"
          clickable
          name="picker"
          :label="param.label"
          :value="handleParseValue(param.value)"
          :error="param.error"
          :error-message="param['error-message'] || ''"
          label-class="van_field_label"
          @click-input="handleClick"
        />
        <van-popup v-if="isBuild()" :show="showPick" position="bottom" @click-overlay="handlePickerCancel" custom-style="background-color: #fff;z-index: 999">
          <van-picker
            show-toolbar
            :columns="param.columns"
            value-key="label"
            @confirm="handlePickerConfirm"
            @cancel="handlePickerCancel"
          />
        </van-popup>
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
                        required: false,
                        disabled: false,
                        error: false,
                        "error-message": "",
                        style: ""
                    }
                }
            }
        },
        data () {
          return {
              showPick: false
          } 
        },
        mounted() {
					// console.log(this.param)
          this.handleInitData()
        },
        methods: {
					// 是否存在
					isBuild(){
						let isShow 
						if(this.param.readonly){
							isShow = false
						}else if(this.param.disabled){
							isShow = false
						}else{
							isShow = true
						}
						return isShow
					},
            handleParseValue (value) {
              if (value||value===0) {
                  const list =  _.get(this.param, 'columns', [])
                  return _.get(list.find(x => x.value == value), 'label', '')
              }
              return ''
            },
            handleInitData () {
                if (_.has(this.param, 'columns') && _.get(this.param, 'columns', []).length > 0) {
                    this.param.columns.map(x => {
                        if (!_.has(x, 'text')) {
                            x.text = _.get(x, 'label')
                        }
                    })
                }
            },
            handleClick () {
               this.showPick = true
            },
            handlePickerCancel () {
                this.showPick = false
            },
            handlePickerConfirm (e) {
                const value = _.get(e, 'detail.value.value', '')
                this.$emit('confirm', value)
                this.showPick = false
            }
        }
    }
</script>

<style lang="less">
    @import "./common.less";
    .base_select_container {}
</style>
