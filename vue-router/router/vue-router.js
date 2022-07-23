
/**
 * 1.在VueRouter中创建$router(当前路由实例) $route（当前路由）
 * 2.初始化页面模式mode history和hash
 * 3.根据routes创建路由表 path -> compunent
 * 4.根据router-link展示路由路径
 * 5.根据router-view去选择对应path的componuet
 * vuerouter 路由实例 
 * 每个组件都有$router(当前路由实例) $route（当前路由）
 * <router-link> path
 * <router-view> componuet
 */
// 记录当前页面url的状态
class HistoryRoute{
    constructor() {
        this.current = null// 存储当前路由状态
    }
}
class VueRouter{
    constructor(options) {
        // mode 模式
        this.mode = options.mode || 'hash'// 默认hash
        this.routes = options.routes || []// 路由
        // 根据routes创建路由表{'/home':Home,'/tab':Tab}
        this.routesMap = this.createRoutesMap(this.routes)

        this.history = new HistoryRoute()
        // 初始化
        this.init()
    }
    init(){
        // 对页面mode监听
        if(this.mode ==='hash'){
            location.hash ? '' : location.hash = '/'// hash的默认值 /
            // hash的路由监听
            // 记录当前页面url的状态
            window.addEventListener('load',()=>{
                this.history.current = location.hash.slice(1)// 去掉#

            })
            window.addEventListener('hashchange',()=>{
                this.history.current = location.hash.slice(1)// 去掉#
            })
        }else{
            // history模式
            location.pathname ? '' : location.pathname = '/'
            // 记录当前页面url的状态
            window.addEventListener('load',()=>{
                this.history.current = location.pathname
            })
            window.addEventListener('popstate',()=>{
                this.history.current = location.pathname
            })
        }
    }
    // 创建路由表 多层嵌套 reduce 根到子
    createRoutesMap(routers){
        //{'/home':Home,'/tab':Tab} 累加找到所有的路由
        return routers.reduce((obj,current)=>{
            obj[current.path] = current.component
            return obj
        },{})
    }
}
// 安装插件 Vue.use()
VueRouter.install = function(Vue,opts){
    // 通过Vue.mixin所有组件添加beforeCreate 再添加$router
    Vue.mixin({
        beforeCreate() {
            console.log(this.$options)
            // 给所有组件添加私有属性_root,_router,随时可以访问路由实例router，route
            if(this.$options && this.$options.router){// 根
                this._root = this// 将当前实例挂在_root
                this._router = this.$options.router// 当前路由实例
                // history中current变化，触发刷新视图 dep--watcher 不然拿不到当前history
                Vue.util.defineReactive(this,'',this._router.history)
            }else{// 子
                this._root = this.$parent._root
            }
            // $router 路由实例
            Object.defineProperty(this,'$router',{
                get(){
                    return this._root.router
                }
            })
            // 当前路由 $route
            Object.defineProperty(this,'$route',{
                get(){
                    return this._root._router.history.current
                }
            })
        }
    })
    // <router-link> path 全局注入router-link组件去展示路由路径
    Vue.component('router-link',{
        props:{
            to:String,
            default:''
        },
        render(h) {
            let {mode} = this._self._root._router// hash模式就加#
            return <a href={mode==='hash' ? `#${this.to}` : this.to}>
                {this.$slots.default}
            </a>
        },
    })
    // <router-view> componuet 全局注入router-view组件去展示路由页面
    Vue.component('router-view',{
        render(h) {
            // 找到当前路由
            let { current } = this._self._root._router.history
            let _routesMap = this._self._root._router.routesMap// 路由实例
            let currentComp = _routesMap[current]// 当前路由name对应的组件
            return h(currentComp)
        },
    })
}
export default VueRouter