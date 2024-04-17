const {dataParse, generateFilterExpression, formatString} = require ('../js/horario.js');

const csvText = "Curso;Unidade Curricular;Turno;Turma;Inscritos no turno;Dia da semana;Hora início da aula;Hora fim da aula;Data da aula;Características da sala pedida para a aula;Sala atribuída à aula\n ME;Teoria dos Jogos e dos Contratos;01789TP01;MEA1;30;Sex;13:00:00;14:30:00;02/12/2022;Sala Aulas Mestrado;AA2.25";

const expectedOutput = [
  {
    Curso: 'ME',
    'Unidade Curricular': 'Teoria dos Jogos e dos Contratos',
    Turno: '01789TP01',
    Turma: 'MEA1',
    'Inscritos no turno': '30',
    'Dia da semana': 'Sex',
    'Hora início da aula': '13:00:00',
    'Hora fim da aula': '14:30:00',
    'Data da aula': '02/12/2022',
    'Características da sala pedida para a aula': 'Sala Aulas Mestrado',
    'Sala atribuída à aula': 'AA2.25'
  }
];

test('Verificar que a informação do CSV é dividida corretamente', () => {
    expect(dataParse(csvText)).toEqual(expectedOutput);
});