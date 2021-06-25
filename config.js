import _ from 'lodash'

// ��ȡȫ������
const globalConfigStorage = uni.getStorageSync('globalConfigStorage')

export const globalConfig = {
  host: 'https://xxx',
  formHost: _.get(globalConfigStorage, 'formEP', 'https://api.mock.smallsaas.cn/form'),
  dataHost: _.get(globalConfigStorage, 'dataEP', 'https://api.mock.smallsaas.cn/data'),
  tokenStorageKey: 'token'  //token�
}