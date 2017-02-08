/*
    MIT LICENSE @2016 Ivan Lausuch <ilausuch@gmail.com>
    1.0
*/
ilPromise=function(options){
	this.data=undefined;
	this.isLoading=true;
	this.isError=false;
	this.hasFinished=false;
	
	this.successEmitter=new ilEventsEmitter();
	this.errorEmitter=new ilEventsEmitter();
	
	if (options==undefined)
		options={}
		
	if (options.context==undefined)
		this.context=ilPromise.defaultContext;
	else
		this.context=options.context;
		
	if (options.owner!=undefined)
		this.owner=options.owner;
	
	this.ready=function(data){
		this.data=data;
		this.isLoading=false;
		this.hasFinished=true;
		
		var $this=this;
		this.context.delayFnc(function(){
			if ($this.successEmitter.length()>0)
				$this.successEmitter.send($this.data);
		})
		
	}
		
	this.error=function(err){
		var $this=this;
		this.hasFinished=true;
		this.isLoading=false;
		this.isError=false;
		this.error=err;
				
		this.context.delayFnc(function(){
			if ($this.errorEmitter.length()>0)
				$this.errorEmitter.send($this.error);
			else
				throw new ilModelException("ilPromise","Error loading data",{theOwner:$this.owner,error:err});
		})
	}
	
	this.then=function(callback,errorCallback){
		if (!this.hasFinished){
			if (callback instanceof ilPromise){
				this.successEmitter.register(function(data){callback.ready(data)});
				this.errorEmitter.register(function(err){callback.error(err)});
			}
			else{
				this.successEmitter.register(callback);
				this.errorEmitter.register(errorCallback);
			}
		}
		else{
			var $this=this;
			this.context.delayFnc(function(){
				if (!$this.isError){
					if (callback instanceof ilPromise){
						callback.ready($this.data)
					}
					else{
						callback($this.data);
					}
				}
				else{
					if (callback instanceof ilPromise){
						errorCallback.error($this.error)
					}
					else{
						errorCallback(error);
					}
				}
			})
			
		}
		
		
		return this;
	}

	
	if (options.data!=undefined){
		this.ready(options.data);
	}
}

ilPromise.defaultContext={
	delayFnc:function(callback){setTimeout(callback)},
	
	setupDefaultAngularContext:function($timeout){
		ilModelConfiguration.defaultContext.delayFnc=function(callback){
			$timeout(callback)
		}
	}
}

ilPromiseSync=function(options){
	//IMPORTANT: Don't use for
	
	this.isLoading=true;
	this.isError=false;
	this.hasFinished=false;
	
	this.successEmitter=new ilEventsEmitter();
	this.errorEmitter=new ilEventsEmitter();
	
	if (options==undefined)
		options={}
		
	if (options.context==undefined)
		this.context=ilEventsEmitter.defaultContext;
	else
		this.context=options.context;
		
	if (options.owner!=undefined)
		this.owner=options.owner;
	
	this.syncList=[];
	
	this.addTask=function(startFunction,options){
		var task=this.add(options);
		startFunction(task);
	}
	
	this.add=function(options){
		this.isLoading=true;
		this.hasFinished=false;
			
		if (options==undefined)
			options={};
			
		var syncObject={
			id:this.syncList.length,
			
			options:options,
			
			sync:this,
			
			isLoading:true,
			isError:false,
			hasFinished:false,
			
			data:undefined,
			error:undefined,
			
			ready:function(data){
				if (this.hasFinished)
					throw new ilModelException("ilPromiseSync.object","This sync is already finished",{theSyncObject:this});
				
				this.hasFinished=true;
				this.isLoading=false;
				this.data=data;
				this.sync.ready(this);
			},
			error:function(err){
				if (this.hasFinished)
					throw new ilModelException("ilPromiseSync.object","This sync is already finished",{theSyncObject:this});
				
				this.hasFinished=true;
				this.isLoading=false;
				this.isError=true;
				this.error=err;
				this.sync.ready(this);
			}
		};
			
		this.syncList.push(syncObject);
		
		return syncObject;
	}
	
	this.ready=function(syncObject){
		var allFinished=true;
		
		this.syncList.some(function(syncObject){
			if (!syncObject.hasFinished){
				allFinished=false;
				return false;
			}
		});
		
		if (allFinished){
			this.isLoading=false;
			this.hasFinished=true;
			
			var anyError=false;
		
			this.syncList.some(function(syncObject){
				if (syncObject.isError){
					anyError=true;
					return true;
				}
			});
			
			if (!anyError){
				var $this=this;
				this.context.delayFnc(function(){
					if ($this.successEmitter.length()>0)
						$this.successEmitter.send($this.syncList);
				})	
			}
			else{
				var $this=this;
				this.context.delayFnc(function(){
					if ($this.errorEmitter.length()>0)
						$this.errorEmitter.send($this.syncList);
					else
						throw new ilModelException("ilPromise","Error loading data",{theOwner:$this.owner,error:err});
				})
				
				
			}
		}
		
	}
		
	this.then=function(callback,errorCallback){
		if (!this.hasFinished){
			if (callback instanceof ilPromise){
				this.successEmitter.register(function(data){callback.ready(data)});
				this.errorEmitter.register(function(err){callback.error(err)});
			}
			else{
				this.successEmitter.register(callback);
				this.errorEmitter.register(errorCallback);
			}
		}
		else{
			var $this=this;
			this.context.delayFnc(function(){
				if (!$this.isError){
					if (callback instanceof ilPromise){
						callback.ready($this.data)
					}
					else{
						callback($this.data);
					}
				}
				else{
					if (callback instanceof ilPromise){
						errorCallback.error($this.error)
					}
					else{
						errorCallback(error);
					}
				}
			})
			
		}
		
		
		return this;
	}
	
	this.progress=function(){
		var completed=0;
		
		this.syncList.forEach(function(syncObject){
			if (syncObject.hasFinished)
				completed++;
		});
		
		return {completed:completed,total:this.syncList.length};
	}
}


