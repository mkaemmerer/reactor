(function(){
	var getAsPlainValue = Backbone.Model.prototype.get;
	var getAsReactor    = function(attribute){
		var reactor = new Reactor(getAsPlainValue.call(this, attribute));
		this.on("change:" + attribute, update, reactor);
		reactor.model = this;
		return reactor;

		function update(model, new_value){
			reactor.set(new_value);
		}
	};
	var getAsReactorSnapshot  = function(attribute){
		var reactor = getAsReactor.call(this, attribute);
		return reactor.get();
	};
	var setAsReactor = function(attribute, reactor){
		var self = this;
		
		this.set(attribute, reactor.get());
		reactor.on(function(new_value){
			self.set(attribute, new_value);
		});
	};


	_.extend(Backbone.Model.prototype, {
		getR: getAsReactor,
		setR: setAsReactor,
		createDerived: function(attribute, generator){
			var self = this;
			
			var reactor = new Reactor(function(){
				var get = Backbone.Model.prototype.get;
				Backbone.Model.prototype.get = getAsReactorSnapshot;
				var ret = generator.call(self);
				Backbone.Model.prototype.get = get;

				return ret
			});
			reactor.clearDependencies = function(){
				for(var i=0, len=this.dependencies.length; i<len; i++){
					this.dependencies[i].off(this.update);
					this.dependencies[i].model.off(null, null, this.dependencies[i]);
				}
				this.dependencies = [];
			};

			this.setR(attribute, reactor);
			return this;
		}
	});

	_.extend(Backbone.Collection.prototype, {
		lengthR: function(){
			var self = this
			  , reactor = new Reactor(this.length);
			
			this.on("add remove reset", update, reactor);
			return reactor;

			function update(){
				reactor.set(self.length);
			}
		}
	});
})();