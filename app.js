var n = N$({
    name: 'Ichigo',
    placeholder: '#ninja',
    language: 'jp',
    menu: [
        {
            title: "Greet",
            talk: "greeting"
        },
        {
            title: "Say Bye",
            talk: "farewell"
        },
        {
            title: "Rotate",
            rotate: {
                duration: 2000,
                angle: 360,
                easing: "swing"
            }
        },
        {
            title: "Cloak",
            action: function (self) {
                self.animate({
                    properties: {
                        opacity: 0.25,
                        left: "+=50"
                    },
                    duration: 3000
                });
                self.say("You don't see me");
            }
        },
        {
            title: "Hello World",
            action: function (self) {
                self.plugins['ninja.helloworld'].test();
            }
        },
    ]
});
