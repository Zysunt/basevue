## promise 解决无限嵌套
```
pending 等待状态
pending 成功
rejected 失败
Promise 的构造器接收一个执行函数 (executor)，可以在这个执行函数里手动地 resolve 和 reject 一个 Promise

初始pending，resolve()转变为成功状态，reject()为失败状态
状态一旦改变不可更改
resolve(xx)数据会传给then(成功，失败)成功回调函数
reject(xx) 数据会传给then中 的失败回调函数方法

成功状态调用成功方法resolve，失败状态调用失败方法 reject

需要把then中的成功失败回调保存,状态改变时执行存起来的成功失败回调
```

## vue响应式 原理
```js
Observer（数据监听器） : 
Observer的核心是通过Object.defineProprtty()来监听数据的变动，
这个函数内部可以定义setter和getter，每当数据发生变化，就会触发setter。
这时候Observer就要通知订阅者，订阅者就是Watcher

Watcher（订阅者） :
 Watcher订阅者作为Observer和Compile之间通信的桥梁，
 主要做的事情是：
在自身实例化时往属性订阅器(dep)里面添加自己
自身必须有一个update()方法
待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调


Compile（指令解析器） : 
Compile主要做的事情是解析模板指令，将模板中变量替换成数据，
然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，
添加鉴定数据的订阅者，一旦数据有变动，收到通知，更新试图
```
## vue-router
```js
步骤
 * 1.在VueRouter中创建$router(当前路由实例) $route（当前路由）
 * 2.初始化页面模式mode history和hash
 * 3.根据routes创建路由表 path -> compunent
 * 4.根据router-link展示路由路径
 * 5.根据router-view去选择对应path的componuet
```
## vuex3 基于vue的插件
vuex3官网图片
<img src="./vuex.png" />
```js
数据流 从根组件root到子组件再到孙子组件
需要有安装插件的方法install,还有Store类或者构造方法
Store里面需要有state，getters，mutations，actions，modules
可以直接拿到state，并且是响应式的，直接借助new Vue()的data()来实现响应式
利用Vue.mixin将每个组件通过beforeCreate()都注册store
改store需要通过mutations（同步）或者action（异步），所以需要再Store里面添加dispatch方法和commit
mutations和actions自己暴露出方法，调用实际传入的options里的方法，利用Object.keys()取到方法名getterName，mutationsName，actionsName
需要注意的是commit方法在actions异步调用的时候this指向问题，所以不要用普通函数，直接用箭头函数

关于模块：
递归构建vuex子模块树状结构，安装installModule所有模块树的getter，mutations，action
重构module后 dispatch，commit每个函数都执行一次

```


## 安装依赖包
```
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin -S
```

## 配置webpack目录
```js
src/index.js // 测试Vue部分
vue/index.js // 初始化Vue，暴露出一些方法一些操作
vue/util.js // 提取{{cxx}}并替换工具
observe/ // Observer核心 Dep Watcher Observer

vue2.js // vue的源码
npm run dev 启动
npm run build 编译
```

## Object.defineProperty()
```
动态给对象添加属性，拦截
每个组件实例都对应一个 watcher 实例，
它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。
之后当依赖项的 setter 触发时，会通知 watcher，
从而使它关联的组件重新渲染。
```
官网的一张图如下：
<img src="./data.png" />
```js
针对nextTick()没有优化，
官网用的是 在内部对异步队列尝试使用
原生的 Promise.then、MutationObserver 和 setImmediate，
如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
```
## 数据拦截
```js
Observe:数据拦截，监听数据
数据访问，proxy后通过vm.xxx访问，实际上访问的是vm._data.xxx.
数据递归监听，多级vm.obj.xxx.zz defineReactive()=>observer(value)
```

## 数组拦截
```js
arr[0] 索引访问，可以
arr.push() 原生方法访问，需要拦截才能响应式 重构原来的方法
array.js文件 拦截的方法:
'push','shift','pop','unshift','reverse','sort','splice'
基本数据类型，对象
vue中不支持基本类型监听，只支持对象的watch
```

## 文本编译 Watcher监听
```js
{{xxx}}=> 具体的值
遍历页面上所有的{{a.b.c.v}}
根据对象的层次，拿到对应的数据
内容替换{{}}
渲染到页面上
创建一个watcher，数据渲染
```


#### Observer 数据劫持 Watcher 数据更新，模版替换

## 依赖收集
```js
把数组的监听方式改为对象，只对对象监听
同步渲染：initState,Observer,defineReactive,mount(),
new Watcher(),watcher.get()压栈，_update(),
拿到data渲染（触发get(),建立dep-watcher关系）
Dep:用来收集data属性依赖的watcher，每个属性都有一个Dep
异步渲染:修改data，set(),Dep,渲染watcher
Dep与Watcher双向依赖
```


## 异步渲染
```js
修改data，set(),Dep,渲染watcher,watcher.get()压栈，_update(),拿到data渲染
性能优化：同一个属性多次修改的话，渲染只执行最后一次修改
```


## 数组依赖收集
```js
如何渲染数组
数据修改触发渲染：
修改data，set(),notify(),Dep,渲染watcher,watcher.get()压栈，_update(),拿到data渲染
数组修改触发渲染过程：
数组->Observer->再Observer添加Dep->notify()->Dep关联Watcher
```


## watch 实现
```js
在对data数据进行依赖收集时，调用watcher.get()方法，
可以将该数据存在watcher中
当修改data时，会触发set()-dep()-watcher.get(),
取现在的属性值域原来存在watcher中的值比较
不同就执行watch函数
```


## computed
```js
不是真实的属性，页面上引用{{xxx.info}},不重复计算，缓存性
不能直接修改，默认不执行，是否执行flag
vm上新增一个属性，只读不改
页面渲染时，set，dep，计算，渲染
watcher计算属性的值
渲染watcher页面渲染
取计算属性的值：fun-dep-计算属性watcher-fun中再取data属性-data属性dep-计算属性watcher
修改计算属性：修改data-set-dep-watcher
```





