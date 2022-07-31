const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios.js');
const { crearMensaje } = require('../utilidades/utilidades.js');

const usuarios = new Usuarios();

io.on('connection', ( client ) => {

    client.on('entrarChat', ( data, callback)  =>{
        

        if( !data.nombre || !data.sala ){

            return callback({
                error   : true,
                msg     : 'El nombre/sala es necesario' 
            })
        }


        client.join( data.sala );

        usuarios.agregarPersona( client.id, data.nombre, data.sala );


        client.to( data.sala ).emit('listaPersona', usuarios.getPersonasPorSala( data.sala ) );

        callback( usuarios.getPersonasPorSala( data.sala ) );
    });



    client.on('crearMensaje', data => {

        let persona = usuarios.getPersona( client.id );
        let mensaje = crearMensaje( persona.nombre, data.mensaje );

        client.to( persona.sala ).emit( 'crearMensaje', mensaje );
    })



    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to( personaBorrada.data ).emit('crearMensaje', crearMensaje( 'Administrador', `${ personaBorrada.nombre} salio`) );
        client.broadcast.to( personaBorrada.data ).emit('listaPersona', usuarios.getPersonasPorSala( personaBorrada.sala ) );
    });


    // Mensajes privados

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona( client.id );
        client.to( data.para ).emit( 'mensajePrivado', crearMensaje( persona.nombre, data.mensaje ));
    } )

});