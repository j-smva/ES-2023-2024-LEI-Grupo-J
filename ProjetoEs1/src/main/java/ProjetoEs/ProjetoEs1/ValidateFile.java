package ProjetoEs.ProjetoEs1;


import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;


import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;



public class ValidateFile {

	public static void main(String[] args) {
	}

	public static String getFileContentRemote(String fileUrl) throws IOException {
		HttpClient httpClient = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(fileUrl);
		HttpResponse response = httpClient.execute(request);
		String content = EntityUtils.toString(response.getEntity(),"UTF-8");
		return content;
	}

	public static String getFileContentLocal(String path) throws IOException{
		File f = new File(path);
		String content = FileUtils.readFileToString(f, StandardCharsets.UTF_8);
		return content;
	}
}
