import { util } from '../vue/util';
import {pushTarget,popTarget} from './dep';
// 数据渲染 每个组件的id都不一样
let id = 0
class Watcher{
    /**
     * @param {*} vm 当前组件实例
     * @param {*} exprOrFn 表达式或者函数
     * @param {*} cb 传入的回调函数 vm.$watch('xxx',function(){}) 
     * @param {*} opts 其他参数 
     * 肥羊
     */
    constructor(vm,exprOrFn,cb=()=>{},opts={}){
        this.vm = vm
        this.exprOrFn = exprOrFn
        if(typeof exprOrFn ==='function'){
            this.getter = exprOrFn
        } else{
            // 表达式 转 函数
            this.getter = function(){
                return util.getValue(vm,exprOrFn)
            }
        }
        if(opts.user){
            this.user = true//watcher 是用户定义的
        }
        this.immediate = opts && opts.immediate// 立即执行watcher
        // computed
        this.lazy = opts.lazy// 是否是计算属性
        this.dirty = this.lazy// 是否要计算
        this.cb = cb
        this.opts = opts
        this.id = id++
        this.deps = []// 存储dep dep跟watcher双向依赖
        this.depsId = new Set()// 避免重复
        // 默认创建一个watcher，立即调用自身的get方法
        this.value = this.get()// 依赖收集时，保存属性默认值，初始值比较，watch
        if(this.immediate){
            this.cb(this.value)// 只有一个新的
        }
        // 计算属性默认不执行
        this.value = this.lazy ? undefined : this.get()
    }
    // 执行当前传入的函数
    get(){
        pushTarget(this)// 将当前的this->watcher压栈
        // let val = this.getter()// 调用_update()
        let val = this.getter.call(this.vm)// 改变执行，vm，不能指向watcher，computed
        popTarget()// 弹出
        return val// 返回去保存
    }
    // watcher关联dep
    addDep(dep){
        let { id } = dep
        if(!this.depsId.has(id)){// 如果depsId中没有id
            this.depsId.add(id)
            this.deps.push(dep)// watcher关联dep
            dep.addSub(this)// 订阅 dep关联watcher
        }
    }
    // dep 渲染watcher 然后get()吧当前watcher压栈  再_update()
    update(){
        // this.get()// 同步 这里会导致每次修改都渲染
        if(this.lazy){// 计算属性
            this.dirty = true
        }else{
            queueWatcher(this)// 异步渲染 同一属性多次修改只渲染最后一次修改
        }
    }
    // 同步渲染
    run(){
        let val = this.get()// 拿到新旧值
        // 比较是否触发watcher
        if(this.value!==val){
            this.cb(val,this.value)// 执行watch
        }
    }
    // 计算属性
    evaluate(){
        this.value = this.get()// 取计算属性值 watcher
        // 属性不变，不需计算
        this.dirty = false
    }
    // 计算属性中引用属性关联渲染watcher
    depend(){
        let len = this.deps.length// 依赖于其他watcher
        while(len--){
            this.deps[len].depend()// 将当前栈的target压栈
        }
    }
}
let has = {}
let queue = []
// 清空队列
function flushQueue(){
    // run 同步渲染
    queue.forEach(watcher=>watcher.run())
    //清空缓存
    has = {}
    queue = []
}
// watcher等待队列
function queueWatcher(watcher){
    let { id } = watcher
    if(!has[id]){// 没有id
        has[id] = true
        queue.push(watcher)// watcher添加到队列
        // setTimeout(flushQueue,0)// 异步调用渲染所有watcher
        nextTick(flushQueue)// 延迟优化处理
    }
}
let cbs=[]
function flushCallback(){
    cbs.forEach(cb=>cb())
}
function nextTick(cb){
    cbs.push(cb)
    // 异步处理
    let timeFun = ()=>{
        flushCallback()
    }
    if(Promise){
        return Promise.resolve().then(timeFun)
    }
    setTimeout(timeFun,0)
}
export default Watcher