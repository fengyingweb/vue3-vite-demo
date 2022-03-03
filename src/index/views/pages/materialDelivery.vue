<template>
  <div class="wrapper">
    <m-nav-bar :border="false"></m-nav-bar>
    <div class="order-input-box-fixed">
      <SelectInput
        ref="order-input"
        :inputText="workcenterData.workcenterName"
        placeholder="请选择WKC"
        :isWhiteBorder="true"
        class="input-order"
        @handle-right-click="handleOpenSelectWKC" />
    </div>

    <div class="content">
      <!-- 头部搜索卡片 -->
      <SearchOrderCard
        :searchCondition="searchCondition"
        @scanInputSubmit="scanInputSubmit"
        @scanInputRightIconClick="scanInputRightIconClick"
        @clickInputRightIcon="clickInputRightIcon"
      />

      <!--详情-->
      <DetailCon :detail="detailData" />
    </div>

    <!-- 底部按钮组件 -->
    <SubmitBar
      buttonText="呼叫"
      leftBtnText="重置"
      :hasLeftBtn="true"
      :hasTotalDisplay="false"
      :hasCheckAll="false"
      @submit="onDeliveryOrderSubmit"
      @leftBtnClick="onReset"
    />

    <!--选择WKC dialog-->
    <SelectWKCDialog
      ref="wkcDialog"
      :visible="showWKCDialog"
      headTitle="WKC选择"
      :errTips="errMsg"
      :hasSearchInput="false"
      :immediateLoad="true"
      :reload="showWKCDialog"
      :orgId="orgId"
      :userName="userInfo.userName"
      @selectionChange="onSelectWKCChange"
      @selectionCancel="onCancel('showWKCDialog')" />

    <!--选择物料编码-->
    <!-- <SelectItemCodeDialog
      ref="itemCodeDialog"
      :visible="showItemCodeDialog"
      headTitle="物料编码查询"
      :errTips="errMsg"
      :hasSearchInput="true"
      :immediateLoad="true"
      :reload="showItemCodeDialog"
      :orgId="orgId"
      :workcenterCode="workcenterData.workcenterCode"
      @selectionChange="onSelectItemCodeChange"
      @selectionCancel="onCancel('showItemCodeDialog')" /> -->
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, toRefs, getCurrentInstance, nextTick } from 'vue'
import commonData from '@/common/index'

export default defineComponent({
  components: {
    mNavBar: defineAsyncComponent(()=> import('@/components/navBar')),
    SelectInput: defineAsyncComponent(()=> import('@/components/selectInput')),
    SearchOrderCard: defineAsyncComponent(()=> import('../components/materialDeliverySearchCard')),
    DetailCon: defineAsyncComponent(()=> import('../components/detail')),
    SubmitBar: defineAsyncComponent(()=> import('@/components/submitBar')),
    SelectWKCDialog: defineAsyncComponent(()=> import('../components/selectWKCDialog')),
    SelectItemCodeDialog: defineAsyncComponent(()=> import('../components/selectItemCodeDialog')),
  },
  setup() {
    const {ctx} = getCurrentInstance()
    const {globalProperties} = getCurrentInstance().appContext.config
    const {
      commonState,
      orgId,
      userInfo,
      currentOrgCode,
      clearAppStore,
      setSearchCondition
    } = commonData()
    console.log(orgId.value, userInfo.value, currentOrgCode.value)

    const handleOpenSelectWKC = ()=> {
      console.log('open WKC')
      commonState.showWKCDialog = true;
      nextTick(() => {
        // 弹出杂项类别选择框
        if (ctx.$refs['wkcDialog']) {
          ctx.$refs['wkcDialog'].resetData()
        }
      })
    }

    const scanInputSubmit = (payload)=> {
      console.log(payload)
    }

    const scanInputRightIconClick = (payload)=> {
      console.log(payload)
    }

    const clickInputRightIcon = (payload)=> {
      console.log(payload)
      if (payload.fieldName === 'itemCode') {
        // 打开物料编码选择弹窗
        if (!commonState.workcenterData.workcenterCode) {
          globalProperties.$toast.fail('未选择WKC，请先选择WKC');
          return;
        }
        commonState.showItemCodeDialog = true;
        nextTick(() => {
          if (ctx.$refs['itemCodeDialog']) {
            ctx.$refs['itemCodeDialog'].resetData()
          }
        })
      }
    }

    const onDeliveryOrderSubmit = ()=> {}

    const onReset = ()=> {
      globalProperties.$dialog.confirm({
        title: '温馨提示',
        message: '将清空所选数据，是否继续？',
        confirmButtonText: '确定'
      }).then(()=> {
        clearAppStore()
      }).catch(()=> {})
    }

    // 确定选择wkc
    const onSelectWKCChange = (val)=> {
      console.log(val);
      if (!val.data) {
        globalProperties.$toast('请选择WKC')
        return;
      }
      commonState.showWKCDialog = false;
      commonState.workcenterData = val.data;
    }

    // 确定选择物料编码
    const onSelectItemCodeChange = (val)=> {
      console.log(val);
      if (!val.data) {
        globalProperties.$toast('请选择物料编码');
        return;
      }
      commonState.showItemCodeDialog = false;
      setSearchCondition({itemCode: val.data.itemCode})
    }

    // 取消选择
    const onCancel = (key)=> {
      commonState.errMsg = ''
      commonState[key] = false;
    }
    return {
      ...toRefs(commonState),
      orgId,
      userInfo,
      handleOpenSelectWKC,
      scanInputSubmit,
      scanInputRightIconClick,
      clickInputRightIcon,
      onDeliveryOrderSubmit,
      onReset,
      onSelectWKCChange,
      onCancel,
      onSelectItemCodeChange,
    }
  },
})
</script>

<style lang="less" scoped>
</style>
