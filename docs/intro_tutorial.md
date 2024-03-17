### When should overlays be triggered?
Overlays should be triggered after an event is triggered. After a certain duration, we can assume that the user either didn't notice the event

```
event is triggered
listen for next event for x seconds
if next event has not been observed
    then run
```

### What is an Event?
An event is `Aff Unit` that will return when the event is observed

### What things can be observed?
- level started
- piece added to location
- piece removed from location
- port diagram changed
- completion status changed

## Which events should trigger overlays?
### Add piece:
- prereq event: level started
- next event: element added to (0,0)
- listen until: 10s elapsed

### Move Piece
- prereq event: element added to (0,0)
- next event: element added to (0,1)
- listen until: 10s elapsed

### Run Tests
- prereq event: completion status == "ready for testing"
- next event: completion status == "testing..."
- listen until: 10s elapsed