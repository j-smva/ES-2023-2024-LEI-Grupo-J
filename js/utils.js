import { giveSemanaAno, giveSemanaSemestre } from './calcSemanas';



function dataParseSalas(csvDataSalas){
    const data = fixTextLocal(csvDataSalas);
    //console.log(data);
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    //console.log(headers);
    const jsonArray = [];
    for(let i = 1; i < lines.length; i++){
        const values = lines[i].split(';');
        const jsonObj = {};
        for(let j = 0; j < headers.length; j++){
            jsonObj[headers[j]] = values[j];
        }
        jsonArray.push(jsonObj);
    }
    return JSON.stringify(jsonArray);
}

function dataParseHorario(csvData){ //não usa tabulator
    const lines = csvData.split('\n');
    const headers = lines[0].split(';');
    headers.push("Semana do Ano", "Semana do Semestre");
    const jsonArray = [];
    for(let i = 1; i < lines.length; i++){
        const values = lines[i].split(';');
        const jsonObj = {};
        for(let j = 0; j < headers.length - 2; j++){
            if(headers[j].includes("Data")){
                jsonObj[headers[j]] = values[j];
                const semanaAno = giveSemanaAno(values[j]);
                const semanaSemestre = giveSemanaSemestre(values[j]);
                jsonObj[headers[headers.length - 2]] = semanaAno;
                jsonObj[headers[headers.length - 1]] = semanaSemestre;
            } else if(headers[j].includes("atribuída")){
                values[j] = values[j].replace(/\r/g, '');
                headers[j] = headers[j].replace(/\r/g, '');
                jsonObj[headers[j]] = values[j];
            } else {
                jsonObj[headers[j]] = values[j];
            }
        }
        jsonArray.push(jsonObj);
    }
    return JSON.stringify(jsonArray);

}

function fixTextLocal(csvDataSalas){
    const fixedText = csvDataSalas
        .replace(/’/g, 'í')
        .replace(/¼/g, 'º')
        .replace(/Ž/g, 'é')
        .replace(/‡/g, 'á')
        .replace(/œ/g, 'ú')
        .replace(/—/g, 'ó')
        .replace(/videoconferncia/g, 'ê')
        .replace(/çtrio/g, 'átrio')
        .replace(/Reuni‹o/g, 'Reunião')
        .replace(/Balc‹o/g, 'Balcão')
        .replace(/Recep‹o/g, 'Recepção')
        .replace(/Edif�cio/g, 'Edifício')
        .replace(/N� caracter�sticas/g, 'Nº características')
        .replace(/t�cnico/g, 'técnico')
        .replace(/Hor�rio/g, 'Horário')
        .replace(/vis�vel/g, 'visível')
        .replace(/p�blico/g, 'público')
        .replace(/Laborat�rio/g, 'Laboratório')
        .replace(/Electr�nica/g, 'Electrónica')
        .replace(/Inform�tica/g, 'Informática')
        .replace(/Telecomunica��es/g, 'Telecomunicações')
        .replace(/Reuni�o/g, 'Reunião')
        .replace(/videoconfer�ncia/g, 'videoconferência')
        .replace(/�trio/g, 'átrio')
        .replace(/M�rio/g, 'Mário')
        .replace(/Aut�noma/g, 'Autónoma')
        .replace(/Audit�rio/g, 'Auditório')
        .replace(/Espa�o Exposi��es/g, 'Espaço Exposições')
        .replace(/Balc�o Recep��o/g, 'Balcão Recepção')
        .replace(/Balne�rio/g, 'Balneário')
        .replace(/Telecomunica›es/g, 'Telecomunicações');

    return fixedText;

};

export { dataParseHorario, dataParseSalas, fixTextLocal};