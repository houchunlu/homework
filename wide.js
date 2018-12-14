const fs = require('fs');
const path = require('path')
// const {promisify} = require('util');

// const statAsync = promisify(fs.stat);
// const readdirAsync  = promisify(fs.readdir);
// const unlinkAsync  = promisify(fs.unlink);
// const rmdirAsync  = promisify(fs.rmdir);
// ///async + await
// let {promisify} = require("util");
// let stat = promisify(fs.stat);
// let readdir = promisify(fs.readdir);
// let unlink = promisify(fs.unlink);
// let rmdir = promisify(fs.rmdir);
// async function wideRmdir(p){
//     let arr = [p];
//     let index = 0;
//     let current;
//     while(current = arr[index++]){
//         let statObj = await stat(current)
//         if(statObj.isDirectory()){
//             let dirs = await readdir(current);
//             dirs = dirs.map(dir => path.join(current,dir));
//             arr = [...arr,...dirs]  
//         }
//     }
//     for(let i = arr.length-1;i>=0;i--){
//         let objStat =await stat(arr[i]);
//         if(objStat.isDirectory()){
//             await rmdir(arr[i])
//         }else{
//             await unlink(arr[i])
//         }
//     }
// }
// wideRmdir('a').then(data=>{
//     console.log("删除完毕")
// });

// 异步
function wideRmdir(p,cb){
    fs.stat(p,function(err,statObj){
        if(statObj.isDirectory()){
            fs.readdir(p,(dirs)=>{
                dirs = dirs.map((dir)=>{return path.join(p,dir)});
                arr = [...arr,...dirs];  
            })
            
            //let index = 0;
            function next(){
                for(let i = arr.length-1;i>=0;i--){
                    let curObj = arr[i];
                    fs.rmdirSync(curObj);
                }
            }
            next();
        }else {

        }
    })
}
wideRmdir('a');


