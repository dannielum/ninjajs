(function () {
	if (!Ninja) {
		throw 'NinjaJS is required!';
	}
	
	Ninja.plugins.register('ninja.helloworld', {
		init: function () {
		},
		test: function () {
			alert('my first plugin!');
		}
	})		
}());
