var express = require('express')
var ParseServer = require('parse-server').ParseServer

var api = new ParseServer({
  databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
  cloud: __dirname + process.env.PARSE_SERVER_CLOUD_CODE_MAIN,
  appId: process.env.PARSE_SERVER_APPLICATION_ID,
  masterKey: process.env.PARSE_SERVER_MASTER_KEY,
  serverURL: process.env.PARSE_SERVER_URL,
  liveQuery: {
    classNames: []
  }
})

var app = express()
app.get('/', function (req, res) {
  res.status(200).send('Server is Live!')
})

var mountPath = process.env.PARSE_SERVER_MOUNT_PATH
app.use(mountPath, api)

var port = process.env.PORT
var httpServer = require('http').createServer(app)
httpServer.listen(port, function () {
  console.log('parse-server running on port ' + port + '.')
})

ParseServer.createLiveQueryServer(httpServer)
