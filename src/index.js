import Vue from '../source/vue'

let vm = new Vue({
    el: '#app',
    data(){
        return {
            msg: '肥羊初始化没事',
            school: {name: '肥羊初始化😂', age: 20},
            arr: [1,2,[4,5],3,{name:'肥羊'}]
        }
    },
    computed: {
        schoolInfo(){
            return `名字：${this.school.name},年纪：${this.school.age}`
        }
    },
    watch: {
        // msg(newVal,oldVal){
        //     console.log(newVal,oldVal)
        // },
        msg:{
            handler(newVal,oldVal){
                console.log('watch变化了：',newVal,oldVal)
            },
            immediate:false// 是否立即执行
        }
    }
})
// console.log(vm)

setTimeout(function(){
    vm.msg = '肥羊没事111'// 测试拿到/修改this.xxx
    vm.school.name = '肥羊的工作被修改了。。。'// 测试修改对象响应式
    vm.arr[2].push('肥羊添加在数组里面了')// 测试拦截数组原生方法
    console.log('异步渲染',vm)
    console.log('computed：',vm.schoolInfo)
},6000)