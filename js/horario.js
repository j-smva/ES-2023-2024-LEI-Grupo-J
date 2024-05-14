import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { dataParseHorario, dataParseSalas, extractAttributeValues, extractAttributes, extractNomeSalas, getCursos, getTurmas, getUCs } from './utils';
import { generateFilterExpression, customFilter, formatString } from './filters';


import { addHeaderToDiv, addParagraphToDiv, createButton, createCheckboxes, createDateInputWithSubmit, createDiv, createDivWAttributes, createDualSelect, createInput, createMultiSelect, createNumberInput, createSingleDateInputWithSubmit, createSingleSelect } from './htmlelems';
import { datasLength, generateClassDuration, generateSubClasses, generateTimeStamps, horasInicioLength, removeDuplicatesTimestamps, removeSalasFromList, removeSelectedWeekdaysFromMap, setAulaforSub, setDatas, setDatasBasedOnSub, setSalas, setSalasByType, setSingleDay, setWeekDays, timestampToMilliseconds, setSemestre, setCursos, setAulas, setTamanhoAula, getNumAulas, getAulaforSub } from './suggestion';
import dateCraft from 'date-craft';
import { getArrayDatesBetween, giveSemanaAno, giveSemanaSemestre, turnToDate } from './calcSemanas';
import { filterAulasByDates, generateData, generateGraphDiagram, generateHeatMap, getAulaByCurso, getAulaByUc, heatMapNull, setAulasGraph, setDatasHeatmap, setHeatMapData, setSalasByCapacidade, setSalasByNumCaract, setSalasHeatmap } from './mapandchart';


var tablefinal; //tabela geral
var tabledata; // dados da tabela geral

var cur_filter; //filtro atual da tabela
var headerFilters; //filtros dos headerInputs
var filterMatrix = []; //matriz para o calculo dos filtros
var counter = 0; //contador para o calculo dos filtros

var aulaParaSubstituicao; //ter atenção se este é mesmon necessário
var divMain; //divPrincipal a ser utilzada para mostrar os elementos html criados
var dataSalas; //dados referentes às salas
var nomeSalas = []; //nomes das salas
var tipoSalas = []; //tipos de salas
var UCs = []; //todas as UCs existentes
var isUCAllocation = false; //variavel que distingue se estamos a utilizar a funcionalidade de substituição de aulas ou de alocação de aulas de uma uc
var aulamanual = { //variavel que incializa um objeto aula para usar como base quando queremos inserir manualmente uma aula no horário
    "Curso": "ME",
    "Unidade Curricular": "Teoria dos Jogos e dos Contratos",
    "Turno": "01789TP01",
    "Turma": "MEA1",
    "Inscritos no turno": "30",
    "Dia da semana": "Sex",
    "Hora início da aula": "13:00:00",
    "Hora fim da aula": "14:30:00",
    "Data da aula": "02/12/2022",
    "Características da sala pedida para a aula": "Sala Aulas Mestrado",
    "Sala atribuída à aula": "AA2.25",
    "Semana do Ano": 48,
    "Semana do Semestre": 13
}

tablefinal = new Tabulator("#example-table", {
    pagination: "local",
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 40],
    paginationCounter: "rows",
    placeholder: "Awaiting Data, Please Load File",
});



document.addEventListener('DOMContentLoaded', function () {
    const githubButton = document.getElementById('githubButton');
    githubButton.addEventListener('click', gitHubCSVHorario);
    const githubButtonSalas = document.getElementById('githubButtonSalas');
    githubButtonSalas.addEventListener('click', function () {
        const githubLink = document.getElementById('githubLinkSalas').value;
        gitHubCSVSalas(1, githubLink);
    });
    const localButton = document.getElementById('localButton');
    localButton.addEventListener('change', function (event) {
        readLocalFile(event, 1);
    })
    const localButtonSalas = document.getElementById('localButtonSalas');
    localButtonSalas.addEventListener('change', function (event) {
        readLocalFile(event, 2);
    })
});

/**
 * Função que inicializa os botões relativos a substituir aula ou Alocar aulas de uma UC, criar um heatmap ou gráfico de conflitualidade, ou Introduzir uma aula manualmente
 */
function tableOptionsStartup() {
    heatMapNull();
    if (!divMain) {
        divMain = createDiv('Sub');
        divMain.style.display = "flex";
        divMain.style.flexDirection = "column";
        document.body.appendChild(divMain);
    } else {
        clearDiv(divMain);
    }
    const buttonSub = createButton('Substituir Aula', '', handleSubAula);
    const buttonAulaNew = createButton('Alocar Novas Aulas', '', handleAlocarAulas);
    const heatmapButton = createButton('Gerar HeatMap de Ocupação', '', handleHeatMapSelection);
    const graphdiagramButton = createButton('Gerar gráfico de conflitualidade', '', handleGraphSelection);
    const addManual = createButton('Introduzir Aula Manualmente', '', handleManual);
    addHeaderToDiv(1, "Opções", divMain);
    divMain.appendChild(buttonSub);
    divMain.appendChild(buttonAulaNew);
    divMain.appendChild(heatmapButton);
    divMain.appendChild(graphdiagramButton);
    divMain.appendChild(addManual);
}

/**
 * Função utilizada para limpar o conteúdo de uma determinada div
 * @param {HTMLElement} div - div na qual queremos remover o conteúdo 
 */
function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

/**
 * Função que dá handle ao cenário de clique no botão de substituir aula
 */
function handleSubAula() {
    setAulas(1);
    if (!tabledata) {
        alert('Horário não gerado');
    } else {
        const aulaSelected = tablefinal.getSelectedData();
        switch (aulaSelected.length) {
            case 0:
                alert('Aula não selecionada');
                break;
            case 1:
                //alert('tudo fixolas');
                aulaParaSubstituicao = aulaSelected[0];
                setAulaforSub(aulaParaSubstituicao);
                secondSalaSubmission(3, 2);
                break;
            default:
                alert('Selecionar apenas uma aula');
        }
    }
}

