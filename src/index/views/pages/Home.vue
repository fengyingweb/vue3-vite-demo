<template>
  <div class="wrapper">
    <img alt="Vue logo" src="@/assets/img/logo.png" />
    <HelloWorld :msg="msg"/>
    <div class="btn-wrapper" @click="goAbout">关于</div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'
export default defineComponent({
  components: {
    HelloWorld: defineAsyncComponent(()=> import('@/components/HelloWorld.vue'))
  },
  setup() {
    const msg = ref('Home 页面')
    const route = useRoute();
    const router = useRouter();
    console.log(route)

    const goAbout = ()=> {
      router.push('/about')
    }
    return {
      msg,
      goAbout
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
    }
  }
</style>
