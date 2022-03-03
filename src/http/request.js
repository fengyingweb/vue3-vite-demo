import { Notify, Toast } from 'vant'
import axios from 'axios'
import {
  bgmRequestSuccess, bgmRequestError, getAppLang,
  convertAppLangToCookieLang, getTimezoneoffset
} from '../utils'
import debounceAjax from 'debounce-ajax'

axios.defaults.timeout = 60000 // 请求超时时间
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = store.getters.serverUrl;
const debonceUrlWhiteList = [''] // 可以重复请求的url白名单

export const DEBOUNCE_AJAX_ERR = '请求加载中，请勿重复操作'

// request拦截器
axios.interceptors.request.use(
    config => {
        // 请求参数中有orgId的情况下，校验orgId是否存在，不存在则提示，取消请求
        const { data, params, url, method } = config
        // 默认有错误提示
        config.hasDefaultNotify = config.hasDefaultNotify === false ? false : true
        // 在url中设置appLang=zh-CN这个语言参数 2021-04-28
        const appLang = convertAppLangToCookieLang(getAppLang())
        if (config.params) {
            config.params.appLang = appLang
        } else {
            config.params = {
                appLang
            }
        }
        // 请求要带ssoToken参数
        const ssoToken = localStorage.getItem('ssoToken')
        if (ssoToken) {
            config.params.ssoToken = ssoToken
        }
        let dataObj = {}
        if (data) {
            if (typeof data === 'string') {
                // 兼容有些代码data传字符串而不是对象的情况 20210602
                try {
                    dataObj = JSON.parse(data)
                } catch (err) {
                    console.log('http请求，data转换失败，data = ', data)
                }
            } else {
                dataObj = data
            }
        } else if (params) {
            dataObj = params
        }
        const keys = Object.keys(dataObj)
        if (keys.includes('orgId')) {
            const orgId = dataObj.orgId
            if (orgId === '' || orgId === undefined || orgId === null) {
                const noOrgError = new Error('没有查询到组织数据，请先在App中选择组织')
                noOrgError.config = config
                throw noOrgError
            }
        }

        const timeZoneOffset = getTimezoneoffset() // 计算时区偏移
        // 向body插入时区字段 2021-05-17
        if (dataObj) {
            dataObj.timeZoneOffset = timeZoneOffset
            config.data = dataObj // 改用dataObj作为参数 20210602
        } else {
            axios.defaults.data = {
                timeZoneOffset
            }
        }

        if (debonceUrlWhiteList.indexOf(url) === -1) {
            let debounceParams = { method, url, data: dataObj, params }
            let ajaxKey = debounceAjax.getKey(debounceParams)
            if (debounceAjax.hitKey(ajaxKey)) {
                const debounceErr = new Error(DEBOUNCE_AJAX_ERR)
                debounceErr.config = config
                throw debounceErr
            }
            config.ajaxKey = ajaxKey
            debounceAjax.addKey(ajaxKey)
        }

        return config
    },
    error => {
        if (error.message !== DEBOUNCE_AJAX_ERR) {
            Toast.clear()
        }
        Promise.reject(error)
    }
)

// respone拦截器
axios.interceptors.response.use(
    response => {
        // Toast.clear()
        // 清空ajaxKey
        debounceAjax.removeKey(response.config.ajaxKey)

        if (response.data && response.data.code === 403) {
            // logout();
            if (response.config.hasDefaultNotify) {
                Notify(response.data.msg)
            }
            errorCallback(response)
            return response.data
        } else if (response.data && response.data.code && response.data.code !== '0' && response.data.code !== 200) {
            // 200 为了 oss 接口添加
            if (response.config.hasDefaultNotify) {
                Notify(response.data.msg)
            }
            errorCallback(response)
            return response.data
        } else {
            successCallback(response)
            return response.data
        }
    },
    error => {
        if (error.message !== DEBOUNCE_AJAX_ERR) {
            Toast.clear()
        }
        if (error && error.config) {
            // 清空ajaxKey
            debounceAjax.removeKey(error.config.ajaxKey)
        }

        const response = Object.assign({}, error.response)
        if (response) {
            // 清空ajaxKey
            debounceAjax.removeKey(response.config && response.config.ajaxKey)

            switch (response.status) {
                case 401:
                    if (error.config.hasDefaultNotify) {
                        Notify('你还没有登录呦！')
                    }
                    errorCallback(response)
                    break
                case 404:
                    if (error.config.hasDefaultNotify) {
                        Notify('没找接口信息')
                    }
                    errorCallback(response)
                    break
                case 500:
                    if (error.config.hasDefaultNotify) {
                        Notify('系统异常')
                    }
                    errorCallback(response)
                    break
                default:
                    if (error.config && error.config.hasDefaultNotify) {
                        Notify(error.message)
                    }
                    errorCallback(response)
                    break
            }
        }
        return Promise.reject(error)
    }
)

function successCallback (response) {
    const { config } = response
    if (config && config.params && config.params.successBgm) {
        bgmRequestSuccess()
    }
}

function errorCallback (response) {
    const { config } = response
    if (config && config.params && config.params.failBgm) {
        bgmRequestError()
    }
}

export default axios
