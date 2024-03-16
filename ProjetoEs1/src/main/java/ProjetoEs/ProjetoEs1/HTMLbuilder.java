package ProjetoEs.ProjetoEs1;
import java.awt.Desktop;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;

public class HTMLbuilder {

    public static boolean buildHTML(String file) {
        return false;
    }

    public static void generateTableToFile(List<List<Object>> rows, String filename) {
        String htmlContent = generateTable(rows);
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(htmlContent);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String generateTable(List<List<Object>> rows) {
        StringBuilder html = new StringBuilder();

        // Generate HTML code for the table
        html.append("<html>\n");
        html.append("<head>\n");
        html.append("<link href=\"https://unpkg.com/tabulator-tables@4.8.4/dist/css/tabulator.min.css\" rel=\"stylesheet\">\n");
        html.append("<script type=\"text/javascript\" src=\"https://unpkg.com/tabulator-tables@4.8.4/dist/js/tabulator.min.js\"></script>\n");
        html.append("</head>\n");
        html.append("<body>\n");
        html.append("<div id=\"example-table\"></div>\n");
        html.append("<script type=\"text/javascript\">\n");
        html.append("var tabledata = [\r\n");
        		/*"    {id:1, name:\"Oli Bob\", progress:12, gender:\"male\", rating:1, col:\"red\", dob:\"19/02/1984\", car:1},\r\n"*/
        	List<String> awd = rowsToJson();	
        for(int i=0; i!=awd.size();i++) {
        	html.append("				{id:"+i+","+awd.get(i));
        	html.append("\r\n");
        }
        html.append("];\r\n");
        html.append("var table = new Tabulator(\"#example-table\", {\r\n"
        		+ "				data:tabledata,\r\n"
        		+ "				layout:\"fitDatafill\",\r\n"
        		+ "				pagination:\"local\",\r\n"
        		+ "				paginationSize:10,\r\n"
        		+ "				paginationSizeSelector:[5, 10, 20, 40],\r\n"
        		+ "				movableColumns:true,\r\n"
        		+ "				paginationCounter:\"rows\",\r\n"
        		+ "				initialSort:[{column:\"building\",dir:\"asc\"},],\r\n"
        		+ "				columns:[\r\n"
        		+ "					{title:\"Curso\", field:\"Curso\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Unidade Curricular\", field:\"Unidade Curricular\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Turno\", field:\"Turno\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Turma\", field:\"Turma\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Inscritos no Turno\", field:\"Inscritos no Turno\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Dia da Semana\", field:\"Dia da Semana\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Hora início da aula\", field:\"Hora início da aula\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Hora fim da aula\", field:\"Hora fim da aula\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Data da aula\", field:\"Data da aula\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Características da sala pedida para a aula\", field:\"Características da sala pedida para a aula\", headerFilter:\"input\"},\r\n"
        		+ "					{title:\"Sala atribuída à aula\", field:\"Sala atribuída à aula\", headerFilter:\"input\"},\r\n"
        		+ "				],\r\n"
        		+ "			});\r\n");
        html.append("</script>\n");
        html.append("</body>\n");
        html.append("</html>\n");

        return html.toString();
    }

    private static List<String> rowsToJson() {
		List<String> out = new LinkedList<>();
    	try {
			String content = ValidateFile.getFileContentRemote("https://raw.githubusercontent.com/j-smva/ES-2023-2024-LEI-Grupo-J/main/csv%20files/HorarioDeExemplo.csv");
			List<Entrada> adw = CSVReader.readCSVHorario(content);
			for (Entrada a : adw){
				out.add(a.toHTMLString());
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
  
    	return out;
    }

    public static void main(String[] args) {
        // Sample data for testing
        List<List<Object>> rows = List.of(
            List.of("John", 30, "New York"),
            List.of("Alice", 25, "London")
        );

        generateTableToFile(rows, "table.html");
        try {
            Desktop.getDesktop().browse(new java.net.URI("file:///" + System.getProperty("user.dir").replace("\\", "/") + "/table.html"));

        } catch (IOException | URISyntaxException e1) {
            e1.printStackTrace();
        }
    }
}
