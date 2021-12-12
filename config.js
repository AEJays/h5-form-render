import _ from 'lodash'

// ��ȡȫ������
const globalConfigStorage = uni.getStorageSync('globalConfigStorage')
// 获取图标库
const iconList = uni.getStorageSync('iconList')

// const userInfo = uni.getStorage("userInfo")
const companyInfo = uni.getStorageSync("companyInfo")
// const userInfo = uni.getStorageSync('userInfo')
const token = uni.getStorageSync('token')

// export const globalConfig = {
//   host: 'https://xxx',
//   useCache: globalConfigStorage.useCache || false,
//   formHost: _.get(globalConfigStorage, 'formEP', 'https://api.mock.smallsaas.cn/form'),
//   dataHost: _.get(globalConfigStorage, 'dataEP', 'https://api.mock.smallsaas.cn/data'),
//   endpoint: _.get(globalConfigStorage, 'endpoint', 'https://api.cloud.smallsaas.cn'),
//   workflowEP: _.get(globalConfigStorage, 'workflowEP', 'https://api.uat.smallsaas.cn'),
//   authEP: _.get(globalConfigStorage, 'authEP', 'https://api.uaas.smallsaas.cn'),
//   // uatEP: _.get(globalConfigStorage, 'workflowEP', 'https://api.uat.smallsaas.cn'),
//   designEP:  _.get(globalConfigStorage, 'designEP', 'https://api.uat.smallsaas.cn'),
//   extraEP: _.get(globalConfigStorage, 'extraEP', 'https://api.uat.smallsaas.cn'),
//   tokenStorageKey: 'token',//token��
//   tencenMapKey: 'HGPBZ-E2IRR-ELTWC-WTE4W-I7MBE-P4FBU' ,// 获取地址sdk key
// 	// 执法token
// 	enforcementKey:"eyJleHBpcmVzX2luIjp7ImRheU9mTW9udGgiOjE3LCJkYXlPZldlZWsiOiJTQVRVUkRBWSIsImRheU9mWWVhciI6MTk4LCJob3VyIjoxOSwibWludXRlIjoxMCwibW9udGgiOiJKVUxZIiwibW9udGhWYWx1ZSI6NywibmFubyI6Njk2MDAwMDAwLCJzZWNvbmQiOjQsInllYXIiOjIwMjEsImNocm9ub2xvZ3kiOnsiY2FsZW5kYXJUeXBlIjoiaXNvODYwMSIsImlkIjoiSVNPIn19LCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic2NvcGUiOiJzZXJ2ZXIiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOiI5ODg5NTE4OTI4Mjk0ODM1OTQ3YzJkNmU4Yzg4N2FmYiIsInJlZnJlc2hfdG9rZW4iOiI3MDUwZGVlZDUzMmY0NjJjOTdiMmY4ZWZlNzllZGE3YiIsImV4cGlyZXNfaW4iOjg2NDAwMCwidXNlcl9pZCI6MjIsImRlcHRfaWQiOjMsInVzZXJuYW1lIjoiemYwMSIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJzY29wZSI6InNlcnZlciIsImxpY2VuY2UiOiJwcm9ncmVzcyIsImZyb20iOjAsInRpbWVfc3RhbXAiOiIxNjI1NjU2MjA0Iiwicm9sZV9jb2RlcyI6WyJBU1MiXX0.L_By2r_yoDFDQ-bNZze2I1qY5Uanp1xXP_t_mS1MUTU",
// 	// enforcementKey:"",
// 	icon:iconList,
// 	userInfo:userInfo
// }

export const globalConfig = {
  host: 'https://xxx',
  useCache: globalConfigStorage.useCache || false,
  formHost: _.get(globalConfigStorage, 'formEP', 'https://ai.hdqmjs.com/form'),
	// formHost: _.get(globalConfigStorage, 'testFormHost', 'https://ky.zbsoft.top/form'),
  dataHost: _.get(globalConfigStorage, 'dataEP', 'https://ai.hdqmjs.com/data'),
	// dataHost: _.get(globalConfigStorage,'testDataHost','https://ky.zbsoft.top/data'),
  endpoint: _.get(globalConfigStorage, 'endpoint', 'https://ai.hdqmjs.com'),
  workflowEP: _.get(globalConfigStorage, 'workflowEP', 'https://ai.hdqmjs.com'),
  authEP: _.get(globalConfigStorage, 'authEP', 'https://ai.hdqmjs.com'),
  // uatEP: _.get(globalConfigStorage, 'workflowEP', 'https://api.uat.smallsaas.cn'),
  designEP:  _.get(globalConfigStorage, 'designEP', 'https://ai.hdqmjs.com'),
	loginEP: _.get(globalConfigStorage, 'loginEP', 'https://ai.hdqmjs.com'),
  extraEP: _.get(globalConfigStorage, 'extraEP', 'https://ai.hdqmjs.com'),
  YyzzEP: _.get(globalConfigStorage, 'YyzzEP', 'https://ai.hdqmjs.com'),
	testEP: _.get(globalConfigStorage,'testEP','https://api.mock.smallsaas.cn/test'),//测试环境api 可使用中间层
  // zfEP: _.get(globalConfigStorage, 'zfEP', 'https://zf.hdqmjs.com'),
  tokenStorageKey: 'token',//token��
  tencenMapKey: 'HGPBZ-E2IRR-ELTWC-WTE4W-I7MBE-P4FBU' ,// 获取地址sdk key
	// 执法token
	enforcementKey:"eyJleHBpcmVzX2luIjp7ImRheU9mTW9udGgiOjE3LCJkYXlPZldlZWsiOiJTQVRVUkRBWSIsImRheU9mWWVhciI6MTk4LCJob3VyIjoxOSwibWludXRlIjoxMCwibW9udGgiOiJKVUxZIiwibW9udGhWYWx1ZSI6NywibmFubyI6Njk2MDAwMDAwLCJzZWNvbmQiOjQsInllYXIiOjIwMjEsImNocm9ub2xvZ3kiOnsiY2FsZW5kYXJUeXBlIjoiaXNvODYwMSIsImlkIjoiSVNPIn19LCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwic2NvcGUiOiJzZXJ2ZXIiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3NfdG9rZW4iOiI5ODg5NTE4OTI4Mjk0ODM1OTQ3YzJkNmU4Yzg4N2FmYiIsInJlZnJlc2hfdG9rZW4iOiI3MDUwZGVlZDUzMmY0NjJjOTdiMmY4ZWZlNzllZGE3YiIsImV4cGlyZXNfaW4iOjg2NDAwMCwidXNlcl9pZCI6MjIsImRlcHRfaWQiOjMsInVzZXJuYW1lIjoiemYwMSIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJzY29wZSI6InNlcnZlciIsImxpY2VuY2UiOiJwcm9ncmVzcyIsImZyb20iOjAsInRpbWVfc3RhbXAiOiIxNjI1NjU2MjA0Iiwicm9sZV9jb2RlcyI6WyJBU1MiXX0.L_By2r_yoDFDQ-bNZze2I1qY5Uanp1xXP_t_mS1MUTU",
	// enforcementKey:"",
	icon:iconList,
	companyInfo:companyInfo,
	userInfo:'userInfo'
}