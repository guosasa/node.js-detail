const EventEmitter = require('events')
class MyEventEmitter extends EventEmitter{

}
const event = new MyEventEmitter()
event.on('play',(val)=>{
  console.log(val)
})
event.emit('play','movie')