var Hapi = require("hapi");
require("./lib/onramp.js");

var server = new Hapi.Server();


server.connection({
    port:7777
});



server.route({
    method:'GET',
    path:'/{name}',
    handler: function(request, reply) {
        reply.file("./web/" + request.params.name);
    }
});

server.route({
    method:'GET',
    path:'/',
    handler: function(request, reply) {
        reply.file("./web/index.html");
    }
});
server.route({
    method:'GET',
    path:'/css/{name}',
    handler: function(request, reply) {
        reply.file("./web/css/" + request.params.name);
    }
});

server.route({
    method:'GET',
    path:'/images/{name}',
    handler: function(request, reply) {
        reply.file("./web/images/" + request.params.name);
    }
});



server.start(function() {
    console.log("Started hapi server");
});
