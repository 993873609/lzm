//加载文件系统
const fs = require("fs");
//加载雪碧图组件
const Spritesmith = require('spritesmith');

//读取目录
var frame_dir = 'project/';
let dir_list = fs.readdirSync(frame_dir);
let frame_pic_dir_list = [];
dir_list.forEach(dir => {
  const path = frame_dir + dir;
  const stat = fs.statSync(path);
  if (stat && stat.isDirectory()) {
    frame_pic_dir_list.push({
      name: dir,
      path: path
    });
  }
});

//循环生成帧动画图片并输出
frame_pic_dir_list.forEach(dir_item => {
  const sprites = fs.readdirSync(dir_item.path);
  let sprites_path = [];
  sprites.forEach(sprite_file => {
    sprites_path.push(dir_item.path + '/' + sprite_file);
  });
  Spritesmith.run({ src: sprites_path,padding:0,algorithm:"left-right", algorithmOpts: {sort: false} }, (err, run_rs) => {
    console.log(dir_item.name + '.png');
    fs.writeFileSync(dir_item.path + '.png',run_rs.image,()=>{});
  });
});