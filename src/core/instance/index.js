import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造函数 Vue constructor
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
	}
	// 初始化 initialize(init)
  this._init(options) // 通过下面的initMixin混入所得 
}

initMixin(Vue) // 通过该方法给Vue构造函数添加_init方法 This method adds an _init method to the Vue constructor
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
