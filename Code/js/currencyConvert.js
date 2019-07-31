$(document).ready(function(){
	  getCurrencyData().then((data) => {
	   //Function Call to populate currencies to Source Currency Dropdown
	   $populateDropdown("#sourceCurrency",data);
	   //Function Call to populate currencies to Destination Currency Dropdown
	   $populateDropdown("#destinationCurrency",data);
	 }).catch((error) => {  
	   console.log('Error from API Call: ' + error);  
	 }); 
	 $("#btn").click( function(){
	  //getting the amount from the input box
	  let amount = $("#sourceNumber").val();
	  //getting the source currency
	  let fromCurrency = $("#sourceCurrency").val();
	  //getting the destination currency
	  let toCurrency = $("#destinationCurrency").val();
	  let isValidated = $validation(amount, fromCurrency, toCurrency);
	  if(isValidated){
		   convertAmount(amount, fromCurrency, toCurrency).then((data) => {
		   //Set the converted value in our result text box
		   $("#destinationNumber").val(data);
		 }).catch((error) => {  
		   console.log('Error from API Call: ' + error);  
	 });
	  }
     } 
);
});	
$validation = function(amount,fromCurrency,toCurrency){
	 //validation to check amount 
	  if (amount < 1) {
		alert("Please enter a amount");
		return false;
	  } 
	  //Code to check Source Currency is selected or not
	  else if(fromCurrency == null){
		  alert("Please Provide Source Currency");
		  return false;
	  }
	  //Code to check destination Currency is selected or not
	  else if(toCurrency == null){
		  alert("Please Provide Destination Currency");
		  return false;
	  }
	  else {
		return true;
	  }
};
$populateDropdown = function(element,data){ 
	//Iterate through the API data
	$.each(data, function(key, value) {
		//Prepare option to add in select element
		let str="<option value='" +key + "'>" +value + "</option>";
		//Adding prepared option 
		$(element).append(str); 
	});
};
const getCurrencyData = function () {
  try{
    return new Promise((resolve, reject) => {
    //Api to get currency list
    const apiUrl = 'https://openexchangerates.org/api/currencies.json';
    //creating object
    const request = new XMLHttpRequest();
	//Open connection
    request.open('GET', apiUrl, true);
    //loading the data
    request.onload = function () {
      //if response is OK then proceed further
      if (request.status === 200) {
        //parsing the data
        const data = JSON.parse(request.responseText);
		//console.log(data);
        resolve(data);
      }
      else {
        //Logging the exception if any
        console.log('Error occurred!')
        reject();
      }
    }
    //sending the data
    request.send();
  })
}catch (exception) {
    console.log(exception);
    alert("Not able to process your request! Try after sometime.");
  }
}
const convertAmount = function (amount, sourceCurrency, destinationCurrency) {
  try{
    return new Promise((resolve, reject) => {
	//Will need apikey to get the access
	var apikey = 'd3111f7a966f446996c0110ec22667cc';
    let convertedAmount = 0;
	let destinationCurrencyString,sourceCurrencyString;
    //api end point to get the all corrency conversion rate 
    const url = 'https://openexchangerates.org/api/latest.json?app_id=' + apikey;
    //creating object
    const request = new XMLHttpRequest();
    //opening connection and making GET request
    request.open('GET', url, true);
    //loading the data
    request.onload = function () {
      //if response is OK then proceed further
      if (request.status === 200) {
        //parsing the data
        const data = JSON.parse(request.responseText);
        //formula to convert the currency 
		$.each(data.rates, function(key, value) {
			//Store current rate of Source currency from API data
			if(key==sourceCurrency){
				sourceCurrencyString = value;
				console.log(sourceCurrencyString);
			}
			//Store current rate of destination currency from API data
		    if(key==destinationCurrency){
				destinationCurrencyString = value;
				console.log(sourceCurrencyString);
			}
		});
		//Calculate the converted amount
        convertedAmount = amount * (destinationCurrencyString / sourceCurrencyString);
        //return the converted currency
        resolve(convertedAmount);
      } else {
        //Logging the exception if any
        alert('Not able to process your request!');
        resolve(0);
      }
    }
    //sending the data
    request.send();
  })
}catch (exception) {
	//catch the exception
    console.log(exception);
    alert("Not able to process your request! Try after sometime.");
  }
}