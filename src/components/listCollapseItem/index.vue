<template>
    <div class="list-collapse-item">
        <van-collapse-item :title="titleText" :name="name" :disabled="disabled" :border="border">
          <template v-if="!titleText" #title>
            <div>
                <slot name="title"></slot>
            </div>
          </template>
          <slot></slot>
          <template #right-icon v-if="!disabled">
            <div>
                <van-icon :name="rightIconName" class="iconarrow" />
            </div>
          </template>
        </van-collapse-item>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

/**
 * 采集量输入组件
 */
export default defineComponent({
    name: 'ListCollapseItem',
    components: {},
    props: {
        // 标题
        titleText: {
            type: String,
            default: ''
        },
        // collapse的name
        name: {
            type: [String, Number],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        rightIconName: {
            type: String,
            default: ''
        }
    },
    setup(props, {emit}) {
      /**
      * 处理长按事件
      */
      const handleExpendLongTap = (evt)=> {
        emit('long-tap', evt)
      }
      return {
        handleExpendLongTap
      }
    }
})
</script>

<style lang="less" scoped>
.list-collapse-item {
    .van-collapse-item__title {
        .iconarrow {
            position: relative;
            display: inline-block;
            transition: 0.3s;
            color: #ccc;
            transform: rotate(180deg);
        }
    }
    .van-collapse-item__title--expanded {
        .iconarrow {
            transform: rotate(0);
        }
    }
}
</style>
<style lang="less">
.list-collapse-item {
    // .van-collapse-item__content {
    //     padding: 0 0.4rem;
    // }
    .van-hairline--top::after {
        border-top-width: 0;
    }
    .van-collapse-item {
        position: relative;
        .van-cell {
            padding: 8px 5px 7px 0;
            background: transparent;
        }
        .van-collapse-item__wrapper {
            .van-collapse-item__content {
                padding-left: 0;
                padding-right: 0;
                padding-top: 0;
                padding-bottom: 5px;
                background: transparent;
            }
        }
    }
}
</style>
