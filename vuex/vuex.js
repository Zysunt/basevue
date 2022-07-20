
// 数据流 从根组件root到子组件再到孙子组件
let Vue
class Store{
    constructor(options){
        // this._state = options.state// 没有响应式
        this.vm = new Vue({
            data:{
                state:options.state// 响应式数据
            }
        })
        // 拿到模块树
        this.modules = new ModelColletion(options)// module
        this.getters = {}
        this.mutations = {}
        this.actions = {}
        // 安装模块
        installModule(this,this.state,[],this.modules.root)
        // getter
        // let getters = options.getter || {}// 局部getter，没有传入就空对象
        // this.getters = {}
        // 把getter中属性定义到this.getter 
        // forEach(getters,(getterName,fn)=>{
        //     Object.defineProperty(this.getters,getterName,{
        //         get:()=>{
        //             // fn =>getters[getterName]
        //             return fn(this.state)// getter是一个函数，所以需要调用函数
        //         }
        //     })
        // })
        // mutations
        // let mutations = options.mutations || {}// 局部mutations，没有传入就空对象
        // this.mutations = {}
        // // 把mutations中属性定义到this.mutations
        // forEach(mutations,(mutationsName,fn)=>{
        //     this.mutations[mutationsName] = payload => {
        //         fn(this.state,payload)// 调用mutations fn=>mutations[mutationsName]
        //     }
        // })
        // actions
        // let actions = options.actions || {}// 局部actions，没有传入就空对象
        // this.actions = {}
        // // 把actions中属性定义到this.actions
        // forEach(actions,(actionsName,fn)=>{
        //     this.actions[actionsName] = payload => {
        //         fn(this,payload)// 调用actions fn=>actions[actionsName]
        //     }
        // })
        // Object.keys(actions).forEach(actionsName=>{
        //     this.actions[actionsName] = payload => {
        //         actions[actionsName](this,payload)// 调用actions
        //     }
        // })
    }
    dispatch(type,payload){
        // this.actions[type](payload)
        // 重构module后 每个函数都执行一次 数组
        this.actions[type].forEach(fn=>fn(payload))
    }
    commit = (type,payload)=>{
        // action异步调用的时候this执行有问题，所以需要用箭头函数固定指向
        // this.mutations[type](payload)
        // 重构module后 每个函数都执行一次 数组
        this.mutations[type].forEach(fn=>fn(payload))
    }
    get state(){// state数据访问
        return this.vm.state
    }
}
// 构建vuex子模块树状结构  递归
class ModelColletion{
    constructor(options){
        this.registerModule([],options)// []根结点root
    }
    // 将子模块注册到根模块
    registerModule(pathArr,rootModule){
        // 初始对象
        let newModule = {
            _raw: rootModule,
            _children:{},
            state:rootModule.state
        }
        // 记录根节点
        if(pathArr.length===0){
            this.root = newModule// 根结点
        }else{
            // 子模块 需取父模块，将newModule赋值给父模块的——child
            let parent = pathArr.slice(0,-1).reduce((root,cur)=>{
                return this.root._children[cur]
            },this.root)
            parent._children[pathArr[pathArr.length-1]] = newModule// 父加上子模块

        }
        // 递归 加树状结构module
        if(rootModule.modules){
            forEach(rootModule.modules,(moduleName,module)=>{
                this.registerModule(pathArr.concat(moduleName),module)
            })
        }
    }
}
// 递归 安装所有模块树的getter，mutations，action
/**
 * 
 * @param {*} store  当前store
 * @param {*} state 当前state
 * @param {*} pathArr 模块路径
 * @param {*} rootModule 根模块
 * 肥羊
 */
const installModule = (store,state,pathArr,rootModule)=>{
    // 安装child state
    if(pathArr.length>0){
        // 根据当前state找父state
        let parent = pathArr.slice(0,-1).reduce((state,cur)=>{
            return state[cur]
        },state)
        // 吧子state添加到父state
        Vue.set(parent,pathArr[pathArr.length-1],rootModule.state)
    }
    let getters = rootModule._raw.getters || {}// 局部getter，没有传入就空对象
    if(getters){
        // 把getter中属性定义到this.getter 
        forEach(getters,(getterName,fn)=>{
            Object.defineProperty(store.getters,getterName,{
                get:()=>{
                    // fn =>getters[getterName]
                    return fn(rootModule.state)// getter是一个函数，所以需要调用函数
                }
            })
        })
    }
    let mutations = rootModule._raw.mutations || {}// 局部mutations，没有传入就空对象
    // 把mutations中属性定义到this.mutations
    if(mutations){
        forEach(mutations,(mutationsName,fn)=>{
            // 同名函数处理
            let arr = store.mutations[mutationsName] || (store.mutations[mutationsName]=[])
            arr.push(payload => {
                fn(rootModule.state,payload)// 调用mutations fn=>mutations[mutationsName]
            })
            // store.mutations[mutationsName] = payload => {
            //     fn(rootModule.state,payload)// 调用mutations fn=>mutations[mutationsName]
            // }
        })
    }
    let actions = rootModule._raw.actions || {}// 局部actions，没有传入就空对象
    // 把actions中属性定义到this.actions
    if(actions){
        // actions存在
        // 同名函数处理 没有就初始化
        forEach(actions,(actionsName,fn)=>{
            let arr = store.actions[actionsName] || (store.actions[actionsName]=[])
            arr.push(payload => {
                fn(store,payload)// 调用actions fn=>actions[actionsName]
            })
        })
        // forEach(actions,(actionsName,fn)=>{
        //     store.actions[actionsName] = payload => {
        //         fn(store,payload)// 调用actions fn=>actions[actionsName]
        //     }
        // })
    }
    // 递归
    forEach(rootModule._children,(moduleName,module)=>{
        installModule(store,state,pathArr.concat(moduleName),module)
    })
}
// 提出forEach Object.keys
const forEach = (obj,cb)=>{
    Object.keys(obj).forEach(key =>{
        cb(key,obj[key])// 真实的函数obj[key]
    })
}
const install = (_Vue)=>{
    Vue = _Vue// vue实例
    // 每个组件都注册一个生命周期方法 beforeCreate
    Vue.mixin({
        beforeCreate() {
            // console.log(this.$options.name)// 根结点 子节点
            // 引入 store 根对象
            if(this.$options && this.$options.store){
                // 根组件
                this.$store = this.$options.store
            } else{
                // 非根结点
                this.$store = this.$parent && this.$parent.$store// 所有的组件都有store
            }
        },
    })
}

export default {
    install,Store
}

