import { describe, it, expect } from "vitest";
import { dataParseHorario, dataParseSalas, fixTextLocal, extractNomeSalas, extractAttributeValues, getUCs, getCursos, getTurmas, extractAttributes } from "../js/utils";


describe('Data Parse: Horário', () => {
    it('Should divide CSV correctly.', () => {
        const csvText = "Curso;Unidade Curricular;Turno;Turma;Inscritos no turno;Dia da semana;Hora início da aula;Hora fim da aula;Data da aula;Características da sala pedida para a aula;Sala atribuída à aula\nME;Teoria dos Jogos e dos Contratos;01789TP01;MEA1;30;Sex;13:00:00;14:30:00;02/12/2022;Sala Aulas Mestrado;AA2.25";
        const expectedOutput = '[{"Curso":"ME","Unidade Curricular":"Teoria dos Jogos e dos Contratos","Turno":"01789TP01","Turma":"MEA1","Inscritos no turno":"30","Dia da semana":"Sex","Hora início da aula":"13:00:00","Hora fim da aula":"14:30:00","Data da aula":"02/12/2022","Semana do Ano":48,"Semana do Semestre":13,"Características da sala pedida para a aula":"Sala Aulas Mestrado","Sala atribuída à aula":"AA2.25"}]';
        
        expect(dataParseHorario(csvText)).toBe(expectedOutput);
    })

    it('Should return nothing.', () => {
        const errorTxt = " ";
        
        expect(dataParseHorario(errorTxt)).toBe('[]');
    })
})

describe('Fixing Text', () => {
    it('Should fix broken characters.', () => {
        const csvText = "Edif�cio II (ISCTE-IUL);Audit�rio B2.03;180;0;2;;;;;;;;;;;;X;;;;;;;;;;;;;;;;;X;";
        const expectedOutput = 'Edifício II (ISCTE-IUL);Auditório B2.03;180;0;2;;;;;;;;;;;;X;;;;;;;;;;;;;;;;;X;';
        
        expect(fixTextLocal(csvText)).toBe(expectedOutput);
    })

    it('Should return the same register.', () => {
        const csvText = "Polidesportivo (ISCTE-IUL);Campo;1;0;1;;;;;;;;;;;;X;;;;;;;;;;;;;;;;;;";
        
        expect(fixTextLocal(csvText)).toBe(csvText);
    })
})

describe('Data Parse: Salas', () => {
    it('Should divide CSV correctly.', () => {
        const csvText = "Edif�cio;Nome sala;Capacidade Normal;Capacidade Exame;N� caracter�sticas;Anfiteatro aulas;Apoio t�cnico eventos;Arq 1;Arq 2;Arq 3;Arq 4;Arq 5;Arq 6;Arq 9;BYOD (Bring Your Own Device);Focus Group;Hor�rio sala vis�vel portal p�blico;Laborat�rio de Arquitectura de Computadores I;Laborat�rio de Arquitectura de Computadores II;Laborat�rio de Bases de Engenharia;Laborat�rio de Electr�nica;Laborat�rio de Inform�tica;Laborat�rio de Jornalismo;Laborat�rio de Redes de Computadores I;Laborat�rio de Redes de Computadores II;Laborat�rio de Telecomunica��es;Sala Aulas Mestrado;Sala Aulas Mestrado Plus;Sala NEE;Sala Provas;Sala Reuni�o;Sala de Arquitectura;Sala de Aulas normal;videoconfer�ncia;�trio\nAla Aut�noma (ISCTE-IUL);Audit�rio Afonso de Barros;80;39;4;;;;;;;;;;;;X;;;;;;;;;;X;X;;;;;X;;";
        const expectedOutput = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
        
        expect(dataParseSalas(csvText)).toBe(expectedOutput);
    })

    it('Should return nothing.', () => {
        const errorTxt = " ";
        
        expect(dataParseSalas(errorTxt)).toBe('[]');
    })
})

describe('Extract Nomes das Salas', () => {
    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    it('Should give correct name.', () => {
        expect(extractNomeSalas(salasJson)).toContain("Auditório Afonso de Barros");
    })

    it('Should return nothing.', () => {
        expect(extractNomeSalas('[{"ab":"aa"}]')).toStrictEqual([]);
    })
})

