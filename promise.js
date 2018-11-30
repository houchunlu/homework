class Promise{
    constructor(executor){
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallback = [];
        this.onRejectedCallback = [];

        let resolve = (value)=>{
            if(Object.is(this.status, 'pending')){
                this.status = 'fulfilled';
                this.value = value;
                this.onResolvedCallback.forEach((fn)=>{
                    fn();
                });
            }
        }

        let reject = (reason)=>{
            if(Object.is(this.status,'pending')){
                this.status = "rejected";
                this.reason = reason;
                this.onRejectedCallback.forEach((fn)=>{
                    fn();
                });
            }
        }

        try{
            executor(resolve,reject);
        }catch(e){
            reject(e);
        }

    }
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data=>data;
        onRejected = typeof onRejected === 'function' ? onRejected : (err)=>{throw err}
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(Object.is(this.status,'fulfilled')){
                setTimeout(()=>{
                    try{
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if(Object.is(this.status,'rejected')){
                setTimeout(()=>{
                    try{
                        let x = onRejected(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                },0);
            }
            if(Object.is(this.status,'pending')){
                self.onResolvedCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    });
                });
                self.onRejectedCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onRejected(this.reason);
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    });
                });
            }
        })
        return promise2
    }
    catch(onRejected){
        return this.then(null,onRejected)
    }
    finally(cb){
        return this.then((data)=>{
            cb();
            return data;
        },(reason)=>{
            cb();
            throw reason;
        });
    }
    static reject(reason){
        return new Promise((reject)=>{
            reject(reason)
        });
    }
    static resolve(value){
        return new Promise((resolve)=>{
            resolve(value);
        })
    }
    static all(promises){
        return new Promise((resolve,reject)=>{
            let arr = [];
            let i = 0;
            let processData = (index,data)=>{
                arr[index] = data;
                if(Object.is(++i,promises.length)){
                    resolve(arr);
                }
            }
            for(let i = 0;i<promises.length;i++){
                let promise = promises[i];
                if(typeof promise.then === 'function'){
                    promise.then((value)=>{
                        processData(i,value)
                    });
                }else {
                    processData(i,promise);
                }
            }
        });
    }
}
let resolvePromise = (promise2,x,resolve,reject)=>{
    if(promise2 === x){
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    let called;
    if((x!=null && typeof x === 'object') || typeof x === 'function'){
        try{
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,(y)=>{
                    if(!called){
                        called = true;
                    }  else {
                        return;
                    }  
                    resolvePromise(x,y,resolve,reject);
                },(r)=>{
                    reject(r);
                })
            }else {
                resolve(x);
            }
        }catch(e){
            reject(e);
        }
    }else {
        resolve(x);
    }
}
module.exports=Promise;
