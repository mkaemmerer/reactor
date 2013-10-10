window.Reactor =
(function(){
	var Reactor = function(value){
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

	var ctor  = Reactor
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

			Reactor.prototype.get = getAndTrackDependents(self);
			self.set(value());
			Reactor.prototype.get = getAndDontTrackDependents;
		}
	};

	proto.update = function(){};

	proto.addSubscriber = function(subscriber){
		this.subscribers.push(subscriber);
		return this;
	};
	proto.removeSubscriber = function(subscriber){
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
	};
	proto.on  = proto.addSubscriber;
	proto.off = proto.removeSubscriber;

	proto.addDependency = function(dependency){
		dependency.addSubscriber(this.update);
		this.dependencies.push(dependency);
	};
	proto.removeDependency = function(dependency){
		for(var i=0, len=this.dependencies.length; i<len; i++){
			if(this.dependencies[i] == dependency){
				this.dependencies[i].removeSubscriber(this.update);
				this.dependencies.splice(i,1);
				break;
			}
		}
	};
	proto.clearDependencies = function(){
		for(var i=0, len=this.dependencies.length; i<len; i++){
			this.dependencies[i].off(this.update);
		}
		this.dependencies = [];
	};

	return Reactor;
})();