## 安装依赖包
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin -S

## 配置webpack目录
- npm run build 编译
- npm run start 启动

## Object.defineProperty()
动态给对象添加属性，拦截

## 数据拦截
Observe:数据拦截，监听数据
数据访问，proxy后通过vm.xxx访问，实际上访问的是vm._data.xxx.
数据递归监听，多级vm.obj.xxx.zz defineReactive()=>observer(value)

## 数组拦截
arr[0] 索引访问，可以
arr.push() 原生方法访问，需要拦截才能响应式 重构原来的方法
array.js文件 拦截的方法'push','shift','pop','unshift','reverse','sort','splice'
基本数据类型，对象
vue中不支持基本类型监听，只支持对象的watch

## 文本编译 Watcher监听
{{xxx}}=> 具体的值
遍历页面上所有的{{a.b.c.v}}
根据对象的层次，拿到对应的数据
内容替换{{}}
渲染到页面上
创建一个watcher，数据渲染

## Observer 数据劫持 Watcher 数据更新，模版替换

## 依赖收集
把数组的监听方式改为对象，只对对象监听
同步渲染：initState,Observer,defineReactive,mount(),
new Watcher(),watcher.get()压栈，_update(),拿到data渲染（触发get(),建立dep-watcher关系）
Dep:用来收集data属性依赖的watcher，每个属性都有一个Dep
异步渲染:修改data，set(),Dep,渲染watcher
Dep与Watcher双向依赖

## 异步渲染
修改data，set(),Dep,渲染watcher,watcher.get()压栈，_update(),拿到data渲染
性能优化：同一个属性多次修改的话，渲染只执行最后一次修改

## 数组依赖收集
如何渲染数组
数据修改触发渲染：修改data，set(),notify(),Dep,渲染watcher,watcher.get()压栈，_update(),拿到data渲染
数组修改触发渲染过程：数组->Observer->再Observer添加Dep->notify()->Dep关联Watcher

## watch 实现
在对data数据进行依赖收集时，调用watcher.get方法，可以将该数据存在watcher中
当修改data时，会触发set-dep-watcher.get,取现在的属性值域原来存在watcher中的值比较
不同就执行watch函数

## computed
不是真实的属性，页面上引用{{xxx.info}},不重复计算，缓存性
不能直接修改，默认不执行，是否执行flag
vm上新增一个属性，只读不改
页面渲染时，set，dep，计算，渲染
watcher计算属性的值
渲染watcher页面渲染
取计算属性的值：fun-dep-计算属性watcher-fun中再取data属性-data属性dep-计算属性watcher
修改计算属性：修改data-set-dep-watcher




