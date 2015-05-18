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