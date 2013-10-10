describe("Backbone-Reactor", function(){
	describe("Models", function(){
		var model

		beforeEach(function(){
			model = new Backbone.Model({first_name: "foo", last_name: "bar"})
		})

		it("can get reactive attributes", function(){
			var first_name = model.getR("first_name")
			  , spy        = jasmine.createSpy("first_name")

			first_name.on(spy)
			model.set("first_name", "quux")

			expect(spy).toHaveBeenCalledWith("quux")
		})

		it("can set reactive attributes", function(){
			var middle_name = new Reactor("foo")

			model.setR("middle_name", middle_name)

			expect(model.get("middle_name")).toBe("foo")
			middle_name.set("quux")
			expect(model.get("middle_name")).toBe("quux")
		})

		it("can set reactive attributes as derived attributes", function(){
			model.createDerived("full_name", function(){
				return this.get("first_name") + " " + this.get("last_name")
			})

			expect(model.get("full_name")).toBe("foo bar")
			model.set("first_name", "baz")
			expect(model.get("full_name")).toBe("baz bar")
			model.set("last_name", "quux")
			expect(model.get("full_name")).toBe("baz quux")
		})
	})

	describe("Collections", function(){
		var collection

		beforeEach(function(){
			collection = new Backbone.Collection([{}, {}, {}])
		})

		it("can get the length as a reactive value", function(){
			var length = collection.lengthR()
			  , spy    = jasmine.createSpy("length")
			  , model  = new Backbone.Model()

			length.on(spy)

			collection.add(model)
			expect(spy).toHaveBeenCalledWith(4)
			collection.remove(model)
			expect(spy).toHaveBeenCalledWith(3)
			collection.reset()
			expect(spy).toHaveBeenCalledWith(0)
		})
	})
})