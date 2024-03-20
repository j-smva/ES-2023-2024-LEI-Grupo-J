package ProjetoEs.ProjetoEs1;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.junit.Test;

import junit.framework.TestCase;

public class FileCreator extends TestCase {

	public final static String TABLEPATH = "table.html";
	public final static String SAVEPATH = "C:/Users/Utilizador/Desktop/Docs/uni/3ºano/ES/ES-2023-2024-LEI-Grupo-J/csv files/NewHorario";
	
	
	private Boolean checkHTMLCreator(String filePath) {
		File file = new File(filePath);
		file.delete();

		String content = null;
		try {
			content = ValidateFile.getFileContentRemote(FileTest.GITPATH + FileTest.HORARIO);
		} catch (IOException e) { }

		HTMLbuilder.generateTableToFile(content, filePath);
		
		return (countLines(filePath) >= 20000);

	}
	
	private Boolean checkSaveFile(String filePath) {
		File file = new File(filePath);
		file.delete();

		String content = null;
		try {
			content = ValidateFile.getFileContentRemote(FileTest.GITPATH + FileTest.HORARIO);
		} catch (IOException e) { }

		SaveFile.saveAsCSV(CSVReader.readCSVHorario(content), filePath);
		
		return (countLines(filePath) >= 20000);

	}
	
	private int countLines(String filePath) {
		int lineCount = 0;

		try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
			while (reader.readLine() != null)
				lineCount++;
		} catch (IOException e) { }
		
		return lineCount;
	}
	
	@Test
	public void testHTML() {
		Boolean r = checkHTMLCreator(TABLEPATH);
		assertTrue(r);
	}
	
	@Test
	public void testSave() {
		Boolean r = checkSaveFile(SAVEPATH);
		assertTrue(r);
	}
	
	

}
