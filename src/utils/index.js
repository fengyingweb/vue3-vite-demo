import successBgm from '@/assets/audio/Success.wav'
import failBgm from '@/assets/audio/FAIL.wav'

// 播放请求成功bgm
export function bgmRequestSuccess () {
  let successAudio = document.getElementById('bgmSuccess')
  if (!successAudio) {
      successAudio = document.createElement('audio')
      successAudio.setAttribute('src', successBgm)
      successAudio.setAttribute('id', 'bgmSuccess')
      document.body.appendChild(successAudio)
  }
  successAudio.play()
}

// 播放请求失败bgm
export function bgmRequestError () {
  let errorAudio = document.getElementById('bgmError')
  if (!errorAudio) {
      errorAudio = document.createElement('audio')
      errorAudio.setAttribute('src', failBgm)
      errorAudio.setAttribute('id', 'bgmError')
      document.body.appendChild(errorAudio)
  }
  errorAudio.play()
}

export function getAppLang () {
  try {
      const appLang = APP.getLanguage() // 使用APP.getLanguage()查询语言配置
      console.log('getAppLang appLang = ', appLang)
      return appLang
  } catch (err) {
      console.log('getAppLang err = ', err)
      return localStorage.getItem('lang') // 基座不运行的话，取localstorage里的语言
  }
}

export function convertAppLangToCookieLang (appLang) {
  if (appLang && appLang.indexOf('en') > -1) {
      return 'en-US'
  } else {
      return 'zh-CN'
  }
}

/**
 * 计算当前时区与东八区的时差
 * @returns {Number} timezoneoffset
 */
 export function getTimezoneoffset () {
  const timezoneoffset = -8 - new Date().getTimezoneOffset() / 60 // 计算方式：北京时区(东八区)offset - 当前时区offset
  return timezoneoffset
}
