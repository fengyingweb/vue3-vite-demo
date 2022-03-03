/**
 * 打开基座摄像头扫码功能的方法
 * @requires errCb
 * @param {Function} errCb 异常处理回调方法
 * @requires successCb
 * @param {Function} successCb 成功处理回调方法，参数code指识别的qrcode
 */
 export function openQrCodeScan (errCb, successCb) {
  if (framework.checkAPP() && APP && APP.openQrCodeScan !== undefined) {
      // 注册Window全局，扫码回调
      window.actionQrCodeData = successCb

      APP.openQrCodeScan() // 打开二维码扫描
  } else {
      // successCb('1') // 测试用
      errCb && errCb('底座不运行，不能使用扫码功能')
  }
}
