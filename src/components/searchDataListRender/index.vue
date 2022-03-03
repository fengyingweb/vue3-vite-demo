<template>
  <div>
    <slot :dataList="dataList" :page="page" :onSearch="onSearch" :onLoad="onLoad"></slot>
  </div>
</template>

<script>
import {defineComponent, computed, watch, reactive, toRefs, onBeforeMount} from 'vue'
import {Toast} from 'vant'
import _ from 'lodash'
import request from '@/http/request'

const defaultPage = {
    pageNo: 1,
    pageSize: 10,
    totalPage: 0,
    totalCount: 0
    // finished: false,
    // error: false
}

/**
 * 数据查询分页展示函数式组件
 */
export default defineComponent({
    name: 'SearchDataListRender',
    props: {
        /**
         * 组件的相关配置属性
         * config: {
         *      request: {
         *          method: 'POST',
         *          url: '/api-lmes/lmes/public/erpWorkOrders/appSearchWorkOrder',
         *          data: {
         *             workOrderName: '123'
         *          }
         *      },
         *      page: {
         *          pageNo: 1,
         *          pageSize: 3
         *      }
         *      callback: {
         *          success: (res) => { // 成功回调 },
         *          error: (err) => { // 失败回调 }
         *      }
         * }
         */
        config: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 是否创建组件后立即加载
        immediateLoad: {
            type: Boolean,
            default: false
        },
        // 传入的值发生变化，则重新加载数据
        reload: {
            type: Boolean,
            default: false
        }
    },
    setup(props, ctx) {
      const configPage = computed(()=> {
        return _.clone(props.config.page)
      })
      const renderDataState = reactive({
        dataList: [],
        page: configPage.value || _.clone(defaultPage)
      })

      /**
      * 搜索数据
      */
      const onSearch = (cbFun)=> {
        let requestConfig = props.config.request
        if (requestConfig) {
          // 重置分页参数
          requestConfig = _.cloneDeep(requestConfig)
          let queryParam = {
            ...requestConfig.data,
            pageNo: 1,
            pageSize: renderDataState.page.pageSize
          }
          if (requestConfig.method.toLowerCase() === 'get') {
            queryParam = {
              ...requestConfig.params,
              pageNo: 1,
              pageSize: renderDataState.page.pageSize
            }
            requestConfig.params = queryParam
          } else {
            requestConfig.data = queryParam
          }

          
          let callback = props.config.callback // cbFun传参优先
          if (cbFun && cbFun.success && cbFun.error) {
            callback = cbFun
          }
          Toast.loading({
            message: '加载中...',
            forbidClick: true
          })
          request(requestConfig)
            .then(res => {
              Toast.clear()
              if (callback.success) {
                callback.success(res).then(dataRes=> {
                  if (dataRes.list) {
                    dataRes.list.forEach((item, ind)=> {
                      item.id = item.id || ind + 1
                    })
                    renderDataState.dataList = dataRes.list
                  } else {
                    console.log(2)
                    renderDataState.dataList = []
                  }
                  renderDataState.page.totalPage = dataRes.totalPage
                  renderDataState.page.pageNo = dataRes.pageNo
                  renderDataState.page.pageSize = dataRes.pageSize
                })
              }
            })
            .catch(err => {
              console.log(4)
              Toast.clear()
              callback.error && callback.error.call(ctx, err)
              renderDataState.dataList = []
            })
          }
      }

      /**
      * 分页加载数据
      */
      const onLoad = ()=> {
        let requestConfig = props.config.request

        if (requestConfig) {
          // 重置分页参数
          requestConfig = _.cloneDeep(requestConfig)
          let queryParam = {
              ...requestConfig.data,
              pageNo: renderDataState.page.pageNo,
              pageSize: renderDataState.page.pageSize
          }
          if (requestConfig.method.toLowerCase() === 'get') {
            queryParam = {
              ...requestConfig.params,
              pageNo: renderDataState.page.pageNo,
              pageSize: renderDataState.page.pageSize
            }
            requestConfig.params = queryParam
          } else {
            requestConfig.data = queryParam
          }

          const callback = props.config.callback
          Toast.loading({
            message: '加载中...',
            forbidClick: true
          })
          request(requestConfig)
            .then(res => {
              Toast.clear()
              if (callback.success) {
                callback.success(res).then(dataRes=> {
                  if (dataRes.list) {
                    dataRes.list.forEach((item, ind)=> {
                      item.id = item.id || ind + 1
                    })
                    renderDataState.dataList = dataRes.list
                  } else {
                    console.log(5)
                    renderDataState.dataList = []
                  }
                  renderDataState.page.totalPage = dataRes.totalPage
                  renderDataState.page.pageNo = dataRes.pageNo
                  renderDataState.page.pageSize = dataRes.pageSize
                })
              }
            })
            .catch(err => {
              console.log(6)
              Toast.clear()
              callback.error && callback.error.call(ctx, err)
              renderDataState.dataList = []
            })
        }
      }

      const resetData = ()=> {
        renderDataState.page = configPage.value || _.clone(defaultPage)
        renderDataState.dataList = []
      }

      watch(configPage, (nval)=> {
        renderDataState.page = nval
      }, {deep: true})

      watch(()=> props.reload, (nval)=> {
        // reload 的新值为true时，重新加载数据
        if (nval) {
          onSearch()
        }
      })

      onBeforeMount(()=> {
        if (props.immediateLoad) {
          console.log(1)
          onSearch()
        }
      })
      return {
        ...toRefs(renderDataState),
        onSearch,
        onLoad,
        resetData
      }
    }
})
</script>
