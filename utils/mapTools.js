import _ from 'lodash'
import { globalConfig } from '@/config.js'
import QQMapWX from '../components/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js'

export async function getAddress ({ latitude, longitude }, callback) {
	if (!latitude || !longitude) {
		if (_.isFunction(callback)) {
			callback({})
		}
	}
	const qqmapsdk = new QQMapWX({
		key: globalConfig.tencenMapKey
	})
	qqmapsdk.reverseGeocoder({
		location: {
			latitude,
			longitude
		},
		success: (res) => {
			if (_.isFunction(callback)) {
				callback(_.get(res, 'result', {}))
			}
		}
	})
}