/* @flow */
// 作用：入口文件，覆盖$mount，执行模板解析和编译工作
// Role:Entry File,overwrite $mount, perform template parsing and compilation

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

// 保存原来的$mount
const mount = Vue.prototype.$mount
// 覆盖默认的$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

	// 解析options
	// Resolution options
  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
		let template = options.template
		// 模板解析
		// Template patsing
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') { // 尝试看看template是否是一个选择器
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el) // 存在el:#xx 会将XX的内容作为template进行解析 Existing el:#xx parses the contents of xx as templates
		}
		// 如果存在模板，执行编译
		// Compile if template exist
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

			// 编译器最终还是要得到渲染函数
			// The ultimate goal of the compiler is to get rendering functions
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render //将得到的渲染函数，放入options中  Place the resulting rendering funtion in options
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
	}
	
	// 真正的挂载是在父级的mount方法 The real mount is the mount method at the parent 
  return mount.call(this, el, hydrating) // 当render函数出现后就可以执行真正的挂载了  When the render funtion appears, the actual mount can be performed
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
