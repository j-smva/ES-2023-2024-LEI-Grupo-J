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
        String htmlContent = generateTable(content);
        try (FileWriter fileWriter = new FileWriter(filename)) {
            fileWriter.write(htmlContent);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String generateTable(String content) {
        StringBuilder html = new StringBuilder();
        List<Entrada> rows = CSVReader.readCSVHorario(content);
        List<String> rowshtml = rowsToHTML(rows);
        List<String> titleshtml = titleSetter(rows.getFirst());
        List<String> buttons = buttonSetter(rows.getFirst());
        // Generate HTML code for the table
        html.append("<html>\n");
        html.append("<head>\n");
        html.append("<link href=\"https://unpkg.com/tabulator-tables@4.8.4/dist/css/tabulator.min.css\" rel=\"stylesheet\">\n");
        html.append("<script type=\"text/javascript\" src=\"https://unpkg.com/tabulator-tables@4.8.4/dist/js/tabulator.min.js\"></script>\n");  
        html.append("<style>\n" +
        		".switch-container {" +
        	    "display: inline-block;" +
        	    "text-align: center;" +
        	    "margin-right:20px;" +
        	    "}" +
        	    ".switch-container p {" +
        	    "margin-right: 10px;" +
        	    "}" +
        	    ".switch {" +
        	    "position: relative;" +
        	    "display: inline-block;" +
        	    "width: 60px;" +
        	    "height: 34px;" +
        	    "}" +
        	    ".switch input {" +
        	    "opacity: 0;" +
        	    "width: 0;" +
        	    "height: 0;" +
        	    "}" +
        	    ".slider {" +
        	    "position: absolute;" +
        	    "cursor: pointer;" +
        	    "top: 0;" +
        	    "left: 0;" +
        	    "right: 0;" +
        	    "bottom: 0;" +
        	    "background-color: #ccc;" +
        	    "-webkit-transition: .4s;" +
        	    "transition: .4s;" +
        	    "}" +
        	    ".slider:before {" +
        	    "position: absolute;" +
        	    "content: \"\";" +
        	    "height: 26px;" +
        	    "width: 26px;" +
        	    "left: 4px;" +
        	    "bottom: 4px;" +
        	    "background-color: white;" +
        	    "-webkit-transition: .4s;" +
        	    "transition: .4s;" +
        	    "}" +
        	    "input:checked + .slider {" +
        	    "background-color: #2196F3;" +
        	    "}" +
        	    "input:focus + .slider {" +
        	    "box-shadow: 0 0 1px #2196F3;" +
        	    "}" +
        	    "input:checked + .slider:before {" +
        	    "-webkit-transform: translateX(26px);" +
        	    "-ms-transform: translateX(26px);" +
        	    "transform: translateX(26px);" +
        	    "}" +
        	    "/* Rounded sliders */" +
        	    ".slider.round {" +
        	    "border-radius: 34px;" +
        	    "}" +
        	    ".slider.round:before {" +
        	    "border-radius: 50%;" +
        	    "}" +
                 "</style>");
        html.append("</head>\n");
        html.append("<body>\n");
        html.append("<div id=\"example-table\"></div>\n");
        html.append("<script type=\"text/javascript\">\n");
        html.append("var tabledata = [\r\n"); 	
        for(int i=0; i!= rowshtml.size();i++) {
        	html.append("				{id:"+i+","+rowshtml.get(i));
        	html.append("},\r\n");
        }
        
       
        html.append("];\r\n");
        html.append("var table = new Tabulator(\"#example-table\", {\r\n"
        		+ "				height:800,\r\n"
        		+ "				data:tabledata,\r\n"
        		+ "				layout:\"fitColumns\",\r\n"
        		+ "				columns:[\r\n");
        		for(int i=0; i!=titleshtml.size();i++) {
                	html.append(titleshtml.get(i));
                }
        		html.append("                ],\r\n"
                        + "            });\r\n");
        html.append("</script>\n");
        html.append("<h2>Hide Column</h2>\n");
        
        for(int i = 0; i != buttons.size(); i++) {
        	html.append(buttons.get(i));
        }
        html.append("\n");
        html.append("</body>\n");
        html.append("</html>\n");

        return html.toString();
    }

    private static List<String> rowsToHTML(List<Entrada> rows) {
		List<String> out = new LinkedList<>();
		for (Entrada r : rows){
				out.add(r.toHTMLString());
		}
  
    	return out;
    }
    
    public static List<String> titleSetter(Entrada row){
		// "					{title:\"Curso\", field:\"Curso\", headerFilter:\"input\"},\r\n"
    	String [] titles = row.getTitles();
		List<String> output = new ArrayList<>();
		for(int i = 0; i != titles.length; i++) {
			output.add("					{title:\""+ titles[i]+ "\", field:\""+ titles[i] +"\", headerFilter:\"input\"},\r\n");
		}

		return output;

	}
    
    public static List<String> buttonSetter(Entrada row){
    	String [] titles = row.getTitles();
		List<String> output = new ArrayList<>();
		for(int i = 0; i != titles.length; i++) {
			output.add( "<div class=\"switch-container\">\n" + "<p>"+ titles[i] +"</p>\n" +
                "<label class=\"switch\" id=\""+ titles[i] + "\">\n" +
                "  <input type=\"checkbox\" onclick=\"table.toggleColumn('"+ titles[i] +"')\">\n" +
                "  <span class=\"slider round\"></span>\n" +
                "</label>\n" + "</div>");
		}
		return output;
    }
   

    
    
    public static void htmlHandler(String content) {
    	  generateTableToFile(content, "table.html");
          try {
              Desktop.getDesktop().browse(new java.net.URI("file:///" + System.getProperty("user.dir").replace("\\", "/") + "/table.html"));

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

        generateTableToFile(content, "table.html");
        try {
            Desktop.getDesktop().browse(new java.net.URI("file:///" + System.getProperty("user.dir").replace("\\", "/") + "/table.html"));

        } catch (IOException | URISyntaxException e1) {
            e1.printStackTrace();
        }
    } 
} 

    