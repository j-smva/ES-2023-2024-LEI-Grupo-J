package ProjetoEs.ProjetoEs1;
import java.awt.Desktop;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class HTMLbuilder {

	public static boolean buildHTML(String file) {
		return false;
	}

	public static void generateTableToFile(String content, String filename) {
		String jsContent = generateTable(content);
		try (FileWriter fileWriter = new FileWriter(filename)) {
			fileWriter.write(jsContent);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static String generateTable(String content) {
		StringBuilder js = new StringBuilder();
		List<Entrada> rows = CSVReader.readCSVHorario(content);
		List<String> rowsData = rowsToJs(rows);
		List<String> titlesTable = titleSetter(rows.get(0));
		js.append("var tabledata = [\r\n");
		//rowsData.size()
		for(int i=0; i!= 10;i++) {
			js.append("				{id:"+i+","+rowsData.get(i));
			js.append("},\r\n");
		}
		js.append("];\r\n");
		js.append("var table = new Tabulator(\"#example-table\", {\n" + "\tdata:tabledata,\n" + "\tlayout:\"fitColumns\",\n" + 
				"\tpagination:\"local\",\n" + "\tpaginationSize:10,\n" + "\tpaginationSizeSelector:[10, 25, 50, 100, true],\n" + 
				"\tpaginationCounter:\"rows\",\n" 
				+"    rowContextMenu: [\r\n"
				+ "        {\r\n"
				+ "            label:\"Hide Column\",\r\n"
				+ "            action:function(e, column){\r\n"
				+ "                column.hide();\r\n"
				+ "            }\r\n"
				+ "        },\r\n"
				+ "        {\r\n"
				+ "            separator:true,\r\n"
				+ "        },\r\n"
				+ "        {\r\n"
				+ "            disabled:true,\r\n"
				+ "            label:\"Move Column\",\r\n"
				+ "            action:function(e, column){\r\n"
				+ "                column.move(\"col\");\r\n"
				+ "            }\r\n"
				+ "        }\r\n"
				+ "    ],	"
				+ "\tcolumns:[\r\n");
		for(int i=0; i!=titlesTable.size();i++) {
			js.append(titlesTable.get(i));
		}
		js.append("                ],\r\n"
				+ "            });\r\n");

		return js.toString();
	}

	private static List<String> rowsToJs(List<Entrada> rows) {
		List<String> out = new LinkedList<>();
		for (Entrada r : rows){
			out.add(r.toHTMLString());
		}

		return out;
	}

	public static List<String> titleSetter(Entrada row){
		String [] titles = row.getTitles();
		List<String> output = new ArrayList<>();
		for(int i = 0; i != titles.length; i++) {
			output.add("					{title:\""+ titles[i]+ "\", field:\""+ titles[i] +"\", headerFilter:\"input\"},\r\n");
		}

		return output;

	}


	public static void htmlHandler(String content) {
		generateTableToFile(content, "Horario.js");
		try {
			Desktop.getDesktop().browse(new java.net.URI("file:///" + System.getProperty("user.dir").replace("\\", "/") + "/Horario.html"));

		} catch (IOException | URISyntaxException e1) {
			e1.printStackTrace();
		}
	}




	public static void main(String[] args) {
		// Sample data for testing
		String content = null;
		try {
			content = ValidateFile.getFileContentRemote("https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/csv%20files/HorarioDeExemplo.csv");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		generateTableToFile(content, "Horario.js");
		try {
			Desktop.getDesktop().browse(new java.net.URI("file:///" + System.getProperty("user.dir").replace("\\", "/") + "/Horario.html"));

		} catch (IOException | URISyntaxException e1) {
			e1.printStackTrace();
		}
	} 
} 