/**
 * Função que dá hanlde à submission do ficheiro de salas para a substituição de aula ou alocação de aula de uma uc
 * @param {Number} numberLocal - cenário a despoletar na função que lê ficheiros local
 * @param {Number} numberGitHub - cenário a despoletar na função que obtém o ficheiro a partir de um link no github
 */
function secondSalaSubmission(numberLocal, numberGitHub) {
    clearDiv(divMain);
    addParagraphToDiv('Submeter ficheiro com informação sobre as salas', divMain);
    const textInput = createInput('url', 'Enter Raw Link', '', null);
    divMain.appendChild(textInput);
    textInput.addEventListener('change', function () {

        gitHubCSVSalas(numberGitHub, textInput.value);
    });
    const fileInput = createInput('file', 'Enter File', '', null);
    divMain.appendChild(fileInput);
    fileInput.addEventListener('change', function (event) {

        readLocalFile(event, numberLocal);
    });
}

/**
 * Função que dá set aos parâmetros necessários para o cálculo das sugestões
 * @param {} content - conteudo do ficheiro de salas
 */
function subAulaInfoSetter(content) {
    dataSalas = dataParseSalas(content);
    nomeSalas = extractNomeSalas(dataSalas);
    tipoSalas = extractAttributes(dataSalas);

    //console.log(dataSalas);
    //console.log(nomeSalas);
    //console.log(tipoSalas);
}

/**
 * Função que dá set aos botões que permitem alocar ou excluir salas
 */
function salasButtonsSetter() {
    clearDiv(divMain);
    const buttonAlocarSala = createButton('Alocar Sala(s) Específica', '', createOptionsAndBackButton, [nomeSalas, handleAllocateSalas, 'Alocar Sala']);
    divMain.appendChild(buttonAlocarSala);

    const buttonAlocarTipo = createButton('Alocar Tipo(s) de Sala Específico', '', createOptionsAndBackButton, [tipoSalas, handleAllocateTipo, 'Alocar Tipo(s) de Sala']);
    divMain.appendChild(buttonAlocarTipo);

    const buttonExludeSala = createButton('Excluir Sala(s) Especifica', '', createOptionsAndBackButton, [nomeSalas, handleExcludeSalas, 'Excluir Sala']);
    divMain.appendChild(buttonExludeSala);

    const buttonExcludeTipo = createButton('Excluir Tipo(s) de Sala Específco', '', createOptionsAndBackButton, [tipoSalas, handleExcludeTipo, 'Excluir Tipo(s) de sala']);
    divMain.appendChild(buttonExcludeTipo);

    const allsalas = createButton('Incluir Todas as Salas', '', handleAllSalas);
    divMain.appendChild(allsalas);
}

/**
 * Função que dá handle ao caso de se decidir usar todas as salas
 */
function handleAllSalas() {
    setSalas(nomeSalas);
    setAllocationOptions();
}

/**
 * Função que cria um select multiple com determinadas opções e um botão para voltar ao ecrã de decisão de salas
 * @param {Array<String>} options - opções para popular o select
 * @param {Function} handler - função que dará handle à seleção de opções
 * @param {String} headerText - texto de header a mostrar na página
 */
function createOptionsAndBackButton(options, handler, headerText) {
    clearDiv(divMain);
    addHeaderToDiv(1, headerText, divMain);
    const div = createMultiSelect(options, '', handler);
    divMain.appendChild(div);
    const goBackButton = createButton('Voltar a opções de Salas', '', salasButtonsSetter);
    divMain.appendChild(goBackButton);
}

/**
 * Função que dá handle ao cenário de escolher salas por tipo
 * @param {Array<String>} options - tipos de salas selecionados
 */
function handleAllocateTipo(options) {
    if (options.length === 0) {
        alert('Nenhum Tipo de Sala selecionada');
    } else {
        setSalas(setSalasByType(dataSalas, options));
        setAllocationOptions();
    }
}

/**
 * Função que dá handle ao cenário de escolha de salas específicas
 * @param {Array<String>} options - Salas selecionadas
 */
function handleAllocateSalas(options) {
    if (options.length === 0) {
        alert('Nenhuma Sala selecionada');
    } else {
        setSalas(options);
        setAllocationOptions();
    }
}

/**
 * Função que dá handle ao cenário de exclusão de salas específicas
 * @param {Array<String>} options - salas selecionadas para exclusão
 */
function handleExcludeSalas(options) {
    if (options.length === 0) {
        alert('Nenhuma Sala selecionada');
    } else {
        setSalas(nomeSalas);
        removeSalasFromList(options);
        setAllocationOptions();
    }

}

/**
 * Função que dá handle ao cenário de exclusão de salas por tipo
 * @param {Array<String>} options - tipos de sala selecionados para exclusão
 */
function handleExcludeTipo(options) {
    if (options.length === 0) {
        alert('Nenhum Tipo de Sala selecionada');
    } else {
        setSalas(nomeSalas);
        removeSalasFromList(setSalasByType(dataSalas, options));
        setAllocationOptions();
    }
}

/**
 * Função que define os botões para seleção de opções de alocação
 */
function setAllocationOptions() {
    if (isUCAllocation) {
        isUCAllocation = false;
        handleExlusionOptions();
    } else {
        clearDiv(divMain);
        addHeaderToDiv(1, 'Opções de Alocação', divMain);
        const sameDay = createButton('Mesmo Dia', '', handleSameDay);
        const sameWeek = createButton('Mesma Semana', '', handleSameWeek);
        const betweenDates = createButton('Entre Datas', '', handleBetweenDates);
        const excludeOptions = createButton('Opções de Exclusão', '', handleExlusionOptions);
        divMain.appendChild(sameDay);
        divMain.appendChild(sameWeek);
        divMain.appendChild(betweenDates);
        divMain.appendChild(excludeOptions);
    }
}

/**
 * Função que dá handle à escolha de alocação no mesmo dia
 */
function handleSameDay() {
    setSingleDay();
    setExclusionOptions();
}

/**
 * Função que dá handle à escolha de alocação na mesma semana
 */
function handleSameWeek() {
    const weekIni = dateCraft.getStartOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"]));
    const weekEnd = dateCraft.subtractDays(dateCraft.getEndOfWeek(turnToDate(aulaParaSubstituicao["Data da aula"])), 2);
    setDatas(weekIni, weekEnd);
    setExclusionOptions();
}

