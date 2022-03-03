<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>

    <div class="content">
      <van-grid :border="false" :column-num="2" :gutter="16">
        <van-grid-item
          v-for="item in distributeType"
          :key="item.type"
          :text="item.name"
          class="grid-item"
          @click="handleGridClick(item.type)">
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, reactive, toRefs } from 'vue'
import {useRouter} from 'vue-router'
import { Grid, GridItem } from 'vant'
export default defineComponent({
  components: {
    mNavBar: defineAsyncComponent(()=> import('@/components/navBar')),
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  setup() {
    const router = useRouter();
    const homeState = reactive({
      distributeType: [
        {
          name: '呼叫1',
          icon: "",
          type: 'materialDelivery'
        },
        {
          name: "呼叫2",
          icon: "",
          type: 'receiveWarehousing'
        },
        {
          name: '呼叫3',
          icon: "",
          type: 'callEmptyCar'
        },
        {
          name: "呼叫4",
          icon: "",
          type: 'pointToPointCall'
        }
      ]
    })

    const handleGridClick = (type)=> {
      console.log('handleGridClick type = ', type)
      router.push({ path: `/${type}`})
    }
    return {
      ...toRefs(homeState),
      handleGridClick
    }
  },
})
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      width: 120px;
      height: 36px;
      background: #f56;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      position: sticky;
      position: -webkit-sticky;
      top: 0px;
      z-index: 100;
    }
  }
</style>

<style lang="less">
  .grid-item {
      .van-grid-item__content {
        background: #f56;
      }
      .van-grid-item__text {
        color: #fff;
      }
  }
</style>
