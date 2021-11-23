<template>
	<view 
	   class="venue_dynamic_list_container"
	   :style="[_get(config, 'outStyle', {})]"
	>
        <view>
            <view class="tab_list" v-if="typeList.length > 0">
                <ms-tabs
                    :list="typeList"
                    field="name"
                    v-model="tabActive"
                    @selected="handleSelectTab"
                />
            </view>
            <load-refresh
                ref="loadRefresh"
                :pagination="_get(config, 'pagination', true)"
                :isRefresh="isRefresh"
                refreshType="hollowDots"
                color="#04C4C4"
                :heightReduce="heightReduce"
                :fixedHeight="fixedHeight"
                :currentPage="listCurrentPage"
                :totalPages="listTotalPages" 
								:unloading="unloading"
                @loadMore="loadMore" 
                @refresh="refresh"
             >
              <view slot="content-list" class="list_content">
                  <view 
					v-for="(item, index) in list" 
					:key="index"
					@click="handleJumpRoute(item)"
				  >
					 <self-inspection-record-item
					 	v-if="getListItemKey() === 'SelfInspectionRecordItem'"
					 	:item="{
							...item,
							...getComponentBindData(item)
						}"
					 />

					<record-steps-item 
					  v-if="getListItemKey() === 'RecordStepsItem'"
					  :item="{
						  ...item,
						  ...getComponentBindData(item)
					  }"
					/>
					<companyStateToEnforcement
					v-if="getListItemKey() === 'company-state-to-enforcement'"
					:item="{
						...item,
						...getComponentBindData(item)
					}"
					:options="_get(config,'options',{})"
					@delete="handleDelete"
					/>
					<state-to-item
					 	v-if="getListItemKey() === 'stateToItem'"
					 	:item="{
							...item,
							...getComponentBindData(item)
						}"
					></state-to-item>
					<notice-item
					v-if="getListItemKey() === 'noticeItem'"
					:item="{
						...item,
						...getComponentBindData(item)
					}"
					/>
					<to-do-list-item
						v-if="getListItemKey() === 'toDoListItem'"
						:item="{
							...item,
							...getComponentBindData(item)
						}"
						:options="config.options"
					></to-do-list-item>
					<aqy-item
						v-if="getListItemKey() === 'aqyItem'"
						:item="{
							...item,
							...getComponentBindData(item)
						}"
						:options="_get(config,'options',{})"
					></aqy-item>
                  </view>
              </view>
            </load-refresh>
        </view>
	</view>
</template>

