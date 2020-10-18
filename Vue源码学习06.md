```html
04-vdom.html
```

**breakpoint** 

```js
const oldCh = oldVnode.children src/core/vdom/patch.js
```

**breakpoint** 

```js
if (isUndef(vnode.text)) { // 判断是否为文本节点，

    if (isDef(oldCh) && isDef(ch)) {
 		if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)

updateChildren() 重排算法
```



**breakpoint**

```js
// while 循环
} else if (sameVnode(oldStartVnode, newStartVnode)) { // 两个开头相同的情况
				// patch 
				patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
```



会循环比对节点5次，前四次没有文本内容的更新，第五次有文本内容的更新

```js
 else if (oldVnode.text !== vnode.text) { // oldVnode.text = 'foo' ,vnode.text = 'fooooo'
			// 双方都是文本节点，更新文本
			nodeOps.setTextContent(elm, vnode.text)
```



- diff 算法
  - 根据vdom计算出需要进行dom操作的地方，使得只需要进行最少的dom操作（是什么）
  - 性能，跨平台，兼容性
  - 存在新旧vdom时就需要进行patch比较，需要用到diff算法(patchVnode)，在(src/core/vdom/patch.js)中
  - 怎么执行的？
    - 原则：深度优先，同级比较
    - 三种类型的操作：属性更新、文本更新、子节点更新（重排算法）
    - 首先会从底层节点进行比较，判断节点类型是否为元素，为元素，判断是否有子节点，有子节点并且新旧子节点不相同则进行递归，向下比较（重排算法）
      - 重排算法(reorder)updateChildren()  用一种较高效的方式比对新旧两个VNode的children从而得出最小dom操作补丁，具体在05中
    - 不是元素则直接进行文本内容的更新

