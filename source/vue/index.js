import {initState} from '../observe'
import Watcher from '../observe/watcher'
import { compiler } from './util'
function Vue(options){
    this._init(options)
}
Vue.prototype._init = function(options){
    let vm = this
    vm.$options = options
    // 初始化
    initState(vm)
    // 渲染模版页面
    if(vm.$options.el){
        this.$mount()
    }
}
// 闭包 拿到真实dom
function query(el){
    if(typeof el ==='string'){
        return document.querySelector(el)
    }
    return el// 不是字符串直接返回
}
// 渲染
Vue.prototype.$mount = function(){
    let vm = this
    let {el} = vm.$options
    el = vm.$el = query(el)// 真实dom
    // this._update()
    // 通过watcher来渲染 页面 
    let updatedc = ()=> {
        vm._update()
    }
    new Watcher(vm,updatedc)
}
Vue.prototype.$watch = function(expr,handler,opts){
    // 创建watcher-渲染watcher-watch user 用户自定义
    new Watcher(this,expr,handler,{user:true,...opts})
}
// 渲染私有方法
Vue.prototype._update = function(){
    let vm = this
    let elm = vm.$el// 真实dom
    // 将页面需要渲染的元素放到内存 文档碎片
    let node = document.createDocumentFragment()
    let firstChild
    // 有第一个元素，就加在内存 firstChild 属性返回被选节点的第一个子节点
    while (firstChild = elm.firstChild) {
        node.appendChild(firstChild)// {{xxx}}添加到node
    }
    // console.log(node)
    compiler(node,vm)// 页面上替换{{xxx}}
    // 内存中再放在页面渲染
    elm.appendChild(node)
}
export default Vue