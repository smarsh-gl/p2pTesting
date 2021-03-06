!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.P=e()}}(function(){return function e(t,n,r){function i(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);var p=new Error("Cannot find module '"+s+"'");throw p.code="MODULE_NOT_FOUND",p}var u=n[s]={exports:{}};t[s][0].call(u.exports,function(e){var n=t[s][1][e];return i(n?n:e)},u,u.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t){t.exports=e("./lib/P.js")},{"./lib/P.js":5}],2:[function(e,t){function n(){throw new Error("This method is not implemented")}function r(e,t,n){s.string(e),s.defined(t),this.address=e,this.peers=t,n&&(n.emitter&&(this.emitter=n.emitter),n.firewall&&(this.acceptRTCConnection=n.firewall)),this.emitter||(this.emitter=new r.Emitter)}function i(e){return"[object String]"===Object.prototype.toString.call(e)}var o=e("./JSONProtocol.js"),s=e("its"),a=e("events").EventEmitter;r.createWebRTCConnection=null,r.Emitter=a,r.prototype=Object.create(o.prototype),r.prototype.on=function(){return this.emitter.on.apply(this.emitter,arguments),this},r.prototype.removeListener=function(){return this.emitter.removeListener.apply(this.emitter,arguments),this},r.prototype.send=o.prototype.writeMessage,r.prototype.getPeer=function(e){return this.peers.get(e)},r.prototype.addPeer=function(e){return this.peers.add(e)},r.prototype.getPeers=function(){return this.peers.get()},r.prototype.connect=function(e){i(e)&&(e={address:e});var t=this,n=e.firewall||this.firewall,o=r.createWebRTCConnection(e,this.peers,this,{firewall:n});return o.writeOffer(e),this.peers.add(o),o.on("close",function(){t.peers.remove(o),t.emitter.emit("disconnection",o)}),this.emitter.emit("connection",o),o},r.prototype.readMessage=function(e){this.emitter.emit("message",e)},r.prototype.readArrayBuffer=function(e){this.emitter.emit("arraybuffer",e)},r.prototype.acceptRTCConnection=function(){return!0},r.prototype.readRelay=function(e,t){var n=this.getPeer(e);return n?void n.writeRelayedMessage(this.address,t):void this.emitter.emit("error",new Error("Unknown peer at address: "+e))},r.prototype.readRelayedIceCandidate=function(e,t){var n=this.getPeer(e);return n?void n.readIceCandidate(t):void this.emitter.emit("error",new Error("Unknown peer at address: "+e))},r.prototype.readRelayedOffer=function(e,t,n){if(!this.acceptRTCConnection(t,n))return!1;var i=this,o=r.createWebRTCConnection({address:e},this.peers,this,{firewall:this.firewall});this.addPeer(o),o.on("close",function(){i.peers.remove(o),i.emitter.emit("disconnection",o)}),o.readOffer(t),o.writeAnswer(),this.emitter.emit("connection",o)},r.prototype.readRelayedAnswer=function(e,t){var n=this.getPeer(e);return n?void n.readAnswer(t):void this.emitter.emit("error",new Error("Unknown peer at address: "+e))},r.prototype.close=n,r.prototype.getReadyState=n,r.prototype.isOpen=function(){return"open"===this.getReadyState()},t.exports=r},{"./JSONProtocol.js":4,events:8,its:9}],3:[function(e,t){function n(){}function r(){this.connectionMap={},this.connectionList=[]}var i=e("its");r.prototype.get=function(e){return void 0===e?this.connectionList.slice():this.connectionMap[e]},r.prototype.add=function(e){i.defined(e);var t=e.address;return i.string(t),t in this.connectionMap?!1:(this.connectionMap[t]=e,this.connectionList.push(e),this.onAdd(e),!0)},r.prototype.onAdd=n,r.prototype.remove=function(e){i.defined(e);var t=e.address;i.string(t);var n=this.connectionMap[t];if(!n||n!==e)return!1;delete this.connectionMap[t];var r=this.connectionList.indexOf(e);return this.connectionList.splice(r,1),this.onRemove(e),!0},r.prototype.onRemove=n,t.exports=r},{its:9}],4:[function(e,t){function n(){throw new Error("This method is not implemented")}function r(){}r.prototype.PROTOCOL_NAME="p",r.prototype.MESSAGE_TYPE={DIRECT:0,RTC_OFFER:3,RTC_ANSWER:4,RTC_ICE_CANDIDATE:5,RELAY:6,RELAYED:7},r.prototype.readRaw=function(e){e instanceof ArrayBuffer?this.readArrayBuffer(e):this.readProtocolMessage(JSON.parse(e))},r.prototype.readProtocolMessage=function(e){var t=this.MESSAGE_TYPE,n=e[0];switch(n){case t.DIRECT:this.readMessage(e[1]);break;case t.RELAYED:this.readRelayedMessage(e[1],e[2]);break;case t.RELAY:this.readRelay(e[1],e[2]);break;default:throw new Error("Unknown message type: "+n)}},r.prototype.readRelayedMessage=function(e,t){var n=this.MESSAGE_TYPE,r=t[0];switch(r){case n.RTC_OFFER:this.readRelayedOffer(e,t[1],t[2]);break;case n.RTC_ANSWER:this.readRelayedAnswer(e,t[1]);break;case n.RTC_ICE_CANDIDATE:this.readRelayedIceCandidate(e,t[1]);break;default:throw new Error("Unknown message type: "+r)}},r.prototype.readMessage=n,r.prototype.readArrayBuffer=n,r.prototype.readRelay=n,r.prototype.readRelayedOffer=n,r.prototype.readRelayedAnswer=n,r.prototype.readRelayedIceCandidate=n,r.prototype.writeRaw=n,r.prototype.writeProtocolMessage=function(e){var t=JSON.stringify(e);this.writeRaw(t)},r.prototype.writeMessage=function(e){e instanceof ArrayBuffer?this.writeRaw(e):this.writeStringMessage(e)},r.prototype.writeStringMessage=function(e){this.writeProtocolMessage([this.MESSAGE_TYPE.DIRECT,e])},r.prototype.writeRelayedMessage=function(e,t){this.writeProtocolMessage([this.MESSAGE_TYPE.RELAYED,e,t])},r.prototype.writeRelayMessage=function(e,t){this.writeProtocolMessage([this.MESSAGE_TYPE.RELAY,e,t])},r.prototype.writeRelayAnswer=function(e,t){this.writeRelayMessage(e,[this.MESSAGE_TYPE.RTC_ANSWER,t])},r.prototype.writeRelayIceCandidate=function(e,t){this.writeRelayMessage(e,[this.MESSAGE_TYPE.RTC_ICE_CANDIDATE,t])},r.prototype.writeRelayOffer=function(e,t,n){this.writeRelayMessage(e,[this.MESSAGE_TYPE.RTC_OFFER,t,n])},t.exports=r},{}],5:[function(e,t){function n(e,t,n){s.defined(e),s.defined(t),this.emitter=e,this.peers=t,this.peers.onAdd=function(t){e.emit("connection",t)},this.peers.onRemove=function(t){e.emit("disconnection",t)},n&&n.firewall&&(this.firewall=n.firewall)}var r=e("events").EventEmitter,i=e("./ConnectionManager.js"),o=e("./WebSocketConnection.js"),s=e("its");e("./WebRtcConnection"),n.create=function(e){var t=new r,o=new i;return new n(t,o,e)},n.prototype.getPeers=function(){return this.peers.get()},n.prototype.connect=function(e){s.string(e);var t=this.peers,n=o.create(e,this.peers,{firewall:this.firewall});return t.add(n),n.on("close",function(){t.remove(n)}),n},n.prototype.on=function(){return this.emitter.on.apply(this.emitter,arguments),this},n.prototype.removeListener=function(){return this.emitter.removeListener.apply(this.emitter,arguments),this},t.exports=n},{"./ConnectionManager.js":3,"./WebRtcConnection":6,"./WebSocketConnection.js":7,events:8,its:9}],6:[function(e,t){function n(e,t,n,o,s){var a=this;i.string(e),i.defined(t),i.defined(n),i.defined(o),r.call(this,e,t,s),this.signalingChannel=o,this.rtcConnection=n,this.rtcDataChannel=n.createDataChannel(this.PROTOCOL_NAME,{protocol:this.PROTOCOL_NAME}),this._initialRtcDataChannel=this.rtcDataChannel,this.close=n.close.bind(n),this.rtcConnection.addEventListener("icecandidate",function(t){t.candidate&&(c("ice candidate",t,a),a.signalingChannel.writeRelayIceCandidate(e,t.candidate))}),this.rtcConnection.addEventListener("datachannel",function(e){c("datachannel",e,a);var t=a.rtcDataChannel=e.channel;t.addEventListener("open",function(e){c("remote datachannel open",e,a),a.emitter.emit("open",e)}),t.addEventListener("close",function(e){c("remote datachannel close",e,a),a.emitter.emit("close",e)}),t.addEventListener("error",function(e){c("remote datachannel error",e,a),a.emitter.emit("error",e)})}),this.rtcDataChannel.addEventListener("message",function(e){c("local datachannel message",e,a),a.readRaw(e.data)}),this.rtcDataChannel.addEventListener("error",function(e){c("local datachannel error",e,a),a.emitter.emit("error",e)}),this.rtcDataChannel.addEventListener("close",function(e){c("local datachannel close",e,a),a.emitter.emit("close",e)})}var r=e("./Connection.js"),i=e("its"),o="undefined"!=typeof RTCPeerConnection?RTCPeerConnection:"undefined"!=typeof webkitRTCPeerConnection?webkitRTCPeerConnection:"undefined"!=typeof mozRTCPeerConnection?mozRTCPeerConnection:void 0,s="undefined"!=typeof RTCSessionDescription?RTCSessionDescription:"undefined"!=typeof mozRTCSessionDescription?mozRTCSessionDescription:void 0,a="undefined"!=typeof RTCIceCandidate?RTCIceCandidate:"undefined"!=typeof mozRTCIceCandidate?mozRTCIceCandidate:void 0,c=function(){};"undefined"!=typeof window&&window.P_DEBUGGING_ENABLED&&(c=function(e,t,n){window.console.debug(e,t,n)});var p=null,u={offerToReceiveAudio:!1,offerToReceiveVideo:!1,iceRestart:!1};n.create=function(e,t,r,i){var s=e.rtcConfiguration||p,a=new o(s);return new n(e.address,t,a,r,i)},n.prototype=Object.create(r.prototype),n.prototype.writeRaw=function(e){switch(this.rtcDataChannel.readyState){case"connecting":throw new Error("Can't send a message while RTCDataChannel connecting");case"open":this.rtcDataChannel.send(e),c("sent message to remote",e,this);break;case"closing":case"closed":throw new Error("Can't send a message while RTCDataChannel is closing or closed")}},n.prototype.readAnswer=function(e){var t=new s(e);this.rtcConnection.setRemoteDescription(t)},n.prototype.readOffer=function(e){var t=new s(e);this.rtcConnection.setRemoteDescription(t)},n.prototype.readIceCandidate=function(e){this.rtcConnection.addIceCandidate(new a(e))},n.prototype.writeAnswer=function(){function e(e){t.emit("error",e)}var t=this.emitter,n=this.address,r=this.rtcConnection,i=this.signalingChannel;r.createAnswer(function(t){r.setLocalDescription(t,function(){i.writeRelayAnswer(n,t)},e)},e)},n.prototype.writeOffer=function(e){function t(e){n.emit("error",e)}var n=this.emitter,r=this.address,i=this.rtcConnection,o=this.signalingChannel;i.createOffer(function(n){i.setLocalDescription(n,function(){o.writeRelayOffer(r,n,e.offerData)},t)},t,e.rtcOfferOptions||u)},n.prototype.getReadyState=function(){return this.rtcDataChannel.readyState},r.createWebRTCConnection=n.create,t.exports=n},{"./Connection.js":2,its:9}],7:[function(e,t){function n(e,t,n,i){var o=this;r.call(this,e,t,i),this.webSocket=n,this.close=n.close.bind(n),this.webSocket.addEventListener("message",function(e){o.readRaw(e.data)}),this.webSocket.addEventListener("open",function(e){o.emitter.emit("open",e)}),this.webSocket.addEventListener("error",function(e){o.emitter.emit("error",e)}),this.webSocket.addEventListener("close",function(e){o.emitter.emit("close",e)})}var r=e("./Connection.js"),i={CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3};"undefined"!=typeof WebSocket&&(i=WebSocket),n.create=function(e,t,r){var i=new WebSocket(e,n.prototype.PROTOCOL_NAME);return new n(e,t,i,r)},n.prototype=Object.create(r.prototype),n.prototype.writeRaw=function(e){switch(this.webSocket.readyState){case i.CONNECTING:throw new Error("Can't send a message while WebSocket connecting");case i.OPEN:this.webSocket.send(e);break;case i.CLOSING:case i.CLOSED:throw new Error("Can't send a message while WebSocket is closing or closed")}},n.prototype.getReadyState=function(){switch(this.webSocket.readyState){case i.CONNECTING:return"connecting";case i.OPEN:return"open";case i.CLOSING:return"closing";case i.CLOSED:return"closed"}},t.exports=n},{"./Connection.js":2}],8:[function(e,t){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function r(e){return"function"==typeof e}function i(e){return"number"==typeof e}function o(e){return"object"==typeof e&&null!==e}function s(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!i(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,n,i,a,c,p;if(this._events||(this._events={}),"error"===e&&(!this._events.error||o(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[e],s(n))return!1;if(r(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:for(i=arguments.length,a=new Array(i-1),c=1;i>c;c++)a[c-1]=arguments[c];n.apply(this,a)}else if(o(n)){for(i=arguments.length,a=new Array(i-1),c=1;i>c;c++)a[c-1]=arguments[c];for(p=n.slice(),i=p.length,c=0;i>c;c++)p[c].apply(this,a)}return!0},n.prototype.addListener=function(e,t){var i;if(!r(t))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,r(t.listener)?t.listener:t),this._events[e]?o(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,o(this._events[e])&&!this._events[e].warned){var i;i=s(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,i&&i>0&&this._events[e].length>i&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())}return this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function n(){this.removeListener(e,n),i||(i=!0,t.apply(this,arguments))}if(!r(t))throw TypeError("listener must be a function");var i=!1;return n.listener=t,this.on(e,n),this},n.prototype.removeListener=function(e,t){var n,i,s,a;if(!r(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],s=n.length,i=-1,n===t||r(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(o(n)){for(a=s;a-->0;)if(n[a]===t||n[a].listener&&n[a].listener===t){i=a;break}if(0>i)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(i,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],r(n))this.removeListener(e,n);else for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?r(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.listenerCount=function(e,t){var n;return n=e._events&&e._events[t]?r(e._events[t])?1:e._events[t].length:0}},{}],9:[function(e,t){t.exports=e("./lib/its.js")},{"./lib/its.js":10}],10:[function(e,t){var n=Array.prototype.slice,r=Object.prototype.toString,i=/%s/,o=function(e,t){for(var n=[],r=e.split(i),o=0,s=r.length;s>o;o++)n.push(r[o]),n.push(t[o]);return n.join("")},s=t.exports=function(e,t){if(e===!1)throw t&&"string"!=typeof t?t(arguments.length>3?o(arguments[2],n.call(arguments,3)):arguments[2]):new Error(arguments.length>2?o(t,n.call(arguments,2)):t);return e};s.type=function(e,t){if(e===!1)throw new TypeError(arguments.length>2?o(t,n.call(arguments,2)):t);return e},s.undefined=function(e){return s.type.apply(null,[void 0===e].concat(n.call(arguments,1)))},s["null"]=function(e){return s.type.apply(null,[null===e].concat(n.call(arguments,1)))},s["boolean"]=function(e){return s.type.apply(null,[e===!0||e===!1||"[object Boolean]"===r.call(e)].concat(n.call(arguments,1)))},s.array=function(e){return s.type.apply(null,["[object Array]"===r.call(e)].concat(n.call(arguments,1)))},s.object=function(e){return s.type.apply(null,[e===Object(e)].concat(n.call(arguments,1)))},function(){for(var e=[["args","Arguments"],["func","Function"],["string","String"],["number","Number"],["date","Date"],["regexp","RegExp"]],t=0,i=e.length;i>t;t++)!function(){var i=e[t];s[i[0]]=function(e){return s.type.apply(null,[r.call(e)==="[object "+i[1]+"]"].concat(n.call(arguments,1)))}}()}(),"function"!=typeof/./&&(s.func=function(e){return s.type.apply(null,["function"==typeof e].concat(n.call(arguments,1)))}),s.defined=function(e,t){if(void 0===e)throw new ReferenceError(arguments.length>2?o(t,n.call(arguments,2)):t);return e},s.range=function(e,t){if(e===!1)throw new RangeError(arguments.length>2?o(t,n.call(arguments,2)):t);return e}},{}]},{},[1])(1)});

(function() {
    function App() {}

    App.prototype.start = function() {
        this.Con = new Con(this);
        this.bindThings();
    };


    App.prototype.addNewUser = function(newUserAddress) {
        new User(newUserAddress);
    };


    App.prototype.bindThings = function() {
        var self = this;
        $('.chat-send').on('keydown', function(e) {
            if(e.keyCode == 13) {
                self.send($(this).val());
            }
        });
    };


    App.prototype.send = function(message) {
        this.Con.sendMessage(message);
        $('.chat-send').val('');
    };


    window.App = App;
})();




$(function() {
  var app =  new App();
    app.start();
});
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
(function($) {
    function User(ID) {
        this.initialize(ID);
    }

    User.prototype.initialize = function(ID) {

        this.id = ID;

        var userObj = $('.user-template');
        var userParent = $('.user-list');

        var newUserObj = userObj.clone();
        newUserObj.removeClass("user-template");
        newUserObj.children("h5").text(ID);


        userParent.append(newUserObj);

    };



    window.User = User;

})(jQuery);