/**
 * Função que gera campos para seleção de duas datas
 */
function handleBetweenDates() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Entre Datas', divMain);
    const datesInput = createDateInputWithSubmit('', handleBetweenDatesInput);
    divMain.appendChild(datesInput);
    const goBackButton = createButton('Voltar a opções de Alocação', '', setAllocationOptions);
    divMain.appendChild(goBackButton);
}

/**
 * Função que dá handle à seleção das duas datas
 * @param {String} inicio - data inicial
 * @param {String} fim - data final
 */
function handleBetweenDatesInput(inicio, fim) {
    //console.log(inicio);
    //console.log(fim);
    if (inicio && fim) {
        const ini = new Date(inicio);
        const end = new Date(fim);
        if (end > ini) {
            setDatas(ini, end);
            setExclusionOptions();
        } else {
            alert('Data de Inicio maior que Data de fim');
        }
    } else {
        alert('Submeter ambas as datas');
    }
}

/**
 * Função que dá handle à seleção do botão de opções de exclusão
 */
function handleExlusionOptions() {
    setDatasBasedOnSub();
    setExclusionOptions();
}

/**
 * Função que define os botões para seleção de opções de exclusão
 */
function setExclusionOptions() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Opções de Exclusão (Horas)', divMain);
    const setPeriods = createButton('Períodos Predefinidos', '', handleSetPeriods);
    divMain.appendChild(setPeriods);
    const entreHoras = createButton('Entre Horas', '', handleEntreHoras);
    divMain.appendChild(entreHoras);
    const nenhum = createButton('Nenhum', '', callSetDays);
    divMain.appendChild(nenhum);
    const goBackButton = createButton('Voltar Atrás', '', setAllocationOptions);
    divMain.appendChild(goBackButton);

}

/**
 * Função que gera o select necessário para escolher períodos predefinidos
 */
function handleSetPeriods() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Períodos Predefinidos para Exclusão de Horas de Início', divMain);
    addParagraphToDiv('Manhã: 08:00:00 - 12:30:00', divMain);
    addParagraphToDiv('Tarde: 13:00:00 - 18:30:00', divMain);
    addParagraphToDiv('Noite: 19:00:00 - 21:30:00', divMain);
    const option = createMultiSelect(['Manhã', 'Tarde', 'Noite'], '', handleSetPeriodsSelect);
    divMain.appendChild(option);
}

/**
 * Função que dá handle ao cenário de escolha de periodos predefinidos para exclusão
 * @param {Array<String>} options 
 */
function handleSetPeriodsSelect(options) {
    generateTimeStamps();
    options.forEach(option => {
        switch (option) {
            case 'Manhã':
                removeDuplicatesTimestamps(generateClassDuration("08:00:00", "12:30:00"));
                break;
            case 'Tarde':
                removeDuplicatesTimestamps(generateClassDuration("13:00:00", "18:30:00"));
                break;
            case 'Noite':
                removeDuplicatesTimestamps(generateClassDuration("19:00:00", "21:30:00"));
                break;
        }
    });
    //console.log(horasInicioLength());
    if (horasInicioLength() === 0) {
        alert('Não é possivel remover todas as opções');
        handleSetPeriods();
    } else {
        if (datasLength() === 1) {
            setWeekDays();
            readyToShowSuggestion();
        } else {
            setDaysOfWeek();
        }
        //alert('tudo de boa');
    }
}

/**
 * Função que gera os campos necessários para a escolha de duas timestamps
 */
function handleEntreHoras() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Horas inicias e finais do período a excluir', divMain);
    const container = createDualSelect(generateClassDuration("08:00:00", "21:30:00"), '', handleEntreHorasSelection);
    divMain.appendChild(container);
}

/**
 * Função que dá handle à seleção de duas timestamps
 * @param {String} horaIni - timetamp inicial
 * @param {String} horaEnd  - timestamp final
 */
function handleEntreHorasSelection(horaIni, horaEnd) {
    console.log(horaIni);
    console.log(horaEnd);
    console.log(timestampToMilliseconds(horaIni));
    console.log(timestampToMilliseconds(horaEnd));
    if (timestampToMilliseconds(horaIni) > timestampToMilliseconds(horaEnd)) {
        alert('Hora de fim maior do que hora de início');
    } else {
        generateTimeStamps();
        removeDuplicatesTimestamps(generateClassDuration(horaIni, horaEnd));
        if (datasLength() === 1) {
            setWeekDays();
            readyToShowSuggestion();
        } else {
            setDaysOfWeek();
        }
    }
}

/**
 * Função que dá handle à chamada dos dias da semana
 */
function callSetDays() {
    generateTimeStamps();
    if (datasLength() === 1) {
        setWeekDays();
        readyToShowSuggestion();
    } else {
        setDaysOfWeek();
    }
}

/**
 * Função que gera as checkboxes necessárias para a escolha de dias da semana para exclusão
 */
function setDaysOfWeek() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Dias da Semana a excluir', divMain);
    const check = createCheckboxes(["Seg", "Ter", "Qua", "Qui", "Sex"], '', handleDaysOfWeekSelect);
    divMain.appendChild(check);
}

/**
 * Função que dá handle aos dias da semana selecionados para exclusão
 * @param {Array<Number>} selectedWeekDays - Números associados aos dias da semana selecionados: 1-segunda; 5-sexta
 */
function handleDaysOfWeekSelect(selectedWeekDays) {
    console.log(selectedWeekDays);
    setWeekDays();
    removeSelectedWeekdaysFromMap(selectedWeekDays);
    readyToShowSuggestion();
}

/**
 * Função que prepara botão para a criação da tabela com as sugestões
 */
function readyToShowSuggestion() {
    clearDiv(divMain);
    const generate = createButton('Gerar Sugestões', '', createTableSuggestion);
    divMain.appendChild(generate);
}

/**
 * Função que cria a tabela com as sugestões geradas
 */
