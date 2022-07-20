import Vue from 'vue'
import Vuex from './vuex'
Vue.use(Vuex)// 安装插件
// 每个vue实例都有一个¥store属性
export default new Vuex.Store({
    state:{
        num:1
    },
    getters:{
        getNum(state){
            return state.num
        }
    },
    mutations:{
        syncAdd(state,payload){
            // payload 传入的参数
            state.num += payload
        },
        syncMinus(state,payload){
            state.num -= payload
        },
    },
    actions:{
        // 异步
        asyncAdd({commit,dispatch},payload){
            setTimeout(()=>{
                commit('syncAdd',payload)
            },100)
        }
    },
    modules:{
        it:{
            state:{
                count:20
            },
            getters:{
                
            }
        }
    }
})

