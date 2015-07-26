(function Ninja(global, $) {

    var Ninja = function (options) {
        return new Ninja.init(options);
    };
    
    // css options
    var ninjaCSS = {
        // menu
        ninjaMenu: '.ninja-menu',
        ninjaMenuTitle: '.ninja-menu-title',
        ninjaMenuList: '.ninja-menu-list',
        
        // message chat box
        ninjaMessage: '.ninja-message',
        
        // avatar
        ninjaAvatar: '.ninja-avatar'
    };
    
    // templates
    var ninjaTemplates = {
        ninjaMenu: 'templates/menu.partial.html'
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
    
    Ninja.prototype = {
        // ninja plugins
        plugins: {},
        
        // ninja config settings
        ninjaSettings: {
            menu: {
                templateUrl: ninjaTemplates.ninjaMenu,
                title: "Action"
            },
            message: {
                
            },
            avatar: {
                
            }
        },
    
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
        setPlaceholder: function (newPlaceholder) {
            if (newPlaceholder instanceof $) {
                this.placeholder = newPlaceholder;
            }
            else if (typeof newPlaceholder === 'string') {
                this.placeholder = $(newPlaceholder);
            }
            return this;
        },
        
        // setup for ninja menu
        setupMenu: function (menu) {
            var self = this;
            
            // setup menu
            if (!$.isEmptyObject(menu)) {
                if (!(this.placeholder instanceof $)) {
                    return;
                }
                
                var menuContainer = $(ninjaCSS.ninjaMenu, this.placeholder);
                if (!menuContainer || !this.ninjaSettings.menu.templateUrl) {
                    throw "cannot setup ninja menu";
                    return;
                }
                
                $(menuContainer).load(this.ninjaSettings.menu.templateUrl, function() {
                    var menuListContainer = $(ninjaCSS.ninjaMenuList, menuContainer);
                    var menuTitleContainer = $(ninjaCSS.ninjaMenuTitle, menuContainer);
                    if (menuTitleContainer && self.ninjaSettings.menu.title) {
                        menuTitleContainer.html(self.ninjaSettings.menu.title);
                    }
                    $.each(menu, function(index, value) {
                        if (value) {
                            var menuItemList = $('<li></li>');
                            var menuItem = $('<a href="#"></a>');
                            menuItemList.append(menuItem);
                            menuItem.html(value.title);
                            if (typeof value.css == 'string') {
                                menuItem.addClass(value.css);
                            }
                            if (typeof value.action === 'function') {
                                menuItem.click(function () {
                                    value.action(self);
                                });
                            }
                            else if (typeof value.talk === 'string') {
                                menuItem.click(function () {
                                    self.talk(value.talk);
                                });
                            }
                            else if (typeof value.rotate === 'object') {
                                menuItem.click(function () {
                                    self.rotate(value.rotate);
                                });
                            }
                            else if (typeof value.animate === 'object') {
                                menuItem.click(function () {
                                    self.animate(value.animate);
                                });
                            }
                            menuListContainer.append(menuItemList);
                        }
                    });
                });
            }
            
            return this;
        },
        
        // configs for ninja settings
        config: function (settings) {
            //var self = this;
            
            if (settings.menu) {
                $.extend(this.ninjaSettings.menu, settings.menu);
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
                messageBox = $(ninjaCSS.ninjaMessage, this.placeholder);
            }

            if (messageBox) {
                messageBox.html(message);
            }
            else if (console) {
                console.log(message);
            }

            return this;
        },
        rotate: function (rotateParams) {
            var elem = $(ninjaCSS.ninjaAvatar, this.placeholder.selector);
            $({deg: 0}).animate({deg: rotateParams.angle || 360}, {
                duration: rotateParams.duration || 1000,
                easing: rotateParams.easing || 'linear',
                step: function(now) {
                    elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
        },
        animate: function (animateParams) {
            var elem = $(ninjaCSS.ninjaAvatar, this.placeholder.selector);
            elem.animate(animateParams.properties, animateParams.duration, animateParams.easing, animateParams.complete);
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
            name: "Ninja",
            language: "en",
            menu: [],
            config: {
                menu: {
                    templateUrl: ninjaTemplates.ninjaMenu,
                    title: "Ninja"
                }
            }
        };

        $.extend(defaultOptions, options);

        var self = this;
        self.setPlaceholder(defaultOptions.placeholder)
            .config(defaultOptions.config)
            .setupMenu(defaultOptions.menu)
            .setLanguage(defaultOptions.language)
            .setName(defaultOptions.name);
    };
    
    Ninja.plugins = {
        register: function (name, pluginObj) {
            if (typeof name !== 'string') {
                throw 'plugin name is invalid';
                return;
            }
            
            if (typeof pluginObj !== 'object') {
                throw 'invalid plugin';
                return;
            }
                
            Ninja.prototype.plugins[name] = pluginObj;
        }
    };

    Ninja.init.prototype = Ninja.prototype;

    global.Ninja = global.N$ = Ninja;

}(window, jQuery)); // jQuery is required for NinjaJS to work