function createTableSuggestion() {
    clearDiv(divMain);
    const message = createDiv('message')
    addHeaderToDiv(1, "Alocar " + getNumAulas() + " aulas", message);
    divMain.appendChild(message)
    const suggestion = createDiv('tabulator');
    suggestion.id = 'suggestion'
    divMain.appendChild(suggestion);
    const novatabledata = generateSubClasses(tabledata);
    const tableS = new Tabulator("#suggestion", {
        data: novatabledata, // Your data array here,
        layout: "fitColumns", // Adjust table layout as needed
        autoColumns: true,
        autoColumnsDefinitions: function (definitions) {
            //definitions - array of column definition objects

            definitions.forEach((column) => {
                column.headerFilter = true; // add header filter to every column
            });

            return definitions;
        },
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        paginationCounter: "rows",
        headerFilter: true,
        rowHeader: {
            headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                cell.getRow().toggleSelect();
            }
        },
        footerElement: "<button id='Select'>Selecionar Aula Sub</button><button id='Reset'>Reset</button>",

    });
    tableS.on("tableBuilt", function () {
        const buttonSub = document.getElementById("Select");
        const button2 = document.getElementById("Reset");
        function handleClick() {
            const novaAula = tableS.getSelectedData();
            if (novaAula.length == 0) {
                alert('Nenhuma aula selecionada');
            } else if (novaAula.length > getNumAulas()) {
                alert('Número Máximo de aulas ultrapassado');
            } else {
                if (getAulaforSub()["Turno"] == "---") {
                    setAulas(getNumAulas() - novaAula.length);
                    novaAula.forEach(function (row) {
                        tablefinal.addRow(row, true);
                    });
                    tableS.getSelectedRows().forEach(row => {
                        row.delete();
                    })
                    console.log(getNumAulas());
                    if (getNumAulas() == 0) {
                        tableOptionsStartup();
                    }
                    clearDiv(message);
                    addHeaderToDiv(1, "Alocar " + getNumAulas() + " aulas", message);

                } else {
                    tablefinal.addRow(novaAula[0], true);
                    const row = tablefinal.getSelectedRows();
                    row[0].delete();
                    //clearDiv(divMain);
                    //divMain.remove();
                    tableOptionsStartup();
                }
            }
        }
        function reset() {
            tableOptionsStartup();
        }
        button2.removeEventListener('click', reset);
        button2.addEventListener('click', reset);
        buttonSub.removeEventListener('click', handleClick);
        buttonSub.addEventListener('click', handleClick);
    });
}

/**
 * Função que dá handle ao clique do botão alocar aulas
 */
function handleAlocarAulas() {
    if (!tabledata) {
        alert('Horário não gerado');
    } else {
        isUCAllocation = true;
        secondSalaSubmission(4, 3);
    }
}

/**
 * Função que gere as definições para a criação de sugestões
 * @param {} content - conteudo do ficheiro de salas
 */
function handleAlocarAulasSettings(content) {
    clearDiv(divMain);
    addParagraphToDiv('Escolher UC', divMain);
    UCs = getUCs(tablefinal.getData());
    dataSalas = dataParseSalas(content);
    nomeSalas = extractNomeSalas(dataSalas);
    tipoSalas = extractAttributes(dataSalas);
    const select = createSingleSelect(UCs, '', handleUCsSelect);
    divMain.appendChild(select);
}

/**
 * Função que dá handle à seleção de UCs
 * @param {Array<String>} options - UCS escolhidas
 */
function handleUCsSelect(options) {
    setAulaforSub({ "Curso": "LIGE, LIGE-PL", "Unidade Curricular": options, "Turno": "---", "Turma": "IGE-PL-C2, IGE-PL-C1", "Inscritos no turno": "-", "Dia da semana": "Ter", "Hora início da aula": "18:00:00", "Hora fim da aula": "19:30:00", "Data da aula": "00/00/0000", "Semana do Ano": 43 });
    clearDiv(divMain);
    addParagraphToDiv('Escolher Semestre', divMain);
    const stSemestre = createButton('1º Semestre', '', handleStSemestre);
    const ndSemestre = createButton('2º Semestre', '', handlendSemestre);
    divMain.appendChild(stSemestre);
    divMain.appendChild(ndSemestre);
}

/**
 * Função que dá handle à seleção do primeiro semestre
 */
function handleStSemestre() {
    setSemestre(1);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Cursos', divMain);
    const select = createMultiSelect(getCursos(tablefinal.getData()), '', handleCursosSelect);
    divMain.appendChild(select);
}

/**
 *  Função que dá handle à seleção do segundo semestre
 */
function handlendSemestre() {
    setSemestre(2);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Cursos', divMain);
    const select = createMultiSelect(getCursos(tablefinal.getData()), '', handleCursosSelect);
    divMain.appendChild(select);
}

/**
 * Função que dá handle à seleção de cursos
 * @param {Array<String>} options - cursos escolhidos
 */
function handleCursosSelect(options) {
    if (options.length === 0) {
        alert('Escolher pelo menos um curso');
    } else {
        setCursos(options);
        clearDiv(divMain);
        addParagraphToDiv('Escolher Turmas', divMain);
        const select = createMultiSelect(getTurmas(tablefinal.getData()), '', handleTurmasSelect);
        divMain.appendChild(select);
    }
}

/**
 * Função que dá handle às turmas escolhidas
 * @param {Array<String>} options - Turmas escolhidas
 */
function handleTurmasSelect(options) {
    if (options.length === 0) {
        alert('Escolher pelo menos uma turma');
    } else {
        clearDiv(divMain);
        addParagraphToDiv('Escolher número de aulas', divMain);
        const num = createNumberInput(1, '', handleAulasNum);
        divMain.appendChild(num);
    }
}

/**
 * Função que dá handle ao número de aulas pretendido
 * @param {Number} option - número de aulas
 */
function handleAulasNum(option) {
    if (option === 0) {
        alert('Escolher pelo menos uma aula');
    } else {
        console.log(option);
        setAulas(option);
        clearDiv(divMain);
        addParagraphToDiv('Escolher duração das aulas', divMain);
        const num = createNumberInput(30, '', handleAulasDuration);
        divMain.appendChild(num);
    }
}

/**
 * Função que dá handle à duração de aulas pretendida
 * @param {Number} option - duração das aulas
 */
