#### vue\src\platforms\web\entry-runtime-with-compiler.js

作用：入口文件，覆盖$mount，执行模板解析和编译工作
Role:Entry File,overwrite $mount, perform template parsing and compilation

#### vue\src\platforms\web\runtime\index.js

定义$mount  Define $mount

#### vue\src\core\index.js

定义全局API  Define global api

#### vue\src\core\instance\index.js

定义Vue构造函数

定义很多实例方法

```js
initMixin(Vue) // 通过该方法给Vue构造函数添加_init方法 This method adds an _init method to the Vue constructor
stateMixin(Vue) // 与状态相关的混入 $set,$delete,$watch
eventsMixin(Vue) // 与事件相关的混入 $emit,$on,$off,$once
lifecycleMixin(Vue)
renderMixin(Vue)
```



#### vue\src\core\instance\init.js

初始化_init方法定义的地方

```javascript
vm._self = vm
    initLifecycle(vm) // 初始化生命周期  Initialization Lifecycle  声明:$parent,$root,$children,$refs  Statement:$parent,$root,$children,$refs
    initEvents(vm)	// 初始化事件  Initialization Event  处理(添加监听)父组件传入事件和回调
    initRender(vm)  // 初始化render函数 Initialization render()  声明:$slots,$createElement()即render函数中的h
    callHook(vm, 'beforeCreate') // 调用钩子函数beforeCreate
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
```

在01-init.html中断点调试
初始化过程
1.new Vue() 调用init => this._init(options)执行初始化各种属性 =>  合并选项mergeOptions

 =>vm.$mount 调用mountComponent =>  mount.call() => mountComponent 声明updateComponent,创建Watcher => _render() 获取vdom  => _update() 将vdom变成dom

 

#### vue\src\core\instance\lifecycle.js

mountComponent 执行校验,调用beforeMount钩子函数,声明更新组件updateComponent



#### 数据响应式

Vue一大特点是数据响应式,数据的变化会作用于UI而不用进行DOM操作.原理上来讲,是利用了JS语言特性Object.defineProperty(),通过定义对象属性setter方法拦截对象属性变更,从而将数值的变化转换为UI的变化.

具体实现是在Vue初始化时,会调用initState,它会初始化data,props等,这里着重关注data初始化,



#### 整体流程

##### initState(vm:Component) src\core\instance\state.js

初始化数据,包括props、methods、data、computed和watch



initData核心代码是将data数据响应化 :获取data，去重，设置代理，启动响应式observe进行递归

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```



#### vue\src\core\observer\index.js



```js
obj = {foo:'foo'}
obj.bar = 'aaa' // error
Vue.set(obj,'bar','aaa') // ok

items = [1,3]
Vue.set(items,0,'abc') // ok
items.length = 0 // error
items[0] = 'aaa' // error
```



Vue 2.0响应式缺点

1.递归遍历，性能会受影响

2.api不统一





#### 作业

- 理出整体流程思维导图

- 自己尝试编写测试案例调试

  - #### vue\examples\test\02-1-reactive.html  断点调试过程

    src/core/instance/init.js Line65 initState(vm) **=>** state.js Line57 initData(vm) **=>** function initData(vm:Component) **=>** Line154 observe(data, true /* asRootData */) **=>** function observe() **=>** Line136 ob = new Observer(value) value=data{obj:{xx}} 创建第一个Observer实例 **=>** class Observer{} **=>** Line65 this.walk(value) => walk(obj: Object) => Line77 defineReactive(obj,keys[i]) => function defineReactive() =>  dep.depend() => childOb.dep.depend() 可以观测到obj与foo的Watcher都是一个，为当前组件实例 => dep.notify() 通知更新 => notify() => subs[i].update()

- 自己研究一下Vue.set/delete/$watch等API

  1. $watch

     - watch:{'$root':function(){}}

     - unwatch = vm.$watch('$route',function(newVal){})  // 通过Vue实例上挂载的$watch方法使用方法：需要监听的表达式，变化时的回调函数，最后还会返回一个取消监听的函数unwatch

     - ```ts
       Vue.prototype.$watch = function (
           expOrFn: string | Function, // 传入的可能是字符串也可能是函数
           cb: any, // 回调函数
           options?: Object // 选项
         ): Function {
           const vm: Component = this
           if (isPlainObject(cb)) { // 如果cb是一个对象
             return createWatcher(vm, expOrFn, cb, options) // 通过createWatcher，创建Watcher
           }
           options = options || {}
           options.user = true // 存在user:true说明为$watch
           const watcher = new Watcher(vm, expOrFn, cb, options) 
           if (options.immediate) { // 如果选项中存在立即执行函数就直接调用watcher，否则值发生变化才调用
             try {
               cb.call(vm, watcher.value)
             } catch (error) {
               handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
             }
           }
           return function unwatchFn () { //返回取消监听的unwatchFn函数
             watcher.teardown() // unwatchFn核心方法是调用watcher.teardown()
           }
         }
       ```

     - Dep 与 Watcher 的关系 => n:n

- 尝试看看vue异步更新是如何实现的

  - Queue 在每一次提交更新的时候不会立即执行，而是尝试将Watcher直接放入更新队列中，若Watcher在队列中，会进行去重
  - 如何批量异步执行 Promise/MutationObserver/SetImmediate/SetTimeout
    - 微任务（会在浏览器执行之前进行）、宏任务（会在浏览器刷新之后执行）