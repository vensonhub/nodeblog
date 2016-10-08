var req = {};
req.flash = function(key,value){
    if(value){
        req[key] = value;
        if(req[key]){
            req[key].push(value);
        }else {
            req[key] = [value];
        }
    }else{
        var result = req[key];
        req[key] = [];
        return result;
    }

}

req.flash('error','失败1')
req.flash('error','失败2')
req.flash('success','成功1')

console.log(req.flash('error'));
console.log(req.flash('error'));
