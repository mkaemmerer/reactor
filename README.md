# Reactor

**Reactor** is a javascript micro library for reactive programming. 

## Example Usage

    var first_name = new Reactor("Matthew"),
        last_name  = new Reactor("Kaemmerer"),
        full_name  = new Reactor(function(){ return first_name.get() + " " + last_name.get(); });

    full_name.on(function(name){
      document.querySelector('.name').innerHTML = name;
    });

    first_name.set("Matt"); // Matt Kaemmerer
    last_name.set("K");     // Matt K

## API

### Reactor(*value_or_function*)

Creates a new reactor object.

If *value_or_function* is an object, the reactor's initial value is set to the object.

If *value_or_function* is a function, the function is evaluated, and the reactor's value is set to the result of that function. If any other reactors are used to compute the function, then reactor will track them as dependencies, and recompute itself any time those reactors change.

    var a = new Reactor(1),
        b = new Reactor(2),
        sum = new Reactor(function(){ return a.get() + b.get() });

### reactor.get()
Gets a snapshot of the reactor's current value.

    var reactor = new Reactor(3);
    reactor.get(); // -> 3

### reactor.set(_new value_)
Sets the reactor's value to _new value_, and notifies subscribers that the value has changed.

    var reactor = new Reactor(3);
    reactor.set(4);
    reactor.get(); // -> 4

### reactor.update()
Recomputes the reactor's value to ensure it has the most up-to-date value.
Generally, you do not need to call update manually.

### reactor.addSubscriber(_callback_)

Adds _callback_ as a subscriber to this reactor. Any time the reactor's value changes, _callback_ will be called with the new value as the only argument.

    var reactor = new Reactor()
      , subscriber = function(name){ alert(name); };
    reactor.addSubscriber(subscriber);
    reactor.set("hello"); // alerts "hello"


*Alias: reactor.on*


### reactor.removeSubscriber(_callback_)

Removes _callback_ as a subscriber to this reactor.

    var reactor = new Reactor(),
        alerter = function(name){ alert(name); },
        logger  = function(name){ console.log(name); };
    reactor.addSubscriber(alerter);
    reactor.addSubscriber(logger);
    reactor.removeSubscriber(alerter);

    reactor.set("hello"); // Logs "hello". Does not alert.


*Alias: reactor.off*

### reactor.clearSubscribers()

Removes all subscribers from this reactor.

    var reactor = new Reactor(),
        alerter = function(name){ alert(name); },
        logger  = function(name){ console.log(name); };
    reactor.addSubscriber(alerter);
    reactor.addSubscriber(logger);
    reactor.clearSubscribers();

    reactor.set("hello"); // Does not log or alert


## License

Reactor is distributed under the MIT license.

Copyright (c) 2013 Matt Kaemmerer, Spiceworks Inc.