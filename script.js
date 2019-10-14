var url = "http://localhost:8000/user/";
var username = "";
var password = "";

/* Load WebAssembly */

Module.onRuntimeInitialized = function() {
  passreadd = Module._passread
  passgenn = Module._passread
}

function passread(str, key, salt){
  // Create a pointer using the 'Glue' method and the String value
  var ptrStr  = allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL);
  var ptrKey = allocate(intArrayFromString(key), 'i8', ALLOC_NORMAL);
  var ptrSalt = allocate(intArrayFromString(salt), 'i8', ALLOC_NORMAL);

  // Call the method passing the pointer
  var retPtr = passreadd(ptrStr, ptrKey, ptrSalt);

  // Retransform back your pointer to string using 'Glue' method
  var resValue = UTF8ToString(retPtr);

  // Free the memory allocated by 'allocate' 
  _free(ptrStr);   
  _free(ptrKey);   
  _free(ptrSalt);   


  return resValue;
}

function passgen(str, key, salt){
  // Create a pointer using the 'Glue' method and the String value
  var ptrStr  = allocate(intArrayFromString(str), 'i8', ALLOC_NORMAL);
  var ptrKey = allocate(intArrayFromString(key), 'i8', ALLOC_NORMAL);
  var ptrSalt = allocate(intArrayFromString(salt), 'i8', ALLOC_NORMAL);

  // Call the method passing the pointer
  var retPtr = passgenn(ptrStr, ptrKey, ptrSalt);

  // Retransform back your pointer to string using 'Glue' method
  console.log(retPtr);
  var resValue = UTF8ToString(retPtr);

  // Free the memory allocated by 'allocate'
  _free(ptrStr);
  _free(ptrKey);
  _free(ptrSalt);


  return resValue;
}


/* WebAssembly loaded */

function getSalt(callbackFunction, additionalVar){
  $.ajax({
    url: url + "getSalt/" + username, //gentoo-h je hostname moje masine, treba da stoji domen ovde
    dataType: "json",
    contentType: "json;charset=UTF-8",
    type: "GET",
    async: true,
    success: function(data){
      callbackFunction(data, additionalVar)
    },
    error: function(){
      alert("error");
    }
  })

}
function getAll(input) {
  var user = username;
  var passwordHash = sha512(password)
  for (var i = 0; i < 512; ++i){
    passwordHash = sha512(passwordHash + input['salt'])
  }
  $.ajax({
    url: url + user, 
    dataType: "json",
    contentType: "json;charset=UTF-8",
    data: {"key": passwordHash, "salt_id": input['salt_id']},
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

function appendPasswordsList(data) {
  $(data).each(function(i, single) {
    console.log(i, single);
    $(".passwords").append(
      '<div class="card password-card password"><img src="http://www.pkdinamo.org.rs/wp-content/uploads/2018/09/no-image.jpg">' +
        single +
        "</div>"
    );
  });
}

function getSingle(input, single) {
  var user = username;
  passwordHash = sha512(password);
  for (var i = 0; i < 512; ++i){
    passwordHash = sha512(passwordHash + input['salt'])
  }
  $.ajax({
    url: url + user + "/" + single,
    dataType: "json",
    contentType: "json",
    data: { "key": passwordHash, "salt_id": input['salt_id']},
    type: "GET",
    async: true,
    success: function(data) {
      $("#single").empty();
      $("#single").append(passread(data.username, password, data.usernameSalt));
      $("#single").append("<br/>");
      $("#single").append(passread(data.password, password, data.passwordSalt));
      $("#single").append("<br/>");
      console.log(passread(data.username, password, data.usernameSalt))
    },
    error: function() {
      alert("error");
    }
  });
}

function login() {
  var user = $("#username").val();
  username = user;
  var pass = $("#password").val();
  //checkIfIsGood
  password = pass;
  getSalt(getAll);
}

$(document).ready(function() {
  var input = document.getElementById("username");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login-button").click();
    }
  });
  input.focus()
  input = document.getElementById("password");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login-button").click();
    }
  });

  document.getElementsByClassName("container")[1].style.display = "none";
  var user = username;
  $("#username").val(user);

  // document.getElementById("username").value = "hawerner"; //delete this too
  // document.getElementById("login-button").click(); //delete this line
});

function visibility(me) {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    me.innerHTML = "visibility";
  } else {
    x.type = "password";
    me.innerHTML = "visibility_off";
  }
}

function changeView(me) {
  if (me.textContent === "apps") {
    me.innerHTML = "reorder";
  } else {
    me.innerHTML = "apps";
  }
}
