<template>
    <div class="search-data-radio-box-list">
        <SearchDataListRender :config="getSearchConfig" ref="SearchDataListRender" v-bind="$attrs">
          <template #default="{dataList, page, onSearch, onLoad}">
            <div>
                <van-icon name="close" class="cancel-icon" @click="handleCancel" />
                <div class="title-box">
                    <span>{{ headTitle }}</span>
                </div>
                <van-search
                    v-show="hasSearchInput && !scanInput"
                    :placeholder="searchPlaceholder"
                    v-model="searchValue"
                    clearable
                    :show-action="hasSearch || hasScan"
                    @search="onSearch"
                    @input="onSearchInputChange"
                    class="search-box"
                    ref="searchInput"
                >
                  <template v-if="hasSearch" #action>
                    <div @click="onSearch">搜索</div>
                  </template>
                  <template v-else-if="hasScan" #action>
                    <div @click="onQrcodeScan">
                        <van-icon name="scan" class="right-scan" />
                    </div>
                  </template>
                </van-search>

                <ScanInput
                    v-show="hasSearchInput && scanInput"
                    ref="order-input"
                    v-model:inputText="searchValue"
                    :placeholder="searchPlaceholder"
                    clearable
                    class="search-box"
                    @inputSubmit="onSearch"
                    @focus="onOrderInputFocus"
                />

                <div class="warning" v-show="!!getErrMsg">{{ getErrMsg }}</div>

                <slot name="checkedOptions" />

                <div v-show="dataList.length <= 0 || !dataList" class="no-data">暂无数据</div>

                <slot name="dataList" v-bind:slotProps="{ dataList, page, onSearch, onLoad, onQrcodeScan }" />

                <div class="btn-box" v-show="dataList.length > 0">
                    <van-button class="btn btn-confirm" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="handleSubmit">确定</van-button>
                </div>
                <van-pagination
                    v-show="dataList.length > 0"
                    v-model="page.pageNo"
                    :page-count="page.totalPage"
                    mode="simple"
                    prev-text=" "
                    next-text=" "
                    class="pagination"
                    @change="onLoad" >
                    <template #prev-text>
                      <van-icon name="arrow-left" />
                    </template>
                    <template #next-text>
                      <van-icon name="arrow" />
                    </template>
                  </van-pagination>
            </div>
          </template>
        </SearchDataListRender>
    </div>
</template>

<script>
import {defineComponent, computed, onMounted, ref, getCurrentInstance, nextTick} from 'vue'
import SearchDataListRender from '../searchDataListRender'
import ScanInput from '../scanInput'
import { Search, Pagination } from 'vant'

/**
 * 搜索数据列表对话框组件
 * 包括关键字搜索，分页功能
 * 用于弹出对话框内，功能包括：搜索，数据展示，选择，确定
 */
export default defineComponent({
    name: 'SearchDataList',
    components: {
        SearchDataListRender,
        ScanInput,
        [Search.name]: Search,
        [Pagination.name]: Pagination
    },
    props: {
        // 标题栏的标题
        headTitle: {
            type: String,
            default: '编辑'
        },
        // 错误提示信息
        errTips: {
            type: String,
            default: ''
        },
        /**
         * {
         *      request: {
         *          url: '/api/123',
         *          method: 'POST',
         *      },
         *      search: {
         *          searchPlaceholder: '请输入搜索关键字',
         *          searchKey: ''
         *      },
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
        checkedDataDetail: {
            type: [Array, Object]
        },
        hasSearch: {
            type: Boolean,
            default: false
        },
        // 是否有搜索输入框，默认是有
        hasSearchInput: {
            type: Boolean,
            default: true
        },
        // 是否有扫描按钮，默认没有
        hasScan: {
            type: Boolean,
            default: false
        },
        // 是否扫描输入框
        scanInput: {
            type: Boolean,
            default: false
        }
    },
    setup(props, {emit}) {
      const {ctx} = getCurrentInstance()
      const searchValue = ref('') // 搜索内容
      const errMsg = ref('') // 错误提示

      const getErrMsg = computed(()=> {
        return props.errTips || errMsg.value
      })

      const searchPlaceholder = computed(()=> {
        return props.config.search.searchPlaceholder || '请输入搜索关键字'
      })

      const searchKey = computed(()=> {
        return props.config.search.searchKey || ''
      })

      const displayList = computed(()=> {
        return props.config.display.displayList
      })

      const getSearchConfig = computed(()=> {
        const requestCofing = props.config.request
        const request = {
          url: requestCofing.url,
          method: requestCofing.method
        }
        const searchParam = {
          ...requestCofing.data
        }
        if (props.config.search.searchKey) {
          // 有searchKey才设置
          searchParam[props.config.search.searchKey] = searchValue.value
        }
        if (requestCofing.method.toLowerCase() === 'get') {
          request.params = searchParam
        } else if (requestCofing.method.toLowerCase() === 'post') {
          request.data = searchParam
        }

        const callback = props.config.callback

        return {
          request,
          callback,
          page: props.config.page,
          searchKey: props.config.search.searchKey
        }
      })

      const handleCancel = ()=> {
        errMsg.value = ''
        emit('selectCancel')
      }

      const handleSubmit = ()=> {
        emit('selectChange')
      }

      const resetData = ()=> {
        searchValue.value = ''
        errMsg.value = ''
        const searchEl = ctx.$refs['SearchDataListRender']
        if (searchEl) {
          searchEl.resetData()
        }
      }

      const searchData = (keyword)=> {
        if (keyword) {
          searchValue.value = keyword
          nextTick(() => {
            const searchEl = ctx.$refs['SearchDataListRender']
            if (searchEl) {
              searchEl.onSearch()
            }
          })
        }
      }

      const onQrcodeScan = ()=> {
        const onScanCb = props.config.handleQrcodeScan
        if (onScanCb) {
          onScanCb().then(config => {
            if (config.code) {
              searchValue.value = config.code
              nextTick(() => {
                const searchEl = ctx.$refs['SearchDataListRender']
                if (searchEl) {
                  searchEl.onSearch(config.cb)
                }
              })
            }
          })
        }
      }

      const searchFocus = ()=> {
        const searchInput = ctx.$refs['searchInput'].$el.querySelector('input.van-field__control')
        if (searchInput) {
          searchInput.focus()
        }
      }

      const onSearchInputChange = (value)=> {
        emit('searchInputChange', value)
      }
      const onOrderInputFocus = ()=> {
        if (ctx.$refs['order-input']) {
          ctx.$refs['order-input'].chooseAllText()
        }
      }

      onMounted(()=> {
        nextTick(()=> {
          searchFocus() // 搜索框自动聚焦
        })
      })
      return {
        searchValue,
        errMsg,
        getErrMsg,
        searchPlaceholder,
        searchKey,
        displayList,
        getSearchConfig,
        handleCancel,
        handleSubmit,
        resetData,
        searchData,
        onQrcodeScan,
        onSearchInputChange,
        onOrderInputFocus
      }
    }
})
</script>

<style lang="less" scoped>
@import './css/index.less';
.search-data-radio-box-list {
    padding: 14px 19px 20px 21px;
    .van-search__action {
        font-size: 20px;
        color: #f56;
        line-height: 34px;
    }
}
</style>
<style lang="less">
@import './css/index.less';
</style>