function handleAulasDuration(option) {
    if (option === 0) {
        alert('Escolher duração de aula');
    } else {
        setTamanhoAula(option);
        salasButtonsSetter();
    }
}


/**
 * Submete o ficheiro das salas para os cenários apropriados
 */
function handleHeatMapSelection() {
    secondSalaSubmission(5, 4);
}

/**
 * Gera os primeiros botões para a definição de filtros do heatmap, relativamente às salas que irão ser consideradas
 */
function generateHeatMapFilters() {
    clearDiv(divMain);
    addHeaderToDiv(1, 'Filtros HeatMap', divMain);
    const buttonTiposSala = createButton('Filtrar por tipo de sala', '', handleHeatMapTipoSala);
    const capacidade = createButton('Filtrar por capacidade', '', handleHeatMapCapacidade);
    const numCarac = createButton('Filtrar por número de características', '', handleHeatMapNumCarac);
    const allRooms = createButton('Todas as salas', '', handleAllRoomSelection);

    divMain.appendChild(buttonTiposSala);
    divMain.appendChild(capacidade);
    divMain.appendChild(numCarac);
    divMain.appendChild(allRooms);
}

/**
 * Função que lida com o cenário de seleção de todas as salas
 */
function handleAllRoomSelection() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Tipo de Sala a filtrar', divMain);
    tipoSalas = extractNomeSalas(dataSalas);
    setSalasHeatmap(tipoSalas);
    handleHeatMapDateFrame();
}

/**
 * Função que lida com o cenário de seleção de sala por tipo
 */
function handleHeatMapTipoSala() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Tipo de Sala a filtrar', divMain);
    tipoSalas = extractAttributes(dataSalas);
    const selec = createMultiSelect(tipoSalas, '', handleHeatMapTipoSalaSelection);
    divMain.appendChild(selec);

}

/**
 * Função que lida com a submissão dos tipos de sala
 * @param {String} options - tipo de sala selecionados
 */
function handleHeatMapTipoSalaSelection(options) {
    setSalasHeatmap(setSalasByType(dataSalas, options));
    handleHeatMapDateFrame();
}

/**
 * Função que lida com o cenário de seleção de sala por capacidade
 */
function handleHeatMapCapacidade() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Capacidade das salas', divMain);
    const select = createNumberInput(1, '', handleHeatMapCapacidadeSelection);
    divMain.appendChild(select);

}

/**
 * Função que lida com a submissão da capacidade de sala para filtrar
 * @param {Number} option - capacidade submetida
 */
function handleHeatMapCapacidadeSelection(option) {
    if (option == 0 || option < 0) {
        alert('Tem de ser selecionado um número positivo');
    } else {
        setSalasHeatmap(setSalasByCapacidade(dataSalas, option));
        handleHeatMapDateFrame();
    }
}

/**
 * Função que lida com o cenário de seleção de sala por número de características
 */
function handleHeatMapNumCarac() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Número de Características das salas', divMain);
    const select = createNumberInput(1, '', handleHeatMapNumCaracSelection);
    divMain.appendChild(select);
}

/**
 * Função que lida com a submissão da capacidade de sala para filtrar
 * @param {Number} option - Número de características submetido
 */
function handleHeatMapNumCaracSelection(option) {
    if (option == 0 || option < 0) {
        alert('Tem de ser selecionado um número positivo');
    } else {
        setSalasHeatmap(setSalasByNumCaract(dataSalas, option));
        handleHeatMapDateFrame();
    }
}

/**
 * Função que cria os inputs de data para selecionar que período de tempo será displayed pelo heatMap
 */
function handleHeatMapDateFrame() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Período para análise', divMain);
    const datas = createDateInputWithSubmit('', handleHeatMapDateFrameSelection);
    divMain.appendChild(datas);
}

/**
 * Função que lida com a submissão das datas para o heatmap
 * @param {String} inicio - data inicial
 * @param {String} fim - data final 
 */
function handleHeatMapDateFrameSelection(inicio, fim) {
    if (inicio && fim) {
        const ini = new Date(inicio);
        const end = new Date(fim);
        if (end > ini) {
            setDatasHeatmap(ini, end);
            finalizeHeatMap();

        } else {
            alert('Data de Inicio maior que Data de fim');
        }
    } else {
        alert('Submeter ambas as datas');
    }
}

/**
 * Função que inicializa os dados do heatmap e o próprio heatmap
 */
function finalizeHeatMap(){
    clearDiv(divMain);
    const heatmap = createDivWAttributes('','heatmap','600px');
    divMain.appendChild(heatmap);
    setHeatMapData(tabledata);
    generateHeatMap();

    const reset = createButton('Reset', '', tableOptionsStartup);
    divMain.appendChild(reset);
}

/**
 * Função que trata do cenário de seleção do Gráfico de conflitualidade
 */
function handleGraphSelection(){
    clearDiv(divMain);
    addHeaderToDiv(1,'Escolher aulas para visualizar',divMain);
    const cursos = createButton('Escolher aulas por curso', '', handleGraphCurso);
    const UC = createButton('Escolher aulas por Unidade Curricular', '', handleGraphUC);
    divMain.appendChild(cursos);
    divMain.appendChild(UC);
}

/**
 * Função que trata do cenário de seleção de filtro por curso
 */
function handleGraphCurso(){
    clearDiv(divMain);
    const cursos = extractAttributeValues(tabledata,"Curso");
    console.log(cursos);
    const cursosSelect = createSingleSelect(cursos, '', handleGraphCursoSelection); 
    divMain.appendChild(cursosSelect);

}

/**
 * Função que trata da submissão do curso para filtrar
 * @param {String} option - curso selecionado
 */
function handleGraphCursoSelection(option){
    const aulas = getAulaByCurso(tablefinal.getData(),option);
    setAulasGraph(aulas);
    handleGraphDateFrame()
}

/**
 * Função que trata do cenário de seleção de filtro por unidade curricular
 */
function handleGraphUC(){
    clearDiv(divMain);
    const ucs = extractAttributeValues(tabledata,"Unidade Curricular");
    console.log(ucs);
    const ucsSelect = createSingleSelect(ucs, '', handleGraphUCSelection); 
    divMain.appendChild(ucsSelect);
}

