import {computed, reactive} from 'vue'
import {useStore} from 'vuex'

export default function commonData () {
  const store = useStore()
  const commonState = reactive({
    searchCondition: {
      itemCode: '',
      destinationGoodsLocationCode: '',
      containerBarcode: '',
      sourceGoodsLocationCode: ''
    }, // 头部搜索条件
    workcenterData: {},
    detailData: {
      itemCode: '',
      itemDesc: '',
      containerBarcode: '',
      qty: '',
      uom: '',
      sourceGoodsLocationCode: '',
      destinationGoodsLocationCode: ''
    },
    showWKCDialog: false,
    showItemCodeDialog: false,
    showTargetDialog: false,
    showBarcodeDialog: false,
    showSourceDialog: false,
    errMsg: ''
  })
  const orgId = computed(()=> {
    return store.getters.orgId
  })
  const userInfo = computed(()=> {
    return store.getters.userInfo
  })
  const currentOrgCode = computed(()=> {
    return store.getters.currentOrgName.split('_')[1]
  })

  const setSearchCondition = (payload = {})=> {
    commonState.searchCondition = Object.assign(commonState.searchCondition, payload)
  }

  const clearAppStore = ()=> {
    commonState.searchCondition = {
      itemCode: '',
      destinationGoodsLocationCode: '',
      containerBarcode: '',
      sourceGoodsLocationCode: ''
    }
    commonState.workcenterData = {}
    commonState.detailData = {
      itemCode: '',
      itemDesc: '',
      containerBarcode: '',
      qty: '',
      uom: '',
      sourceGoodsLocationCode: '',
      destinationGoodsLocationCode: ''
    }
  }
  return {
    commonState,
    orgId,
    userInfo,
    currentOrgCode,
    clearAppStore,
    setSearchCondition
  }
}
