
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala   = params.get('sala');
//Referencias jquery

var divUsuarios = $('#divUsuarios') ;
var formEnviar  = $('#formEnviar')  ;
var txtMensaje  = $('#txtMensaje')  ;
var divChatbox  = $('#divChatbox')  ;

// Funciones para renderizar usuarios


function renderizarUsuarios( personas ){

    var html = '';

    html +='<li>';
    html +='    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html +='</li>';


    for( let i = 0; i < personas.length; i ++ ){

        html += '<li>';
        html += '    <a  data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html( html );
};

function renderizarMensajes( mensaje, yo ){

    var html = ''
    var fecha = new Date( mensaje.fecha );
    var hora  = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if( mensaje.nombre === 'Administrador' ){
        adminClass = 'danger';
    }

    if( !yo ){

        html = '<li class="animated fadeIn">';

        if( mensaje.nombre !== 'Administrador'){
            html += '<div class="chat-img"><img src="assets/images/users/2.jpg" alt="user" /></div>';
        }
        
        html += '<div class="chat-content">';
        html += '<h5>'+ mensaje.nombre +'</h5>';
        html += '<div class="box bg-light-'+ adminClass +'">' + mensaje.mensaje  +'</div>';
        html += '</div>';
        html += '<div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }
    else{

        html += '<li class="reverse">'
        html +=     '<div class="chat-content">'
        html +=     '<h5>'+ mensaje.nombre +'</h5>'
        html +=     '<div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>'
        html +=     '</div>'
        html +=     '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html +=     '<div class="chat-time">'+ hora +'</div>'
        html += '</li>'
    }

    divChatbox.append( html );
}

//Listeners 

divUsuarios.on('click', 'a', function(){

    var id = $( this ).data('id');

    if( !id ) return;

    console.log( id );
});

formEnviar.on('submit', function( e ){

    e.preventDefault();

    if ( txtMensaje.val().trim().length == 0 ) return;


    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val().trim()

    }, function( mensaje ){

        txtMensaje.val('').focus();
        renderizarMensajes( mensaje, true );
    })
})



