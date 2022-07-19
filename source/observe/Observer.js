import { observer } from './index'
import {arrayMethods,dependArray} from './array'
import Dep from './dep';
// 观察类
class Observer {
    constructor(data){
        // dep-watcher
        this.dep = new Dep()
        // 如果是数组 array-Observer-dep
        Object.defineProperty(data,'__ob__',{
            get:()=>this
        })
        // 数组修改原型，拦截原生方法
        if(Array.isArray(data)){
            data.__proto__ = arrayMethods
        }
        this.walk(data)// 所有属性响应式
    }
    walk(data){
        let keys = Object.keys(data)// 拿到data的所有key
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = data[key]
            defineReactive(data,key,value) // 属性 =>响应式
        }
    }
}
// data 属性拦截处理 响应式属性 这里的value可以不传，直接data[key]拿到value，不过vue2源码是传了value，所以保持一致
export function defineReactive(data,key,value){
    // 相同属性 用的是相同dep
    let dep = new Dep()
    let childob = observer(value)// 如果value是对象，继续调用Observer 递归
    // 在data上动态添加key
    Object.defineProperty(data,key,{
        enumerable: true,// 可枚举
        configurable: true,// 可修改
        get(){
            if(Dep.target){
                // dep.addSub(Dep.target)// 单向依赖
                dep.depend()// dep--watcher 关系双向依赖
                 // 数组中dep关联watcher
                if(childob){
                    childob.dep.depend()// dep-watcher双向绑定
                    dependArray(value)// 多层数组，递归
                }
            }
            // console.log('deep:',dep)
            return value
        },
        set(newVal){
            if(value===newVal) return
            value = newVal
            // 通知更新
            dep.notify()
        }
    })
}
export default Observer