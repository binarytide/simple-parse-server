var express = require('express')
var ParseServer = require('parse-server').ParseServer
var ParseDashboard = require("parse-dashboard")
var fs = require('fs')
var app = express()
var config = require("./env.js")

var api = new ParseServer({
  databaseURI: config.databaseURI,
  cloud: config.cloudDir,
  appId: config.appId,
  masterKey: config.masterKey,
  serverURL: config.serverURL + ':' + config.port + config.mountPath,
  liveQuery: { classNames: config.liveQueryClassNames }
})

var dashboard = new ParseDashboard({
  apps: [{
      serverURL: config.serverURL + ':' + config.port + config.mountPath,
      appId: config.appId,
      masterKey: config.masterKey,
      appName: config.appName
    }],
    users: config.users
}, true);

var mountPath = config.mountPath
app.use(mountPath, api)

var dashPath = config.dashPath
app.use(dashPath, dashboard)

app.get('/', function (req, res) {
  if(config.redirect){
    res.redirect(config.redirect)
  } else {
    res.status(200).send('Server is Live!')
  }
})

var port = config.port

if(config.pfx){
  var options = {
    pfx: fs.readFileSync(config.pfx),
    passphrase: config.passphrase
  }
  var httpServer = require('https').createServer(options, app)
} else {
  var httpServer = require('http').createServer(app)
}

httpServer.listen(port, function () {
  console.log('parse-server running on port ' + port + '.')
})

ParseServer.createLiveQueryServer(httpServer)
