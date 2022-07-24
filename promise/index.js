
let Promise = require('./promise')
// new Promise((resolve, reject) => {
//     console.log('初始化');
//     resolve();
// })
// .then(() => {
//     throw new Error('有哪里不对了');
//     console.log('执行「这个」”');
// })
// .catch(() => {
//     console.log('执行「那个」');
// })
// .then(() => {
//     console.log('执行「这个」，无论前面发生了什么');
// });
let fs = require('fs')
// const {resolve} = require('path')
let p = new Promise((resolve,reject)=>{
    fs.readFile(__dirname+'/name.txt',(err,data)=>{
        console.log('1',data.toString())
        resolve(data.toString())// 成功
        // reject(data.toString())// 失败
    })
})
let p1 = p.then(data=>{
    console.log(data)
    return new Promise((resolve,reject)=>{
        fs.readFile(__dirname+data.toString(),(err,data)=>{
            try {
                console.log('2',data.toString())
                resolve(data.toString())// 成功
            } catch (error) {
            }
        })
    },err=>{
        // 失败状态
        console.log('err',err)
    })
})
let p2 = p1.then(data=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(__dirname+data.toString(),(err,data)=>{
            console.log('3',data)
            resolve(data.toString())// 成功
        })
    })
})
p2.then(data=>{
    console.log('3',data)
})