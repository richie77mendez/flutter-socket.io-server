
const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');


const bands = new Bands();

bands.addBand(new Band('Ricardo Arjona'));
bands.addBand(new Band('Heroes del Silencio'));
bands.addBand(new Band('Mana'));
bands.addBand(new Band('Farruko'));

//mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-Bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
     });

    client.on('mensaje', (payload)=>{
        console.log('mensaje!!!!', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    }); 

//    client.on('emitir-mensaje', (payload) => {
  //     console.log(payload);
        // io.emit('nuevo-mensaje', payload); //emite a todos
   //    client.broadcast.emit('nuevo-mensaje', payload); //emite a todos menos el que lo emitio
   // })

    client.on('vote-band',(payload)=> {
        bands.voteBand(payload.id);
        io.emit('active-Bands', bands.getBands());
    });

    client.on('add-band',(payload)=> {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-Bands', bands.getBands());
    });

    client.on('delete-band',(payload)=> {
        bands.deleteBand(payload.id);
        io.emit('active-Bands', bands.getBands());
    });
  });