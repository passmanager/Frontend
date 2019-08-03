var url = "http://0.0.0.0:8000/user/";
var password = "";

function getAll() {
  var user = window.location.hash.substr(1);
  passwordHash = sha512(password);
  console.log(sha512(password));
  $.ajax({
    url: url + user, //gentoo-h je hostname moje masine, treba da stoji domen ovde
    dataType: "json",
    contentType: "json;charset=UTF-8",
    data: { key: passwordHash },
    type: "GET",
    async: true,
    success: function(data) {
      appendPasswordsList(data);
      document.getElementsByClassName("container")[0].style.display = "none";
      document.getElementsByClassName("container")[1].style.display = "block";
    },
    error: function() {
      alert("error");
    }
  });
}

// function appendPasswordsList(data) {
//   $(data).each(function(i, single) {
//     console.log(i, single);
//     $(".passwords").append(
//       '<button class="password" onClick="getSingle(\'' +
//         single +
//         "')\">" +
//         single +
//         "</button>"
//     );
//   });
// }

function appendPasswordsList(data) {
  $(data).each(function(i, single) {
    console.log(i, single);
    $(".passwords").append("<div class=\"card password-card password\"><img src=\"http://www.pkdinamo.org.rs/wp-content/uploads/2018/09/no-image.jpg\">"+single+"</div>");
  });
}

function getSingle(single) {
  var user = window.location.hash.substr(1);
  passwordHash = sha512(password);
  $.ajax({
    url: url + user + "/" + single, //gentoo-h je hostname moje masine, treba da stoji domen ovde
    dataType: "json",
    contentType: "json",
    data: { key: passwordHash },
    type: "GET",
    async: true,
    success: function(data) {
      $("#single").empty();
      $("#single").append(passread(data.username, password, data.usernameSalt));
      $("#single").append("<br/>");
      $("#single").append(passread(data.password, password, data.passwordSalt));
      $("#single").append("<br/>");
    },
    error: function() {
      alert("error");
    }
  });
}

function login() {
  var user = $("#username").val();
  window.location = "#" + user;
  var pass = $("#password").val();
  //checkIfIsGood
  password = pass;
  getAll();
}

$(document).ready(function() {
  var input = document.getElementById("username");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login-button").click();
    }
  });
  input = document.getElementById("password");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login-button").click();
    }
  });

  document.getElementsByClassName("container")[1].style.display = "none";
  var user = window.location.hash.substr(1);
  $("#username").val(user);

  // document.getElementById("username").value = "hawerner"; //delete this too
  // document.getElementById("login-button").click(); //delete this line
});

function visibility(me) {
	var x = document.getElementById("password");
	if (x.type === "password") {
		x.type = "text";
		me.innerHTML = "visibility"
	} else {
		x.type = "password";
		me.innerHTML = "visibility_off"
	}
}

