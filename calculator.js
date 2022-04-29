var viewfinder = document.getElementById('viewfinder');  
var detailResult = document.getElementById('detailResult'); 
var numbers = "0123456789";

let buttons = Array.from(document.getElementsByClassName('button'));

buttons.map( button => {
    button.addEventListener('click', (e) => {
        switch(e.target.innerText){
            case 'C':
                (viewfinder.innerText != '') ? viewfinder.innerText = '' : "pass";
                break;
            case '=':
                if((!compareExpression(viewfinder.innerText[0]))){
                    try{
                        var result = myCalculator(viewfinder.innerText);
                        if(result != "Erro"){
                            result = Math.round(result * 10000) / 10000;
                            viewfinder.innerText = result;
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
            case '←':
                (viewfinder.innerText) ? viewfinder.innerText = viewfinder.innerText.slice(0, -1) : "pass";
                break;
            default:
                viewfinder.innerText += e.target.innerText;
        }
    });
});


function myCalculator(str){
    var expression = str.replace(/\s/g, '');
    var arrayOfNumbers = [];
    var stringTemp = "";
    var foundOperator = false;
    var operators = "";
    var start = str.charAt(0);
    var theEnd = str.charAt(str.length-1);
    var duplicateOperator = lookForDuplicateOperator(str)
    if((numbers.indexOf(start) == -1) || (numbers.indexOf(theEnd) == -1)){
        printDetail("Verifique: "+str, true);
        return "Erro";
    }
    if(duplicateOperator != ""){
        printDetail("Operadores em sequencia ("+duplicateOperator+").", true);
        return "Erro";
    }
    detailResult.innerText += expression + "\r\n";
    for(var i = 0; i < expression.length; i++){
        if(compareExpression(expression[i])){
            foundOperator = true;
            if(operators.indexOf(expression[i]) == -1){
                operators += expression[i]
            }
        }else{
            stringTemp = stringTemp + expression[i];
        }
        if(stringTemp != "" && (foundOperator == true || i == (expression.length-1))){
            arrayOfNumbers.push(stringTemp);
            if(i != (expression.length-1)){
                arrayOfNumbers.push(expression[i])
            }
            stringTemp = "";
            foundOperator = false;
        }
    }
    return startCalculator(arrayOfNumbers, operators);
}

function compareExpression(str){
    if((str == "+") || (str == "-") || (str == "*") || (str == "/")){
        return true;
    }else{
        return false;
    }
}

function startCalculator(arrayExpression, operators){
    var orderOfPrecedence = setPrecedenceOrder(operators); 
    var accumulatedResul= 0;
    for(var i = 0; i < orderOfPrecedence.length; i++ ){
        while(arrayExpression.indexOf(orderOfPrecedence[i]) != -1){
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
        (operators[i] == "/") || (operators[i] == "*") ? firstBlock += operators[i] : secundBlock += operators[i];
    }
    return firstBlock+secundBlock;
}

function solveOperation(operation, firstValue, secondValue){
    var res = 0;
    if(operation == "+"){
        res = parseFloat(firstValue) + parseFloat(secondValue);
    }else if(operation == "-"){
        res = parseFloat(firstValue) - parseFloat(secondValue);
    }else if(operation == "*"){
        res = parseFloat(firstValue) * parseFloat(secondValue);
    }else if(operation == "/"){
        res = parseFloat(firstValue) / parseFloat(secondValue);
    }
    printDetail(firstValue + " " + operation + " " + secondValue + " = "+res.toString(), true)
    return res.toString();
}

function lookForDuplicateOperator(operation){
    var str = ["//","++","--","**", "/+","/-","/*","+/","+-","+*","-/","-+","-*","*/","*+","*-"];
    var part = "";
    for(var i = 0; i < str.length; i++){
      for(var j = 0; j < operation.length; j++){
        if((operation[j]+operation[j+1]) == str[i]){
          return str[i];
        }
      }
    }
    return "";
}

function printDetail(str, jumpLine){
    var jump = jumpLine ? "\r\n" : "";
    detailResult.innerText += str + jump;
}