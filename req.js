let path = require('path');
let fs = require("fs");
let vm = require("vm");


function Module(id){
    this.id = id;
    this.exports={};
}
Module._cache = Object.create(null);


Module._extensions = {
'.js'(module){
    let content = fs.readFileSync(module.id,'utf8');
        let fnStr = Module.wrap(content);
        let fn = vm.runInThisContext(fnStr);
        fn.call(module.exports,module,req,module)
},
'.json'(module){
    module.exports = JSON.parse(fs.readFileSync(module.id,'utf8'));
}
}

Module.wrap = function (script) {
    return `(function (exports, require, module, __filename, __dirname) {
        ${script}
    })`
}
Module._resolveFileName = function(realPath){
    let r= path.resolve(__dirname,realPath);
    if(!path.extname(r)){
        let extnames = Object.keys(Module._extensions);
        console.log
        for(let i = 0;i<extnames.length;i++){
            let p = r+'.'+extnames[i];
            try{
                fs.accessSync(p);
                return p;
            }catch(e){

            }
                console.log(p)
            }
        
    
    }else {
        return r;
    }
    console.log(r)
}

Module._load = function(filename){
    let absPath = Module._resolveFileName(filename);
    var cachedModule = Module._cache[absPath];
    if (cachedModule) {
      return cachedModule.exports;
    }

    let module = new Module(absPath);
    Module._cache[absPath] = module;
    let ext = path.extname(module.id);
    Module._extensions[ext](module); 
    return module.exports;

}


function req(moduleId){
    return Module._load(moduleId);
}

let a = req("./a.json");
let a1 = req("./a.json");
console.log(a);