import {globalConfig} from '@/config.js'
export const Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    
    // public method for encoding
    , encode (input) {
      let output = "";
      let chr1; let chr2; let chr3; let enc1; let enc2; let enc3; let enc4;
      let i = 0;
    
      input = Base64._utf8_encode(input);
    
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
    
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
    
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
          enc4 = 64;
        }
    
        output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      } // Whend
    
      return output;
    } // End Function encode
    
    
    // public method for decoding
    , decode (input) {
      let output = "";
      let chr1; let chr2; let chr3;
      let enc1; let enc2; let enc3; let enc4;
      let i = 0;
    
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
    
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
    
        output += String.fromCharCode(chr1);
    
        if (enc3 != 64) {
          output += String.fromCharCode(chr2);
        }
    
        if (enc4 != 64) {
          output += String.fromCharCode(chr3);
        }
    
      } // Whend
    
      output = Base64._utf8_decode(output);
    
      return output;
    } // End Function decode
    
    
    // private method for UTF-8 encoding
    , _utf8_encode (string) {
      let utftext = "";
      string = string.replace(/\r\n/g, "\n");
    
      for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n);
    
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
    
      } // Next n
    
      return utftext;
    } // End Function _utf8_encode
    
    // private method for UTF-8 decoding
    , _utf8_decode (utftext) {
      let string = "";
      let i = 0;
      let c; let c1; let c2; let c3;
      c = c1 = c2 = 0;
    
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
    
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
    
      } // Whend
    
      return string;
    } 
}
    //生成随机 GUID 数
export const guid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
// 设置缓存 获取缓存
export const cache=(key,value,seconds = 3600 *24)=>{
		let nowTime = Date.parse(new Date()) / 1000;
		if (key && value) {
			let expire = nowTime + Number(seconds);
			uni.setStorageSync(key,JSON.stringify(value) + '|' +expire)
			// console.log('已经把' + key + '存入缓存,过期时间为' + expire)
		} else if (key && !value) {
			let val = uni.getStorageSync(key);
			if (val) {
				// 缓存存在，判断是否过期
				let temp = val.split('|')
				if (!temp[1] || temp[1] <= nowTime) {
					uni.removeStorageSync(key)
					// console.log(key + '缓存已失效')
					return '';
				} else {
					return JSON.parse(temp[0]);
				}
			}
		}
}
// 获取默认登录用户信息
export  async function getDefaultUser(){
	let userMessage =await new Promise((resolve,reject)=>{
		uni.request({
			url:`${globalConfig.formHost}?id=2`,
			method:"GET",
			success(res) {
				let User = JSON.parse(Base64.decode(res.data.data.defaultUser))
				resolve(User)
			}
		})
	})
	return userMessage
}
// 登录默认用户
export async function LoginDefault(){
	let user = await getDefaultUser()
	uni.request({
		url: `${globalConfig.loginEP}/api/sys/oauth/app/login`,
		data:user,
		method:"POST",
		success(res) {
			let token;
			token = res.data.encryptedData
			uni.setStorageSync(globalConfig.tokenStorageKey,token)
			// console.log("设置token成功!")
		}
	})
}

export function login(){
	let auth;
	let authCache = cache("auth")
	// console.log(authCache,"cache_auth")
	if(authCache!=null&&authCache!=undefined&&authCache!=""){
		auth = authCache
		// console.log(auth)
	}else{
		uni.login({
			success(res) {
				auth = res.code
				cache("auth",auth,5*60)//设置登录许可为5*60
			},
			fail(){
				uni.showModal({
					title:"登录失败",
					showCancel:false,
					confirmColor:"#FC1944",
					success() {
						uni.navigateBack({
							delta:10
						})
					}
				})
			}
		})
	}
	return auth
}
// 获取用户信息
export function getUserProfile(){
	let iv;
	let encryptedData;
	let rawData;
	let userProfile;
	let profile = cache("profile")
	let that = this
	if(profile!=null&&profile.iv!=null){
		userProfile = profile
		// console.log(profile)
	}else{
		uni.showModal({
			title:"申请",
			content:"正在请求您的个人信息",
			success(User) {
				uni.showLoading({
					title:"正在请求中",
					mask:true
				})
				if(User.confirm){
					uni.getUserProfile({
						desc:"获取您的昵称、头像、地区及性别",
						success(userProfile) {
							uni.hideLoading()
							// console.log(userProfile)
							iv = userProfile.iv	
							encryptedData = userProfile.encryptedData
							let newRawData;
							let jsonRaw = JSON.parse(userProfile.rawData)
							for(let i in jsonRaw){
								if(i==="nickName"){
									jsonRaw.nickname=jsonRaw.nickName
									delete jsonRaw["nickName"]
								}
							}
							newRawData = JSON.stringify(jsonRaw)
							rawData = newRawData
							let newProfile = {
								"iv":iv,
								"encryptedData":encryptedData,
								"rawData":newRawData
							}
							// userProfile = newProfile
							cache("profile",newProfile,5*60)//设置缓存为五分钟
							that.$reload()
						}
					})
				}else{
					uni.hideLoading()
				}
			}
		})
		userProfile = cache("profile")
		if(userProfile!=null&&userProfile.iv!=null){
			uni.showToast({
				title:"授权超时！"
			})
			return getUserProfile()
		}
	}
	return userProfile
}
// 重新加载当前页面 (带onload参数)
export function reload(){
	let pages = getCurrentPages()
	let nowPage = pages[pages.length-1];
	uni.redirectTo({
		url:nowPage.$page.fullPath
	})
}
// 企业类型判断
export function whatCompany(type){
	let typeGroup = [{
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
        "label": "蹦床",
        "value": "TRA"
      }, {
        "label": "瑜伽",
        "value": "YOG"
      }]
		let label;
		typeGroup.map((item,i)=>{
			if(type === item.value){
				label = item.label
			}
		})
		return label
}