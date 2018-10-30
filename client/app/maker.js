//Function to send an AJAX request when a user creates a domo
const handleDomo = (e) => {
	//Prevent the form from submitting
	e.preventDefault();
	
	$("#domoMessage").animate({width:'hide'},350);
	
	//Handle invalid input
	if ($("#domoName").val() == '' || $("#domoAge").val() == ''){
		handleError("RAWR! All fields are required");
		return false;
	}
	
	//Send the AJAX request
	sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
		loadDomosFromServer();
	});
	
	//Prevent the form from changing pages
	return false;
};

//Function to use React to dynamically create the domo form
const DomoForm = (props) => {
	return(
		<form id="domoForm" name="domoForm"
			onSubmit={handleDomo}
			action="/maker"
			method="POST"
			className="domoForm">
			<label htmlFor="name">Name: </label>
			<input id="domoName" type="text" name="name" placeholder="Domo Name" />
			<label htmlFor="age">Age: </label>
			<input id="domoAge" type="text" name="age" placeholder="Domo Age" />
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makeDomoSubmit" type="submit" value="Make Domo" />
		</form>
	);
};

//Function to dynamically create the UI for displaying the domos
const DomoList = function(props){
	//Render UI that says that no domos are available
	if (props.domos.length === 0){
		return(
			<div className="domoList">
				<h3 className="emptyDomo">No Domos yet</h3>
			</div>
		);
	}
	
	//Use array.map to create UI for each domo
	const domoNodes = props.domos.map(function(domo){
		return(
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
				<h3 className="domoName"> Name: {domo.name} </h3>
				<h3 className="domoAge"> Age: {domo.age} </h3>
			</div>
		);
	});
	
	//Render out the domo list we just created
	return(
		<div className="domoList">
			{domoNodes}
		</div>
	);
};

//Function to make an AJAX request to get the domos from the server
//and render the page
const loadDomosFromServer = () => {
	sendAjax('GET', '/getDomos', null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos} />,
			document.querySelector("#domos")
		);
	});
};

//Function to render forms and domos to the page
const setup = function(csrf){
	//Render domo form
	ReactDOM.render(
		<DomoForm csrf={csrf} />,
		document.querySelector("#makeDomo")
	);
	
	//Render default domo list (empty array)
	ReactDOM.render(
		<DomoList domos={[]} />,
		document.querySelector("#domos")
	);
	
	//Render domo list
	loadDomosFromServer();
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