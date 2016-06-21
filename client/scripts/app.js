// YOUR CODE HERE:
$(document).ready(function() {
  var roomName;
  var roomNames = [];
  var message = {
    username: window.location.search.split('=')[1],
    text: $('.new-message').val(),
    roomname: roomName
  };

  $('.newroomname').hide();

  $('.send').click(function() {
    message.text = $('.new-message').val() || 'hi';
    roomName = $('.newroomname').val() || roomName;
    message.roomname = roomName;
    $('.newroomname').val('');
    $('.newroomname').hide();
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // console.log('here');
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        $('.new-message').val('');
        populate(roomName);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  });

  $('.newroom').click(function() {
    $('.newroomname').show();
  });

  $('.refresh').click(function() {
    populate(roomName);
  });

  $('.dropbtn').click(function() {
    $('#myDropdown').toggleClass('show');
  });

  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = $('.dropdown-content');
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };

  $(document).on('click', '.room', function() {
    var name = $(this).html();
    populate(name);
  });

  $(document).on('click', '.user', function() {
    
  });

  var appendMessages = function (results) {
    _.each(results, function(element) {
      if (roomNames.indexOf(element.roomname) === -1) {
        $('.chatroom').append($('<a class=\"room\" href="#">' + element.roomname + '</a>'));
        roomNames.push(element.roomname);
      }

      if (element.roomname === roomName) {
        var p = $('<p></p>');
        p.addClass(element.username + ' user');
        p.text(element.username + ': ' + element.text);
        $('#chats').append(p);
      }
    });
  };
  
  var populate = function(name) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      success: function (data) {                
        $('#chats').empty();
        roomName = name || data.results[0].roomname;
        $('.dropbtn').text(roomName);
        appendMessages(data.results);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  };

  populate();
});