import {isString, isNumber} from 'lodash'
/**
 * 显示内容转换指令
 * e.g.
 * v-display-convert-to="{ value: erpWorkOrder.status, displayMap: statusMap }"
 */
export function displayConvertTo(app) {
  app.directive('display-convert-to', (el, binding)=> {
    const value = binding.value
    const displayMap = value.displayMap
    const displayContent = value.value
    if (displayContent && displayMap) {
        if (displayMap[displayContent]) {
            el.innerHTML = displayMap[displayContent]
        } else {
            el.innerHTML = displayContent
        }
    } else {
        if (displayMap.default) {
            el.innerHTML = displayMap.default
        } else {
            el.innerHTML = displayContent
        }
    }
  })
}

/**
 * 条件显示样式转换指令
 * e.g.
 * binding.value = {
 *  styleMap: {
 *    1: 'background: red;',
 *    0: 'background: yellow'
 *  },
 *  value: 1
 * }
 * display-style-control="{ value: 1, styleMap: styleMap }"
 */
export function displayStyleControl(app) {
  app.directive('display-style-control', (el, binding)=> {
    const value = binding.value
    const styleMap = value.styleMap
    const currentVal = value.value
    if (currentVal !== undefined && styleMap) {
        el.style = styleMap[currentVal]
    }
  })
}



/**
 * 数字转换指令
 */
export function numberFix(app) {
  app.directive('number-fix', (el, binding)=> {
    const value = binding.value
    const numStr = value.value
    if ((isString(numStr) && numStr !== '') || isNumber(numStr)) {
        el.innerHTML = parseFloat(parseFloat(numStr).toFixed(value.fix))
    } else {
        el.innerHTML = ''
    }
  })
}