<script>
    import _ from 'lodash'
    import qs from 'qs'
	import loadRefresh from '../load-refresh/load-refresh.vue'
    import msTab from '../ms-tabs/ms-tabs.vue'
	import SelfInspectionRecordItem from './listItem/SelfInspectionRecordItem.vue'
	import RecordStepsItem from './listItem/RecordStepsItem.vue'
	import StateToItem from './listItem/StateToList.vue'
	import ToDoListItem from './listItem/todoListItem.vue'
	import noticeItem from './listItem/NoticeItem.vue'
	import aqyItem from './listItem/aqyItem.vue'
	import CompanyStateToEnforcement from './listItem/AvatarStateList/companyStateToEnforcement/companyStateToEnforcement.vue'
    import { globalConfig } from '@/config.js'
    
	export default {
		components: {
			loadRefresh,
			msTab,
			SelfInspectionRecordItem,
			RecordStepsItem,
			StateToItem,
			ToDoListItem,
			CompanyStateToEnforcement,
			noticeItem,
			aqyItem
		},
		props: {
			config: {
				type: Object,
				default: function() {
					return {}
				}
			},
			unloading:{
				type:Boolean,
				default(){
					return false
				}
			},
			fileno:{
				type:String,
				default(){
					return {}
				}
			},
			// 外部传入的查询
			otherSearch:{
				type:Object,
				default(){
					return {}
				}
			}
		},
		data() {
			return {
				listCurrentPage: 1,
				listTotalPages: 1,
				list: [],
                typeList: [],
                tabActive: 0,
                
                listSearch: {}, // 列表查询参数
                pageNoField: '',  // 页数配置的字段名
                pageSizeField: '', // size配置的字段名
								isStop:false ,//是否停止自动刷新
								Time:null,
								isDelete:false
								
			}
		},
        computed: {
          heightReduce () {
            return this.typeList.length > 0 ? 88 : 0
          },
		  //是否外部传入数据
		  isPropsList () {
			return _.has(this.config, 'list') && _.isArray(this.config.list)
		  },
          // 列表高度
          fixedHeight () {
             // 默认传入的为px
             let height = 0
             if (_.get(this.config, 'outStyle.height')) {
                height = parseInt(_.get(this.config, 'outStyle.height', 0)) - (this.typeList.length > 0 ? 44 : 0)
             }
             if (height < 0) {
                height = 0
             }
             return height * 2
          },
          isRefresh () {
              // return !this.isPropsList && this.list.length !== 0
			  return false
          }
        },
		mounted() {
		 // 外部传入数据源
		 if (_.get(this.config, 'loadApi')) {
		    this.updateData()
				this.Time = setInterval(()=>{
					if(!this.isStop){
						this.fetchList({ refresh: true })
					}
				},5000)
				console.log(this.Time)
		 } else {
			 if (this.isPropsList) {
				this.list = _.cloneDeep(this.config.list)
			 }
		 }
		},
		beforeDestroy(){
			clearInterval(this.Time)
		},
		methods: {
			_has (item = {}, str) {
				if (Object.keys(item).length === 0) {
					return false
				}  
				return _.get(item, str)
			},
            _get (item, str, defauleValue = '') {
              return _.get(item, str, defauleValue)
            },
            getListItemKey() {
              // const moduleKey = _.get(this.config, 'config.modules[0].key', '')
              // const moduleData = _.get(this.config, 'config.moduleData', {})
              // const keyData = _.get(moduleData, moduleKey, {})
			  const keyData = _.get(this.config,'itemModule',{})
              return _.get(keyData, 'name', '')
            },
            handleDelete(e){
							this.isDelete = e
						},
            // 切换tab
            handleSelectTab (e, item) {
                this.tabActive = e
                const typeField = _.get(this.config, 'request.fixed')
                this.listSearch = {
                    ...this.listSearch,
                    [typeField]: _.get(item, 'value'),
                    [this.pageNoField]: 1
                }
                this.fetchList({ refresh: true })
            },
            
            // 更新数据
            updateData () {  
                this.typeList =  _.get(this.config, 'tabConfig.show') === true ? _.get(this.config, 'tabConfig.list', []) : []
                const requestData = _.get(this.config, 'request', {})
								let customData;
								let fileno;
								// console.log(this.fileno)
								
								if(_.get(this.config,'request.fileno')==='fileno'){
									if(this.fileno){
										 fileno=this.fileno
										 customData = {
										 	"customValues":{
												"fileno":fileno
											}
										 }
										 // console.log(customData)
									}
								}

                const searchData = {}
                for (const key in requestData) {
                    if (key !== 'default') {
                        searchData[requestData[key]] = ''
                    }
                }
                if (_.has(searchData, 'pageNo')) {
                    searchData.pageNo = 1
                }
                if (_.has(searchData, 'pageSize')) {
                    searchData.pageSize = 10
                }
								
                this.pageNoField = _.get(searchData, 'pn', 'pageNo')
                this.pageSizeField = _.get(searchData, 'ps', 'pageSize')
                this.listSearch = { ...searchData, ..._.get(this.config, 'request.default', {}),...customData||{},...this.otherSearch||{} }
                if (_.get(this.config, 'loadApi')) {
                    this.fetchList({ refresh: true })
               }
            },
            
            // 获取列表信息
            fetchList (searchData = {}) {
              // uni.showLoading({
              //     title: "loading...",
              //     mask: true
              // })
              uni.request({
                  url: _.get(this.config, 'loadApi'),
                  method: _.get(this.config,'method','GET'),
                  data: this.listSearch,
                  header: {
                      Authorization: `Bearer ${uni.getStorageSync(`${globalConfig.tokenStorageKey}`) || ''}`,
                      token: uni.getStorageSync(`${globalConfig.tokenStorageKey}`) || ''
                  },
                  complete: (res) => {
                     // uni.hideLoading()
                     if (['000000', 200].includes(_.get(res, 'data.code'))) {
                        const data = _.get(res, 'data.data')
                        const listField = _.get(this.config, 'response.list', '')
                        const totolField = _.get(this.config, 'response.total', 0)
                        // console.log(data,"data")
                        const prevList = _.get(searchData, 'refresh') ? [] : this.list
                        this.list = prevList.concat(listField ? _.get(data, listField, []) : _.get(res, 'list', []))
                        const total = _.get(data, totolField, 0)
                        this.listCurrentPage = this.list.length < 10 ? 1 :  Math.floor(total / 10)
                        this.listTotalPages = total < 10 ? 1 : Math.floor(total / 10)
                        this.$refs.loadRefresh.completed()
                     }
										if(res.data.code==='00000'){
											const data = _.get(res, 'data.data')
											const listField = _.get(this.config, 'response.list', '')
											const totolField = _.get(this.config, 'response.total', 0)
											// console.log(data,"data")
											const prevList = _.get(searchData, 'refresh') ? [] : this.list
											this.list = prevList.concat(listField ? _.get(data, listField, []) : _.get(res, 'list', []))
											const total = _.get(data, totolField, 0)
											this.listCurrentPage = this.list.length < 10 ? 1 :  Math.floor(total / 10)
											this.listTotalPages = total < 10 ? 1 : Math.floor(total / 10)
											this.$refs.loadRefresh.completed()
										}
                  }
              })  
            },
            
            // 加载更多
            loadMore () {
							if(!this.unloading){
							// console.log("加载更多")
				if (this.isPropsList) {
					return
				}
				this.isStop = true
                this.listSearch = {
                    ...this.listSearch,
                    [this.pageNoField]: this.listSearch[this.pageNoField] + 1
                }
                this.fetchList()
								
								}
            },
            
            // 上拉加载刷新
            refresh () {
							if(!this.unloading){
								// console.log("刷新")
				if (this.isPropsList) {
					return
				}
            	this.listSearch = {
            	    ...this.listSearch,
            	    [this.pageNoField]: 1
            	}
            	this.fetchList({ refresh: true })
							}
            },
			
			// 列表项组件与列表数据绑定
			getComponentBindData (item) {
				if (!_.has(this.config, 'binding') || JSON.stringify(this.config.binding) === '{}') {
					return {}
				}
				const comonentScouce = {}
				for (const i in this.config.binding) {
					comonentScouce[this.config.binding[i]] = _.get(item, i, '')
				}
				return comonentScouce
			},
			
			// 统一跳转路由
			handleJumpRoute (item) {
				if(this.isDelete){
					return
				}
				if (!_.get(this.config, 'itemNavigation')) {
					return
				}
				let routeUrl = ''
				const itemNavigation = this.config.itemNavigation
				const route = itemNavigation.split('?')[0]
				const query = itemNavigation.split('?')[1] ? qs.parse(itemNavigation.split('?')[1]) : {}
				routeUrl += (`/pages${route.charAt(0) !== '/' ? '/' : ''}` + route)
				if (Object.keys(query).length > 0) {
				    for (const i in query) {
				        if (query[i] === '') {
				            query[i] = item[i] || ''
				        }
				    }
				    routeUrl += '?query=' + encodeURIComponent(JSON.stringify(query))
				}
				// console.log('routeUrl= ', routeUrl)
				// 旧跳转方式
				uni.navigateTo({
					url:routeUrl
				})
				// 栈溢出,改用redirectTo
				// uni.redirectTo({
				// 	url: routeUrl
				// 	// success:res =>{// console.log("跳转成功")},
				// 	// fail:err =>(// console.log("跳转失败",err))
				// })
			}
		}
	}
</script>

<style lang="less" scoped>
	.venue_dynamic_list_container {
		width: 100%;
		display: block;

		.tab_list {
			border-bottom: 1px solid #f2f2f2;
			position: relative;
			z-index: 100;
		}

		.list_content {}
	}
</style>