/**
 * Função que trata da submissão da unidade curricular para filtrar
 * @param {String} option - Unidade Curricular
 */
function handleGraphUCSelection(option){
    const aulas = getAulaByUc(tablefinal.getData(),option);
    setAulasGraph(aulas);
    handleGraphDateFrame()
}

/**
 * Função que gera os inputs de data para seleção do período a analisar
 */
function handleGraphDateFrame() {
    clearDiv(divMain);
    addParagraphToDiv('Escolher Período para análise', divMain);
    const datas = createDateInputWithSubmit('', handleGraphDateFrameSelection);
    divMain.appendChild(datas);
}

/**
 * Função que trata da submissão das datas para o gráfico de conflitualidade
 * @param {String} inicio - data inicial
 * @param {String} fim - data final
 */
function handleGraphDateFrameSelection(inicio, fim) {
    if (inicio && fim) {
        const ini = new Date(inicio);
        const end = new Date(fim);
        if (end > ini) {
            const datas = getArrayDatesBetween(ini,end);
            setAulasGraph(filterAulasByDates(datas));
            finalizeGraph();

        } else {
            alert('Data de Inicio maior que Data de fim');
        }
    } else {
        alert('Submeter ambas as datas');
    }
}

/**
 * Função que gera o gráfico de conflitualidade
 */
function finalizeGraph(){
    clearDiv(divMain);
    const graph = createDivWAttributes('','graphdiagram','400px');
    divMain.appendChild(graph);
    generateData();
    generateGraphDiagram();

    const reset = createButton('Reset', '', tableOptionsStartup);
    divMain.appendChild(reset);
}

/**
 * Função que trata do cenário de seleção da opção de introdução manual de uma aula
 */
function handleManual(){
    clearDiv(divMain);
    addParagraphToDiv('Escolher Curso', divMain);
    const cursos = getCursos(tablefinal.getData());
    const cursosSelect = createSingleSelect(cursos, '', handleManualCursosSelection);
    divMain.appendChild(cursosSelect);
}

/**
 * Função que trata da seleção do curso
 * @param {String} option - Curso selecionado
 */
function handleManualCursosSelection(option){
    aulamanual["Curso"] = option;
    console.log(aulamanual);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Unidade Curricular', divMain);
    const uc = getUCs(tablefinal.getData());
    const ucSelect = createSingleSelect (uc, '', handleManualUcSelection);
    divMain.appendChild(ucSelect);
}

/**
 * Função que trata da seleção da unidade curricular
 * @param {String} option - Unidade Curricular Selecionada
 */
function handleManualUcSelection(option){
    aulamanual["Unidade Curricular"] = option;
    console.log(aulamanual);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Unidade Turno', divMain);
    const turno = extractAttributeValues(tabledata,"Turno");
    const turnoSelect = createSingleSelect (turno, '', handleManualTurnoSelection);
    divMain.appendChild(turnoSelect);
}

/**
 * Função que trata da seleção do turno
 * @param {String} option - Turno Selecionada
 */
function handleManualTurnoSelection(option){
    aulamanual["Turno"] = option;
    console.log(aulamanual);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Turma', divMain);
    const turma = getTurmas(tablefinal.getData());
    const turmaSelect = createSingleSelect (turma, '', handleManualTurmaSelection);
    divMain.appendChild(turmaSelect);
}

/**
 * Função que trata da seleção da turma
 * @param {String} option - Turma Selecionada
 */
function handleManualTurmaSelection(option){
    aulamanual["Turma"] = option;
    console.log(aulamanual);
    clearDiv(divMain);
    addParagraphToDiv('Definir número de inscritos', divMain);
    const inscritos = createNumberInput(1,'', handleManualInscritosSelection);
    divMain.appendChild(inscritos);
}

/**
 * Função que trata da seleção do número de inscritos
 * @param {Number} option - Número de inscritos Selecionada
 */
function handleManualInscritosSelection(option){
    if(option < 0){
        alert('número de inscritos inválido');
    } else {
        aulamanual["Inscritos no turno"] = option;
        console.log(aulamanual);
        clearDiv(divMain);
        addParagraphToDiv('Escolher hora de início e fim', divMain);
        const container = createDualSelect(generateClassDuration("08:00:00", "21:30:00"), '', handleManualHorasSelection);
        divMain.appendChild(container);
    }
}

/**
 * Função que trata da submissão das horas de inicio e fim da aula
 * @param {String} horaIni - timestamp inicial
 * @param {String} horaEnd - timestamp final
 */
function handleManualHorasSelection(horaIni,horaEnd){
    if (timestampToMilliseconds(horaIni) > timestampToMilliseconds(horaEnd)) {
        alert('Hora de fim maior do que hora de início');
    } else {
        aulamanual["Hora início da aula"] = horaIni;
        aulamanual["Hora fim da aula"] = horaEnd;
        console.log(aulamanual);
        clearDiv(divMain);
        addParagraphToDiv('Escolher data da aula', divMain);
        const date = createSingleDateInputWithSubmit('',handleManualDateSelection);
        divMain.appendChild(date);
    }
}

/**
 * Função que trata da submissão da data da aula
 * @param {String} option - data da aula
 */
function handleManualDateSelection(option){
    aulamanual["Data da aula"] = dateCraft.formatDate(option).format('DD/MM/YYYY');
    console.log(aulamanual);
    aulamanual["Semana do Ano"] = giveSemanaAno(aulamanual["Data da aula"]);
    aulamanual["Semana do Semestre"] = giveSemanaSemestre(aulamanual["Data da aula"]);
    const day = turnToDate(aulamanual["Data da aula"]).getDay();
    switch(day){
        case 1:
            aulamanual["Dia da semana"] = 'Seg'
            break;
        case 2:
            aulamanual["Dia da semana"] = 'Ter'
            break;
        case 3:
            aulamanual["Dia da semana"] = 'Qua'
            break;
        case 4:
            aulamanual["Dia da semana"] = 'Qui'
            break;
        case 5:
            aulamanual["Dia da semana"] = 'Sex'
            break;
    }
    clearDiv(divMain);
    console.log(aulamanual);
    addParagraphToDiv('Escolher Característica da sala pedida para a aula', divMain);
    const carac = extractAttributeValues(tabledata,"Características da sala pedida para a aula");
    const caracSelect = createSingleSelect (carac, '', handleManualCaracSelection);
    divMain.appendChild(caracSelect);
}
 
