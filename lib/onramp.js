var Onramp = require('onramp');

// Create a default onramp instance at localhost:20500
var onramp = Onramp.create();

// Whenever a connection is established, tell it about all the
// other connections available, and then broadcast its connection
// id to the rest of the connections so everyone always
// knows who is connected to the onramp
onramp.on("connection", function(connection){
    console.log(connection);
    onramp.connections.forEach(function(other){
        // Don't send a connection its own id
        if(other === connection) return;

        connection.send(other.address);
        other.send(connection.address);
    });
});