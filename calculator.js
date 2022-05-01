let viewfinder = document.getElementById('viewfinder');
let detailResult = document.getElementById('detailResult');
const numbers = "0123456789";
const logicalOperators = "/*-+";
let lastKeyPress = "";
let stitch = '';

let buttons = Array.from(document.getElementsByClassName('button'));

buttons.map( button => {
    button.addEventListener('click', (e) => {
        let currentKey = e.target.innerText;
        switch(currentKey){
            case 'C':
                if(viewfinder.innerText !== ''){
                    viewfinder.innerText = '';
                }
                lastKeyPress = "";
                break;
            case '=':
                var numError = stitchInvalided(viewfinder.innerText);
                if(numError == ""){
                    if((!compareExpression(viewfinder.innerText[0])) &&
                    (!compareExpression(viewfinder.innerText.charAt(viewfinder.innerText.length-1)))){
                        try{
                            var result = myCalculator(viewfinder.innerText);
                            if(result === "Erro"){
                                result = Math.round(result * 10000) / 10000;
                                viewfinder.innerText = result;
                                lastKeyPress = "";
                                printDetail("--------------------------------------", true);
                            }
                        } catch (e) {
                            alert(e);
                        }
                        break;
                    }else{
                        printDetail("Verifique: "+viewfinder.innerText, true);
                        break;
                    }
                }else{
                    printDetail("Expressão inválida: "+numError, true);
                }
            case '←':
                (viewfinder.innerText) ? viewfinder.innerText = viewfinder.innerText.slice(0, -1) : "pass";
                break;
            default:
                if((lastKeyPress === "") && (!isOperator(currentKey))){         // A primeira tecla digitada não pode ser um operador
                    viewfinder.innerText += currentKey; 
                }else if(isOperator(currentKey) && isOperator(lastKeyPress)){   // A tecla atual é um operador e a anterior também
                    viewfinder.innerText = viewfinder.innerText.slice(0, -1);
                    viewfinder.innerText += currentKey;
                }else if(isOperator(currentKey) && !isOperator(lastKeyPress)){  // A tecla atual é um operador e a anterior não
                    viewfinder.innerText += currentKey;
                }else if(!isOperator(currentKey) && isOperator(lastKeyPress)) {  // A tecla atual não é um operador e a anterior é
                    viewfinder.innerText += currentKey;
                }else if(!isOperator(currentKey) && !isOperator(lastKeyPress)){  // Ambas as teclas são números
                    if(currentKey === '.'){
                        console.log('Ponto');
                    }
                    viewfinder.innerText += currentKey;
                }
        }    
        lastKeyPress = currentKey;
    });
});

function stitchInvalided(str){
    var numbers = [];
    var posFisrtOperator = 0;
    var posNextOperator = 0;
    var numError = "";
    for(var i = 0; i < str.length; i++){
        if(isOperator(str[i]) || i === 0){
            if(i === 0) {
                posFisrtOperator = i;
            }else{
                posFisrtOperator = i + 1;
            }
            for(var j = i+1; str.length; j++){
                if(isOperator(str[j]) || j === str.length){
                    posNextOperator = j;
                    break;
                }
            }
            numbers.push(str.substring(posFisrtOperator, posNextOperator));
        }
    }
    for(var i = 0; i < numbers.length; i++){
        if(numbers[i].indexOf(".") !== numbers[i].lastIndexOf(".")){
            return numbers[i];
        }
    }
    return numError;
}

function isOperator(str){

    if(logicalOperators.indexOf(str) !== -1){
        return true;
    }else{
        return false;
    }
}

function myCalculator(str){
    var expression = str.replace(/\s/g, '');
    var arrayOfNumbers = [];
    var stringTemp = "";
    var foundOperator = false;
    var operators = "";
    var start = str.charAt(0);
    var theEnd = str.charAt(str.length-1);
    var duplicateOperator = lookForDuplicateOperator(str)
    if((numbers.indexOf(start) === -1) || (numbers.indexOf(theEnd) === -1)){
        printDetail("Verifique: "+str, true);
        return "Erro";
    }
    if(duplicateOperator !== ""){
        printDetail("Operadores em sequencia ("+duplicateOperator+").", true);
        return "Erro";
    }
    detailResult.innerText += expression + "\r\n";
    for(var i = 0; i < expression.length; i++){
        if(compareExpression(expression[i])){
            foundOperator = true;
            if(operators.indexOf(expression[i]) === -1){
                operators += expression[i]
            }
        }else{
            stringTemp = stringTemp + expression[i];
        }
        if(stringTemp !== "" && (foundOperator === true || i === (expression.length-1))){
            arrayOfNumbers.push(stringTemp);
            if(i !== (expression.length-1)){
                arrayOfNumbers.push(expression[i])
            }
            stringTemp = "";
            foundOperator = false;
        }
    }
    return startCalculator(arrayOfNumbers, operators);
}

function compareExpression(str){
    if((str === "+") || (str === "-") || (str === "*") || (str === "/")){
        return true;
    }else{
        return false;
    }
}

function startCalculator(arrayExpression, operators){
    var orderOfPrecedence = setPrecedenceOrder(operators); 
    var accumulatedResul= 0;
    for(var i = 0; i < orderOfPrecedence.length; i++ ){
        while(arrayExpression.indexOf(orderOfPrecedence[i]) !== -1){
            var positionOperator = arrayExpression.indexOf(orderOfPrecedence[i]);
            accumulatedResul = solveOperation(orderOfPrecedence[i],
                                              arrayExpression[positionOperator-1],
                                              arrayExpression[positionOperator+1]);
            arrayExpression.splice(positionOperator-1, 3, accumulatedResul);
        }
    }
    return arrayExpression.toString();
}

function setPrecedenceOrder(operators){
    var firstBlock = "", secundBlock = "";
    for(var i = 0; i < operators.length; i++){
        (operators[i] === "/") || (operators[i] === "*") ? firstBlock += operators[i] : secundBlock += operators[i];
    }
    return firstBlock+secundBlock;
}

function solveOperation(operation, firstValue, secondValue){
    var res = 0;
    if(operation === "+"){
        res = parseFloat(firstValue) + parseFloat(secondValue);
    }else if(operation === "-"){
        res = parseFloat(firstValue) - parseFloat(secondValue);
    }else if(operation === "*"){
        res = parseFloat(firstValue) * parseFloat(secondValue);
    }else if(operation === "/"){
        res = parseFloat(firstValue) / parseFloat(secondValue);
    }
    printDetail(firstValue + " " + operation + " " + secondValue + " = "+res.toString(), true)
    return res.toString();
}

function lookForDuplicateOperator(operation){
    /*
    var str = ["//","++","--","**", "/+","/-","/*","+/","+-","+*","-/","-+","-*","*/","*+","*-"];
    var part = "";
    for(var i = 0; i < str.length; i++){
      for(var j = 0; j < operation.length; j++){
        if((operation[j]+operation[j+1]) == str[i]){
          return str[i];
        }
      }
    */
    return "";
}

function printDetail(str, jumpLine){
    var jump = jumpLine ? "\r\n" : "";
    detailResult.innerText += str + jump;
}
