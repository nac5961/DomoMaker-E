//Function to send an AJAX request when the user logs in
const handleLogin = (e) => {
	//Prevent the form from submitting
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	//Handle invalid input
	if ($("#user").val() == '' || $("#pass").val() == ''){
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
const handleSignup = (e) => {
	//Prevent the form from submitting
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	//Handle invalid input
	if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == ''){
		handleError("RAWR! All fields are required");
		return false;
	}
	
	//Handle mismatched passwords
	if ($("#pass").val() !== $("#pass2").val()){
		handleError("RAWR! Passwords do not match");
		return false;
	}
	
	//Send the AJAX request
	sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
	
	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the login form
const LoginWindow = (props) => {
	return(
		<form id="loginForm" name="loginForm"
			onSubmit={handleLogin}
			action="/login"
			method="POST"
			className="mainForm">
			<label htmlFor="username">Username: </label>
			<input id="user" type="text" name="username" placeholder="username" />
			<label htmlFor="pass">Password: </label>
			<input id="pass" type="password" name="pass" placeholder="password" />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="formSubmit" type="submit" value="Sign in" />
		</form>
	);
};

//Function to use React to dynamically create the signup form
const SignupWindow = (props) => {
	return(
		<form id="signupForm" name="signupForm"
			onSubmit={handleSignup}
			action="/signup"
			method="POST"
			className="mainForm">
			<label htmlFor="username">Username: </label>
			<input id="user" type="text" name="username" placeholder="username" />
			<label htmlFor="pass">Password: </label>
			<input id="pass" type="password" name="pass" placeholder="password" />
			<label htmlFor="pass2">Password: </label>
			<input id="pass2" type="password" name="pass2" placeholder="retype password" />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="formSubmit" type="submit" value="Sign Up" />
		</form>
	);
};

//Function to render the Login form to the page
const createLoginWindow = (csrf) => {
	ReactDOM.render(
		<LoginWindow csrf={csrf} />,
		document.querySelector("#content")
	);
};

//Function to render the Signup form to the page
const createSignupWindow = (csrf) => {
	ReactDOM.render(
		<SignupWindow csrf={csrf} />,
		document.querySelector("#content")
	);
};

//Function to setup event listeners to the page buttons
//to allow React to render the UI accordingly
const setup = (csrf) => {
	//Get reference to page buttons
	const loginButton = document.querySelector("#loginButton");
	const signupButton = document.querySelector("#signupButton");
	
	//Event listener for signup
	signupButton.addEventListener("click", (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});
	
	//Event listener for login
	loginButton.addEventListener("click", (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});
	
	//Setup default view to login form
	createLoginWindow(csrf);
};

//Function to get a CSRF token from the server for security
const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

//Note: $(document).ready() is similar to window.onload = init;
//Make a call to get the token and render the forms
//when the page loads
$(document).ready(function(){
	getToken();
});