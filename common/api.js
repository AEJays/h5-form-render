import { request, upLoad } from './request'
import { globalConfig } from '@/config.js'

// 搜索测试
export const getSearchPage = (params)=>{
	const url = `${globalConfig.formHost}`
	return request('GET', url, params)
}

export const LoadComplete = (params) =>{
	// const url = `${globalConfig.workflowEP}/api.flow.examine/toComplete`
	const url = `${globalConfig.workflowEP}/api.webapp/canWrite`
	return request('POST', url, params)
}

export const getFormAPIdata = (API,params)=>{
	const url = `${globalConfig.workflowEP}${API}`
	return request('POST', url, params)
}

// 获取执法对象数据
export const getNavList = (params) => {
	const url = `${globalConfig.workflowEP}/admin/companyinfo/page`
	return request('GET', url, params)
}

export const getFormNo = (params) => {
	const url = `${globalConfig.workflowEP}/api.flow.examine/genFormNo`
	return request('POST', url, params)
}


// 获取搜索信息
export const getSearchALL = (id) => {
	const url = `${globalConfig.workflowEP}/admin/companyinfo/${id}`
	return request('GET', url, id)
}

// 获取执法对象类型数据
export const getNavTypeList = (params) => {
	const url = `${globalConfig.workflowEP}/api/u/icon`
	return request('GET', url, params)
}

// 获取企业信息库搜索数据

export const getSearchList = (params) => {
    const url = `${globalConfig.workflowEP}/api/u/user`
    return request('GET', url, params)
}
// select组件使用
export const getselectList = (loadAPI,params) =>{
	const url = loadAPI
	return request('GET',url,params)
}

// 获取动态表单配置信息
export const getDynamicFormField = (params) => {
    const url = `${globalConfig.formHost}`
    return request('GET', url, params)
}

// 获取动态列表配置信息
export const getDynamicListField = (params) => {
    const url = `${globalConfig.formHost}`
    return request('GET', url, params)
}

// 获取动态页面配置信息
export const getDynamicPageField = (params) => {
    const url = `${globalConfig.formHost}`
    return request('GET', url, params)
}

//获取复工页面数据
export const getReturnToWork = (params) => {
    const url = `${globalConfig.dataHost}`
    return request('GET', url, params)
}

//获取我的页面数据
export const getUserInfo = (params) => {
    const url = `${globalConfig.dataHost}`
    return request('GET', url, params)
}

//获取自查记录页面数据
export const getSelfInspectionRecord = (params) => {
    const url = `${globalConfig.dataHost}`
    return request('GET', url, params)
}

//2021-6-30
//获取经办人列表
export const getAdmUsers = (api, params) => {
    const url = `${globalConfig.workflowEP}${api}`
    return request('GET', url, params)
}
//end

//获取自查详情页面配置
// export const getSelfInspectionDetailField = (params) => {
//     const url = `${globalConfig.formHost}`
//     return request('GET', url, params)
// }


// 获取全局配置
export const getGolobalConfig = (params) => {
	const url = `${globalConfig.formHost}?id=1`
    // const url = 'https://api.mock.smallsaas.cn/form?id=1'
    return request('GET', url, params)
}


// 获取图片资源
export const getIcon = (params)=>{
	const url = `${globalConfig.dataHost}?id=9999999`
	return request('GET',url,params)
}