describe("Reactor", function(){
	describe("A simple reactive value", function(){
		var reactive

		beforeEach(function(){
			reactive = new Reactor(0)
		})

		it("returns its current value", function(){
			expect(reactive.get()).toBe(0)
		})

		it("can change its current value", function(){
			reactive.set(5)
			expect(reactive.get()).toBe(5)
		})

		describe("with subscribers", function(){
			var old_subscriber

			beforeEach(function(){
				old_subscriber = jasmine.createSpy("old_subscriber")
				reactive.on(old_subscriber)
			})

			it("can add subscribers", function(){
				var subscriber = jasmine.createSpy("subscriber")

				reactive.on(subscriber)
				reactive.set(10)

				expect(old_subscriber).toHaveBeenCalledWith(10)
				expect(subscriber).toHaveBeenCalledWith(10)
			})

			it("can remove subscribers", function(){
				var subscriber = jasmine.createSpy("subscriber")

				reactive.on(subscriber)
				reactive.off(subscriber)
				reactive.set(7)

				expect(old_subscriber).toHaveBeenCalledWith(7)
				expect(subscriber).not.toHaveBeenCalled()
			})

			it("notifies all subscribers when it changes", function(){
				var subscriber1 = jasmine.createSpy("subscriber1")
				  , subscriber2 = jasmine.createSpy("subscriber2")
				  , subscriber3 = jasmine.createSpy("subscriber3")

			  reactive.on(subscriber1)
			  reactive.on(subscriber2)
			  reactive.on(subscriber3)

			  reactive.set(4)

			  expect(old_subscriber).toHaveBeenCalledWith(4)
			  expect(subscriber1).toHaveBeenCalledWith(4)
			  expect(subscriber2).toHaveBeenCalledWith(4)
			  expect(subscriber3).toHaveBeenCalledWith(4)
			})

			it("can clear all subscribers", function(){
				var subscriber1 = jasmine.createSpy("subscriber1")
				  , subscriber2 = jasmine.createSpy("subscriber2")
				  , subscriber3 = jasmine.createSpy("subscriber3")

			  reactive.on(subscriber1)
			  reactive.on(subscriber2)
			  reactive.on(subscriber3)
			  reactive.clearSubscribers()

			  reactive.set(28)

			  expect(old_subscriber).not.toHaveBeenCalled()
			  expect(subscriber1).not.toHaveBeenCalled()
			  expect(subscriber2).not.toHaveBeenCalled()
			  expect(subscriber3).not.toHaveBeenCalled()
			})
		})
	})

	describe("A reactive function from reactive values", function(){
		var r1
		  , r2
		  , r3
		  , reactive

		beforeEach(function(){
			r1 = new Reactor(1)
			r2 = new Reactor(10)
			r3 = new Reactor(-10)

			reactive = new Reactor(function(){
				if(r1.get() > 0){
					return r2.get()
				} else {
					return r3.get()
				}
			})
		})

		it("returns its current value", function(){
			expect(reactive.get()).toBe(10)
		})

		it("tracks its dependencies", function(){
			expect(reactive.dependencies).toContain(r1)
			expect(reactive.dependencies).toContain(r2)
			expect(reactive.dependencies).not.toContain(r3)
		})

		it("changes its value when any of its dependencies change", function(){
			//Dependencies: r1, r2
			r2.set(27)
			expect(reactive.get()).toBe(27)

			//Dependencies: r1, r2
			r1.set(-1)
			expect(reactive.get()).toBe(-10)

			//Dependencies: r1, r3
			r3.set(-39)
			expect(reactive.get()).toBe(-39)
		})

		it("tracks its dependencies when it changes", function(){
			r1.set(-1)

			expect(reactive.dependencies).toContain(r1)
			expect(reactive.dependencies).not.toContain(r2)
			expect(reactive.dependencies).toContain(r3)
		})
	})

	describe("A reactive function from other reactive functions", function(){
		var array
		  , rSum
		  , rAverage

		beforeEach(function(){
			array = []
			for(var i=0; i<10; i++){
				array.push(new Reactor(i))
			}

			rSum = new Reactor(function(){
				var sum = 0
				for(var i=0, len=array.length; i<len; i++){
					sum += array[i].get()
				}
				return sum
			})

			rAverage = new Reactor(function(){
				return rSum.get() / array.length
			})
		})

		it("returns its current value", function(){
			expect(rAverage.get()).toBe(4.5)
		})

		it("tracks its dependencies", function(){
			expect(rAverage.dependencies).toContain(rSum)
		})

		it("changes its value when any of its dependencies change", function(){
			array[3].set(20)

			expect(rAverage.get()).toBe(6.2)
		})
	})
})