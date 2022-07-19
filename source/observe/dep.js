// 给属性收集watcher，每个属性都有一个dep
let id = 0
class Dep {
    constructor(){
        this.id = id++
        this.subs = []// 存储watcher
    }
    // 订阅
    addSub(watcher){
        this.subs.push(watcher)
    }
    // 通知 所有的watcher 渲染
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
    // 关联watcher
    depend(){
        if(Dep.target){
            Dep.target.addDep(this)// this-> dep watcher双向依赖
        }
    }
}

// 压栈
let stack = []
export function pushTarget(watcher){
    Dep.target = watcher// 将当前watcher指向Dep.target
    stack.push(watcher)// 压栈
}
// 出栈
export function popTarget(){
    stack.pop()// 出栈
    Dep.target = stack[stack.length - 1]// target为空
}
export default Dep

