document.getElementById('jj').addEventListener('submit', function(jj){
    jj.preventDefault();
       socket.emit('chat message', document.getElementById('m').value);
        document.getElementById('m').value = "";
        return false;
      })
     
      socket.on('chat message', function(msg, name){
       gameMsg = document.createElement("li");
       
		var node = document.createTextNode(name + ": " + msg);
        gameMsg.appendChild(node);

        document.getElementById('messages').appendChild(gameMsg);
      });
