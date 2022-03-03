<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition
        name="slide"
        mode="out-in"
        enter-active-class="slideInRight"
        leave-active-class="slideOutLeft">
        <keep-alive v-if="$route.meta.keepAlive">
          <component :is="Component" />
        </keep-alive>
        <component v-else :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  }
}
</script>

<style lang="less">

</style>
