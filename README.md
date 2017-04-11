# ilPromises
ilPromises provide a powerful method to async results. And ilPromisesSync allows to synchronize some async results

## Example of ilPromise

Creation of a function than returns the result after 10 seconds within a promise

```javascript
function testAsyncResult(data){
	//Create a promise
	var promise=new ilPromise();
	
	setTimeout(function(){
		//Resolve the promise after 10 seconds
		promise.ready(data);
	},10*1000);
	
	//return the promise
	return promise;
}
```

Test

```javascript

testAsyncResult("test").then(function(data){
		//TODO something with data	
	},
	function(err){
		//TODO something with error	
	}
);
```

## Example of ilPromiseSync

TODO

## ilPromise Reference

TODO

## ilPromiseSync Reference

```javascript
var sync = new ilPromiseSync().then(function () {
    //TODO Something when finish
})

sync.addTask(function (task) {
    //TODO Do something async and call task ready, when it finish
    task.ready(data);
})

````