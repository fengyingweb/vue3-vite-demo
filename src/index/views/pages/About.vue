<template>
  <div>
    <img alt="Vue logo" src="@/assets/img/logo.png" />
    <h1>{{title}}</h1>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const title = ref('About 页面');
    return {
      title
    }
  }
})
</script>

<style lang="less" scoped>

</style>
