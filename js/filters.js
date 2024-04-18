function generateFilterExpression(dataArray) {
    let expression = "(";
    for (let i = 0; i < dataArray.length; i++) {
        let subArray = dataArray[i];
        expression += "(";
        for (let j = 0; j < subArray.length; j++) {
            let filterObject = subArray[j];
            expression += `data["${filterObject.field}"] ${filterObject.type} "${filterObject.value}"`;
            if (j < subArray.length - 1) {
                expression += " && ";
            }
        }
        expression += ")";
        if (i < dataArray.length - 1) {
            expression += " || ";
        }
    }
    expression += ")";
    return expression.replace(/like/g, "==");
}


function customFilter(data,str){
    //cur_filter.innerText =formatString(str);
    return eval(str);
}

function formatString(input) {
    let formattedString = input.replace(/\(/, ''); // Remove the first opening parenthesis
    formattedString = formattedString.replace(/\)$/, ''); // Remove the last closing parenthesis
    formattedString = formattedString.replace(/==/g, ' é '); // Replace "==" with " é "
    formattedString = formattedString.replace(/data\["/g, ''); // Remove "data["
    formattedString = formattedString.replace(/"\] /g, ''); // Remove "] "
    formattedString = formattedString.replace(/&&/g, ' e '); // Replace "&&" with " e "
    formattedString = formattedString.replace(/\|\|/g, ' ou '); // Replace "||" with " ou "
    
    return formattedString;
}


export { generateFilterExpression, customFilter, formatString };