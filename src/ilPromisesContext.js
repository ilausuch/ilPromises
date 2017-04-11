/*
    MIT LICENSE @2016 Ivan Lausuch <ilausuch@gmail.com>
    1.0
*/

ilPromisesContext={
    delayFnc:function(callback){setTimeout(callback)},
	
    setupDefaultAngularContext:function($timeout){
            ilModelConfiguration.defaultContext.delayFnc=function(callback){
                    $timeout(callback)
            }
    }
}