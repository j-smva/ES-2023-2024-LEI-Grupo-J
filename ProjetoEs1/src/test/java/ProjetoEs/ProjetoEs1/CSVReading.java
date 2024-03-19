package ProjetoEs.ProjetoEs1;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.junit.Test;
import junit.framework.TestCase;



public class CSVReading extends TestCase {

	public final static String HORAEXAMPLE = "ME;Teoria dos Jogos e dos Contratos;01789TP01;MEA1;30;Qua;13:00:00;14:30:00;23/11/2022;Sala Aulas Mestrado;AA2.25";
	public final static String HORAEXAMPLEBAD = "ME;Teoria dos Jogos e dos Contratos;01789TP01;;30;Qua;13:00:00;14:30:00;;;";
	
	public final static String SALAEXAMPLE = "Ala Autónoma (ISCTE-IUL);Auditório Afonso de Barros;80;39;4;;;;;;;;;;;;X;;;;;;;;;;X;X;;;;;X;;";
	
	
	private String getContent(String path) {
		String content = "";
		try {
			content = ValidateFile.getFileContentRemote(path);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return content;
	}
	
	private Boolean checkHorarioRead(String path) {
		String content = getContent(path);
		List<Entrada> horario = CSVReader.readCSVHorario(content);
		return (horario.size() >= 20000);
	}
	
	private Boolean checkSalasRead(String path) {
		String content = getContent(path);
		List<Sala> horario = CSVReader.readCSVSala(content);
		return (horario.size() >= 130);
	}
	
	private Boolean checkEntrada(String entrada) {
		String[] data = entrada.split(";",-1);
		
		CSVReader.replaceEmptyValuesHorario(data); // replace emptyStrings
		
		LocalTime horaInicio = LocalTime.parse(data[6], CSVReader.parser);
		LocalTime horaFim = LocalTime.parse(data[7], CSVReader.parser);
		LocalDate dataAula = LocalDate.parse(data[8].replace("/", "-"), CSVReader.formatter);
		
		Entrada e = new Entrada(data[0],data[1],data[2],data[3],Integer.parseInt(data[4]),data[5],horaInicio,horaFim,dataAula,data[9],data[10]);
		
		return e.entradaCheck();
	}

	@Test
	public void testHorarioRead() {
		Boolean r = checkHorarioRead(FileTest.GITPATH + FileTest.HORARIO);
		assertTrue(r);
	}
	
	@Test
	public void testSalaRead() {
		Boolean r = checkSalasRead(FileTest.GITPATH + FileTest.SALAS);
		assertTrue(r);
	}
	
	@Test
	public void testFailCSVRead() {
		Boolean r = checkHorarioRead("Ficheiro errado");
		assertFalse("Exemplo de erro na leitura",!r);
	}
	
	@Test
	public void testEntrada() {
		Boolean r = checkEntrada(HORAEXAMPLE);
		assertTrue(r);
	}
	
	@Test
	public void testFailedEntrada() {
		Boolean r = checkEntrada(HORAEXAMPLEBAD);
		assertFalse("Entrada com parametros não preenchidos", !r);
	}
	
}
