### When should overlays be triggered?
Overlays should be triggered after an event is triggered. After a certain duration, we can assume that the user either didn't notice the event


### What is an Event?
An event is `Aff Unit` that is observing something

### What things can be observed?
- level started
- piece added to location
- piece removed from location
- port diagram changed
- completion status changed

### Which events should trigger overlays?
- level started:
    - after 10s delay trigger add piece overlay
- port diagram left port goes bad:
    - ???
- first piece added to board
    - 10s delay
    - trigger move piece overlay
- piece added to (0,1):
    - 10s delay
    - move piece to right side overlay
- first time completion status changed to "ready":
    - 10s delay trigger
    - run test overlay
- first time run tests:
    - 10 second delay