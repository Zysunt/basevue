// 提取{{cxx}}并替换
export function compiler({childNodes} ,vm){
    // if(childN÷odes.length>0)
    [...childNodes].forEach(child=>{
        // 1.元素节点 3.文本 11.DocumentFragment节点 9.Document节点。
        if(child.nodeType===1){// 如果是node元素 递归找文本
            compiler(child,vm)
        } else if(child.nodeType===3){
            // {{xxx}}文本替换
            util.compilerText(child,vm)
        }
    })
}
const re =/\{\{((?:.|\r?\n)+?)}\}/g// ?： 匹配不捕获
export const util = {
    getValue(vm,expr){
        // 根据对象的层次，拿到对应的数据
        let keys = expr.split('.')// expr = vm.o1.o2.o3.o4.msg keys= ['vm', 'o1', 'o2', 'o3', 'o4', 'msg']
        return keys.reduce((total,cur)=>{
            total = total[cur]
            return total// 从vm.o1最终拿到msg
        },vm)
    },
    compilerText(node,vm){
        if(!node.expr){
            node.expr = node.textContent// 拿到{{xxx}}
        }
        node.textContent = node.expr.replace(re,function(...args){
            // 将页面[object Object]序列化
            return JSON.stringify(util.getValue(vm,args[1]))
            // return util.getValue(vm,args[1])// '{{vm.xxx}}'.match(re) args[1]=vm.xxx
        })
        // node.textContent = node.textContent.replace(re,function(...args){
        //     console.log(util.getValue(vm,args[1]))
        //     return util.getValue(vm,args[1])// '{{vm.xxx}}'.match(re) args[1]=vm.xxx
        // })
    }
}