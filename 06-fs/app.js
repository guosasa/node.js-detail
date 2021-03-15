const { UV_FS_O_FILEMAP } = require('constants')
const fs = require('fs')
const fsPromise = require('fs').promises
/*--------------------操作文件夹----------------*/
// 创建
/* fs.mkdir('logs',(err)=>{
  if(err)throw err
  console.log('创建成功')
}) */

//重命名
/* fs.rename('./logs','lockNew',()=>{
  console.log('修改成功')
}) */

// 删除文件夹
/* fs.rmdir('./logs',()=>{
  console.log('dele ok')
}) */
//  查询
/* fs.readdir('./logs',()=>{
  console.log('dele ok')
}) */

/* -------------文件操作--------------------*/
// 写文件
/* fs.writeFile('./lockNew/log1.log','hello\nworld',(err)=>{
  console.log('success')
}) */

// 追加内容
/* fs.appendFile('./lockNew/log1.log','!!!',()=>{
  console.log('修改成功')
}) */

// 删除文件
/* fs.unlink('./lockNew/log1.log',()=>{
  console.log('删除成功')
}) */

// 查询操作
/* fs.readFile('./lockNew/log.log','utf-8',(err,content)=>{
  console.log(content)
}) */
/* fs.readFile('./lockNew/log.log',(err,content)=>{
  console.log(content.toString())
}) */

// 同步操作
/* const content =  fs.readFileSync('./lockNew/log.log')
 */
/* ;(async()=>{
  let content  = await fsPromise.readFile('./lockNew/log.log')
  console.log(content.toString())
})() */

//批量删除文件
/* for(var i =0;i<10;i++){
  fs.unlink(`./lockNew/log${i+1}.log`,()=>{})
} */

// 批量添加文件
/* for(var i = 0;i<10;i++){
  fs.writeFile(`./lockNew/log${i+1}.txt`,`第${i+1}个文件`,()=>{

  })
} */

// 遍历文件,文件内容读取
function readFiles(file) {
  fs.readdir(file,(err,data)=>{
    data.forEach((item,index)=>{
      console.log(item)
      fs.stat(`./${file}/${item}`,(err,stat)=>{
        console.log(stat)
        if(stat.isDirectory()){
          readFiles(`./$${file}/{item}`)
        } else {
          fs.readFile(`./${file}/${item}`,(err,con)=>{
            console.log(con.toString())
          })
        }
      })
      
    })
   
  })
}
readFiles('./lockNew')