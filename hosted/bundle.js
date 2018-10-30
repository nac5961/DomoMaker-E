"use strict";

//Function to send an AJAX request when a user creates a domo
var handleDomo = function handleDomo(e) {
	//Prevent the form from submitting
	e.preventDefault();

	$("#domoMessage").animate({ width: 'hide' }, 350);

	//Handle invalid input
	if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
		handleError("RAWR! All fields are required");
		return false;
	}

	//Send the AJAX request
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
		loadDomosFromServer();
	});

	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the domo form
var DomoForm = function DomoForm(props) {
	return React.createElement(
		"form",
		{ id: "domoForm", name: "domoForm",
			onSubmit: handleDomo,
			action: "/maker",
			method: "POST",
			className: "domoForm" },
		React.createElement(
			"label",
			{ htmlFor: "name" },
			"Name: "
		),
		React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
		React.createElement(
			"label",
			{ htmlFor: "age" },
			"Age: "
		),
		React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
		React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
		React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
	);
};

//Function to dynamically create the UI for displaying the domos
var DomoList = function DomoList(props) {
	//Render UI that says that no domos are available
	if (props.domos.length === 0) {
		return React.createElement(
			"div",
			{ className: "domoList" },
			React.createElement(
				"h3",
				{ className: "emptyDomo" },
				"No Domos yet"
			)
		);
	}

	//Use array.map to create UI for each domo
	var domoNodes = props.domos.map(function (domo) {
		return React.createElement(
			"div",
			{ key: domo._id, className: "domo" },
			React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
			React.createElement(
				"h3",
				{ className: "domoName" },
				" Name: ",
				domo.name,
				" "
			),
			React.createElement(
				"h3",
				{ className: "domoAge" },
				" Age: ",
				domo.age,
				" "
			)
		);
	});

	//Render out the domo list we just created
	return React.createElement(
		"div",
		{ className: "domoList" },
		domoNodes
	);
};

//Function to make an AJAX request to get the domos from the server
//and render the page
var loadDomosFromServer = function loadDomosFromServer() {
	sendAjax('GET', '/getDomos', null, function (data) {
		ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
	});
};

//Function to render forms and domos to the page
var setup = function setup(csrf) {
	//Render domo form
	ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

	//Render default domo list (empty array)
	ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

	//Render domo list
	loadDomosFromServer();
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
