(function(P) {
    function Con(App) {
        this.App = App;
        this.onrampServerAddress = 'ws://' + location.hostname + ':20500/';
        this.P = new P.create();
        this.connect();

    }



    Con.prototype.connect = function() {
        var self = this;
        this.onramp = this.P.connect(this.onrampServerAddress);



        this.onramp.on("on", this.onConnection);
        this.onramp.on('message', function(userAddress) {
            console.log("MESSAGE: " + userAddress)
            self.onMessage(userAddress);
        });

    };


    Con.prototype._getPeerList = function() {
        return this.peer.peers.connectionList;
    };

    Con.prototype.sendMessage = function(message) {
        window.peer = this.peer;
        this.peer.send(message);
    };


    Con.prototype.bindPeerCallbacks = function() {
        console.log("binding peer events");
        this.peer.on("message", function(message) {
            console.log(message);
        });
    };

    Con.prototype.onConnection = function(peer) {
        console.log(peer);
    };

    Con.prototype.onMessage = function(peerAddress) {
        this.peer = this.onramp.connect({ address: peerAddress, offerData: "Hi!" });
        this.App.addNewUser(peerAddress);
        this.bindPeerCallbacks();
    };


    window.Con = Con;

})(P);