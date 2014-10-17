div = {
	append: function(dummy) {}
};

var difference = function(size, answer, callback)
{
	var del = 0;
	for(var i=0; i<size; i++)
	{
		del = Math.abs(x[i] - answer[i]);
		callback(del);
	}
}

QUnit.test( "test 1", function( assert ) {
	var answer;
	size = 4;
	matr = [[0,1,3,2], [1000,3,1,-5], [-3,4,1,4], [4,0,-2,-3]];
	b = [-1,-2,-1,4];
	gauss();
	answer = [-0.01, 1.21, 0.29, -1.55];

	difference(size, answer, function(del) {
		assert.ok(del < 0.1);
	}); 
});

QUnit.test( "test 2", function( assert ) {
	size = 3;
	matr = [[3,2,-5], [2,-1,3], [1,2,-1]];
	b = [-1,13,9];
	gauss();
	answer = [3,5,4];

	difference(size, answer, function(del) {
	assert.ok(del < 0.1);
	}); 
});

QUnit.test( "test 3", function( assert ) {
	size = 3;
	matr = [[1,2,3], [2,-1,2], [1,1,5]];
	b = [1,6,-1];
	gauss();
	answer = [4,0,-1];

	difference(size, answer, function(del) {
	assert.ok(del < 0.1);
	}); 
});

QUnit.test( "test 4", function( assert ) {
	size = 4;
	matr = [[2,5,4,1], [1,3,2,1], [2,10,9,7], [3,8,9,2]];
	b = [20,11,40,37];
	gauss();
	answer = [1,2,2,0];

	difference(size, answer, function(del) {
	assert.ok(del < 0.1);
	}); 
});

QUnit.test( "test 5", function( assert ) {
	size = 3;
	matr = [[7,-2,-1], [6,-4,-5], [1,2,4]];
	b = [2,3,5];
	gauss();
	answer = [4,0,-1];
	assert.equal(flag, false);
});