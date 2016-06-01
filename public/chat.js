$(document).ready(function () {


      $('#jj').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });

      socket.on('chat message', function(msg, name){

        $('#messages').append($('<li>').text(name + ": " + msg));
      });
});
