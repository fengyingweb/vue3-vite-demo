<template>
    <div class="select-input">
        <van-cell-group>
            <van-field
              ref="input-field"
              v-model="inputText"
              :placeholder="placeholder"
              :readonly="true"
              :clearable="true"
              right-icon="search"
              @click-right-icon="handkleRightClick">
            </van-field>
        </van-cell-group>
    </div>
</template>

<script>
import {defineComponent, getCurrentInstance, onMounted, nextTick} from 'vue'
export default defineComponent({
    name: 'SelectInput',
    props: {
        // 输入的字符串
        inputText: {
            type: String,
            default: ''
        },
        //输入提示信息
        placeholder: {
            type: String,
            default: ''
        },
        isWhiteBorder: {
            type: Boolean,
            default: false
        },
        // 是否不可编辑
        isDisabled: {
            type: Boolean,
            default: false
        },
    },
    emits: ['handle-right-click'],
    setup(props, {emit}) {
      const {ctx} = getCurrentInstance()

      const handkleRightClick = ()=> {
        emit('handle-right-click')
      }
      onMounted(()=> {
        nextTick(()=> {
          if (props.isWhiteBorder) {
            ctx.$refs['input-field'].$el.style.borderColor = '#fff' // 设置边框为白色
          }
        })
      })
      return {
        handkleRightClick
      }
    }
})
</script>

<style lang="less" scoped>
.select-input {
    .van-cell-group {
        background-color: transparent;
    }
    .van-cell {
        padding: 7px 16px 5px 16px;
        font-size: 15px;
        background: #fff;
        border: 1px solid #f56;
        border-radius: 4px;
    }
    .van-hairline--top-bottom::after {
        border-width: 0;
    }
}
</style>
<style lang="less">
.select-input {
    position: relative;
    .van-field__left-icon {
        margin-right: 8px;
        > .van-icon {
            font-size: 16px;
        }
    }
    .van-field__right-icon {
        .van-icon {
            font-size: 18px;
        }
    }
    .van-field--disabled {
        background-color: #ddd !important;
    }
}
</style>
