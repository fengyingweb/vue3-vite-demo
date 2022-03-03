<template>
    <div class="form-card">
        <van-row v-for="rowIndex in getMaxRow(settings) + 1" :key="rowIndex" gutter="5" class="row align-left">
            <!-- 加入是否渲染的控制逻辑 由isShowControlKey字段控制 -->
            <van-col
                v-for="(content, index) in settings.filter(
                    setting =>
                        setting.layout.row === rowIndex - 1 && (!setting.showControlKey || item[setting.showControlKey])
                )"
                :key="index"
                :span="content.layout.span || 24"
            >
                <van-row>
                    <van-col :span="content.layout.labelSpan >= 0 ? content.layout.labelSpan : 3" class="label">{{
                        content.label
                    }}</van-col>
                    <van-col
                        :span="(content.layout.labelSpan >= 0 && 24 - content.layout.labelSpan) || 21"
                        style="display: flex;"
                    >
                        <span
                            v-if="content.directive && content.directive.name === 'v-display-style-control'"
                            v-display-style-control="{
                                ...content.directive.param,
                                value: item[content.directive.param.key]
                            }"
                            :style="content.layout.style"
                            >{{ item[content.name] }}</span
                        >
                        <span
                            v-else-if="content.directive && content.directive.name === 'v-display-convert-to'"
                            v-display-convert-to="{
                                ...content.directive.param,
                                value: item[content.directive.param.key]
                            }"
                            :style="content.layout.style"
                            >{{ item[content.name] }}</span
                        >
                        <span
                            v-else-if="content.directive && content.directive.name === 'v-number-fix'"
                            v-number-fix="{
                                fix: content.directive.param.fix,
                                value: item[content.directive.param.key]
                            }"
                            :style="content.layout.style"
                            >{{ item[content.name] }}</span
                        >
                        <span v-else :style="content.layout.style">
                            <span v-if="!content.layout.input && !content.layout.scanInput">
                                <span :class="[content.className ? content.className : '']">
                                    {{ item[content.name] }}
                                </span>
                            </span>
                        </span>
                        <div
                            v-if="content.layout.editable"
                            class="amount-btn"
                            @click="handleEdit($event, uniqueKey ? item[uniqueKey] : '', content.name)"
                        >
                            <van-icon v-if="!content.layout.icon && !content.layout.word" name="edit" />
                            <span v-else-if="content.layout.icon" :style="content.layout.iconStyle"
                                ><van-icon :name="content.layout.icon"
                            /></span>
                            <span v-else-if="content.layout.word" :style="content.layout.iconStyle">{{
                                content.layout.word
                            }}</span>
                        </div>
                        <!-- 支持input类型 -->
                        <div v-if="content.layout.input" class="input-box">
                            <van-field
                                :ref="`${content.name}-${item[uniqueKey]}`"
                                v-model="item[content.name]"
                                v-bind="content.layout.inputProps"
                                :right-icon="content.layout.inputProps.rightIcon"
                                @change="onInputChange($event, uniqueKey ? item[uniqueKey] : '', content.name)"
                                @keydown.enter="onInputEnter($event, uniqueKey ? item[uniqueKey] : '', content.name)"
                                @click-right-icon="onClickRightIcon(uniqueKey ? item[uniqueKey] : '', content.name)"
                            >
                            </van-field>
                        </div>
                        <!-- 支持scanInput类型 -->
                        <div v-if="content.layout.scanInput" class="scan-input-box">
                            <van-field v-model="item[content.name]">
                              <template #input>
                                <div :class="[content.className ? content.className : '']">
                                    <ScanInput
                                        :ref="`${content.name}-${item[uniqueKey]}`"
                                        v-model:inputText="item[content.name]"
                                        v-bind="content.layout.scanInputProps"
                                        clearable
                                        class=""
                                        :rightIcon="content.layout.scanInputProps.rightIcon"
                                        @inputSubmit="
                                            onScnaInputSubmit(uniqueKey ? item[uniqueKey] : '', content.name, $event)
                                        "
                                        @handle-right-click="
                                            onScanInputRightIconClick(uniqueKey ? item[uniqueKey] : '', content.name)
                                        "
                                        @focus="
                                            onOrderInputFocus({
                                                id: `${content.name}-${item[uniqueKey]}`
                                            })
                                        "
                                    />
                                </div>
                              </template>
                            </van-field>
                        </div>
                    </van-col>
                </van-row>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import {defineComponent, watchEffect, nextTick, getCurrentInstance} from 'vue'