/**
 * Função que lida com a seleção das caracteristicas pedidas para a sala de aula
 * @param {String} option 
 */
function handleManualCaracSelection(option){
    aulamanual["Características da sala pedida para a aula"] = option;
    console.log(aulamanual);
    clearDiv(divMain);
    addParagraphToDiv('Escolher Sala de aula', divMain);
    const sala = extractAttributeValues(tabledata,"Sala atribuída à aula");
    const salaSelect = createSingleSelect (sala, '', handleManualSalaSelection);
    divMain.appendChild(salaSelect);
}

/**
 * Função que lida com a seleção da sala de aula e submete a aula criada manualmente para a tabela de horário
 * @param {String} option 
 */
function handleManualSalaSelection(option){
    aulamanual["Sala atribuída à aula"] = option
    tablefinal.addRow(aulamanual, true);
    tableOptionsStartup();
}



/**
 * Função que obtém o ficheiro através do link vindo do gitHub relativo às salas
 * @param {Number} number - cenário pretendido
 * @param {String} githubLink - link do ficheiro 
 */
function gitHubCSVSalas(number, githubLink) {
    //numbers: 1 -> tabela Salas; 2->Substituir aula
    //const githubLink = document.getElementById('githubLinkSalas').value;
    fetch(githubLink)
        .then(response => response.text())
        .then(csvDataSalas => {
            switch (number) {
                case 1:
                    tabledata = dataParseSalas(csvDataSalas);
                    //console.log(tabledata);
                    createTableSalas(tabledata);
                    //console.log("isto funcionou a gerar tabela");
                    break;
                case 2:
                    //handleFileSub(csvDataSalas);
                    //alert('ta tudo fixolas');
                    subAulaInfoSetter(csvDataSalas);
                    salasButtonsSetter();
                    //console.log(dataParseSalas(csvDataSalas));
                    break;
                case 3:
                    handleAlocarAulasSettings(csvDataSalas);
                    break;
                case 4:
                    dataSalas = dataParseSalas(csvDataSalas);
                    generateHeatMapFilters();
                    break;
            }
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
}

/**
 * Função que obtém o ficheiro através do link vindo do gitHub relativo ao Horário
 */
function gitHubCSVHorario() {
    const githubLink = document.getElementById('githubLink').value;

    fetch(githubLink)
        .then(response => response.text())
        .then(csvData => {
            tabledata = dataParseHorario(csvData);
            //console.log(tabledata);
            createTableHorario(tabledata);
        })
        .catch(error => {
            console.error('Error fetching CSV data:', error);
        });
}

/**
 * Função que obtém o conteudo do ficheiro através da submissão de um ficheiro local
 * @param {*} event 
 * @param {Number} number - cenário pretendido
 */
function readLocalFile(event, number) {
    //numbers: 1 -> Horario; 2 -> Salas;
    const file = event.target.files[0];

    if (file) {
        if (file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileContent = event.target.result;
                switch (number) {
                    case 1:
                        tabledata = dataParseHorario(fileContent);
                        createTableHorario(tabledata);
                        break;
                    case 2:
                        tabledata = dataParseSalas(fileContent);
                        createTableSalas(tabledata);
                        break;
                    case 3:
                        //alert('ta tudo fixolas mas local');
                        subAulaInfoSetter(fileContent);
                        salasButtonsSetter();
                        //console.log(dataParseSalas(fileContent));
                        break;
                    case 4:
                        handleAlocarAulasSettings(fileContent);
                        break;
                    case 5:
                        dataSalas = dataParseSalas(fileContent);
                        generateHeatMapFilters();
                        break;
                }

            }
            reader.readAsText(file);
        } else {
            console.error('Please select a CSV file.');
        }
    } else {
        console.error('No file selected.');
    }
}

/**
 * Função que gera a tabela do horário
 * @param {JSON} tabledata - conteudo da tabela
 */
function createTableHorario(tabledata) {

    tablefinal = new Tabulator("#example-table", {
        layout: "fitColumns",
        data: tabledata,
        rowHeader: {
            headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                cell.getRow().toggleSelect();
            }
        },
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        paginationCounter: "rows",
        footerElement: "<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns: [
            { title: "Curso", field: "Curso", headerFilter: "input", headerMenu: headerMenu },
            { title: "Unidade Curricular", field: "Unidade Curricular", headerFilter: "input", headerMenu: headerMenu },
            { title: "Turno", field: "Turno", headerFilter: "input", headerMenu: headerMenu },
            { title: "Turma", field: "Turma", headerFilter: "input", headerMenu: headerMenu },
            { title: "Inscritos no Turno", field: "Inscritos no turno", headerFilter: "input", headerMenu: headerMenu },
            { title: "Dia da Semana", field: "Dia da semana", headerFilter: "input", headerMenu: headerMenu },
            { title: "Hora início da aula", field: "Hora início da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Hora fim da aula", field: "Hora fim da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Data da aula", field: "Data da aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Características da sala pedida para a aula", field: "Características da sala pedida para a aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala atribuída à aula", field: "Sala atribuída à aula", headerFilter: "input", headerMenu: headerMenu },
            { title: "Semana do Ano", field: "Semana do Ano", headerFilter: "input", headerMenu: headerMenu },
            { title: "Semana do Semestre", field: "Semana do Semestre", headerFilter: "input", headerMenu: headerMenu },
        ],
    });
    tablefinal.on("tableBuilt", addEventListeners);
    tablefinal.on("rowAdded", function (row) {
        //console.log("adawdawda");
        // Set the background color of the newly added row to green
        row.getElement().style.backgroundColor = "green";
    });
}

/**
 * Função que gera a tabela das salas
 * @param {JSON} tabledata - conteudo da tabela
 */