describe('Extract Atributos das Salas', () => {

    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    it('Should return all columns names.', () => {
        expect(extractAttributes(salasJson)).toStrictEqual(['Anfiteatro aulas','Apoio técnico eventos','Arq 1','Arq 2','Arq 3','Arq 4','Arq 5','Arq 6','Arq 9','BYOD (Bring Your Own Device)','Focus Group','Horário sala visível portal público','Laboratório de Arquitectura de Computadores I','Laboratório de Arquitectura de Computadores II','Laboratório de Bases de Engenharia','Laboratório de Electrónica','Laboratório de Informática','Laboratório de Jornalismo','Laboratório de Redes de Computadores I','Laboratório de Redes de Computadores II','Laboratório de Telecomunicações','Sala Aulas Mestrado','Sala Aulas Mestrado Plus','Sala NEE','Sala Provas','Sala Reunião','Sala de Arquitectura','Sala de Aulas normal','videoconferência','átrio']);
    })

    it('Should return nothing.', () => {
        expect(extractAttributes('[{"ab":"aa"}]')).toStrictEqual([]);
    })
})

describe('Extract Specific Atributos das Salas', () => {
    const salasJson = '[{"Edifício":"Ala Autónoma (ISCTE-IUL)","Nome sala":"Auditório Afonso de Barros","Capacidade Normal":"80","Capacidade Exame":"39","Nº características":"4","Anfiteatro aulas":"","Apoio técnico eventos":"","Arq 1":"","Arq 2":"","Arq 3":"","Arq 4":"","Arq 5":"","Arq 6":"","Arq 9":"","BYOD (Bring Your Own Device)":"","Focus Group":"","Horário sala visível portal público":"X","Laboratório de Arquitectura de Computadores I":"","Laboratório de Arquitectura de Computadores II":"","Laboratório de Bases de Engenharia":"","Laboratório de Electrónica":"","Laboratório de Informática":"","Laboratório de Jornalismo":"","Laboratório de Redes de Computadores I":"","Laboratório de Redes de Computadores II":"","Laboratório de Telecomunicações":"","Sala Aulas Mestrado":"X","Sala Aulas Mestrado Plus":"X","Sala NEE":"","Sala Provas":"","Sala Reunião":"","Sala de Arquitectura":"","Sala de Aulas normal":"X","videoconferência":"","átrio":""}]';
    
    it('Should return all column value.', () => {
        expect(extractAttributeValues(salasJson, "Nome sala")).toStrictEqual(["Auditório Afonso de Barros"]);
    })

    it('Should return nothing.', () => {
        expect(extractAttributeValues('[{"ab":"aa"}]', "Nome sala")).toStrictEqual([]);
    })
})

describe('Get from aula: UC', () => {
    const aulaJson = [{"Unidade Curricular":"Teoria dos Jogos e dos Contratos"}, {"Unidade Curricular":"Teoria dos Computadores"}];
    
    it('Should all Ucs names.', () => {
        expect(getUCs(aulaJson)).toStrictEqual(["Teoria dos Jogos e dos Contratos", "Teoria dos Computadores"]);
    })

    it('Should return nothing.', () => {
        expect(getUCs([{"Unidade Curricular":""}])).toStrictEqual([""]);
    })
})

describe('Get from aula: Curso', () => {
    const aulaJson = [{"Curso":"ME"}, {"Curso":"MB"}];
    
    it('Should return all Cursos names.', () => {
        expect(getCursos(aulaJson)).toStrictEqual(["ME", "MB"]);
    })

    it('Should return nothing.', () => {
        expect(getCursos([{"Curso":""}])).toStrictEqual([""]);
    })
})

describe('Get from aula: Turma', () => {
    const aulaJson = [{"Turma":"MEA1"}, {"Turma":"MEA2"}];
    
    it('Should return all Turmas names.', () => {
        expect(getTurmas(aulaJson)).toStrictEqual(["MEA1", "MEA2"]);
    })

    it('Should return nothing.', () => {
        expect(getTurmas([{"Turma":""}])).toStrictEqual([""]);
    })
})
