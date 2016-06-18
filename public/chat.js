document.addEventListener("DOMContentLoaded", function(event) {
  document.getElementById('starter').addEventListener('submit', function(starter) {
        starter.preventDefault();
        nameChoose();

    });

    document.getElementById('jj').addEventListener('submit', function(jj) {
        jj.preventDefault();

        var mess = document.getElementById('m').value;
         if(mess.indexOf("/colour ") >= 0) {
           backColour = mess.substr(8);
         mess = "";
         document.getElementById('m').blur();}
        if(mess != ""){
        socket.emit('chat message', mess);
            document.getElementById('m').blur();
        }

        document.getElementById('m').value = "";

       return false;
    });

    socket.on('chat message', function(msg, name) {
        gameMsg = document.createElement("li");

        var node = document.createTextNode(name + ": " + msg);
        gameMsg.appendChild(node);

        document.getElementById('messages').appendChild(gameMsg);
        var chat = document.getElementById("messages");
        chat.scrollTop = chat.scrollHeight;

    });
});
