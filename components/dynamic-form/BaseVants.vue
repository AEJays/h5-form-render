<template>
    <view>
       <block v-for="(item, index) in fields" :key="index" v-if="!_get(item,'hidden')">
            <base-field
              v-if="['el-input'].includes(_get(item, '__config__.tag'))"
              :param="{
                  ...getBaseParam(item),
                   type: _get(item, '__config__.tagIcon') === 'input' ? 'text' : _get(item, '__config__.tagIcon'),
                   ..._get(item, 'error') 
                      ? { 'error-message': item['error-message'] || `请填写${_get(item, '__config__.label')}`} 
                      : {}
                 }"
                 @input="(e) => handleSetValue(e, fields[index])"
                 @clear="(e) => handleClear(e, fields[index])"
            />
           <base-input-number 
               v-if="_get(item, '__config__.tag') === 'el-input-number'"
               :param="{
                   ...getBaseParam(item),
                   ...item.min !== undefined ? { min: item.min } : {},
                   ...item.max !== undefined ? { max: item.max } : {},
                   ..._get(item, 'error', false) ? { error: item.error } : {},
                   ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请填写${_get(item, '__config__.label')}` } : {}
               }"
               @change="(e) => handleSetValue(e, fields[index])"
           />
           <base-select 
               v-if="_get(item, '__config__.tag') === 'el-select'"
               :param="{
                   ...getBaseParam(item),
                   columns: _get(item, '__slot__.options', []),
                   ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
               }"
               @confirm="(e) => handleSetValue(e, fields[index])"
           />
           
           <base-switch 
               v-if="_get(item, '__config__.tag') === 'el-switch'"
               :param="{
                   ...getBaseParam(item),
                   ..._get(item, 'error', false) ? { error: item.error } : {},
                   ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
               }"
               @change="(e) => handleSetValue(e, fields[index])"
           />
           <view style="font-size: 14px;font-weight: bolder;margin: 0 5px;width: auto;color: #888;" v-if="_get(item,'__config__.title')">{{_get(item,'__config__.title')}}</view>
           <base-radio 
               v-if="_get(item, '__config__.tag') === 'el-radio-group'"
               :param="{
                   ...getBaseParam(item),
                   options: _get(item, '__slot__.options', []),
                   ..._get(item, 'error', false) ? { error: item.error } : {},
                   ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
               }"
               @change="(e) => handleSetValue(e, fields[index])"
           />
           
           <base-checkbox 
               v-if="_get(item, '__config__.tag') === 'el-checkbox-group'"
               :param="{
                  ...getBaseParam(item),
                  options: _get(item, '__slot__.options', []),
                  ..._get(item, 'error', false) ? { error: item.error } : {},
                  ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
               }"
               @change="(e) => handleSetValue(e, fields[index])"
           />
           
           <base-slider 
              v-if="_get(item, '__config__.tag') === 'el-slider'"
              :param="{
                ...getBaseParam(item),
                ..._get(item, 'error', false) ? { error: item.error } : {},
                ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
              }"
              @change="(e) => handleSetValue(e, fields[index])"
           />
           
		   <base-date-picker 
			  v-if="['el-time-picker', 'el-date-picker'].includes(_get(item, '__config__.tag'))"
			  :param="{
				  ...getBaseParam(item),
				  tagIcon: _get(item, '__config__.tagIcon'),
                  ..._get(item, 'error', false) ? { error: item.error } : {},
				  ..._get(item, 'error') ? { 'error-message' : item['error-message'] || '' } : {},
					hasButton:_get(item,'hasButton')
			  }"
			  @confirm="(e) => handleSetValue(e, fields[index])"
		   />
		   
		   <base-rate 
			  v-if="_get(item, '__config__.tag') === 'el-rate'"
			  :param="{
				  ...getBaseParam(item),
                  ..._get(item, 'error', false) ? { error: item.error } : {},
				  ..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {}
			  }"
			  @change="(e) => handleSetValue(e, fields[index])"
			/>
		   
		   <base-upload 
			v-if="_get(item, '__config__.tag') === 'el-upload'"
			:param="{
				...getBaseParam(item),
				..._get(item, 'error', false) ? { error: item.error } : {},
				..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
				...item['max-count'] ? { 'max-count': item['max-count'] } : {},
				..._has(item, 'deletable') ? { deletable: item.deletable } : {},
                ..._has(item, 'accept') ? { accept: item.accept } : {},
			}"
            @change="(e) => handleSetValue(e, fields[index])"
		   />
			 <c-image
				v-if="_get(item, '__config__.tag') === 'c-image'"
				:param="{
					...getBaseParam(item),
					..._get(item, 'error', false) ? { error: item.error } : {},
					..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
					...item['max-count'] ? { 'max-count': item['max-count'] } : {},
					..._has(item, 'deletable') ? { deletable: item.deletable } : {},
				          ..._has(item, 'accept') ? { accept: item.accept } : {},
				}"
				      @change="(e) => handleSetValue(e, fields[index])"
			 > 
			 </c-image>
			 <c-video
			 				v-if="_get(item, '__config__.tag') === 'c-video'"
			 				:param="{
			 					...getBaseParam(item),
			 					..._get(item, 'error', false) ? { error: item.error } : {},
			 					..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
			 					...item['max-count'] ? { 'max-count': item['max-count'] } : {},
			 					..._has(item, 'deletable') ? { deletable: item.deletable } : {},
			 				          ..._has(item, 'accept') ? { accept: item.accept } : {},
			 				}"
			 				      @change="(e) => handleSetValue(e, fields[index])"
			 > 
			 </c-video>
<!-- 			 <c-select-list
				 v-if="_get(item, '__config__.tag') === 'c-video'"
				 :param="{
					...getBaseParam(item),
					..._get(item, 'error', false) ? { error: item.error } : {},
					..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
					...item['max-count'] ? { 'max-count': item['max-count'] } : {},
					..._has(item, 'deletable') ? { deletable: item.deletable } : {},
									 ..._has(item, 'accept') ? { accept: item.accept } : {},
				 }"
							 @change="(e) => handleSetValue(e, fields[index])"
			 ></c-select-list> -->
			 
			 <c-select
			 				 v-if="_get(item, '__config__.tag') === 'c-select'&&!Details"
			 				 :param="{
			 					...getBaseParam(item),
			 					..._get(item, 'error', false) ? { error: item.error } : {},
			 					..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
			 					...item['max-count'] ? { 'max-count': item['max-count'] } : {},
			 					..._has(item, 'deletable') ? { deletable: item.deletable } : {},
								..._has(item, 'accept') ? { accept: item.accept } : {},
			 				 }"
							 :loadAPI="_get(item,'loadApi','')"
							 :data="_get(item,'data')"
							 :method="_get(item,'method')"
							 :options="item.options"
							 @change="(e) => handleSetValue(e, fields[index])"
										 @list="(e)=>handleList(e)"
			 ></c-select>
			 <c-select-street
			 				 v-if="_get(item, '__config__.tag') === 'c-select-street'&&!Details"
			 				 :param="{
			 					...getBaseParam(item),
			 					..._get(item, 'error', false) ? { error: item.error } : {},
			 					..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
			 					...item['max-count'] ? { 'max-count': item['max-count'] } : {},
			 					..._has(item, 'deletable') ? { deletable: item.deletable } : {},
			 								..._has(item, 'accept') ? { accept: item.accept } : {},
			 				 }"
			 							 :loadAPI="_get(item,'loadApi','')"
			 							 :data="_get(item,'data')"
			 							 :method="_get(item,'method')"
										 :response="_get(item,'response')"
			 							 @change="(e) => handleSetValue(e, fields[index])"
			 										 @list="(e)=>handleStreet(e)"
			 ></c-select-street>
			 <c-Map-Mes
				 v-if="_get(item, '__config__.tag') === 'c-map-mes'"
				 :param="{
						...getBaseParam(item),
						..._get(item, 'error', false) ? { error: item.error } : {},
						..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
						...item['max-count'] ? { 'max-count': item['max-count'] } : {},
						..._has(item, 'deletable') ? { deletable: item.deletable } : {},
						..._has(item, 'accept') ? { accept: item.accept } : {},
				 }"
				 @map="(e) => handleMap(e, fields[index])"
			 ></c-Map-Mes>
			 <base-single-modal-select
			 	v-if="['el-single-modal-select', 'el-multiple-modal-select'].includes(_get(item, '__config__.tag'))"
				:selectType="_get(item, '__config__.tag') === 'el-multiple-modal-select' ? 'checkbox' : 'radio'"
				:param="{
			 		...getBaseParam(item),
			        ..._get(item, 'error', false) ? { error: item.error } : {},
			 		..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
					..._get(item, 'listUrl') ? { 'listUrl': item.listUrl } : {},
					..._get(item, 'titleField') ? { 'titleField': item.titleField } : {},
					..._get(item, 'valueField') ? { 'valueField': item.valueField } : {},
					..._get(item, 'listField') ? { 'listField': item.listField } : {}
			 	}"
			 	@change="(e) => handleSetValue(e, fields[index])"
			/>
            <base-signature 
                v-if="_get(item, '__config__.tag') === 'signature'"
                :param="{
                	...getBaseParam(item),
					..._get(item, 'error', false) ? { error: item.error } : {},
					..._get(item, 'error') ? { 'error-message' : item['error-message'] || '请签章' } : {},
                }"
								:hideSelect = "_get(item,'hideSelect')"
				@change="(e) => handleSetValue(e, fields[index])"
            />
						<c-rich-text
							v-if="_get(item, '__config__.tag') === 'tinymce'"
							        :param="{
							        	...getBaseParam(item),
								..._get(item, 'error', false) ? { error: item.error } : {},
								..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请输入${_get(item, '__config__.label')}` } : {},
							        }"
							@change="(e) => handleSetValue(e, fields[index])"
						></c-rich-text>
						<c-view-upload
						v-if="_get(item, '__config__.tag') === 'c-view-upload'"
						:param="{
							...getBaseParam(item),
							..._get(item, 'error', false) ? { error: item.error } : {},
							..._get(item, 'error') ? { 'error-message' : item['error-message'] || `请选择${_get(item, '__config__.label')}` } : {},
							...item['max-count'] ? { 'max-count': item['max-count'] } : {},
							..._has(item, 'deletable') ? { deletable: item.deletable } : {},
						          ..._has(item, 'accept') ? { accept: item.accept } : {},
						}"
						      @change="(e) => handleSetValue(e, fields[index])"
						 />
       </block>
    </view>
