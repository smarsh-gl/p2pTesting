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