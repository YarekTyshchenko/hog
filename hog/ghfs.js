// Github filesystem (of sorts)

GHFS = (function() {
    var _gh_path = 'https://api.github.com/repos/yarekt/yarekt.github.com/contents/';
    var _gh = (function() {
        return {
            list: function(path, callback) {
                $.ajax({
                    url: _gh_path + path,
                    success: function(data){
                        list = [];
                        $.each(data, function(key, object) {
                            list.push({
                                key: key,
                                name: object.name,
                                path: object.path
                            });
                        });
                        callback(list);
                    }
                });
            },
            rateLimit: function(callback) {
                $.ajax({
                    url: 'https://api.github.com/rate_limit',
                    success: function(data) {
                        callback(data.rate);
                    }
                });
            }
        };
    })();

    var _store = (function(){
        if (!localStorage.ghfs) {
            localStorage.ghfs = JSON.stringify({});
        }

        return {
            set: function(key, value) {
                var data = JSON.parse(localStorage.ghfs);
                data.key = value;
                localStorage.ghfs = JSON.stringify(data);
            },
            get: function(key) {
                var data = JSON.parse(localStorage.ghfs);
                return data.key;
            }
        };
    })();


    return {
        findAll: function(type, callback) {
            var _sendList = function(list, callback2) {
                $.each(list, function(key, post) {
                    callback2(post);
                });
            };
            // Check if list is persisted
            storedList = _store.get('list');
            // As long as its younger than a minute we are ok
            timeAgo = (new Date().getTime()) - (60 * 1000); 
            if (storedList && storedList.time > timeAgo) {
                _sendList(_store.get('list').data, callback);
            } else {
                _gh.list(type, function(list) {
                    // Persist the list;
                    _store.set('list', {
                        time: new Date().getTime(),
                        data: list
                    });
                    _sendList(list, callback);
                });
            }
        },
        rateLimit: function(callback) {
            _gh.rateLimit(callback);
        }
    };
})();