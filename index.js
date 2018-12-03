module.exports = function (options) {
  var EventEmitter = require('events')
  var express = require('express')
  
  var serveremitter = new EventEmitter()
  var app = express();
  app.use(express.static('public'));
  app.get('/', function(request, response) {
    
      response.send(`
     <head>
     <title>${options.name || 'AgentWorlds Server'}</title>
     <link rel="stylesheet" type="text/css" href="https://gitcdn.xyz/repo/pi0/clippyjs/master/assets/clippy.css">
     <link id="favicon" rel="icon" href="https://dl2.macupdate.com/images/icons128/37064.png?d=1315099598" type="image/x-icon">
     </head>
     <body>
     
     This is a AgentWorlds Server.
     
    
     
      <script>
        location.href = "https://kindhearted-tulip.glitch.me/server.html?"+location.href
     </script>
     </body>
  `);
    
});
const listener = app.listen(options.port || process.env.PORT || 3000, function() {
  console.log('Your AgentWorlds Server has been listening to port '+listener.address().port+'. enjoy your server!');
});
  var io = require('socket.io')(listener)
var roomfinder = io.of('/roomtrack')
var announcement = io.of('/announce')
var clients = []
io.on('connection',function (socket) {
  serveremitter.emit('client_connect',socket.id)
  socket.emit('server_data',options)
  var anclient = clients.push(socket.id)
  var joinedid;
   socket.on('join',function (id,agentname){
      serveremitter.emit('client_join_room',id,socket.id)
      joinedid = id;
      io.emit('room-join',id,socket.id,agentname)
      roomfinder.emit('trackroom',id)
      socket.broadcast.emit('room-ping',id,agentname)
   })
   socket.on('room-pong',function (id,agent,agentname) {
      if (joinedid !== id) return;
      socket.broadcast.emit('room-ponged',id,agent,agentname)
      
      
   })
   socket.on('speak',function (msg) {
      serveremitter.emit('client_speak',msg,socket.id)
      socket.broadcast.emit('r_speak',msg,socket.id)
   })
   socket.on('move',function (x = 12,y = 12) {
      serveremitter.emit('client_move',x,y,socket.id)
      socket.broadcast.emit('r_move',x,y,socket.id)
   })
   socket.on('pointat',function (x,y) {
      serveremitter.emit('client_pointat',x,y,socket.id)
      socket.broadcast.emit('r_pointat',x,y,socket.id)
   })
   socket.on('animate',function (anim) {
      serveremitter.emit('client_animate',anim,socket.id)
      socket.broadcast.emit('r_animate',anim,socket.id)
   })
   socket.on('disconnect',function (){
      serveremitter.emit('client_disconnect',socket.id)
      clients.pop(anclient,1)
      if (!joinedid) return;
      io.emit('room-leave',joinedid,socket.id)
   })
})

roomfinder.on('connection',function (socket){
   serveremitter.emit('client_roomfinder_ready',socket.id)
})
return {
  announce:function (message) {
     announcement.emit('new',message)
  },
  ban:function (id,reason) {
    var socket = io.to(id)
    // emit client that server bans client
    socket.emit('banned',reason || "N/A")
    socket.disconnect()
  },
  clients:clients,
  server:serveremitter
}
}
