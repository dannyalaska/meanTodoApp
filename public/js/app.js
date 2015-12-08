var loginTemplate;
var userTemplate;

$(function() {
  loginTemplate = Handlebars.compile($('#login-template').html());
  userTemplate = Handlebars.compile($('#user-template').html());

  fetchAndRenderUser();
  fetchAndRenderSession();

  $('body').on('click', '#signup-button', signup);
  $('body').on('click', '#login-button', login);
  $('body').on('click', '#logout-button', logout);
  $('body').on('click', '#new-todo-button', createTodo);
});

var fetchAndRenderUser = function() {
  $.get('/users').done(renderUsers);
};

var renderUsers = function(users) {
  $('#users').empty();
  users.forEach(renderUsers);
};

var fetchAndRenderSession = function() {
  $.get('/current_user').done(function(user) {
    if (user) {
      $('#session').html(userTemplate(user));
    } else {
      $('#session').html(loginTemplate());
    }
  }).fail(function(jqXHR) {
    if (jqXHR.status === 404) {
      $('#session').html(loginTemplate());
    }
  });
};

var signup = function() {
  var username = $('#signup-username').val();
  var password = $('#signup-password').val();

  $.post('/users', {
    username: username,
    password: password
  }).done(fetchAndRenderUser);
};

var login = function() {
  var username = $('#login-username').val();
  var password = $('#login-password').val();

  $.post('/sessions', {
    username: username,
    password: password
  }).done(fetchAndRenderSession)
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert('Error: ' + jqXHR.responseText);
      $('#session').empty();
      $('#session').html(loginTemplate());
    });
};

var logout = function() {
  $.ajax({
    url: '/sessions',
    method: 'DELETE'
  }).done(fetchAndRenderSession);
};

var createTodo = function() {};