</template>

<script>
    import _ from 'lodash'
		import {isDisabled} from '@/utils/customTools.js'
    import BaseField from './BaseField.vue'
    import BaseInputNumber from './BaseInputNumber.vue'
    import BaseSelect from './BaseSelect.vue'
    import BaseSwitch from './BaseSwitch.vue'
    import BaseRadio from './BaseRadio.vue'
    import BaseCheckbox from './BaseCheckbox.vue'
    import BaseSlider from './BaseSlider.vue'
	import BaseDatePicker from './BaseDatePicker.vue'
	import BaseRate from './BaseRate.vue'
	import BaseUpload from './BaseUpload.vue'
	import cImage from './custom/c-image.vue'
	import cVideo from './custom/c-video.vue'
	import CRichText from './custom/c-rich-text.vue'
	// import cMapMes from 
	// import cSelectList from './custom/c-select-list.vue'
	import cSelect from './custom/c-select/c-select.vue'
	import cSelectStreet from './custom/selectBox/selectBox.vue'
	import cMapMes from './custom/c-map-mes.vue'
	import BaseSingleModalSelect from './BaseSingleModalSelect.vue'
    import BaseSignature from './BaseSignature.vue'
		// 附件显示
		import cViewUpload from './custom/c-View-Upload/c-View-Upload.vue'
    export default {
        components: {
           BaseField,
           BaseInputNumber,
           BaseSelect,
           BaseSwitch,
           BaseRadio,
           BaseCheckbox,
           BaseSlider,
		   BaseDatePicker,
		   BaseRate,
		   BaseUpload,
		   cImage,
		   cVideo,
		   // cSelectList,
		   cSelect,
			 cMapMes,
		   BaseSingleModalSelect,
           BaseSignature,
					 cSelectStreet,
					 CRichText,
					 cViewUpload
        },
        props: {
          fields: {
              type: Array,
              default: function () {
                  return []
              }
          },
          form: {
             type: Object,
             default: function () {
                 return {}
             } 
          },
					Details:{
						type:Boolean,
						default:function(){
							return false
						}
					}
        },
        methods: {
           getBaseParam (item) {
						 let config;
						 // console.log(this.fields,"表单数据")
							// this.form[item.__vModel__]
							let latitude = this.form["latitude"]
							let longitude = this.form["longitude"]
							let streetName = this.form["streetName"]
							let streetId = this.form["streetId"]
							// console.log("获取到的item",isDisabled(item),"fields",this.fields)
							// console.log("这是form",this.form)
							// console.log("tag",_.get(item,'__config__.tag'))
							if(_.get(item,'__config__.tag')==='c-select-street'){
								config={
								 // title:_.get(item,'__config__.title'),
									label: _.get(item, '__config__.label'),
									required: _.get(item, '__config__.required', false),
									readonly: true,
									disabled: _.get(item, 'disabled', false),
									clearable: _.get(item, 'clearable', false),
									inputBlock: _.get(item, 'inputBlock', false),
									value: {
										name:streetName,
										id:streetId
									},
									style: _.get(item, 'style', ''),
									regList: _.get(item, '__config__.regList', []),
									..._.has(item, 'placeholder') ? { placeholder: item.placeholder } : {},
									..._.has(item, 'password') ? { password: item.password } : {},
									..._.has(item, 'maxlength') ? { maxlength: item.maxlength } : {},
									..._.has(item, 'prefix-icon') ? { 'left-icon': item['prefix-icon'] } : {},
									..._.has(item, 'suffix-icon') ? { 'right-icon': item['suffix-icon'] } : {},
									..._.has(item, 'show-word-limit') ? { 'show-word-limit': item['show-word-limit'] } : {}
								}
							}else if(_.get(item,'__config__.tag')==='c-map-mes'){
								config={
								 // title:_.get(item,'__config__.title'),
									label: _.get(item, '__config__.label'),
									required: _.get(item, '__config__.required', false),
									readonly: true,
									disabled: _.get(item, 'disabled', false),
									clearable: _.get(item, 'clearable', false),
									inputBlock: _.get(item, 'inputBlock', false),
									value: {
										latitude:latitude,
										longitude:longitude
									},
									style: _.get(item, 'style', ''),
									regList: _.get(item, '__config__.regList', []),
									..._.has(item, 'placeholder') ? { placeholder: item.placeholder } : {},
									..._.has(item, 'password') ? { password: item.password } : {},
									..._.has(item, 'maxlength') ? { maxlength: item.maxlength } : {},
									..._.has(item, 'prefix-icon') ? { 'left-icon': item['prefix-icon'] } : {},
									..._.has(item, 'suffix-icon') ? { 'right-icon': item['suffix-icon'] } : {},
									..._.has(item, 'show-word-limit') ? { 'show-word-limit': item['show-word-limit'] } : {}
								}
							}else if(this.Details===true){
								 config={
									 // title:_.get(item,'__config__.title'),
										label: _.get(item, '__config__.label'),
										required: _.get(item, '__config__.required', false),
										readonly: true,
										disabled: _.get(item, 'disabled', false),
										clearable: _.get(item, 'clearable', false),
										inputBlock: _.get(item, 'inputBlock', false),
										value: this.form[item.__vModel__],
										style: _.get(item, 'style', ''),
										regList: _.get(item, '__config__.regList', []),
										..._.has(item, 'placeholder') ? { placeholder: item.placeholder } : {},
										..._.has(item, 'password') ? { password: item.password } : {},
										..._.has(item, 'maxlength') ? { maxlength: item.maxlength } : {},
										..._.has(item, 'prefix-icon') ? { 'left-icon': item['prefix-icon'] } : {},
										..._.has(item, 'suffix-icon') ? { 'right-icon': item['suffix-icon'] } : {},
										..._.has(item, 'show-word-limit') ? { 'show-word-limit': item['show-word-limit'] } : {}
								 }
							 }else{
								 // console.log(this.form,"FORM")
								 config={
								 // title:_.get(item,'__config__.title'),
									label: _.get(item, '__config__.label'),
									required: _.get(item, '__config__.required', false),
									readonly: _.get(item, 'readonly', false),
									disabled: _.get(item, 'disabled', false),
									clearable: _.get(item, 'clearable', false),
									inputBlock: _.get(item, 'inputBlock', false),
									value: this.form[item.__vModel__],
									style: _.get(item, 'style', ''),
									regList: _.get(item, '__config__.regList', []),
									..._.has(item, 'placeholder') ? { placeholder: item.placeholder } : {},
									..._.has(item, 'password') ? { password: item.password } : {},
									..._.has(item, 'maxlength') ? { maxlength: item.maxlength } : {},
									..._.has(item, 'prefix-icon') ? { 'left-icon': item['prefix-icon'] } : {},
									..._.has(item, 'suffix-icon') ? { 'right-icon': item['suffix-icon'] } : {},
									..._.has(item, 'show-word-limit') ? { 'show-word-limit': item['show-word-limit'] } : {}
							 }
							}
							// console.log(this.fields)
							// console.log("传到里面的配置",config)
							return config
           },
		   _has (item = {}, str) {
			 if (Object.keys(item).length === 0) {
				 return false
			 }  
			 return _.get(item, str)
		   },
           _get (item, str, defauleValue = '') {
              return _.get(item, str, defauleValue)
           },
           handleSetValue (e, item) {
              this.$emit('change', e, item)
           },
					 handleMap(e, item){
						 this.$emit('map', e, item)
					 },
					 handleList(e){
						 this.$emit("user",e)
					 },
					 handleStreet(e){
						 // console.log(e)
						 this.$emit("street",e)
					 },
           handleClear (e, item) {
               this.$emit('clear', e, item)
           }
        }
    }
</script>

<style>
</style>
