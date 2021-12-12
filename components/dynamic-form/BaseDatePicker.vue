<template>
	<view :class="[`base_date_picker_containe ${param.inputBlock ? 'van_field_input_block' : ''}`]">
		<van-field
			name="datetimePicker"
			clickable
			readonly
			:label="param.label"
			:required="param.required"
			:disabled="param.disabled"
			:placeholder="param.placeholder"
			:style="param.style"
			:value="param.value"
			:error="param.error === true"
			:error-message="param['error-message'] || ''"
			label-class="van_field_label"
			@click-input="handleShowPicker(true)"
		  />
		<van-popup v-if="isBuild()" :show="showPicker" position="bottom" @click-overlay="handleShowPicker(false)" custom-style="background-color: #fff;z-index: 999">
			<van-datetime-picker
			  :type="param.tagIcon"
			  :value="showTime()||time"
			  @confirm="handleComfirm"
			  @cancel="handleShowPicker(false)"
			/>
		</van-popup>
		<view class="base-date-picker-button-box" v-if="(!param.readonly&&!param.disabled)&&param.hasButton">
			<van-button class="base-date-picker-button" type="primary" size="small" @click="handleChange('无固定期限')">无固定期限</van-button>
			<van-button class="base-date-picker-button" type="primary" size="small" @click="handleChange('长期')">长期</van-button>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
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
	                    "error-message": "",
	                    style: ""
	                }
	            }
	        }
	    },
		data () {
			return {
				showPicker: false,
				time:'0',
				date:'0000/00/00'
			}
		},
		created() {
			this.time = new Date(this.convertToLateDate()).getTime()
			this.date = this.convertToLateDate()
			// console.log("TIME",this.time)
		},
	    methods: {
				handleChange(value){
					this.$emit('confirm', value)
				},
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
			convertToLateDate() {
				var data = new Date();
					// var Da = new Date(data.getTime() + 24 * 60 * 60 * 1000 * 30);
					// 以上两行代码为关键代码，若想要返回一天后的时间，则可以将第二行代码更换为下面代码
					// var Da = new Date(data.getTime() + 24 * 60 * 60 * 1000);
					// 若是想要返回值为当前时间，则上面两行代码可以直接修改为下面代码即可。
					var Da = new Date()
					var y = Da.getFullYear();
					var m = Da.getMonth() + 1;
					var d = Da.getDate();
					var H = Da.getHours();
					var mm = Da.getMinutes();
					m = m < 10 ? "0" + m : m;
					d = d < 10 ? "0" + d : d;
					H = H < 10 ? "0" + H : H;
					let time;
					if(_.get(this.param,"tagIcon")==='datetime'){
						time = y + "/" + m + "/" + d + " " + H + ":" + mm
					}else if(_.get(this.param,"tagIcon"==='year-month')){
						time = y + "/" + m
					}else{
						time = y + "/" + m + "/" + d
					}
					// console.log()
					return time;
			},
			showTime () {
				let time = _.get(this.param, 'value')
				if (!time) {
					return ''
				}
				if (['date', 'datetime', 'year-month'].includes(_.get(this.param, 'tagIcon')) && _.isString(time)) {
					time = new Date(time).getTime()
				}
				return time
			},
			handleShowPicker (value = false) {
				this.showPicker = value
			},
	        handleComfirm (e) {
				let value = e.detail
				if (['date', 'datetime', 'year-month'].includes(_.get(this.param, 'tagIcon'))) {
					const timeFomat = {
						date: 'YYYY-MM-DD',
						datetime: 'YYYY-MM-DD HH:mm',
						'year-month': 'YYYY-MM'
					}
					value = moment(value).format(timeFomat[this.param.tagIcon])
				}
	           this.$emit('confirm', value)
			   this.handleShowPicker(false)
	        }
	    }
	}
</script>

<style lang="less">
	@import "./common.less";
	.base_date_picker_containe {}
	.base-date-picker-button-box{
    position: relative;
		border-bottom: 1px solid #F5F6F7;
    /* margin-left: 5px; */
    display: flex;
    justify-content: flex-end;
	}
	.base-date-picker-button{
    font-size: 10px;
    margin:5px;
	}
</style>