import { Col, Row } from 'vant'
import ScanInput from '../scanInput'
/**
 * 根据配置参数，渲染卡片内容的组件
 */
export default defineComponent({
    name: 'FormCard',
    components: {
        ScanInput,
        [Col.name]: Col,
        [Row.name]: Row
    },
    props: {
        // 展示内容对象
        item: {
            type: Object,
            required: true,
            default: () => {}
        },
        // 展示内容配置对象数组
        settings: {
            type: Array,
            default: () => []
        },
        // 内容对象id对应的key
        uniqueKey: {
            type: String,
            default: '',
            required: true
        },
        hasAutoFocus: {
            type: Boolean,
            default: false
        },
        autoFocusId: {
            type: String,
            default: ''
        },
        isAutoSelectAll: {
            type: Boolean,
            default: false
        }
    },
    setup(props, {emit}) {
      const {ctx} = getCurrentInstance()
      // 计算最大的行数
      const getMaxRow = (settings)=> {
        if (!settings) return 0
        const maxRow = Math.max(...settings.map(item => item.layout.row))
        return maxRow
      }
      // 处理字段编辑操作
      const handleEdit = (evt, id, fieldName)=> {
        emit('fieldEdit', {
          id,
          fieldName
        })
      }

      const onInputChange = (evt, id, fieldName)=> {
        emit('inputChange', {
          id,
          fieldName,
          value: evt.currentTarget.value
        })
      }

      const onInputEnter = (evt, id, fieldName)=> {
        emit('inputEnter', {
          id,
          fieldName,
          value: evt.currentTarget.value
        })
      }

      const onClickRightIcon = (id, fieldName)=> {
        emit('clickInputRightIcon', {
          id,
          fieldName
        })
      }

      const onScnaInputSubmit = (id, field, value)=> {
        emit('scanInputSubmit', {
          id,
          field,
          value
        })
      }

      const onScanInputRightIconClick = (id, field)=> {
        emit('scanInputRightIconClick', {
          id,
          field
        })
      }

      const onOrderInputFocus = ({ id })=> {
        if (ctx.$refs[id] && ctx.$refs[id].length > 0 && props.isAutoSelectAll) {
          ctx.$refs[id][0].chooseAllText()
        }
      }

      function setInputFocus (refId) {
        nextTick(() => {
          const input = ctx.$refs[refId]
          if (Array.isArray(input) && input.length > 0) {
            if (input[0].focus) {
                input[0].focus()
            } else {
                input[0].setInputFocus()
            }
          }
        })
      }

      watchEffect(()=> {
        if (props.hasAutoFocus) {
          setInputFocus(props.autoFocusId)
        }
      })
      return {
        getMaxRow,
        handleEdit,
        onInputChange,
        onInputEnter,
        onClickRightIcon,
        setInputFocus,
        onScnaInputSubmit,
        onScanInputRightIconClick,
        onOrderInputFocus
      }
    },
})
</script>

<style lang="less" scoped>
@import '@/assets/css/list-item.less';
.form-card {
    .row {
        margin: 8px 0;
    }
    .input-box {
        padding: 0 28px 0 5px;
        width: 90%;
        .van-cell { 
            padding: 2px 5px;
            background: #fff;
            border: 1px solid #646efa;
            border-radius: 4px;
        }
    }
    .scan-input-box {
        width: 90%;
    }
}
</style>
<style lang="less">
.form-card {
    .scan-input-box {
        width: 90%;
        .van-cell {
            padding: 2px 5px;
        }
        .scan-input {
            input {
                font-size: 13px;
            }
        }
    }
}
</style>
