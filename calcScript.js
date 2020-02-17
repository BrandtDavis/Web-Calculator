// Brandt Davis
// 30019817
// SENG 513 Assignment 2
// T0
//


var inputValues = [];
var inputTypes = []
var result = "";

function getValues(element) {
  let lastEntry = inputTypes[inputTypes.length - 1];
  console.log(lastEntry);
  console.log(inputTypes);
  // Handle multiple operator entries
  if(element.id === "operator" && lastEntry === "operator"){
    inputValues.pop();
    inputValues.push(element.value);
    reprintValues("bottomDisplay");
  }
  else if(lastEntry === "equals") {
    console.log("equals tiem");
    inputValues = [];
    inputTypes = [];
    document.getElementById("topDisplay").value = "Ans = " + result;

  }
  else if(element.id === "operator" && lastEntry === "leftParenth"){
    if(element.value === "-" && lastEntry === "leftParenth"){
      inputValues.push(element.value);
      inputTypes.push(element.id);
      printValues("bottomDisplay");
    }
    else {
      return;
    }
  }
  // Handle decimal input
  else if(element.id === "decimal"){
    checkDecimal(element);
    return;
  }
  else if(element.id === "rightParenth"){
    checkParentheses(element);
    return;
  }
  else {
    inputValues.push(element.value);
    inputTypes.push(element.id);
    printValues("bottomDisplay");
  }
  console.log(inputValues);
}

// Verify that the decimal entry is valid by checking the current input
function checkDecimal(element){
  let invalidInput = false;
  // Allow decimal as first input
  if(inputTypes.length === 0){
     inputValues.push(element.value);
     inputTypes.push(element.id);
     printValues("bottomDisplay");
     return;
  }
  // Avoid consecutive decimals  
  else if(inputTypes[inputTypes.length - 1] === "decimal"){
    return
  }
  // Allow decimal as first input after an operator
  else if(inputTypes[inputTypes.length - 1] === "operator"){
    inputValues.push(element.value);
    inputTypes.push(element.id);
    printValues("bottomDisplay");
    return;
  }
  
  // If no immediate cases match, iterate and check final case
  //  * Multiple decimals per number
  // 
  // prev will tell us whether there is an operator
  // to seperate decimal inputs
  let prev = inputTypes[inputTypes.length - 1];
  
  for(i = inputTypes.length - 1; i >= 0; i--){
    // Allow number
    if(inputTypes[i] === "number"){
      prev = "number";
      continue;
    }
    // Allow operator, set prev
    else if(inputTypes[i] === "operator"){
      prev = "operator";
      continue;
    }
    // Don't allow multiple decimals per number
    else if(inputTypes[i] === "decimal" && prev === "number"){
      console.log("we breaking here");
      invalidInput = true;
      break;
    }
    // Allow multiple decimals per operator
    else if(inputTypes[i] === "decimal" && prev === "operator"){
      continue;
    } 
  }// For-loop 

  if(invalidInput){
    console.log("tis invlaid");
    return;
  }
  else {
    inputValues.push(element.value);
    inputTypes.push(element.id);
    printValues("bottomDisplay");
  }
} // checkDecimal()

// Check validity of any input parentheses
function checkParentheses(element){
  let leftCount = 0;
  let rightCount = 0;
  let hasContents = false;

  // Do not allow closing parentheses without opening
  if(!inputValues.includes("(")){
    return;
  }

  // Iterate through current array and collect number of left and right parentheses
  // and whether or not the parentheses contain anything
  for(i = 0; i < inputValues.length; i++){
    if(inputValues[i] === "("){
      leftCount++;
    }
    else if(inputValues[i] === ")"){
      rightCount++;
    }
    else if(inputTypes[i] === ("number" || "operator" || "decimal")){
      hasContents = true;
    }

  } // For-loop
  // Ensure parentheses are balanced
  if(leftCount <= rightCount){
    return;
  }
  else  if(!hasContents){
    return;
  }
  else {
    inputValues.push(element.value);
    printValues("bottomDisplay");
  }
  
}

// Need to update so that reclicking equals still displays "result"
// Also need to clear array so that there is not previous value leftover for
// The next entries (perhaps we clear in the getInputs() function)
function evaluateInput() {
  if(inputTypes[inputTypes.length - 1] === "leftParenth"){
    document.getElementById("bottomDisplay").value = "Error";
    return;
  }
  else if(!inputValues.includes("=")) {
    inputValues.push("=");
    inputTypes.push("equals");
    reprintValues("topDisplay");
  }
  let expression = document.getElementById("bottomDisplay").value; 
  let finalEquation = "";
  console.log(expression)

  for(i = 0; i < expression.length; i++){
    console.log(expression[i])
    if(expression[i] === "x"){
      finalEquation+= "*";
      console.log(expression[i])
    }
    else if (expression[i] === "(" && expression[i-1] === ")"){
      finalEquation+= "*" + expression[i];
    }
    else {
      finalEquation+=expression[i];
    }
  } 
  console.log(expression)

  result = eval(finalEquation);

  if(result === Infinity){
    document.getElementById("bottomDisplay").value = "Error";
  }
  else if(result === undefined){
    document.getElementById("bottomDisplay").value = "Error";
  }
  else {
    document.getElementById("bottomDisplay").value = result;
    result = "(" + result + ")";
  }
  inputValues = ["="];
  inputTypes = ["equals"]; 
}

// Reset the bottom display to '0'
// Print "Ans = " to top display
// Clear input arrays
function clearInput(){
  document.getElementById("bottomDisplay").value = "0";
  document.getElementById("topDisplay").value = "0";
  inputValues = [];
  inputTypes = [];
}

// Remove the last input from the input arrays
// Reprint display
function backspace(){
  if(inputValues.length === 1){
    document.getElementById("bottomDisplay").value = "0";
    inputValues.pop();
    inputValues.push("0");
    reprintValues("bottomDisplay")    
  }
  else {
    inputValues.pop();
    inputTypes.pop()
    reprintValues("bottomDisplay")
  }
}

// Print newest value added to inputValues
function printValues(display){
  if(inputValues.length === 1){
    document.getElementById(display).value = inputValues[inputValues.length - 1];
  }
  else {
    document.getElementById(display).value += inputValues[inputValues.length - 1];
  }
}

// Reprints the current display if existing input is changed
function reprintValues(display) {
  document.getElementById(display).value = "";
  for(i = 0; i < inputValues.length; i++){
    document.getElementById(display).value += inputValues[i];
  }
}


function printAns(){
  if(result !== ""){
    for(i = 0; i < result.length; i++){
      console.log(result[i]);
      if(result[i] === "("){
        inputTypes.push("leftParenth");
      }
      else if(result[i] === ")"){
        inputTypes.push("rightParenth");
      }
      else if(result[i] === "-"){
        inputTypes.push("operator");
      }
      else if(result[i] < 0 || result[i] > 0){
        inputTypes.push("number")
      }
    }
    inputValues.push(result[i]);
    document.getElementById("bottomDisplay").value += result;
  }
}