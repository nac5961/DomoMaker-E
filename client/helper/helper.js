//Function to display errors
const handleError = (message) => {
	$("#errorMessage").text(message);
	$("#domoMessage").animate({width:'toggle'},350);
};

//Function to redirect the user to another page
const redirect = (response) => {
	$("#domoMessage").animate({width:'hide'},350);
	window.location = response.redirect;
};

//Function to send an AJAX request to the server
const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		dataType: "json",
		success: success,
		error: function(xhr, status, error){
			var messageObj = JSON.parse(xhr.responseText);
			handleError(messageObj.error);
		}
	});
};