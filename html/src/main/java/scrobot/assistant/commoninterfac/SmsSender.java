package scrobot.assistant.commoninterfac;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

//Install the Java helper library from twilio.com/docs/libraries/java
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Controller
public class SmsSender {
	
	  // Find your Account Sid and Token at twilio.com/user/account
	  public static final String ACCOUNT_SID = "ACae49f3ed7a059d4d737d429c3ee2daed";
	  public static final String AUTH_TOKEN = "3c39e768577d68c184848e2f5d9afc0f";
	  
	  // SMS 전송
	//  @ResponseBody
	  @RequestMapping(value="/Messagesend.do",method = RequestMethod.POST )
	  public @ResponseBody static int sendSMS (@RequestBody Map<String,Object> phoneNum) throws Exception { 
		//  String country, 
		Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
	    
	    // 휴대폰 인증번호 생성
	    int authNum = randomRange(100000, 999999);
	    
	   // if(country == "undefined" || country == null || country == "") {
	  //  	country = "82";
	  //  }
	    	
	    // 전송대상 휴대폰 번호
	    String sendTarget = "+82"+phoneNum.get("phone");
	    
	    // 전송 메세지
	    String authMsg = "[SCROBOT]인증번호 [" + authNum + "]를 입력해주세요." ;
	    
	    
	    Message message = Message.creator(
	    	// to
	    	new PhoneNumber(sendTarget),
	        // from
	    	new PhoneNumber("+15099564434"), 
	        // message
	    	authMsg).create();
	    
		return authNum;
		
	  }
	    
	  // 인증번호 범위 지정
	  public static int randomRange(int n1, int n2) {
	    return (int) (Math.random() * (n2 - n1 + 1)) + n1;
	  }
	  
	  
	}