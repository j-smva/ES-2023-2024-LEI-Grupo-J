import { describe, test, it, expect } from "vitest";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { dataParse, } from "../js/horario";


const matrixString = `[
    {field:"Curso", type:"=", value:ME},
    {field:"Turma", type:"=", value:MEA1}
],
[
    {field:"Curso", type:">", value:ME}
]`;


const preString = '((data["Curso"] == "ME" && data["Turma"] == "MEA1") || (data["Curso"] > "ME"))';

const postString = 'Curso é "ME" e Turma é "MEA1" ou Curso é "ME"'

describe('dateParse', () => {
    it('Should divide CSV correctly.', () => {
        const csvText = "Curso;Unidade Curricular;Turno;Turma;Inscritos no turno;Dia da semana;Hora início da aula;Hora fim da aula;Data da aula;Características da sala pedida para a aula;Sala atribuída à aula\n ME;Teoria dos Jogos e dos Contratos;01789TP01;MEA1;30;Sex;13:00:00;14:30:00;02/12/2022;Sala Aulas Mestrado;AA2.25";
        const expectedOutput = [{"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25","Semana do Ano":"48","Semana do Semestre":"14"}]
        
        expect(dataParse(csvText)).toBe(expectedOutput);
    })
})

test('Verificar que a informação do CSV é dividida corretamente', () => {
    expect(dataParse(csvText)).toBe(expectedOutput);
});

test('Verificar que a string de filtro é traduzida para Português', () => {
    expect(formatString(preString)).toBe(postString);
});

test('Verificar que os vários parametros de pesquisa são convertidos em expressões corretas',() =>{
    expect(generateFilterExpression(matrixString)).toBe(preString);
});
