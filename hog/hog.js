var Hog = function(contentElement) {
    var _content = contentElement;
    var _showdown = new Showdown.converter();
    var _ghfs = GHFS;

    return {
        homePage: function() {
            _ghfs.findAll('post', function(post){
                $.ajax({
                    url: post.path,
                    success: function(data) {
                        _content.append(_showdown.makeHtml(data));
                    }
                });
            });
        }
    };
};




