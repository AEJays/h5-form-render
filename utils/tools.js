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
    //???????????? GUID ???
export const guid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
// ???????????? ????????????
export const cache=(key,value,seconds = 3600 *24)=>{
		let nowTime = Date.parse(new Date()) / 1000;
		if (key && value) {
			let expire = nowTime + Number(seconds);
			uni.setStorageSync(key,JSON.stringify(value) + '|' +expire)
			// console.log('?????????' + key + '????????????,???????????????' + expire)
		} else if (key && !value) {
			let val = uni.getStorageSync(key);
			if (val) {
				// ?????????????????????????????????
				let temp = val.split('|')
				if (!temp[1] || temp[1] <= nowTime) {
					uni.removeStorageSync(key)
					// console.log(key + '???????????????')
					return '';
				} else {
					return JSON.parse(temp[0]);
				}
			}
		}
}
// ??????????????????????????????
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
// ??????????????????
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
			// console.log("??????token??????!")
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
				cache("auth",auth,5*60)//?????????????????????5*60
			},
			fail(){
				uni.showModal({
					title:"????????????",
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
// ??????????????????
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
			title:"??????",
			content:"??????????????????????????????",
			success(User) {
				uni.showLoading({
					title:"???????????????",
					mask:true
				})
				if(User.confirm){
					uni.getUserProfile({
						desc:"?????????????????????????????????????????????",
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
							cache("profile",newProfile,5*60)//????????????????????????
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
				title:"???????????????"
			})
			return getUserProfile()
		}
	}
	return userProfile
}
// ???????????????????????? (???onload??????)
export function reload(){
	let pages = getCurrentPages()
	let nowPage = pages[pages.length-1];
	uni.redirectTo({
		url:nowPage.$page.fullPath
	})
}
// ??????????????????
export function whatCompany(type){
	let typeGroup = [{
        "label": "??????",
        "value": "BBD"
      }, {
        "label": "??????",
        "value": "SW"
      }, {
        "label": "??????",
        "value": "SKI"
      }, {
        "label": "??????",
        "value": "DIV"
      }, {
        "label": "??????",
        "value": "RC"
      }, {
        "label": "??????",
        "value": "SKA"
      }, {
        "label": "??????",
        "value": "ARC"
      }, {
        "label": "??????",
        "value": "ATH"
      }, {
        "label": "?????????",
        "value": "BAD"
      }, {
        "label": "?????????",
        "value": "CAN"
      }, {
        "label": "??????",
        "value": "BASE"
      }, {
        "label": "??????",
        "value": "BASK"
      }, {
        "label": "??????",
        "value": "BOX"
      }, {
        "label": "?????????",
        "value": "BIC"
      }, {
        "label": "??????",
        "value": "FEN"
      }, {
        "label": "??????",
        "value": "FOOT"
      }, {
        "label": "??????",
        "value": "HAND"
      }, {
        "label": "??????",
        "value": "EQU"
      }, {
        "label": "?????????",
        "value": "HOC"
      }, {
        "label": "??????",
        "value": "JUD"
      }, {
        "label": "????????????",
        "value": "MOD"
      }, {
        "label": "??????",
        "value": "ART"
      }, {
        "label": "??????",
        "value": "ROW"
      }, {
        "label": "??????",
        "value": "SAI"
      }, {
        "label": "??????",
        "value": "SHO"
      }, {
        "label": "??????",
        "value": "VOL"
      }, {
        "label": "??????",
        "value": "SOFT"
      }, {
        "label": "?????????",
        "value": "BPP"
      }, {
        "label": "?????????",
        "value": "TAE"
      }, {
        "label": "??????",
        "value": "TEN"
      }, {
        "label": "????????????",
        "value": "TRI"
      }, {
        "label": "??????",
        "value": "WEI"
      }, {
        "label": "??????",
        "value": "WRE"
      }, {
        "label": "????????????",
        "value": "WIB"
      }, {
        "label": "??????",
        "value": "CUR"
      }, {
        "label": "??????",
        "value": "ICH"
      }, {
        "label": "??????",
        "value": "SUR"
      }, {
        "label": "?????????",
        "value": "MOT"
      }, {
        "label": "??????",
        "value": "LIS"
      }, {
        "label": "?????????",
        "value": "AER"
      }, {
        "label": "??????",
        "value": "SKL"
      }, {
        "label": "????????????",
        "value": "GOLF"
      }, {
        "label": "?????????",
        "value": "BOWL"
      }, {
        "label": "??????",
        "value": "THR"
      }, {
        "label": "??????",
        "value": "BIL"
      }, {
        "label": "??????",
        "value": "SEP"
      }, {
        "label": "??????",
        "value": "SQU"
      }, {
        "label": "?????????",
        "value": "RUG"
      }, {
        "label": "????????????",
        "value": "LTEN"
      }, {
        "label": "?????????",
        "value": "HAB"
      }, {
        "label": "????????????",
        "value": "SPAI"
      }, {
        "label": "??????",
        "value": "SKDI"
      }, {
        "label": "??????",
        "value": "GLID"
      }, {
        "label": "????????????",
        "value": "AVMO"
      }, {
        "label": "????????????",
        "value": "VEMO"
      }, {
        "label": "????????????",
        "value": "NAMO"
      }, {
        "label": "??????",
        "value": "DIR"
      }, {
        "label": "???????????????",
        "value": "AMR"
      }, {
        "label": "??????",
        "value": "TGOG"
      }, {
        "label": "????????????",
        "value": "CHES"
      }, {
        "label": "????????????",
        "value": "CCHE"
      }, {
        "label": "??????",
        "value": "BRI"
      }, {
        "label": "??????",
        "value": "AMA"
      }, {
        "label": "????????????",
        "value": "FIQG"
      }, {
        "label": "??????",
        "value": "MOU"
      }, {
        "label": "??????",
        "value": "AUMO"
      }, {
        "label": "?????????",
        "value": "MOT"
      }, {
        "label": "??????",
        "value": "ROSK"
      }, {
        "label": "??????",
        "value": "SHUT"
      }, {
        "label": "??????",
        "value": "GATE"
      }, {
        "label": "????????????",
        "value": "DLDA"
      }, {
        "label": "??????",
        "value": "DRBO"
      }, {
        "label": "??????",
        "value": "FISH"
      }, {
        "label": "??????",
        "value": "KITE"
      }, {
        "label": "??????",
        "value": "CAPI"
      }, {
        "label": "????????????",
        "value": "SPDA"
      }, {
        "label": "??????",
        "value": "BOBU"
      }, {
        "label": "??????",
        "value": "TOW"
      }, {
        "label": "??????",
        "value": "DART"
      }, {
        "label": "????????????",
        "value": "ELSP"
      }, {
        "label": "??????",
        "value": "TRA"
      }, {
        "label": "??????",
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