const EventEmitter = require('events');

const customEmitter = new EventEmitter()



customEmitter.on('response', (name, id) => {
    console.log(`Data recieved ${name} with id: ${id}`)
})

customEmitter.on('response', () => {
    console.log(`Some other logic here`)
})


customEmitter.emit('response', 'John', 34)