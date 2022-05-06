const http = require('http');
const os = require('os')
const fs = require('fs')
const url = require('url')
const path = require('path')

const port = 3000;

const server = http.createServer((req, res) => {

  let parsedUrl = url.parse(req.url, true)

  // stripping the forward slashes at beginning and end
  let pathToFile = parsedUrl.path.replace(/^\/+|\/+$/g, "")

  let file;

  if(pathToFile == ""){
    path = "index.html"
  }
  if(pathToFile == "sys"){
    let osInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      architecture: os.arch(),
      numberOfCPUS: os.cpus(),
      networkInterfaces: os.networkInterfaces(),
      uptime: os.uptime()
    }
    let osInfo1 = JSON.stringify(osInfo)
    fs.writeFile('osinfo.json', osInfo1, (err) => {
      if(err){
       return console.log('An error Occured')
      }
      console.log('File saved')
    })
  
    res.writeHead(201, {"Content-Type": "text/plain"})
    res.end('Your OS info has been saved successfully')
  }
  else{
    file = __dirname + "/pages/" + pathToFile;
  }
  console.log(`Requested path: ${pathToFile} `)
  
  
  fs.readFile(file, (err, content) => {
    if(pathToFile == "about.html"){
      res.writeHead(200, {"Content-Type": "text/html" })
    }
    
    else if(pathToFile == "index.html"){
      res.writeHead(200, "Content-Type", "text/html")
    }

    else{
      if(err){ 
        // throw new Error(err)
        console.log(`File Not Found ${file}`)
        let newFile = __dirname + "/pages/" + "404.html";
        console.log(newFile)
        fs.readFile(newFile, (err, data) =>{
          if(err) throw new Error(err)
          res.writeHead(404, {"Content-Type": "text/html"})
          return res.write(data)
          // res.end()
        })
      }
    }
    res.end(content)
  })

})


server.listen(port, () => {
  console.log(`App is Listening on ${port}`)
})