// YOUR CODE HERE:
$(document).ready(function() {
  var app = {};
  var appendMessages = function (results) {
    _.each(results, function(element) {
      if (app.roomNames.indexOf(element.roomname) === -1 && element.roomname !== null && element.roomname !== undefined) {
        var r = $('<a class=\"room\" href="#"></a>');
        r.text(element.roomname);
        $('.chatroom').append(r);
        app.roomNames.push(element.roomname);
      }

      if (element.roomname === app.roomName) {
        var p = $('<p></p>');
        p.addClass(`${element.username.replace(/\s/g, '')} chat`);
        p.text(`${element.username}: ${element.text}`);
        $('#chats').append(p);
      }
    });
  };

  app.init = function() {
    app.roomName = 'lobby';
    app.roomNames = [];
    app.message = {
      username: window.location.search.split('=')[1] || 'anonymous',
      text: $('.new-message').val(),
      roomname: app.roomName
    };

    app.fetch(app.roomName);

    $('.newroomname').hide();

    $('.newroom').click( () => $('.newroomname').show() );

    $('.refresh').click( () => app.fetch(app.roomName) );

    $('.dropbtn').click( () => $('#myDropdown').toggleClass('show') );

    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        let dropdowns = $('.dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

    $(document).on('click', '.room', function() {
      var name = $(this).html();
      app.fetch(name);
    });

    $(document).on('click', '.chat', function() {
      $(`.${$(this).attr('class').split(' ')[0]}`).toggleClass('buddy'); 
    });

    $('.send').click(function() {
      app.send();
    });
  };

  app.send = function() {
    app.message.text = $('.new-message').val() || 'hi';
    app.roomName = $('.newroomname').val() || app.roomName;
    app.message.roomname = app.roomName;
    $('.newroomname').val('');
    $('.newroomname').hide();
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(app.message),
      contentType: 'application/json',
      success: (data) => {
        $('.new-message').val('');
        app.fetch(app.roomName);
      },
      error: (data) => console.error('chatterbox: Failed to send message', data)
    });
  };

  app.fetch = function(name) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      success: data => {                
        $('#chats').empty();
        app.roomName = name;
        $('.dropbtn').text(app.roomName);
        appendMessages(data.results);
      },
      error: data => console.error('chatterbox: Failed to get message', data)
    });
  };

  app.init();
});





