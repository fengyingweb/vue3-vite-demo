import { createStore } from 'vuex'
import config from '@/config'
import { convertAppLangToCookieLang } from '@/utils'

const store = createStore({
  state: {
    // 组织id，通过android基座获取
    orgId: '',
    // 组织名，通过android基座获取
    currentOrgName: '',
    // 用户信息，通过android基座获取
    userInfo: {},
    // 接口服务器地址，通过android基座获取
    serverUrl: '',
    // 选择的工作中心
    workcenterCode: '',
    // 选择的工作中心名称
    workcenterName: '',
    // app选择的语言
    language: ''
  },
  getters: {
    orgId: state => state.orgId,
    currentOrgName: state => state.currentOrgName,
    userInfo: state => state.userInfo
  },
  mutations: {
    SET_ORG_ID: (state, orgId) => {
      state.orgId = orgId
    },
    SET_CURRENT_ORG_NAME: (state, currentOrgName) => {
        state.currentOrgName = currentOrgName
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_SERVER_URL: (state, serverUrl) => {
        state.serverUrl = serverUrl
    },
    SET_WORK_CENTER_CODE: (state, workcenterCode) => {
        state.workcenterCode = workcenterCode
    },
    SET_WORK_CENTER_NAME: (state, workcenterName) => {
        state.workcenterName = workcenterName
    },
    
    SET_LANGUAGE: (state, lang) => {
        state.language = lang
        const langStr = convertAppLangToCookieLang(lang)
        localStorage.setItem('lang', langStr) // 语言配置放到localstorage
    }
  },
  actions: {
    /**
     * app初始化方法，
     */
     initApp ({ commit}) {
        // 本地调试模拟基座环境
        commit('SET_ORG_ID', config.orgId)
        commit('SET_CURRENT_ORG_NAME', config.orgName)
        commit('SET_USER_INFO', {
            userName: config.userName,
            userDisplayName: config.userDisplayName
        })
        commit('SET_WORK_CENTER_CODE', config.workcenterCode)
        commit('SET_WORK_CENTER_NAME', config.workcenterName)
        commit('SET_LANGUAGE', config.language)
        const langStr = convertAppLangToCookieLang(config && config.language)
        localStorage.setItem('lang', langStr) // 语言配置放到localstorage
        localStorage.removeItem('ssoToken') // 基座没有ssoToken
    }
  }
})

export default store
