import { defineReactive } from './Observer'
import {observer} from './index'

// 把原生的方法重构 外面包一层 在调用时添加判断，对象就监控
let oldArrayMethod = Array.prototype
// 复制一份
export let arrayMethods = Object.create(oldArrayMethod)
// 需要拦截的方法
let methods = ['push','shift','pop','unshift','reverse','sort','splice']

// 监听添加到数据，只对对象
export function observerArray(inserted){
    for (let i = 0; i < inserted.length; i++) {
        observer(inserted[i])
    }
}
// 递归给数组添加dep
export function dependArray(val){
    for (let i = 0; i < val.length; i++) {
        const item = val[i];
        item.__ob__ && item.__ob__.dep.depend()//双向绑定dep-watcher
        if(Array.isArray(item)){
            dependArray(item)// 递归绑定数组dep-watcher
        }
    }
}

methods.forEach(item=>{
    arrayMethods[item] = function(...args){// 重构原生方法
        // 拦截数组原生方法
        // 调用原生数组方法 get
        let res = oldArrayMethod[item].apply(this,args)
        let inserted
        switch(item){
            case 'push':
            case 'unshift':
                inserted = args;break;
            case 'splice':
                inserted = args.slice(2)// 取新增的内容
            default:
                break
        }
        if(inserted){// 有新增的内容
            // 数据拦截 set
            // defineReactive(this,this.length-1,inserted[0])
            observerArray(inserted)// 监听每个数据
            this.__ob__.dep.notify()// 通知数组更新

        }
        return res
    }
})