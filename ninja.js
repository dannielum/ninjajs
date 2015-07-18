(function Ninja(global, $) {

    var Ninja = function (options) {
        return new Ninja.init(options);
    };

    // conversations that ninja can talk
    var conversations = {
        "en": {
        	"greeting": "Hello",
        	"farewell": "Good Bye"
        },
        "ch": {
        	"greeting": "您好",
        	"farewell": "再見"
        },
        "jp": {
        	"greeting": "こんにちは",
        	"farewell": "さようなら"
        }
    };
    
    // helper functions
    function loadFile (fileName, format, successCallback, failCallback) {
        return $.getJSON(fileName, {
            format: format
        })
        .success(successCallback)
        .fail(failCallback);
    }

    Ninja.prototype = {
        // getters and setters for ninja properties
        getName: function () {
            return this.name;
        },
        setName: function (newName) {
            this.name = newName;
            return this;
        },
        getLanguage: function () {
            return this.language;
        },
        setLanguage: function (newLanguage) {
            this.language = newLanguage;
            return this;
        },
        getPlaceholder: function () {
            return this.placeholder;
        },
        setPlaceholder: function(newPlaceholder) {
            if (newPlaceholder instanceof $) {
                this.placeholder = newPlaceholder;
            }
            else if (typeof newPlaceholder === 'string') {
                this.placeholder = $(newPlaceholder);
            }
            return this;
        },
        
        // configs for ninja settings
        config: function(settings) {
            var self = this;
            
            // setup menu
            if (!$.isEmptyObject(settings.menu)) {
                if (!(this.placeholder instanceof $)) {
                    return;
                }
                
                var menu = $('.menu', this.placeholder);
                    $.each(settings.menu, function(key, value) {
                        if (key && value) {
                            var itemButton = $(value, menu) 
                            if (itemButton.length === 0)
                                itemButton = $('<input type="button" />');
                            itemButton.val(key);
                            itemButton.click(function () {
                                self.talk(value);
                            });
                            menu.append(itemButton)
                        }
                    });
            }
            
            return this;
            
            // var deferred;
            // if (!conversations[this.language]) {
            //     deferred = loadFile('lang/' + this.language + '.json', 'json', function (data) {
            //         conversations[self.language] = data;
            //     })
            //     .then(function () {
            //         try {
            //             self.validateLanguage();
            //         }
            //         catch (ex) {
            //             self.say(ex);
            //             self.language = 'en';
            //         }
            //     });
            // }
            // return deferred;
        },

        // validation for ninja settings
        validate: function () {
            this.validateLanguage();
            return this;
        },
        validateLanguage: function () {
            if (!conversations[this.language]) {
                throw this.getName() + ": I don't speak " + (this.getLanguage() || 'this language');
            }
            return this;
        },

        // ninja's behaviors
        talk: function (whatToSay) {
            var message =  this.getName() + ": " + (conversations[this.language][whatToSay] && conversations[this.language][whatToSay]) || 'Urg...';
            this.say(message);
            return this;
        },
        say: function (message) {
            var messageBox;
            if (this.placeholder instanceof $) {
                messageBox = $('.message', this.placeholder);
            }

            if (messageBox) {
                messageBox.html(message);
            }
            else if (console) {
                console.log(message);
            }

            return this;
        },
        disappear: function () {
            this.placeholder.hide();
        },
        appear: function () {
            this.placeholder.show();
        }
    };

    // initialization method for ninja
    Ninja.init = function (options) {
        var defaultOptions = {
            name: 'Ninja',
            language: 'en',
            config: {
                menu: {
                    "Greet": "greeting",
                    "Hide": "farewell"                    
                }
            }
        };

        $.extend(defaultOptions, options);

        var self = this;
        self.setPlaceholder(defaultOptions.placeholder)
            .config(defaultOptions.config)
            .setLanguage(defaultOptions.language)
            .setName(defaultOptions.name);
            
    };

    Ninja.init.prototype = Ninja.prototype;

    global.Ninja = global.N$ = Ninja;

}(window, jQuery)); // jQuery is required for NinjaJS to work
