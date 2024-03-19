package ProjetoEs.ProjetoEs1;

import java.io.IOException;

import org.junit.Test;

import junit.framework.Assert;
import junit.framework.TestCase;
import junit.framework.TestSuite;



public class FileTest extends TestCase {

	public final static String GITPATH = "https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/csv%20files/";
	
	public final static String HORARIO = "HorarioDeExemplo.csv";
	public final static String SALAS = "Caracteriza%C3%A7%C3%A3oDasSalas.csv";
	
	public final static String FILEPATH = "C:\\Users\\Utilizador\\Desktop\\Docs\\uni\\3ºano\\ES\\ES-2023-2024-LEI-Grupo-J\\csv files\\";
	
	
	public Boolean checkFileValidationLocal(String filePath) {
		System.out.println("File Path: " + filePath);
		
		Boolean r;
		
		try {
			ValidateFile.getFileContentLocal(filePath);
			r = true;
		} catch (IOException e) {
			r = false;
		}
		return r;
	}
	
	public Boolean checkFileValidationGit(String url) {		
		System.out.println("Url: " + url);
		
		Boolean r;
		try {
			ValidateFile.getFileContentRemote(url);
			r = true;
		} catch (IOException e) {
			r = false;
		}
		return r;
	}
	
	@Test
	public void test1() {
		Boolean r = checkFileValidationGit(GITPATH + HORARIO);
		assertTrue(r);
	}
	
	@Test
	public void test2() {
		Boolean r = checkFileValidationGit(GITPATH + SALAS);
		assertTrue(r);
	}
	
	@Test
	public void test3() {
		Boolean r = checkFileValidationLocal(FILEPATH + HORARIO);
		assertTrue(r);
	}
	
	@Test
	public void test4() {
		Boolean r = checkFileValidationLocal("Vazio");
		assertFalse("Não foi dado nenhum ficheiro.", !r);
	}
	
}
