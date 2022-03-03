<template>
    <div class="m-submit-bar" ref="mSubmitBar">
        <van-submit-bar
            :price="convertTotal"
            :currency="''"
            :decimal-length="getDecimal"
            :button-text="buttonText"
            :disabled="disabled"
            :loading="loading"
            @submit="onSubmit"
            v-bind="$attrs"
        >
            <div class="checkbox-container">
                <van-checkbox v-model="checked" v-if="hasCheckAll" :disabled="checkDisabled">
                    {{ checkBoxText }}
                </van-checkbox>
                <span v-if="hasCheckAll && !hasTotalStatistic && !selfDisplay" class="check-amount-tip">
                  已选{{ checkedLength }}个
                </span>
                <span v-if="hasTotalStatistic" class="check-amount-tip">
                  已选/总数：{{ checkedLength }}/{{ totalLength }}
                </span>
                <div v-if="selfDisplay" class="self-display">
                    <div class="display-item" v-for="item in selfDisplay" :key="item.label">
                        {{ item.label }}: {{ item.value }}
                    </div>
                </div>
                <van-button v-if="hasLeftBtn" plain class="left-button" type="primary" @click="onLeftBtnClick">{{
                    leftBtnText
                }}</van-button>
            </div>
        </van-submit-bar>
    </div>
</template>

<script>
import {defineComponent, computed, watch, watchEffect, ref, onMounted, getCurrentInstance, nextTick} from 'vue'
import { Checkbox, SubmitBar } from 'vant'
/**
 * 提交bar组件
 */
export default defineComponent({
    name: 'mSubmitBar',
    components: {
        [Checkbox.name]: Checkbox,
        [SubmitBar.name]: SubmitBar
    },
    props: {
        buttonText: {
            type: String,
            default: '提交'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 保留小数位
        decimal: {
            type: Number,
            default: 0
        },
        checkBoxText: {
            type: String,
            default: '全选'
        },
        isCheck: {
            type: Boolean,
            default: false
        },
        // 合计的数值
        total: {
            type: Number,
            default: 0
        },
        // 选中单位个数
        checkedLength: {
            type: Number,
            default: 0
        },
        // 是否需要全选
        hasCheckAll: {
            type: Boolean,
            default: true
        },
        // 全部数据长度
        totalLength: {
            type: Number,
            default: 0
        },
        // 总数统计
        hasTotalStatistic: {
            type: Boolean,
            default: false
        },
        // 全选disable控制
        checkDisabled: {
            type: Boolean,
            default: false
        },
        leftBtnText: {
            type: String,
            default: '重置'
        },
        hasLeftBtn: {
            type: Boolean,
            default: false
        },
        hasTotalDisplay: {
            type: Boolean,
            default: true
        },
        // 自定义显示数据
        selfDisplay: {
            type: Array
        }
    },
    setup(props, {emit}) {
      const {ctx} = getCurrentInstance()
      let checked = ref(false)

      const convertTotal = computed(()=> {
        // 由于组件默认是分做单位，这里要将传入的total * 100
        return props.total * 100
      })

      const getDecimal = computed(()=> {
        // 最多保留4位
        const decimalVal = parseFloat((props.total - parseInt(props.total)).toFixed(4))
        if (decimalVal > 0) {
          return props.decimal || decimalVal.toString().length - 2
        }
        return 0
      })

      /**
      * 提交按钮点击处理方法
      */
      const onSubmit = ()=> {
        emit('submit')
      }
      const onLeftBtnClick = ()=> {
        emit('leftBtnClick')
      }

      watchEffect(()=> {
        checked.value = props.isCheck
      })

      watch(checked, (nval, oval)=> {
        if (nval !== oval) {
          // 发射全选事件
          emit('update:isCheck', nval)
        }
      })

      onMounted(()=> {
        nextTick(()=> {
          if (!props.hasTotalDisplay) {
            const textDiv = ctx.$refs['mSubmitBar'].querySelector('.van-submit-bar__text')
            if (textDiv) {
              textDiv.style.display = 'none'
            }
          }
        })
      })
      return {
        checked,
        convertTotal,
        getDecimal,
        onSubmit,
        onLeftBtnClick
      }
    }
})
</script>

<style lang="less" scoped>
.van-submit-bar__bar {
    padding: 7px 10px 6px 15px;
    border: solid 0.5px #e5e5e5;
    background-color: #fff;
    box-sizing: border-box;
    justify-content: space-between;
    .checkbox-container {
        display: flex;
        flex-grow: 1;
        align-items: center;
        > .van-checkbox {
        }
        .van-checkbox__icon {
            > img {
                width: 20px;
            }
        }
        .left-button {
            width: 110px;
            height: 36px;
            box-sizing: border-box;
            border-radius: 4px;
            border-color: #646efa;
            font-size: 15px;
            line-height: 1.4;
            color: #646efa;
            margin-right: 10px;
        }
        .self-display {
            width: 43%;
            box-sizing: border-box;
            padding: 0 10px;
            font-size: 12px;
            line-height: 1.4;
            color: #666;
        }
    }
    > .van-button--danger {
        width: 120px;
        height: 36px;
        border-radius: 4px;
        background-color: #646efa;
        border: none;
        font-size: 15px;
        line-height: 1.4;
    }
    > .van-submit-bar__text {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        align-items: center;
        padding-right: 4px;
        font-size: 14px;
        color: #333;
        line-height: 1.37;
        max-width: 30%;

        > .van-submit-bar__price {
            font-size: 18px;
            line-height: 1.4;
            color: #f56;
            white-space: nowrap; /*强制不换行*/
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /*超出部分显示省略号*/
        }
        > .van-submit-bar__price::first-letter {
            font-size: 18px !important;
        }
    }
    .check-amount-tip {
        max-width: 85px;
        font-size: 12px;
        transform: scale(0.83);
        color: #666;
        margin-left: 3px;
    }
}
</style>
<style lang="less">
.m-submit-bar {
    .van-checkbox__label {
        font-size: 13px;
        color: #666;
    }
}
</style>
