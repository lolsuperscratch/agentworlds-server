# AgentWorlds Server
![Bulid Status](https://travis-ci.com/lolsuperscratch/agentworlds-server.svg)<br>
AgentWorlds Server will help you to make your server online and you'ill be redirected to agentworlds server page. and verify that server is working.

# Usage
```js
   var agentserver = require('agentworlds-server')({
   // client connected will emit an 'server_data' to your options
      name:"My AgentWorlds Server",
      port:process.env.PORT || 3000
   })
   // send into console
   // todo: let your client have a admin permissions.
   agentserver.server.on('client_speak',function (msg,id) {
      if (msg.indexOf('http://') > -1) {
         // ban if client is sharing to others to connect
         agentserver.ban(id,"Sharing")
      }
      if (msg.indexOf('https://') > -1) {
         // ban if client is sharing to others to connect
         agentserver.ban(id,"Sharing")
      }
      console.log(`[Client ${id}] said: ${msg}`)
   })
   agentserver.server.on('client_animate',function (anim,id) {
      console.log(`[Client ${id}] animated: ${anim}`)
   })
   agentserver.server.on('client_pointat',function (x,y,id) {
      console.log(`[Client ${id}] pointed at: ${x} ${y}`)
   })
   agentserver.server.on('client_move',function (x,y,id) {
      console.log(`[Client ${id}] moved: ${x} ${y}`)
   })
   agentserver.server.on('client_disconnect',function (id) {
      console.log(`[Client ${id}] disconnected`)
   })
   agentserver.server.on('client_connect',function (id) {
      console.log(`[Client ${id}] connected`)
   })
   agentserver.server.on('client_join_room',function (roomid,id) {
      console.log(`[Client ${id}] joined room: ${roomid}`)
   })
```
