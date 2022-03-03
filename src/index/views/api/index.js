import request from '@/http/request.js'

/**
 * AGV叫料相关接口
 */
const callAgvApi = {
    // 扫描载具
    scanContainerBarcode(params) {
        return request({
            url: '/hdAgvCallMaterial/selectContainerBarcode',
            method: 'post',
            data: params
        })
    },

    // 查询载具
    queryContainerBarcodes(params) {
        return request({
            url: '/hdAgvCallMaterial/selectContainerBarcodes',
            method: 'post',
            data: params
        })
    },

    // 出库呼叫
    agvCallOut(params) {
        return request({
            url: '/hdAgvCallMaterial/callOut',
            method: 'post',
            data: params
        })
    },

    // 入库呼叫
    agvCallIn(params) {
        return request({
            url: '/hdAgvCallMaterial/callIn',
            method: 'post',
            data: params
        })
    },

    // 呼叫空车
    agvCallEmpty(params) {
        return request({
            url: '/hdAgvCallMaterial/callEmpty',
            method: 'post',
            data: params
        })
    },
    // 任务下发（点对点呼叫）
    agvCallDelivery(params) {
        return request({
            url: '/hdAgvCallMaterial/callDelivery',
            method: 'post',
            data: params
        })
    }
}
export default callAgvApi
