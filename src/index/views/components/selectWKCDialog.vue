<template>
  <div class="select-dialog-wrapper">
    <van-dialog v-model:show="visible" :showCancelButton="false" :showConfirmButton="false">
      <div>
        <SearchDataList
            ref="searchDataList"
            v-bind="$attrs"
            :config="returnReasonSearchConfig"
            @selectChange="onSelectChange"
            @selectCancel="onSelectCancel"
            @searchInputChange="onSearchInputChange"
        >
          <template #dataList="{slotProps}">
            <div>
                <van-collapse v-show="slotProps.dataList.length > 0" v-model="activeNames" :border="false" accordion>
                    <van-radio-group
                        class="detail-list"
                        v-model="checkedData"
                        @change="handleCheckedChange($event, slotProps.dataList)"
                    >
                        <van-radio
                            class="detail-list__item"
                            v-for="item in slotProps.dataList"
                            v-show="!item.hide"
                            :label-disabled="true"
                            :key="item.id"
                            :name="item.id"
                            checked-color="#7EDB42"
                        >
                            <ListCollapseItem :name="item.id" class="item-ct" rightIconName="arrow-up">
                                <template #title class="title-ct">
                                    <div style="margin-right: 15px">{{ item.workcenterName }}</div>
                                </template>
                                <div>
                                    <div class="row">
                                        <div class="label w-87">WKC编码</div>
                                        <div class="content">{{ item.workcenterCode }}</div>
                                    </div>
                                    <div class="row">
                                        <div class="label w-87">WKC名称</div>
                                        <div class="content">{{ item.workcenterName }}</div>
                                    </div>
                                </div>
                            </ListCollapseItem>
                        </van-radio>
                    </van-radio-group>
                </van-collapse>
            </div>
          </template>
        </SearchDataList>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import {defineComponent, watchEffect, reactive, toRefs, getCurrentInstance} from 'vue'
import { Radio, RadioGroup, Toast } from 'vant'
import SearchDataList from '@/components/searchDataList'
import ListCollapseItem from '@/components/listCollapseItem'

export default defineComponent({
  name: 'SelectWKCDialog',
  components: {
    SearchDataList,
    ListCollapseItem,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: Number,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    // 选中的radio的值
    checked: {
      type: [String, Number],
      default: function () {
        return ''
      }
    }
  },
  setup(props, {emit}) {
    const {ctx} = getCurrentInstance()
    const dialogState = reactive({
      // WKC搜索配置
      returnReasonSearchConfig: {
        request: {
          url: '/hdAgvCallMaterial/selectWorkcenterUsers',
          method: 'post',
          data: {
            orgId: props.orgId,
            updateUserCode: props.userName
          }
        },
        search: {
          searchPlaceholder: '请输入WKC',
          searchKey: 'workcenterCode'
        },
        page: {
          pageNo: 1,
          pageSize: 5
        },
        callback: {
          success: function (res) {
            console.log(res)
            return new Promise((resolve, reject)=> {
              const { code, data, msg } = res
              if (code === '0') {
                resolve(data)
              } else {
                Toast.fail(`查询WKC失败：${msg}`)
                reject(msg)
              }
            })
          },
          error: function () {
            // console.error('errorCallback err = ', err)
            Toast.fail(`查询WKC失败：服务器忙，请稍后再试`)
            return Promise.reject()
          }
        }
      },
      activeNames: '',
      checkedData: '', // 选中数据的key
      checkedDataDetail: null // 选中数据的详情
    })

    const handleCheckedChange = (val, dataList)=> {
      // 更新选中的物料数组
      dialogState.checkedDatas = val
      dialogState.checkedDataDetail = dataList.find(item => item.id === val)
      // 发射checked更新事件
      emit('update:checked', dialogState.checkedData)
    }

    const onSelectChange = ()=> {
      emit('selectionChange', { data: dialogState.checkedDataDetail })
    }

    const onSelectCancel = ()=> {
      resetData()
      emit('selectionCancel')
    }

    const onSearchInputChange = (val)=> {
      emit('searchInputChange', val)
    }

    function resetData () {
      dialogState.activeNames = ''
      dialogState.checkedData = ''
      dialogState.checkedDataDetail = null
      const searchListEl = ctx.$refs['searchDataList']
      if (searchListEl) {
        searchListEl.resetData()
      }
    }

    watchEffect(()=> props.checked, (nval, oval)=> {
      if (nval !== oval) {
        dialogState.checkedData = nval
      }
    })
    return {
      ...toRefs(dialogState),
      handleCheckedChange,
      onSelectChange,
      onSelectCancel,
      onSearchInputChange,
      resetData
    }
  },
})
</script>

<style lang="less" scoped>
@import '@/assets/css/list-item.less';
.detail-list {
    background-color: #fff;
    padding: 0;
    margin-top: 0;
    .detail-list__item {
        border-bottom: 1px solid #f5f5f5;
    }
}
</style>
<style lang="less">
@import '@/assets/css/list-item.less';
</style>
