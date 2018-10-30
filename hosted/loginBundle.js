"use strict";

//Function to send an AJAX request when the user logs in
var handleLogin = function handleLogin(e) {
	//Prevent the form from submitting
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	//Handle invalid input
	if ($("#user").val() == '' || $("#pass").val() == '') {
		handleError("RAWR! Username or password is empty");
		return false;
	}

	console.log($("input[name=_csrf]").val());

	//Send the AJAX request
	sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

	//Prevent the form from changing pages
	return false;
};

//Function to send an AJAX request when the user signs up
var handleSignup = function handleSignup(e) {
	//Prevent the form from submitting
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	//Handle invalid input
	if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	//Handle mismatched passwords
	if ($("#pass").val() !== $("#pass2").val()) {
		handleError("RAWR! Passwords do not match");
		return false;
	}

	//Send the AJAX request
	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the login form
var LoginWindow = function LoginWindow(props) {
	return React.createElement(
		"form",
		{ id: "loginForm", name: "loginForm",
			onSubmit: handleLogin,
			action: "/login",
			method: "POST",
			className: "mainForm" },
		React.createElement(
			"label",
			{ htmlFor: "username" },
			"Username: "
		),
		React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
		React.createElement(
			"label",
			{ htmlFor: "pass" },
			"Password: "
		),
		React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
	);
};

//Function to use React to dynamically create the signup form
var SignupWindow = function SignupWindow(props) {
	return React.createElement(
		"form",
		{ id: "signupForm", name: "signupForm",
			onSubmit: handleSignup,
			action: "/signup",
			method: "POST",
			className: "mainForm" },
		React.createElement(
			"label",
			{ htmlFor: "username" },
			"Username: "
		),
		React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
		React.createElement(
			"label",
			{ htmlFor: "pass" },
			"Password: "
		),
		React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
		React.createElement(
			"label",
			{ htmlFor: "pass2" },
			"Password: "
		),
		React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
	);
};

//Function to render the Login form to the page
var createLoginWindow = function createLoginWindow(csrf) {
	ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

//Function to render the Signup form to the page
var createSignupWindow = function createSignupWindow(csrf) {
	ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

//Function to setup event listeners to the page buttons
//to allow React to render the UI accordingly
var setup = function setup(csrf) {
	//Get reference to page buttons
	var loginButton = document.querySelector("#loginButton");
	var signupButton = document.querySelector("#signupButton");

	//Event listener for signup
	signupButton.addEventListener("click", function (e) {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	//Event listener for login
	loginButton.addEventListener("click", function (e) {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	//Setup default view to login form
	createLoginWindow(csrf);
};

//Function to get a CSRF token from the server for security
var getToken = function getToken() {
	sendAjax('GET', '/getToken', null, function (result) {
		setup(result.csrfToken);
	});
};

//Note: $(document).ready() is similar to window.onload = init;
//Make a call to get the token and render the forms
//when the page loads
$(document).ready(function () {
	getToken();
});
"use strict";

//Function to display errors
var handleError = function handleError(message) {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({ width: 'toggle' }, 350);
};

//Function to redirect the user to another page
var redirect = function redirect(response) {
	$("#domoMessage").animate({ width: 'hide' }, 350);
	window.location = response.redirect;
};

//Function to send an AJAX request to the server
var sendAjax = function sendAjax(type, action, data, success) {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function error(xhr, status, _error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};