function createTableSalas(tabledata) {
    tablefinal = new Tabulator("#example-table", {
        layout: "fitData",
        data: tabledata,
        pagination: "local",
        paginationSize: 10,
        paginationSizeSelector: [5, 10, 20, 40],
        movableColumns: false,
        //autoColumns:true,
        paginationCounter: "rows",
        footerElement: "<button id='ORtoggle'>OR Filter Toggle</button><button id='ResetFilter'>Reset Filters</button>",
        columns: [
            { title: "Edifício", field: "Edifício", headerFilter: "input", headerMenu: headerMenu },
            { title: "Nome sala", field: "Nome sala", headerFilter: "input", headerMenu: headerMenu },
            { title: "Capacidade Normal", field: "Capacidade Normal", headerFilter: "input", headerMenu: headerMenu },
            { title: "Capacidade Exame", field: "Capacidade Exame", headerFilter: "input", headerMenu: headerMenu },
            { title: "Nº características", field: "Nº características", headerFilter: "input", headerMenu: headerMenu },
            { title: "Anfiteatro aulas", field: "Anfiteatro aulas", headerFilter: "input", headerMenu: headerMenu },
            { title: "Apoio técnico eventos", field: "Apoio técnico eventos", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 1", field: "Arq 1", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 2", field: "Arq 2", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 3", field: "Arq 3", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 4", field: "Arq 4", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 5", field: "Arq 5", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 6", field: "Arq 6", headerFilter: "input", headerMenu: headerMenu },
            { title: "Arq 9", field: "Arq 9", headerFilter: "input", headerMenu: headerMenu },
            { title: "BYOD (Bring Your Own Device)", field: "BYOD (Bring Your Own Device)", headerFilter: "input", headerMenu: headerMenu },
            { title: "Focus Group", field: "Focus Group", headerFilter: "input", headerMenu: headerMenu },
            { title: "Horário sala visível portal público", field: "Horário sala visível portal público", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Arquitectura de Computadores I", field: "Laboratório de Arquitectura de Computadores I", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Arquitectura de Computadores II", field: "Laboratório de Arquitectura de Computadores II", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Bases de Engenharia", field: "Laboratório de Bases de Engenharia", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Electrónica", field: "Laboratório de Electrónica", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Informática", field: "Laboratório de Informática", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Jornalismo", field: "Laboratório de Jornalismo", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Redes de Computadores I", field: "Laboratório de Redes de Computadores I", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Redes de Computadores II", field: "Laboratório de Redes de Computadores II", headerFilter: "input", headerMenu: headerMenu },
            { title: "Laboratório de Telecomunicações", field: "Laboratório de Telecomunicações", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Aulas Mestrado", field: "Sala Aulas Mestrado", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Aulas Mestrado Plus", field: "Sala Aulas Mestrado Plus", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala NEE", field: "Sala NEE", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Provas", field: "Sala Provas", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala Reunião", field: "Sala Reunião", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala de Arquitectura", field: "Sala de Arquitectura", headerFilter: "input", headerMenu: headerMenu },
            { title: "Sala de Aulas Normal", field: "Sala de Aulas normal", headerFilter: "input", headerMenu: headerMenu },
            { title: "Videoconferência", field: "videoconferência", headerFilter: "input", headerMenu: headerMenu },
            { title: "Átrio", field: "átrio", headerFilter: "input", headerMenu: headerMenu },
        ],
    });

    tablefinal.on("tableBuilt", addEventListeners);
}

/**
 * Função que adiciona os event listeners relacionados com os botões nos footers da tabela
 */
function addEventListeners() {
    const ORtoggle = document.getElementById('ORtoggle');
    const ResetFilter = document.getElementById('ResetFilter');
    cur_filter = document.getElementById('cur_filter');
    const CSV = document.getElementById('CSV');
    const JSON = document.getElementById('JSON');

    ResetFilter.removeEventListener('click', resetFilters);
    ORtoggle.removeEventListener('click', toggleFilter);
    CSV.removeEventListener('click', downloadCSV);
    JSON.removeEventListener('click', downloadJSON);

    ResetFilter.addEventListener('click', resetFilters);
    ORtoggle.addEventListener('click', toggleFilter);
    CSV.addEventListener('click', downloadCSV);
    JSON.addEventListener('click', downloadJSON);
    tableOptionsStartup();
}

/**
 * função que trata do reset dos filtros colocados na tabela
 */
function resetFilters() {
    if (tablefinal) {
        cur_filter.innerText = "";
        tablefinal.clearHeaderFilter();
        tablefinal.clearFilter();
        counter = 0;
        filterMatrix = [];
    }
}

/**
 * Função que calcula o filtro OR
 * @returns - naão retorna nada se não houver filtros 
 */
function toggleFilter() {
    if (tablefinal) {
        headerFilters = tablefinal.getHeaderFilters();
        if (headerFilters.length == 0) return;
        filterMatrix[counter] = [];
        filterMatrix[counter] = headerFilters;
        counter++;
        tablefinal.clearHeaderFilter();
        tablefinal.clearFilter();
        cur_filter.innerText = formatString(generateFilterExpression(filterMatrix));
        tablefinal.setFilter(customFilter, generateFilterExpression(filterMatrix));
    }
}

/**
 * Função que faz download da tabela em formato csv
 */
function downloadCSV() {
    if (tablefinal) {
        //console.log("1");
        tablefinal.download("csv", "table.csv");
    }
}

/**
 * Função que faz download da tabela no formato json
 */
function downloadJSON() {
    if (tablefinal) {
        //console.log("2");
        tablefinal.download("json", "table.json");
    }
}

/**
 * Função que constroi o header menu que permite filtrar e esconder colunas
 * @returns - retorna o header menu
 */
var headerMenu = function () {
    var menu = [];
    var columns = this.getColumns();

    for (let column of columns) {

        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
            label: label,
            action: function (e) {
                //prevent menu closing
                e.stopPropagation();

                //toggle current column visibility
                column.toggle();

                //change menu item icon
                if (column.isVisible()) {
                    icon.classList.remove("fa-square");
                    icon.classList.add("fa-check-square");
                } else {
                    icon.classList.remove("fa-check-square");
                    icon.classList.add("fa-square");
                }
            }
        });
    }

    return menu;
}