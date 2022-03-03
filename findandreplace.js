
//fr.js - find and replace
var fs=require('fs');
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


    var r1=[
        //{'@pancakeswap-libs/uikit':'@dinoswap/uikit'},
        //{'@pancakeswap-libs/sdk':'@dinoswap/sdk'},
        {'app.dinoswap':'dinoswap'}
    ];


var files= getFiles('./src');
for (var i=0;i<files.length;i++){
    var f = files[i]
    if (f.indexOf(".tsx") >-1 || f.indexOf(".js") >-1 || f.indexOf(".ts") >-1){
        findAndReplace(f, r1);
    }

}

function findAndReplace(f, r){
    console.log("File:", f)

    for (var z=0; z<r.length;z++){
        for (var key in r[z]){
            var find = key;
            var repl = r[z][key];
            console.log("Find: " ,find," Replace: ",repl)
            find = new RegExp(find,"gi");
            console.log(find)
            var read = fs.readFileSync(f, 'utf8');
            var myreplace = read.replace(find, repl);
            fs.writeFileSync(f, myreplace, 'utf8')
        }
    }
}