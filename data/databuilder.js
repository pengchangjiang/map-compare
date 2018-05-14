const turf = require('../turf/turf.min.js');
const fs = require('fs');
const basePath = 'data/';
const pathExt = 'points.json';
// const countArr = [500,100,50,20];
const countArr = [5000,10000,15000,20000];

countArr.forEach(count=>{
    var randomPoints = turf.randomPoint(count, {bbox: [-90, -180, 90, 180]});
    let path = basePath+count+pathExt;
    fs.writeFile(path,JSON.stringify(randomPoints),function(err){
        if(err){
            console.log(err);
        }else{
            console.log(count,"写入成功!");
        }
    });
});


//判断文件是否存在JSON.stringify(randomPoints)
// if(fs.exists(pointsPath)){
    // fs.writeFile(pointsPath,"hjhjhk");
// }else{
    // console.log('不存在')
// }