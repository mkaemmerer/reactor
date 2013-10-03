window.Reactive =
(function(){
	var Reactive = function(value){
		var self = this;
		
		self.subscribers  = [];
		self.dependencies = [];
		
		if(typeof value == "function") {
			self.update = setAndTrackDependencies(self, value);
			self.update();
		} else {
			self.value = value;
		}
	};

	var ctor  = Reactive
	  , proto = ctor.prototype
	  ;

	proto.get = getAndDontTrackDependents;
	function getAndDontTrackDependents(){
		return this.value;
	};
	function getAndTrackDependents(derived){
		return function(){
			derived.addDependency(this);
			return this.value;
		}
	};

	proto.set = function(value){
		if(this.value != value){
			this.value = value;

			for(var i=0, len=this.subscribers.length; i<len; i++){
				this.subscribers[i](value);
			}
		}
	};
	function setAndTrackDependencies(self, value){
		return function(){
			self.clearDependencies();

			Reactive.prototype.get = getAndTrackDependents(self);
			self.set(value());
			Reactive.prototype.get = getAndDontTrackDependents;
		}
	}

	proto.update = function(){};

	proto.on = function(subscriber){
		this.subscribers.push(subscriber);
		return this;
	};
	proto.off = function(subscriber){
		for(var i=0, len=this.subscribers.length; i<len; i++){
			if(this.subscribers[i] == subscriber){
				this.subscribers.splice(i,1);
				break;
			}
		}
		return this;
	};
	proto.clearSubscribers = function(){
		this.subscribers = [];
	}

	proto.addDependency = function(dependency){
		dependency.on(this.update);
		this.dependencies.push(dependency);
	}
	proto.removeDependency = function(dependency){
		for(var i=0, len=this.dependencies.length; i<len; i++){
			if(this.dependencies[i] == dependency){
				this.dependencies[i].off(this.update);
				this.dependencies.splice(i,1);
				break;
			}
		}
	}
	proto.clearDependencies = function(update){
		for(var i=0, len=this.dependencies.length; i<len; i++){
			this.dependencies[i].off(update);
		}
		this.dependencies = [];
	}

	return Reactive;
})();