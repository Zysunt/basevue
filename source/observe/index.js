
import Dep from './dep';
import Observer from './Observer';
import Watcher from './watcher';

export function initState(vm){
    let opts = vm.$options
    if(opts.data){
        initData(vm)// 初始化数据 监听器等
    }
    // watch
    if(opts.watch){
        initWatch(vm)
    }
    // computed
    if(opts.computed){
        initComputed(vm)
    }
}
function initComputed(vm){
    let watcher = vm._watcherComputed = Object.create(null)// 创建空对象用于存储计算属性名和函数
    let { computed } = vm.$options
    for(let key in computed){
        let fn = computed[key]// 计算属性函数
        watcher[key] = new Watcher(vm,fn,()=>{},{lazy:true})// 默认计算属性不执行lazy
        Object.defineProperty(vm,key,{
            get:createComputedGetter(vm,key)
        })
    }
}
// 获取计算属性
function createComputedGetter(vm,key){
    let watcher = vm._watcherComputed[key]// 计算属性watcher
    return function(){
        if(watcher){
            if(watcher.lazy){
                //重新计算
                watcher.evaluate()
            }
        }
        // watcher.get会有出栈操作，吧最上面的watcher去掉
        // get出栈后，dep.target指针指向渲染wathcer
        if(Dep.target){
            watcher.depend()
        }
        return watcher.value
    }
}
function initWatch(vm){
    let watch = vm.$options.watch
    for (const key in watch) {
        let objorfn = watch[key],handler=objorfn
        if(objorfn.handler){
            // 配置
            handler = objorfn.handler
            createWatcher(vm,key,handler,{immediate:objorfn.immediate})
        } else{
            // 函数
            createWatcher(vm,key,handler,{})
        }
    }
}
// watcher-watch-自定义
function createWatcher(vm,key,handler,opts){
    vm.$watch(key,handler,opts)
}
// 数据展示修改监听 初始化
function initData(vm){
    let { data } = vm.$options
    // 如果data是函数就call执行函数，对象就返回data或者空对象初始值 这时候可以vm._data.xxx拿到数据，data放在私有属性_data上
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
    // 将data里面的每个数据重新代理 这时候可以vm.xxx拿到数据
    for (const key in data) {
        proxy(vm,'_data',key)
    }
    // 数据拦截 修改数据后监听到
    observer(vm._data)
}
// 对象data数据拦截 重点  饮用类型 递归也走这边
export function observer(data){
    if(typeof data !== 'object' || data ===null){
        return
    }
    // 针对数组 有__ob__,不需在new
    if(data.__ob__){
        return data.__ob__
    }
    // 对象 就监听 观察
    return new Observer(data)
}
// 在vm实现上动态添加所有属性 vm.xxx => vm._data.xxx
function proxy(vm,_data,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[_data][key]
        },
        set(newVal){
            vm[_data][key] = newVal
        }
    })
}