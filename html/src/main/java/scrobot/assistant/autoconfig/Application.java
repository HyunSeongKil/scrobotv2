package scrobot.assistant.autoconfig;

import java.awt.datatransfer.UnsupportedFlavorException;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import freemarker.template.TemplateNotFoundException;
import scrobot.assistant.batch.FileGenerator;
import scrobot.assistant.commoninterfac.Utils;

/**
 * @author hyunseongkil
 * 
 */
public class Application {

	
	/**
	 * @param args
	 * @throws IOException 
	 * @throws TemplateException 
	 * @throws UnsupportedFlavorException 
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public static void creationHTML(Map<String,Object> paramMap) throws IOException, TemplateException, UnsupportedFlavorException, ClassNotFoundException, SQLException {
		
		paramMap = loadConfigJsonHTML(paramMap);
		Configuration cfg = createConfiguration(paramMap);
		
		new FileGenerator().genHtml(cfg, paramMap);

	}
	
	
	/**
	 * @param args
	 * @throws IOException 
	 * @throws TemplateException 
	 * @throws UnsupportedFlavorException 
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 */
	public static void creationDevFile(Map<String,Object> paramMap) throws IOException, TemplateException, UnsupportedFlavorException, ClassNotFoundException, SQLException {
		
		//paramMap = loadConfigJson(paramMap);
		processAll(paramMap);

		
	}

	/**
	 * 프리마커 환경 인스턴스 생성
	 * @see https://freemarker.apache.org/docs/pgui_quickstart.html
	 * @param paramMap
	 * @return
	 * @throws IOException
	 */
	private static Configuration createConfiguration(Map<String, Object> paramMap) throws IOException {
		// Create your Configuration instance, and specify if up to what FreeMarker
		// version (here 2.3.29) do you want to apply the fixes that are not 100%
		// backward-compatible. See the Configuration JavaDoc for details.
		Configuration cfg = new Configuration(Configuration.VERSION_2_3_29);

		// Specify the source where the template files come from. Here I set a
		// plain directory for it, but non-file-system sources are possible too:
		Path path = Paths.get(paramMap.get("templatePath").toString());
		cfg.setDirectoryForTemplateLoading(path.toFile());

		// From here we will set the settings recommended for new projects. These
		// aren't the defaults for backward compatibilty.

		// Set the preferred charset template files are stored in. UTF-8 is
		// a good choice in most applications:
		cfg.setDefaultEncoding("UTF-8");

		// Sets how errors will appear.
		// During web page *development* TemplateExceptionHandler.HTML_DEBUG_HANDLER is better.
		cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);

		// Don't log exceptions inside FreeMarker that it will thrown at you anyway:
		cfg.setLogTemplateExceptions(false);

		// Wrap unchecked exceptions thrown during template processing into TemplateException-s:
		cfg.setWrapUncheckedExceptions(true);

		// Do not fall back to higher scopes when reading a null loop variable:
		cfg.setFallbackOnNullLoopVariable(false);

		//
		Utils.log(Thread.currentThread().getStackTrace(), "<<", cfg);
		return cfg;
	}
	
	/**
	 * 환경 파일 로드
	 * 실행 파일과 같은 경로의 app.json파일 로드
	 * @return
	 * @throws JsonSyntaxException
	 * @throws JsonIOException
	 * @throws IOException 
	 */
	@SuppressWarnings("unchecked")
	private static Map<String,Object> loadConfigJsonHTML(Map<String,Object> paramMap) throws JsonSyntaxException, JsonIOException, IOException {
		URL url = Application.class.getProtectionDomain().getCodeSource().getLocation();
		Path path = Paths.get(url.toString().replaceAll("file:/", "").replaceAll("classes", "classes/static/templates"));
		Path cssPath = Paths.get(url.toString().replaceAll("file:/", "").replaceAll("classes", "classes/static/css"));
		String cssFileName = "sample.css";
		
		BufferedReader reader = new BufferedReader(new FileReader(cssPath.resolve(cssFileName).toFile()));
		
		String         line = null;
	    StringBuilder  stringBuilder = new StringBuilder();

	    try {
	        while((line = reader.readLine()) != null) {
	            stringBuilder.append(line);
	        }

	        
	    } finally {
	        reader.close();
	    }
		
	    String style = paramMap.get("style").toString();
	    stringBuilder.append(style);
	    
	    paramMap.put("style", stringBuilder.toString());
	    paramMap.put("templatePath", path.toString());
		
		return paramMap;
	}
	
	
	/**
	 * 환경 파일 로드
	 * 실행 파일과 같은 경로의 app.json파일 로드
	 * @return
	 * @throws JsonSyntaxException
	 * @throws JsonIOException
	 * @throws IOException 
	 */
	@SuppressWarnings("unchecked")
	private static Map<String,Object> loadConfigJson(Map<String,Object> paramMap) throws JsonSyntaxException, JsonIOException, IOException {
		URL url = Application.class.getProtectionDomain().getCodeSource().getLocation();
		Path path = Paths.get(url.toString().replaceAll("file:/", "").replaceAll("classes", "classes/static/templates"));
		
		
		// HTML, JSP만 해당됨
		if(paramMap.get("style") != null) {
			Path cssPath = Paths.get(url.toString().replaceAll("file:/", "").replaceAll("classes", "classes/static/css"));
			String cssFileName = "sample.css";
			
			BufferedReader reader = new BufferedReader(new FileReader(cssPath.resolve(cssFileName).toFile()));
			
			String         line = null;
		    StringBuilder  stringBuilder = new StringBuilder();

		    try {
		        while((line = reader.readLine()) != null) {
		            stringBuilder.append(line);
		        }

		        
		    } finally {
		        reader.close();
		    }
			
		    String style = paramMap.get("style").toString();
		    stringBuilder.append(style);
		    paramMap.put("style", stringBuilder.toString());
		}
		
	    
	    
	    if(!paramMap.get("TMPLAT_ID").equals("undefined")) {
	    	BufferedOutputStream bs = null;
			try {
				bs = new BufferedOutputStream(new FileOutputStream(path.toString()+"/test.ftl"));
				String str =paramMap.get("TMPLAT_CTNT").toString();
				bs.write(str.getBytes()); //Byte형으로만 넣을 수 있음

			} catch (Exception e) {
		                e.getStackTrace();
				// TODO: handle exception
			}finally {
				bs.close();
			}
	    }
	    
	     
	    
	    
	    paramMap.put("templatePath", path.toString());
	    
		
		return paramMap;
	}
	

	

	
	
	/**
	 * 모든 소스 파일 생성
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 * @throws UnsupportedFlavorException 
	 * @throws SQLException 
	 */
	public static void processAll(Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException, UnsupportedFlavorException, ClassNotFoundException, SQLException {

		Configuration cfg = createConfiguration(paramMap);
		

		new FileGenerator().generate(cfg, paramMap);
		
	}



}
