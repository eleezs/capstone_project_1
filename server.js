const http = require('http');
const os = require('os')
const fs = require('fs')
const url = require('url')

const port = 3000;

const server = http.createServer((req, res) => {

  let parsedUrl = url.parse(req.url, true)

  // stripping the forward slashes at beginning and end
  let path = parsedUrl.path.replace(/^\/+|\/+$/g, "")

  if(path == ""){
    path = "index.html"
  }
  console.log(`Requested path: ${path} `)
  let file = __dirname + "/pages/" + path;
  
  fs.readFile(file, (err, content) => {
    if(err) {
      console.log(`File Not Found ${file}`)
      res.writeHead(404, {"Content-Type": "text/html" })
      res.write('404.html')
      // res.end("pages/404.html")
    }
    else if(path == "about.html"){
      res.writeHead(200, {"Content-Type": "text/html" })
    }

    else if(path == "sys"){
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

    else if(path == "index.html"){
      res.writeHead(200, "Content-Type", "text/html")
    }
    res.end(content)
  })
})


server.listen(port, () => {
  console.log(`App is Listening on ${port}`)
})