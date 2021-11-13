/**
 * d
 */
package scrobot.assistant.batch;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateNotFoundException;
import scrobot.assistant.commoninterfac.Utils;

/**
 * 파일 생성
 * @author hyunseongkil
 *
 */
public class FileGenerator {
	
	String osPath = "";

	@SuppressWarnings("unchecked")
	public void generate(Configuration cfg, Map<String,Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		boolean isWindows = System.getProperty("os.name")
                .toLowerCase().startsWith("windows");
		
		if(isWindows) {
			osPath = "C:/dev/";
		} else {
			osPath = "/var/lib/jenkins/workspace/";
		}
		
		String header = paramMap.get("header").toString();
		
		genMenu(cfg, paramMap,"main");
		genMenu(cfg, paramMap,"header");
		genMenu(cfg, paramMap,"left");
		
		
		
		if(paramMap.get("viewList") != null) {
			List<Map<String,Object>> viewInfo = (List<Map<String, Object>>) paramMap.get("viewInfo");
			for(int i=0; i<viewInfo.size(); i++) {
				Map<String, Object> view = viewInfo.get(i);
				genView(cfg, view);
				genController(cfg, view);
				genService(cfg, view);
				genSql(cfg, view);
			}
		}


		
		
		
		
		// url 앞에 붙이는 형식일때 사용
		//genROOT(cfg, paramMap);
		
	}
	
	/**
	 * main jsp 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genMenu(Configuration cfg, Map<String, Object> paramMap, String dvs) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		Template temp = cfg.getTemplate(dvs+".ftl");
		
		
		//파일 생성 경로
		Path path = Paths.get(osPath+"scrobot_외부/scrobot/src/main/webapp/ws/jsp/root/");
		
		//파일명
		String filename = dvs+".jsp";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}
	
	
	/**
	 * view jsp 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genView(Configuration cfg, Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		String viewNm = paramMap.get("VIEW_NM").toString();
		String prjNm = paramMap.get("PRJ_NM").toString();
		
		Template temp = cfg.getTemplate("detailJsp.ftl");
		
		
		//파일 생성 경로
		Path path = Paths.get(osPath+"scrobot_외부/scrobot/src/main/webapp/ws/jsp","scrobot",prjNm);
		
		//파일명
		String filename = viewNm+".jsp";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}
	
	

	
	
	/**
	 * controller 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genController(Configuration cfg,	Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {

		
		String viewNm = paramMap.get("VIEW_NM").toString();
		String prjNm = paramMap.get("PRJ_NM").toString();
		
		//템플릿
		Template temp = cfg.getTemplate("controller.ftl");

		//파일 생성 경로
		Path path = Paths.get(osPath+"scrobot_외부/scrobot/src/main/java/scrobot/","scrobot",prjNm,"controller");
		
		//파일명
		String filename = viewNm + "Controller.java";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}

	
	/**
	 * service 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genService(Configuration cfg,	Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		String viewNm = paramMap.get("VIEW_NM").toString();
		String prjNm = paramMap.get("PRJ_NM").toString();
		
		//템플릿
		Template temp = cfg.getTemplate("service.ftl");

		//파일 생성 경로
		Path path = Paths.get(osPath+"scrobot_외부/scrobot/src/main/java/scrobot/","scrobot",prjNm,"service");
		
		//파일명
		String filename = viewNm + "Service.java";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
		
	}
	
	/**
	 * sql 파일 생성
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genSql(Configuration cfg, Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		String viewNm = paramMap.get("VIEW_NM").toString();
		String prjNm = paramMap.get("PRJ_NM").toString();
		
		//템플릿
		Template temp = cfg.getTemplate("sql.ftl");

		//파일 생성 경로
		Path path = Paths.get(osPath+"scrobot_외부/scrobot/src/main/resources/mapper/","scrobot",prjNm);
		
		//파일명
		String filename = viewNm + "Sql.xml";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}
	
	
	
	/**
	 * html 파일 생성
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	public String genHtml(Configuration cfg, Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		
		if(paramMap.get("TMPLAT_COURS") == null) {
			paramMap.put("TMPLAT_COURS", "C:\\dev");
		}
		
		Template temp;
		
		//템플릿
		if(paramMap.get("TMPLAT_ID") == null) {
			temp = cfg.getTemplate("html.ftl");
		} else {
			if(paramMap.get("TMPLAT_ID").equals("undefined")) {
				temp = cfg.getTemplate("html.ftl");
			} else {
				temp = cfg.getTemplate("test.ftl");
			}
		}
		
		
		
		//파일 생성 경로
		Path path = Paths.get(paramMap.get("TMPLAT_COURS").toString(), paramMap.get("PRJ_NM").toString(), "html");
		
		//파일명
		String filename = paramMap.get("VIEW_NM") + ".html";
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}
	
	
	
	
	
	/**
	 * 공통 - 소스 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @param temp
	 * @param path
	 * @param filename
	 * @throws TemplateException
	 * @throws IOException
	 */
	private String gen(Configuration cfg, Map<String,Object> paramMap, Template temp, Path path, String filename) throws TemplateException, IOException {
		//경로 미존재시 생성
		if(!path.toFile().exists()) {
			path.toFile().mkdirs();
		}

		boolean b = (boolean) paramMap.get("overwrite");
		if(!b) {
			Utils.backupFileIfExists(path, filename);
		}

		
		try(OutputStream os = new FileOutputStream(path.resolve(filename).toFile())){
			try(Writer out = new OutputStreamWriter(os, StandardCharsets.UTF_8)){
				temp.process(paramMap, out);
				
			}
		}
		
		
		String targetString = "";
		
		try(InputStream is = new FileInputStream(path.resolve(filename).toFile())){
			try(Reader in = new InputStreamReader(is, StandardCharsets.UTF_8)){
				int intValueOfChar;
			    while ((intValueOfChar = in.read()) != -1) {
			        targetString += (char) intValueOfChar;
			    }
			    in.close();
				
			}
		}
		
		//
		Utils.log(Thread.currentThread().getStackTrace(), "<<", path.resolve(filename));
		
		return targetString;
	}
	
	
	/**
	 * view jsp 파일 생성
	 * @param configMap
	 * @param cfg
	 * @param paramMap
	 * @throws TemplateNotFoundException
	 * @throws MalformedTemplateNameException
	 * @throws ParseException
	 * @throws IOException
	 * @throws TemplateException
	 */
	private String genROOT(Configuration cfg, Map<String, Object> paramMap) throws TemplateNotFoundException, MalformedTemplateNameException, ParseException, IOException, TemplateException {
		
		String prjNm = paramMap.get("PRJ_NM").toString();
		
		Template temp = cfg.getTemplate("ROOT.ftl");
		
		String catalinaHome = System.getenv("CATALINA_HOME").toString();
		//파일 생성 경로
		
		Path path = Paths.get(catalinaHome+"/conf/Catalina/"+prjNm+".192.168.0.4/");
		Path warPath = Paths.get(catalinaHome+"/"+prjNm+"/");
		
		//파일명
		String filename = "ROOT.xml";
		
		
		//경로 미존재시 생성
		if(!warPath.toFile().exists()) {
			warPath.toFile().mkdirs();
		}
		
		//
		return gen(cfg, paramMap, temp, path, filename);
	}
	
}

