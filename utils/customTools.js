			import {globalConfig} from '@/config.js'
			// import {LoadComplete} from '@/common/api.js'
			export const convert=(argConfig)=> {
			  if (!argConfig.isLawForm) {
			    return argConfig
			  }
			  const config = deepClone(argConfig)
			  config.isLawForm = false
			
			  // 生成检查事项
			  const itemChilds = []
			  for (let i = 0; i < argConfig.lawFormConfig.checkItemsList.length; i++) {
			    const item = argConfig.lawFormConfig.checkItemsList[i]
			    const item1 = {
			      __config__: {
			        label: '检查方法',
			        tag: 'el-checkbox-group',
			        tagIcon: 'checkbox',
			        layout: 'colFormItem',
			        required: false,
			        title: item.title
			      },
			      __slot__: {
			        options: item.way.options || []
			      },
			      __vModel__: item.way.__vModel__
			    }
			    const item2 = {
			      __config__: {
			        label: '检查结果',
			        tag: 'el-radio-group',
			        tagIcon: 'radio',
			        layout: 'colFormItem',
			        required: false,
			      },
			      __slot__: {
			        options: item.result.options || []
			      },
			      __vModel__: item.result.__vModel__
			    }
			    itemChilds.push(item1)
			    itemChilds.push(item2)
			  }
			  const checkItems = {
			    type: 'default',
			    justify: 'start',
			    align: 'top',
			    __config__: {
			      layout: 'rowFormItem',
			      tagIcon: 'row',
			      componentName: '检查事项',
			      children: itemChilds
			    }
			  }
			
			  config.fields = [
			    {
			      type: 'default',
			      justify: 'start',
			      align: 'top',
			      __config__: {
			        layout: 'rowFormItem',
			        tagIcon: 'row',
			        componentName: '检查对象',
			        children: [
			          {
			            __config__: {
			              label: '统一社会信用代码',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入统一社会信用代码',
			            __vModel__: 'businessLicense'
			          },
			          {
			            __config__: {
			              label: '名称',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入名称',
			            __vModel__: 'companyName'
			          },
			          {
									"__config__": {
										"label": "业务类型",
										"showLabel": true,
										"labelWidth": null,
										"tag": "el-checkbox-group",
										"tagIcon": "checkbox",
										"layout": "colFormItem",
										"span": 8,
										"regList": [],
										"changeTag": true,
										"document": "https://element.eleme.cn/#/zh-CN/component/checkbox",
										"formId": 108,
										"renderKey": "1081627530596290"
									},
									"__slot__": {
										"options": [{
											"label": "健身",
											"value": "BBD"
										}, {
											"label": "游泳",
											"value": "SW"
										}, {
											"label": "滑雪",
											"value": "SKI"
										}, {
											"label": "潜水",
											"value": "DIV"
										}, {
											"label": "攀岩",
											"value": "RC"
										}, {
											"label": "滑冰",
											"value": "SKA"
										}, {
											"label": "射箭",
											"value": "ARC"
										}, {
											"label": "田径",
											"value": "ATH"
										}, {
											"label": "羽毛球",
											"value": "BAD"
										}, {
											"label": "皮划艇",
											"value": "CAN"
										}, {
											"label": "棒球",
											"value": "BASE"
										}, {
											"label": "篮球",
											"value": "BASK"
										}, {
											"label": "拳击",
											"value": "BOX"
										}, {
											"label": "自行车",
											"value": "BIC"
										}, {
											"label": "击剑",
											"value": "FEN"
										}, {
											"label": "足球",
											"value": "FOOT"
										}, {
											"label": "手球",
											"value": "HAND"
										}, {
											"label": "马术",
											"value": "EQU"
										}, {
											"label": "曲棍球",
											"value": "HOC"
										}, {
											"label": "柔道",
											"value": "JUD"
										}, {
											"label": "现代五项",
											"value": "MOD"
										}, {
											"label": "体操",
											"value": "ART"
										}, {
											"label": "赛艇",
											"value": "ROW"
										}, {
											"label": "帆船",
											"value": "SAI"
										}, {
											"label": "射击",
											"value": "SHO"
										}, {
											"label": "排球",
											"value": "VOL"
										}, {
											"label": "垒球",
											"value": "SOFT"
										}, {
											"label": "兵乒球",
											"value": "BPP"
										}, {
											"label": "跆拳道",
											"value": "TAE"
										}, {
											"label": "网球",
											"value": "TEN"
										}, {
											"label": "铁人三项",
											"value": "TRI"
										}, {
											"label": "举重",
											"value": "WEI"
										}, {
											"label": "摔跤",
											"value": "WRE"
										}, {
											"label": "冬季两项",
											"value": "WIB"
										}, {
											"label": "冰壶",
											"value": "CUR"
										}, {
											"label": "冰球",
											"value": "ICH"
										}, {
											"label": "滑水",
											"value": "SUR"
										}, {
											"label": "摩托艇",
											"value": "MOT"
										}, {
											"label": "救生",
											"value": "LIS"
										}, {
											"label": "健美操",
											"value": "AER"
										}, {
											"label": "技巧",
											"value": "SKL"
										}, {
											"label": "高尔夫球",
											"value": "GOLF"
										}, {
											"label": "保龄球",
											"value": "BOWL"
										}, {
											"label": "掷球",
											"value": "THR"
										}, {
											"label": "台球",
											"value": "BIL"
										}, {
											"label": "藤球",
											"value": "SEP"
										}, {
											"label": "壁球",
											"value": "SQU"
										}, {
											"label": "橄榄球",
											"value": "RUG"
										}, {
											"label": "软式网球",
											"value": "LTEN"
										}, {
											"label": "热气球",
											"value": "HAB"
										}, {
											"label": "运动飞机",
											"value": "SPAI"
										}, {
											"label": "跳伞",
											"value": "SKDI"
										}, {
											"label": "滑翔",
											"value": "GLID"
										}, {
											"label": "航空模型",
											"value": "AVMO"
										}, {
											"label": "车辆模型",
											"value": "VEMO"
										}, {
											"label": "航海模型",
											"value": "NAMO"
										}, {
											"label": "定向",
											"value": "DIR"
										}, {
											"label": "业余无线电",
											"value": "AMR"
										}, {
											"label": "围棋",
											"value": "TGOG"
										}, {
											"label": "国际象棋",
											"value": "CHES"
										}, {
											"label": "中国象棋",
											"value": "CCHE"
										}, {
											"label": "桥牌",
											"value": "BRI"
										}, {
											"label": "武术",
											"value": "AMA"
										}, {
											"label": "健身气功",
											"value": "FIQG"
										}, {
											"label": "登山",
											"value": "MOU"
										}, {
											"label": "汽车",
											"value": "AUMO"
										}, {
											"label": "摩托车",
											"value": "MOT"
										}, {
											"label": "轮滑",
											"value": "ROSK"
										}, {
											"label": "毽球",
											"value": "SHUT"
										}, {
											"label": "门球",
											"value": "GATE"
										}, {
											"label": "舞龙舞狮",
											"value": "DLDA"
										}, {
											"label": "龙舟",
											"value": "DRBO"
										}, {
											"label": "钓鱼",
											"value": "FISH"
										}, {
											"label": "风筝",
											"value": "KITE"
										}, {
											"label": "信鸽",
											"value": "CAPI"
										}, {
											"label": "体育舞蹈",
											"value": "SPDA"
										}, {
											"label": "健美",
											"value": "BOBU"
										}, {
											"label": "拔河",
											"value": "TOW"
										}, {
											"label": "飞镖",
											"value": "DART"
										}, {
											"label": "电子竞技",
											"value": "ELSP"
										}, {
											"label":"蹦床",
											"value":"TRA"
										}, {
											"label": "瑜伽",
											"value": "YOG"
										}]
									},
									"placeholder": "请选择业务类型",
									"style": {
										"width": "100%"
									},
									"clearable": true,
									"disabled": false,
									"filterable": false,
									"multiple": false,
									readonly:true,
									"__vModel__": "type"
								},
			          {
			            __config__: {
			              label: '住所',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入住所',
			            __vModel__: 'companyAddress'
			          },
			          {
			            __config__: {
			              label: '法定代表人',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入法定代表人',
			            __vModel__: 'companyLegalPerson'
			          },
			          {
			            __config__: {
			              label: '联系方式',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入联系方式',
			            __vModel__: 'companyPhone'
			          },
			        ]
			      }
			    },
					{
					  type: 'default',
					  justify: 'start',
					  align: 'top',
					  __config__: {
					    layout: 'rowFormItem',
					    tagIcon: 'row',
					    componentName: '基础信息',
					    children: [
					      {
					        __config__: {
					          label: '检查开始时间',
					          tag: 'el-date-picker',
					          tagIcon: 'datetime',
					          layout: 'colFormItem',
					          required: false,
					        },
					        type: 'date',
					        placeholder: '请选择检查开始时间',
					        __vModel__: 'checkTimeStart'
					      },
								{
								  __config__: {
								    label: '检查结束时间',
								    tag: 'el-date-picker',
								    tagIcon: 'datetime',
								    layout: 'colFormItem',
								    required: false,
								  },
								  type: 'date',
								  placeholder: '请选择检查结束时间',
								  __vModel__: 'checkTimeEnd'
								},
					      {
					        __config__: {
					          label: '检查单号',
					          tag: 'el-input',
					          tagIcon: 'input',
					          layout: 'colFormItem',
					          required: false,
					        },
					        placeholder: '请输入检查单号',
									disabled: true,
					        __vModel__: 'checkOno'
					      },
					      {
					        __config__: {
					          label: '检查地点',
					          tag: 'el-input',
					          tagIcon: 'input',
					          layout: 'colFormItem',
					          required: false,
					        },
					        placeholder: '请输入检查地点',
					        __vModel__: 'checkAddress'
					      },
					    ]
					  }
					},
			    checkItems,
			    {
			      type: 'default',
			      justify: 'start',
			      align: 'top',
			      __config__: {
			        layout: 'rowFormItem',
			        tagIcon: 'row',
			        componentName: '检查结论',
			        children: [
			          {
			            __config__: {
			              label: '检查结果',
			              tag: 'el-radio-group',
			              tagIcon: 'radio',
			              layout: 'colFormItem',
			              required: false,
			            },
			            __slot__: {
			              options: [{
			                label: '合格',
			                value: '合格'
			              }, {
			                label: '不合格',
			                value: '不合格'
			              }]
			            },
			            __vModel__: 'checkResult'
			          },
			          {
			            __config__: {
			              label: '检查人意见',
			              tag: 'el-input',
			              tagIcon: 'textarea',
			              layout: 'colFormItem',
			              required: false,
										defaultValue:"/"
			            },
			            placeholder: '请输入检查人意见',
			            __vModel__: 'checkSuggest'
			          }
			        ]
			      }
			    },
			    {
			      type: 'default',
			      justify: 'start',
			      align: 'top',
			      __config__: {
			        layout: 'rowFormItem',
			        tagIcon: 'row',
			        componentName: '检查人',
			        children: [
			          {
			            __config__: {
			              label: '执法人员1',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入执法人员1',
			            __vModel__: 'lawPerson1'
			          },
			          {
			            __config__: {
			              label: '证件号1',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入证件号1',
			            __vModel__: 'lawPerson1Id'
			          },
			          {
			            __config__: {
			              label: '执法人员2',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入执法人员2',
			            __vModel__: 'lawPerson2'
			          },
			          {
			            __config__: {
			              label: '证件号2',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入证件号2',
			            __vModel__: 'lawPerson2Id'
			          },
			
			          {
			            __config__: {
			              label: '记录人',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入记录人',
			            __vModel__: 'recorder'
			          },
			          {
			            __config__: {
			              label: '被检查人',
			              tag: 'signature',
			              tagIcon: 'signature',
			              layout: 'colFormItem',
			              required: false,
			            },
			            placeholder: '请输入被检查人',
			            __vModel__: 'examinee'
			          },
			          {
			            __config__: {
			              label: '备注',
			              tag: 'el-input',
			              tagIcon: 'input',
			              layout: 'colFormItem',
			              required: false,
										defaultValue:"/",
			            },
			            placeholder: '请输入备注',
			            __vModel__: 'remark'
			          },
								{
									__config__: {
									  label: '上传附件',
									  tag: 'c-view-upload',
									  tagIcon: 'upload',
									  layout: 'colFormItem',
									  required: false,
										defaultValue:"/",
									},
									placeholder: '请上传附件',
									__vModel__: 'attachment'
								}
			        ]
			      }
			    }
			  ]
			  return config
			}
			export const deepClone=(obj)=> {
			  const _toString = Object.prototype.toString
			
			  // null, undefined, non-object, function
			  if (!obj || typeof obj !== 'object') {
			    return obj
			  }
			
			  // DOM Node
			  if (obj.nodeType && 'cloneNode' in obj) {
			    return obj.cloneNode(true)
			  }
			
			  // Date
			  if (_toString.call(obj) === '[object Date]') {
			    return new Date(obj.getTime())
			  }
			
			  // RegExp
			  if (_toString.call(obj) === '[object RegExp]') {
			    const flags = []
			    if (obj.global) { flags.push('g') }
			    if (obj.multiline) { flags.push('m') }
			    if (obj.ignoreCase) { flags.push('i') }
			
			    return new RegExp(obj.source, flags.join(''))
			  }
			
			  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}
			
			  for (const key in obj) {
			    result[key] = deepClone(obj[key])
			  }
			
			  return result
			}
			//确定表单是否可用工具（流程重要工具)(废弃)
			// export async function isDisabled(config,key,taskId){
			// 	let newField;
			// 	let newConfig;
				
			// 	let res = await LoadComplete({"processDefineKey":key,"taskId":taskId})
			// 	if(res.code==="00000"){
			// 		// console.log("获取到的数据res",res)
			// 		let list = res.data.nodeSettingEntity.formFiledEntityList
			// 		// console.log("list",list)
			// 		for(var i in list){
			// 			// console.log("name",list[i].name)
			// 			let status = list[i].status
			// 			let fields = config
			// 			// console.log("config",config)
			// 					let __model__ = fields.__vModel__
			// 					if(__model__===list[i].name){
			// 						let __newConfig__ = fields
			// 						if(status===0){
			// 							newConfig={...__newConfig__,"readonly":true}
			// 							// console.log("NewConfig",newConfig)
			// 						}else{
			// 							newConfig={...__newConfig__,"readonly":false}
			// 						}
			// 						newField=newConfig
			// 						// console.log("NEWFIELD",newField)
			// 						return newField
			// 			}
			// 			// if(config.fields)
			// 		}
			// 	}
			// 	// console.log("完成之后的配置",newField)
			// 	return newField
			// }
			