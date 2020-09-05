# Vuecode
vuecode study
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
stateMixin(Vue) // 与状态相关的混入
eventsMixin(Vue)
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
