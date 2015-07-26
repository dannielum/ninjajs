(function () {
	if (!Ninja) {
		throw 'NinjaJS is required!';
	}
	
	Ninja.plugins.register('ninja.helloworld', {
		init: function () {
			// initialization function for plugin
			this.message = 'My first hello world plugin!'
		},
		message: '',
		test: function () {
			alert(this.message);
		}
	})		
}());
