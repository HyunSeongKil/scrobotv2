package scrobot.assistant.batch;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import org.junit.Test;


public class BuildScript {

    private static class StreamGobbler implements Runnable {
        private InputStream inputStream;
        private Consumer<String> consumer;

        public StreamGobbler(InputStream inputStream, Consumer<String> consumer) {
            this.inputStream = inputStream;
            this.consumer = consumer;
        }

        
        public void run() {
            try {
                new BufferedReader(new InputStreamReader(inputStream, "euc-kr")).lines()
                        .forEach(consumer);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
    }
    
    
    public static void delete() throws IOException, InterruptedException {
        boolean isWindows = System.getProperty("os.name")
                .toLowerCase().startsWith("windows");

        ProcessBuilder builder = new ProcessBuilder();
        System.out.println("실행환경이 윈도우인가? " + isWindows);
        
        String command ="";
        
        if (isWindows) {
        	command ="rmdir /s /q webapp\\ws\\jsp\\scrobot && "
        			+ "rmdir /s /q java\\scrobot\\scrobot && "
        			+ "rmdir /s /q resources\\mapper\\scrobot";
            builder.command("cmd.exe", "/c", command);
            builder.directory(new File("C:\\dev\\scrobot_외부\\scrobot\\src\\main"));
        } else {
        	command = "rm -rf webapp/ws/jsp/scrobot && "
        			+ "rm -rf java/scrobot/scrobot && "
        			+ "rm -rf resources/mapper/scrobot ";
            builder.command("sh", "-c", command);
            builder.directory(new File("/var/lib/jenkins/workspace/scrobot_외부/scrobot/src/main"));
        }
        
        Process process = builder.start();
        StreamGobbler streamGobbler =
                new StreamGobbler(process.getInputStream(), System.out::println);
        Executors.newSingleThreadExecutor().submit(streamGobbler);
        int exitCode = process.waitFor();
        assert exitCode == 0;
    }
    
    

    public static void make(String prjNm) throws IOException, InterruptedException {
        boolean isWindows = System.getProperty("os.name")
                .toLowerCase().startsWith("windows");

        ProcessBuilder builder = new ProcessBuilder();
        
        
        
        String command ="";
        
        if (isWindows) {
        	String catalinaHome = System.getenv("CATALINA_HOME").toString();
        	command ="C:\\tools\\apache-maven-3.6.3\\bin\\mvn clean install -P prod "+
        	        "&& copy c:\\dev\\scrobot_외부\\scrobot\\target\\scrobot-0.0.0.war "+catalinaHome+"\\webapps\\"+prjNm+".war";
            builder.command("cmd.exe", "/c", command);
            builder.directory(new File("C:\\dev\\scrobot_외부\\scrobot"));
        } else {
        	command = "mvn clean install -P prod && cp target/scrobot-0.0.0.war /opt/server/apache-tomcat-9.0.41/webapps/"+prjNm+".war";
            builder.command("sh", "-c", command);
            builder.directory(new File("/var/lib/jenkins/workspace/scrobot_외부/scrobot"));
        }
        
        Process process = builder.start();
        StreamGobbler streamGobbler =
                new StreamGobbler(process.getInputStream(), System.out::println);
        Executors.newSingleThreadExecutor().submit(streamGobbler);
        int exitCode = process.waitFor();
        assert exitCode == 0;
    }
}
