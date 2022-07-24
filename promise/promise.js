const SUCCESS = 'fulfilled'
const FAILURE = 'rejected'
const PENDING = 'pending'
class Promise{
    constructor(executor){
        this.status = PENDING// 初始状态
        this.value = undefined// 成功状态
        this.reason = undefined// 失败状态
        // 需要把then中的成功失败回调保存
        this.onFulfilledCb = []
        this.onRejectedCb = []
        let resolve = value=>{
            // 当状态为pending时可以修改
            if(this.status===PENDING){
                this.status = SUCCESS
                this.value = value
                // 状态改变时执行存起来的成功回调   
                this.onFulfilledCb.forEach(fn=>fn())
            }
        }
        let reject = reason=>{
            if(this.status===PENDING){
                this.status = FAILURE
                this.value = reason
                // 状态改变时执行存起来的失败回调
                this.onRejectedCb.forEach(fn=>fn())
            }
        }
        // Promise 的构造器接收一个执行函数 (executor)
        try {
            executor(resolve,reject)//手动地 resolve 和 reject 一个 Promise
        }catch (e){
            reject(e)
        }
    }
    then(onFulfilled,onRejected){
        // 返回一个新的promise，解决潜逃回调then
        let promise = new Promise((resolve,reject)=>{
            // 成功回调函数 失败回调
            if(this.status===SUCCESS){
                // onFulfilled(this.value)
                let val = onFulfilled(this.value)
                // then里面也要return一个promise
                resolvePromise(val,resolve,reject)
            }
            if(this.status===FAILURE){
                // onRejected(this.reason)
                let val = onRejected(this.reason)
                // then里面也要return一个promise
                resolvePromise(val,resolve,reject)
            }
            // 刚开始时就保存成功失败回调pending
            if(this.status===PENDING){
                // 等待状态时存成功失败回调
                this.onFulfilledCb.push(()=>{
                    // onFulfilled(this.value)
                    let val = onFulfilled(this.value)
                    // then里面也要return一个promise
                    resolvePromise(val,resolve,reject)
                })
                this.onRejectedCb.push(()=>{
                    let val = onFulfilled(this.reason)//
                    // then里面也要return一个promise
                    resolvePromise(val,resolve,reject)
                })
            }
        })
        return promise
    }
}
function resolvePromise(value,resolve,reject){
    if(typeof value==='function' || typeof value==='object'){
        try {
            let {then} = value
            if(typeof then==='function'){
                // then有2个回调，一个成功，一个失败 call 调用一个函数
                then.call(value,res=>{
                    // resolve(res)// 成功
                    resolvePromise(value,resolve,reject)// 递归处理then里面返回的promise
                },error=>{
                    reject(error)// 失败回调
                })
            }else{
                // 如果then不是函数
                resolve(value)
            }
        } catch (error) {
            reject(error)
        }
    }else{
        // 如果value不是函数或者对象,返回普通值
        resolve(value)
    }
}
module.exports = Promise
