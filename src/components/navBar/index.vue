<template>
  <div class="nav-bar-wrapper">
    <van-nav-bar
      class="m-nav-bar"
      :fixed="true"
      :title="title"
      left-arrow
      v-bind="$attrs"
      @click-left="clickLeft">
    </van-nav-bar>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'
export default defineComponent({
  props: {
    navTitle: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    const route = useRoute()
    const router = useRouter()

    const title = computed(()=> {
      return props.navTitle || route.meta.title
    })

    const clickLeft = ()=> {
      emit('navBack')
      router.back(-1)
    }
    return {
      title,
      clickLeft
    }
  },
})
</script>

<style lang="less" scoped>
  .nav-bar-wrapper {
    height: 46px;
  }
  .m-nav-bar {
    background-color: #f56;
  }
</style>

<style lang="less">
  .m-nav-bar {
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
    }
  }
</style>
