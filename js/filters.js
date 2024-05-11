/**
 * Função que gera a expressão do filtro pretendido.
 * @param {Array<String>} dataArray - Array com filtros presentes nos headers das colunas
 * @returns {String} - Expressão gerada de acordo com os filtros passados
 */
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

/**
 * Função que avalia o filtro utilizado.
 * @param {String} data - Linha da tabela
 * @param {String} str - String que define a função boolean que processa a data
 * @returns {Boolean} - Define se uma determinada linha da tabela deve ou não ser mostrada
 */
function customFilter(data, str){
    return eval(str);
}

/**
 * Função utilizada para mostrar a expressão do filtro utilizado em texto.
 * @param {String} input - Expressão do filtro que está atualmente a ser utilizado
 * @returns {String} - Tradução do filtro para texto mais facilmente reconhecível
 */
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


export {generateFilterExpression, customFilter, formatString};