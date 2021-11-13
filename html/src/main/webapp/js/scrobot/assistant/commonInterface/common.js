/***
 * 
 */
 //
robot = {};

/* prompt - 프롬프트를 실행한다.a
 * msg : 메시지 내용(String)
 * ele : prompt 요소(Arrary)
 * btn1 : 버튼1 name(String)
 * btn2 : 버튼2 name(String)
 * callBack : callback함수(String)
 * */
robot.prompt = function(header, msg, ele, btn1, btn2, callBack){ 
	
	if(typeof(ele) != "object"){
		robot.alert("프롬프트 메소드 에러","");
		return false;
	}
	var vsSource = "<h3>"+msg+"</h3><br><br>";
	for(var i=0; i<ele.length; i++){
		if(typeof(ele[i]) =="string"){
			vsSource += "<span>"+ele[i]+" : "+"</span>";
			vsSource += "<input class=\"prompt_input\" type=\"text\"></input><br><br>";
		} else if(typeof(ele[i]) =="object"){
			var key = Object.keys(ele[i])[0];
			vsSource += "<span>"+key+" : "+"</span>";
			vsSource += "<input class=\"prompt_input\" type=\"text\" value=\""+ele[i][key]+"\"></input><br><br>";
		}
		
	}
	
	vsSource += "<br>"
	
	if(btn1 == null || btn1 == ""){
		btn1 = "확인";
	}
	if(btn2 == null || btn2 == ""){
		btn2 = "취소";
	}
	
	if(header == null || header == ""){
		header = "prompt";
	}
	
	
	vsSource += "<input type=\"button\" class=\"btn_retrieve1\" id=\"btn_promptSave\" value=\""+btn1+"\" onclick=\"robot.promptOnclick(";
	
	if(typeof(ele) == "object"){
		vsSource += "[";
		for(var i=0; i<ele.length; i++){
			vsSource += "'";
			vsSource += ele[i];
			vsSource += "'";
			if(ele.length-1 != i){
				vsSource += ",";
			}
		}
		vsSource += "]";
	} else if(typeof(ele) == "string"){		
		vsSource += "'"+ele+"'";
	} else if(typeof(ele) == "number"){
		vsSource += ele;
	}
	
	vsSource += "," + callBack+")\"></input>";
	vsSource += "<input type=\"button\" class=\"btn_retrieve2\" value=\""+btn2+"\" onclick=\"robot.closePop('',"+callBack+")\"></input>";
	
	var info = {"header" : header,
			    "callBack" : callBack};
	
	robot.openPop(info, vsSource,"tag","prompt");
}

robot.promptOnclick = function(ele, callBack){
	var voClassInfo = $(".prompt_input");
	var voClassValue = [];
	var vsMsg = "";
	
	for(var i=0; i<voClassInfo.length; i++){
		if(voClassInfo.eq(i).val() == ""){
			
			
			if(vsMsg != ""){
				vsMsg += ", ";
			}
			vsMsg += ele[i];
			
		}
		voClassValue.push(voClassInfo.eq(i).val());
	}
	
	if(vsMsg != ""){
		robot.alert(vsMsg+"을(를) 올바르게 입력하여 주시기 바랍니다.");
		return false;
	}
	
	
	robot.closePop(voClassValue, callBack);
	
}


/* alert - alert창을 실행
 * msg : 메시지 내용(String)
 * btn : 버튼 name(String)
 * param : 파라메터 값 (JSON)
 * callBack : callback함수(String)
 * */
robot.alert = function(msg, btn, param, callBack){

	var vsSource = "<h3>"+msg+"</h3><br><br>";
	vsSource += "<br>"
	
	if(btn == null || btn == ""){
		btn = "확인";
	}
	
	vsSource += "<input type=\"button\" class=\"btn_retrieve1\" style=\"cursor: pointer; padding: 7px 20px; border-radius: 10px; border: 2px solid black; background: white; color: black; margin-right: 10px; \" value=\""+btn+"\" onclick=\"robot.closePop(";
	
	if(typeof(param) == "object"){
		var vsRecursion = robot.objectForRecursion("",param);
		vsRecursion = vsRecursion.replace(/,\s*$/, "");
		vsRecursion = vsRecursion.split(" ").join("&nbsp;");
		
		vsSource += vsRecursion;
	} else if(typeof(param) == "string"){
		vsSource += "'"+param+"'";
	} else if(typeof(param) == "number"){
		vsSource += param;
	} else if(typeof(param) == "undefined"){
		vsSource += "''";
	}
		
	vsSource += ","+callBack+")\"></input>";
	
	
	var info = {"header" : "prompt",
		        "callBack" : callBack};
	
	robot.openPop(info, vsSource,"tag");
}


/* confirm - confirm창을 실행
 * msg : 메시지 내용(String)
 * btn1 : 버튼 name(String)
 * btn2 : 버튼 name(String)
 * param : 파라메터 값 (JSON)
 * callBack : callback함수(String)
 * */
robot.confirm = function(msg, btn1, btn2, param, callBack){
	
	var vsSource = "<h3 style='padding:50px 0 15px 0;'>"+msg+"</h3><br><br>";

	
	if(btn1 == null || btn1 == ""){
		btn1 = "확인";
	}
	if(btn2 == null || btn2 == ""){
		btn2 = "취소";
	}
	
	
	vsSource += "<input type=\"button\" class=\"btn_retrieve1\" style=\"cursor: pointer; padding: 7px 20px; border-radius: 10px; border: 2px solid black; background: white; color: black; margin-right: 10px; \" value=\""+btn1+"\" onclick=\"robot.closePop(";
	
	if(typeof(param) == "object"){
		var vsRecursion = robot.objectForRecursion("",param);
		vsRecursion = vsRecursion.replace(/,\s*$/, "");
		vsRecursion = vsRecursion.split(" ").join("&nbsp;");
		
		vsSource += vsRecursion;
	} else if(typeof(param) == "string"){
		vsSource += "'"+param+"'";
	} else if(typeof(param) == "number"){
		vsSource += param;
	} else if(typeof(param) == "undefined"){
		vsSource += "''";
	}
	
	
	
	
	
	vsSource += ","+callBack+");\"></input>";
	vsSource += "<input type=\"button\" class=\"btn_retrieve2\" style=\"cursor: pointer; padding: 7px 20px; border-radius: 10px; border: 2px solid black; background: white; color: black; \" value=\""+btn2+"\" onclick=\"robot.closePop('','');\"></input>";
	
	var info = {"header" : "안내",
				"param":param,
		        "callBack" : callBack};
	
	robot.confirmPop(info, vsSource,"tag");
}

/* confirmPop - 안내 팝업을 오픈한다.
 * info : header헤더에 표시될 내용(string)
 * url : 팝업에 표시될 url내용(String)
 * urlDvs : jsp를 호출할지 tag를 직접입력할지 여부(String)
 *        - tag경우에 append, url인경우 load
 * */
robot.confirmPop = function(info, url, urlDvs,tagDvs){

	var header = info.header;
	var width = info.width;
	var height = info.height;
	var vsCallBack = info.callBack;
	var vjParam = info.param;
	var node = info.node;
	
	if(typeof(header) == "undefined"){
		header = "popUp";
	}
	
	if(typeof(width) == "undefined"){
		width = "400px";
	} else if(typeof(width) == "number"){
		width += "px";
	}
	
	if(typeof(height) == "undefined"){
		height = "260px";
	} else if(typeof(height) == "number"){
		height += "px";
	}
	
	if(typeof(vsCallBack) == "undefined"){
		vsCallBack = "''";
	}

	if(typeof(node) == "undefined"){
		node = "";
	}
	
	var div_pop_cnt = $(".div_pop").length;
	
	var div_confirm_popCount = $(".div_confirm_pop").length;

	var info= "<div id=\"div_pop"+div_pop_cnt+"\" class=\"div_pop\" style=>";
	
	info += " <input id=\"param\" type=\"hidden\" value=";

	
	var vsRecursion = robot.objectForRecursionOpenPop("",vjParam);
	vsRecursion = vsRecursion.replace(/,\s*$/, "");
	vsRecursion = vsRecursion.split(" ").join("&nbsp;");
	
	info += vsRecursion;
	
	info += "></input>";
	
	info += " <input id=\"node\" type=\"hidden\" value=\""+node+"\" >"; 
	
	info += " <input id=\"callBack\" type=\"hidden\" value=\""+vsCallBack+"\"></input>";
	
	
	info += "    <div id=\"div_confirm_pop_content"+div_confirm_popCount+"\" class=\"div_confirm_pop_content\" style=\"width:"+width+"; height:"+height+"\">";
	info += "      <div id=\"div_confirm_pop_header\">";
	info += "      <span class=\"span_content\" style=\"display:inline-block;font-size:1.1vw;padding-left:9px;\">"+header+"</span>";
	info += "      <input type=\"button\" value=\"X\" style=\"cursor:pointer;  border:2px solid black; float:right; font-size:12px; font-weight:bold; text-align:center; border-radius:50px; width:20px; height:20px; background:white; transform:translateY(10px); margin-right:9px;\"";
	info += "      onclick=\"robot.closePop('','');\">";
	info += "      </div>";
	info += "      <div id=\"confirm_pop_content"+div_confirm_popCount+"\" class=\"confirm_pop_content\">";
	info += "      </div>";
	info += "    </div>";
	info += "</div>";


	$("body").append(info);
	
	
	if(urlDvs == "tag"){
		$("#confirm_pop_content"+div_confirm_popCount).append(url);
		if(tagDvs == "prompt"){
			var vsValue = $(".prompt_input").val().trim();
			
			$(".prompt_input").val(vsValue);
			$(".prompt_input").eq(0).select();
		}
	} else { 
		$("#confirm_pop_content"+div_confirm_popCount).load("./ws/pop/"+url);
	}
	fn_hover();
	
}


/* openPop - 팝업을 오픈한다.
 * info : header헤더에 표시될 내용(string)
 * url : 팝업에 표시될 url내용(String)
 * urlDvs : jsp를 호출할지 tag를 직접입력할지 여부(String)
 *        - tag경우에 append, url인경우 load
 * */
robot.openPop = function(info, url, urlDvs,tagDvs){ 

	var header = info.header;
	var width = info.width;
	var height = info.height;
	var vsCallBack = info.callBack;
	var vjParam = info.param;
	var node = info.node;
	
	if(typeof(header) == "undefined"){
		header = "popUp";
	}
	
	if(typeof(width) == "undefined"){
		width = "400px";
	} else if(typeof(width) == "number"){
		width += "px";
	}
	
	if(typeof(height) == "undefined"){
		height = "260px";
	} else if(typeof(height) == "number"){
		height += "px";
	}
	
	if(typeof(vsCallBack) == "undefined"){
		vsCallBack = "''";
	}

	if(typeof(node) == "undefined"){
		node = "";
	}
	
	var div_popCount = $(".div_pop").length;

	var info= "<div id=\"div_pop"+div_popCount+"\" class=\"div_pop\" style=>";
	
	info += " <input id=\"param\" type=\"hidden\" value=";

	
	var vsRecursion = robot.objectForRecursionOpenPop("",vjParam);
	vsRecursion = vsRecursion.replace(/,\s*$/, "");
	vsRecursion = vsRecursion.split(" ").join("&nbsp;");
	
	info += vsRecursion;
	
	info += "></input>";
	
	info += " <input id=\"node\" type=\"hidden\" value=\""+node+"\" >"; 
	
	info += " <input id=\"callBack\" type=\"hidden\" value=\""+vsCallBack+"\"></input>";
	
	
	info += "    <div id=\"div_pop_content"+div_popCount+"\" class=\"div_pop_content\" style=\"width:"+width+"; height:"+height+"\">";
	info += "      <div id=\"div_pop_header\" class=\"div_pop_header\">";
	info += "      <span class=\"span_content\" style=\" display:inline-block;font-size:1.1vw;padding-left:9px;\">"+header+"</span>";
	info += "      <input type=\"button\" value=\"X\" style=\"cursor:pointer;  border:2px solid black; float:right; font-size:12px; font-weight:bold; text-align:center; border-radius:50px; width:20px; height:20px; background:white; transform:translateY(10px); margin-right:9px;\"";
	info += "      onclick=\"robot.closePop('',"+vsCallBack+");\">";
	info += "      </div>";
	info += "      <div id=\"pop_content"+div_popCount+"\" class=\"pop_content\">";
	info += "      </div>";
	info += "    </div>";
	info += "</div>";


	$("body").append(info);
	
	if(urlDvs == "tag"){
		$("#pop_content"+div_popCount).append(url);
		if(tagDvs == "prompt"){
			var vsValue = $(".prompt_input").val().trim();
			
			$(".prompt_input").val(vsValue);
			$(".prompt_input").eq(0).select();
		}
	} else {
		$("#pop_content"+div_popCount).load("./ws/pop/"+url);
	}
	fn_hover();
}


robot.loginPop = function(info, url, urlDvs,tagDvs){ 

	var header = info.header;
	var width = info.width;
	var height = info.height;
	var vsCallBack = info.callBack;
	var vjParam = info.param;
	var node = info.node;
	
	if(typeof(header) == "undefined"){
		header = "popUp";
	}
	
	if(typeof(width) == "undefined"){
		width = "400px";
	} else if(typeof(width) == "number"){
		width += "px";
	}
	
	if(typeof(height) == "undefined"){
		height = "260px";
	} else if(typeof(height) == "number"){
		height += "px";
	}
	
	if(typeof(vsCallBack) == "undefined"){
		vsCallBack = "''";
	}

	if(typeof(node) == "undefined"){
		node = "";
	}
	
	var div_popCount = $(".div_pop").length;

	var info= "<div id=\"div_pop"+div_popCount+"\" class=\"div_pop\" style=>";
	
	info += " <input id=\"param\" type=\"hidden\" value=";

	
	var vsRecursion = robot.objectForRecursionOpenPop("",vjParam);
	vsRecursion = vsRecursion.replace(/,\s*$/, "");
	vsRecursion = vsRecursion.split(" ").join("&nbsp;");
	
	info += vsRecursion;
	
	info += "></input>";
	
	info += " <input id=\"node\" type=\"hidden\" value=\""+node+"\" >"; 
	
	info += " <input id=\"callBack\" type=\"hidden\" value=\""+vsCallBack+"\"></input>";
	
	
	info += "    <div id=\"div_pop_content"+div_popCount+"\" class=\"div_pop_content\" style=\"width:"+width+"; height:"+height+"\">";
	info += "      <div id=\"div_logonPop_header\">";
	info += "      <input type=\"button\" value=\"X\" style=\"cursor:pointer; border:0px; float:right; background: #faf4eb; height:100%; width:5%; font-size:0.8vw; padding:10px 28px; font-weight:bold;\"";
	info += "      onclick=\"robot.closePop('',"+vsCallBack+");\">";
	info += "      </div>";
	info += "      <div id=\"pop_content"+div_popCount+"\" class=\"pop_content\">";
	info += "      </div>";
	info += "    </div>";
	info += "</div>";


	$("body").append(info);
	
	
	if(urlDvs == "tag"){
		$("#pop_content"+div_popCount).append(url);
		if(tagDvs == "prompt"){
			var vsValue = $(".prompt_input").val().trim();
			
			$(".prompt_input").val(vsValue);
			$(".prompt_input").eq(0).select();
		}
	} else {
		$("#pop_content"+div_popCount).load("./ws/pop/"+url);
	}
	
}


robot.logoutPop = function(info, url, urlDvs,tagDvs){ 

	var header = info.header;
	var width = info.width;
	var height = info.height;
	var vsCallBack = info.callBack;
	var vjParam = info.param;
	var node = info.node;
	
	if(typeof(header) == "undefined"){
		header = "popUp";
	}
	
	if(typeof(width) == "undefined"){
		width = "400px";
	} else if(typeof(width) == "number"){
		width += "px";
	}
	
	if(typeof(height) == "undefined"){
		height = "260px";
	} else if(typeof(height) == "number"){
		height += "px";
	}
	
	if(typeof(vsCallBack) == "undefined"){
		vsCallBack = "''";
	}

	if(typeof(node) == "undefined"){
		node = "";
	}
	
	var div_popCount = $(".div_pop").length;

	var info= "<div id=\"div_pop"+div_popCount+"\" class=\"div_pop\" style=>";
	
	info += " <input id=\"param\" type=\"hidden\" value=";

	
	var vsRecursion = robot.objectForRecursionOpenPop("",vjParam);
	vsRecursion = vsRecursion.replace(/,\s*$/, "");
	vsRecursion = vsRecursion.split(" ").join("&nbsp;");
	
	info += vsRecursion;
	
	info += "></input>";
	
	info += " <input id=\"node\" type=\"hidden\" value=\""+node+"\" >"; 
	
	info += " <input id=\"callBack\" type=\"hidden\" value=\""+vsCallBack+"\"></input>";
	
	
	info += "    <div id=\"div_pop_content"+div_popCount+"\" class=\"div_pop_content\" style=\"width:"+width+"; height:"+height+"\">";
	info += "      <div id=\"div_pop_header\">";
	info += "      <input type=\"button\" value=\"X\" style=\"cursor:pointer; border:0px; float:right; background: white; height:100%; width:5%; font-size:1.3vw; font-weight:bold;\"";
	info += "      onclick=\"robot.closePop('',"+vsCallBack+");\">";
	info += "      </div>";
	info += "      <div id=\"pop_content"+div_popCount+"\" class=\"pop_content\">";
	info += "      </div>";
	info += "    </div>";
	info += "</div>";


	$("body").append(info);
	
	
	if(urlDvs == "tag"){
		$("#pop_content"+div_popCount).append(url);
		if(tagDvs == "prompt"){
			var vsValue = $(".prompt_input").val().trim();
			
			$(".prompt_input").val(vsValue);
			$(".prompt_input").eq(0).select();
		}
	} else {
		$("#pop_content"+div_popCount).load("./ws/pop/"+url);
	}
	
}


/* closePop - 팝업을 닫는다.
 * param : 콜백함수로 보내질 param값(Object)
 * callBack : callBack 함수(String)
 * */
robot.closePop = function(param, callBack){

	var div_popCount = ($(".div_pop").length)-1;
	$("#div_pop"+div_popCount).remove();
	
	if(callBack != null && callBack != "" && typeof(callBack) == "function"){
		callBack(param);
	}
	
	if(typeof(callBack) == "string" && callBack != ""){
		eval(callBack)(param);
	}
}


/******************************************
 * getAttr - 클릭한 태그의 속성을 가지고 온다.  >> 모든 속성은 내부 컴포넌트 기준임.
 * param : 선택한 컴포넌트 this (Object)
 * i : 반복변수 (int)
 *
 *  div : div_in , div_out
 *	title : div_title
 *	label : div_label
 *	button : button 
 *	input : inputBox
 *	select : select
 *	checkbox : div_checkbox , checkbox
 *	radio : div_radio , radio
 *	  : td , div_table
 *	grid : div_grid_comp , gth , gtd
 *
 ******************************************/
var checkComp = "";
robot.getAttr = function(param, i){     

	checkComp = $(param).attr("compoDvs");
	
	var vMap = {}; // 속성들을 담을 맵
	
	if(checkComp == "div_in" || checkComp == "div_out"){
		if(checkComp == "div_in"){ // 해당 컴포넌트 속성들 가져옴.
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "div"
				}	
		}
		else if(checkComp == "div_out"){
			vMap = {
					"id" : $(param).eq(0).attr("cmpid"),
					"class" : $(param).eq(0).attr("cmpclass"),
					"name" : $(param).eq(0).attr("cmpname"),
					"label" : $(param).eq(0).attr("cmplabel"),
					"value" : $(param).eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).eq(0).attr("cmponclick"),
					"dblclick" : $(param).eq(0).attr("cmpdblclick"),
					"keydown" : $(param).eq(0).attr("cmpkeydown"),
					"keyup" : $(param).eq(0).attr("cmpkeyup"),
					
					"compoDvs" : $(param).eq(0).attr("compoDvs"),
					"realId" : $(param).eq(0).attr("id"),
					
					"width" : $(param).eq(0).css("width").replace("px",""),
					"height" : $(param).eq(0).css("height").replace("px",""),
					"background" : $(param).eq(0).css("background-color"),
					
					"compType": "div"
				}
		}
	}
	else if(checkComp == "div_title" || checkComp == "div_label"){ // 유사 컴포넌트
		var compName = "";
		
		if(checkComp == "div_title"){
			compName = "title";
		}
		else if(checkComp == "div_label"){
			compName = "label";
		}
		
		vMap = {
				"id" : $(param).attr("cmpid"),
				"class" : $(param).attr("cmpclass"),
				"name" : $(param).attr("cmpname"),
				"label" : $(param).attr("cmplabel"),
				"value" : $(param).attr("cmpvalue"),
					
				"onclick" : $(param).attr("cmponclick"),
				"dblclick" : $(param).attr("cmpdblclick"),
				"keydown" : $(param).attr("cmpkeydown"),
				"keyup" : $(param).attr("cmpkeyup"),
				
				"compoDvs" : $(param).attr("compoDvs"),
				"realId" : $(param).attr("id"),
				
				"width" : $(param).css("width").replace("px",""),
				"height" : $(param).css("height").replace("px",""),
				"background" : $(param).css("background-color"),
				
				"compType": compName
			}	
	}
	else if(checkComp == "div_button" || checkComp == "button"){
		if(checkComp == "div_button"){
			vMap = {
					"id" : $(param).eq(0).attr("cmpid"),
					"class" : $(param).eq(0).attr("cmpclass"),
					"name" : $(param).eq(0).attr("cmpname"),
					"label" : $(param).eq(0).attr("cmplabel"),
					"value" : $(param).eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).eq(0).attr("cmponclick"),
					"dblclick" : $(param).eq(0).attr("cmpdblclick"),
					"keydown" : $(param).eq(0).attr("cmpkeydown"),
					"keyup" : $(param).eq(0).attr("cmpkeyup"),
					
					"compoDvs" : $(param).eq(0).attr("compoDvs"),
					"realId" : $(param).eq(0).attr("id"),
					
					"width" : $(param).eq(0).css("width").replace("px",""),
					"height" : $(param).eq(0).css("height").replace("px",""),
					"background" : $(param).eq(0).css("background-color"),
					
					"compType": "button"
				}
		}
		else if(checkComp == "button"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "button"
				}	
		}	
	}
	else if(checkComp == "div_inputBox" || checkComp == "inputBox"){
		if(checkComp == "div_inputBox"){
			vMap = {
					"id" : $(param).eq(0).attr("cmpid"),
					"class" : $(param).eq(0).attr("cmpclass"),
					"name" : $(param).eq(0).attr("cmpname"),
					"label" : $(param).eq(0).attr("cmplabel"),
					"value" : $(param).eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).eq(0).attr("cmponclick"),
					"dblclick" : $(param).eq(0).attr("cmpdblclick"),
					"keydown" : $(param).eq(0).attr("cmpkeydown"),
					"keyup" : $(param).eq(0).attr("cmpkeyup"),
					
					"compoDvs" : $(param).eq(0).attr("compoDvs"),
					"realId" : $(param).eq(0).attr("id"),
					
					"width" : $(param).eq(0).css("width").replace("px",""),
					"height" : $(param).eq(0).css("height").replace("px",""),
					"background" : $(param).eq(0).css("background-color"),
					
					"compType": "inputBox"
				}
		}
		else if(checkComp == "inputBox"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "inputBox"
				}	
		}
	}
	else if(checkComp == "div_select" || checkComp == "select"){
		if(checkComp == "div_select"){
			vMap = {
					"id" : $(param).eq(0).attr("cmpid"),
					"class" : $(param).eq(0).attr("cmpclass"),
					"name" : $(param).eq(0).attr("cmpname"),
					"label" : $(param).eq(0).attr("cmplabel"),
					"value" : $(param).eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).eq(0).attr("cmponclick"),
					"dblclick" : $(param).eq(0).attr("cmpdblclick"),
					"keydown" : $(param).eq(0).attr("cmpkeydown"),
					"keyup" : $(param).eq(0).attr("cmpkeyup"),
					
					"compoDvs" : $(param).eq(0).attr("compoDvs"),
					"realId" : $(param).eq(0).attr("id"),
					
					"width" : $(param).eq(0).css("width").replace("px",""),
					"height" : $(param).eq(0).css("height").replace("px",""),
					"background" : $(param).eq(0).css("background-color"),
					
					"compType": "select"
				}
		}
		else if(checkComp == "select"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "select"
				}	
		}
	}
	else if(checkComp == "div_checkbox" || checkComp == "checkbox"){
		if(checkComp == "div_checkbox"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "checkbox"
				}	
		}
		else if(checkComp == "checkbox"){
			vMap = {
					"id" : $(param).parent().attr("cmpid"),
					"class" : $(param).parent().attr("cmpclass"),
					"name" : $(param).parent().attr("cmpname"),
					"label" : $(param).parent().attr("cmplabel"),
					"value" : $(param).parent().children().eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).parent().attr("cmponclick"),
					"dblclick" : $(param).parent().attr("cmpdblclick"),
					"keydown" : $(param).parent().attr("cmpkeydown"),
					"keyup" : $(param).parent().attr("cmpkeyup"),
					
					"compoDvs" : $(param).parent().attr("compoDvs"),
					"realId" : $(param).parent().attr("id"),
					
					"width" : $(param).parent().css("width").replace("px",""),
					"height" : $(param).parent().css("height").replace("px",""),
					"background" : $(param).parent().css("background-color"),
					
					"compType": "checkbox"
				}	
		}
	}
	else if(checkComp == "div_radio" || checkComp == "radio"){
		if(checkComp == "div_radio"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "radio"
				}	
		}
		else if(checkComp == "radio"){
			vMap = {
					"id" : $(param).parent().attr("cmpid"),
					"class" : $(param).parent().attr("cmpclass"),
					"name" : $(param).parent().attr("cmpname"),
					"label" : $(param).parent().attr("cmplabel"),
					"value" : $(param).parent().children().eq(0).attr("cmpvalue"),
						
					"onclick" : $(param).parent().attr("cmponclick"),
					"dblclick" : $(param).parent().attr("cmpdblclick"),
					"keydown" : $(param).parent().attr("cmpkeydown"),
					"keyup" : $(param).parent().attr("cmpkeyup"),
					
					"compoDvs" : $(param).parent().attr("compoDvs"),
					"realId" : $(param).parent().attr("id"),
					
					"width" : $(param).parent().css("width").replace("px",""),
					"height" : $(param).parent().css("height").replace("px",""),
					"background" : $(param).parent().css("background-color"),
					
					"compType": "radio"
				}	
		}
	}
	else if(checkComp == "div_table" || checkComp == "td"){
		if(checkComp == "div_table"){

			// 일단 생략
			return false;
			
			vMap = {
					"id" : $(param).children(".table").attr("cmpid"),
					"class" : $(param).children(".table").attr("cmpclass"),
					"name" : $(param).children(".table").attr("cmpname"),
					"label" : $(param).children(".table").attr("cmplabel"),
					"value" : $(param).children(".table").attr("cmpvalue"),
						
					"onclick" : $(param).children(".table").attr("cmponclick"),
					"dblclick" : $(param).children(".table").attr("cmpdblclick"),
					"keydown" : $(param).children(".table").attr("cmpkeydown"),
					"keyup" : $(param).children(".table").attr("cmpkeyup"),
					
					"compoDvs" : $(param).children(".table").attr("compoDvs"),
					"realId" : $(param).children(".table").attr("id"),
					
					"width" : $(param).children(".table").css("width").replace("px",""),
					"height" : $(param).children(".table").css("height").replace("px",""),
					"background" : $(param).children(".table").css("background-color"),
					
					"compType": "table"
				}	
		}
		else if(checkComp == "td"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" :  $(param).parent().parent().parent().attr("id"), // 테이블을 찾기 위함.
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "td"
				}	
		}
	}
	else if(checkComp == "div_grid_comp" || checkComp == "gth" || checkComp == "gtd"){
		if(checkComp == "div_grid_comp"){

			// 일단 생략
			return false;
			
			vMap = {
					"id" : $(param).children(".grid").attr("cmpid"),
					"class" : $(param).children(".grid").attr("cmpclass"),
					"name" : $(param).children(".grid").attr("cmpname"),
					"label" : $(param).children(".grid").attr("cmplabel"),
					"value" : $(param).children(".grid").attr("cmpvalue"),
						
					"onclick" : $(param).children(".grid").attr("cmponclick"),
					"dblclick" : $(param).children(".grid").attr("cmpdblclick"),
					"keydown" : $(param).children(".grid").attr("cmpkeydown"),
					"keyup" : $(param).children(".grid").attr("cmpkeyup"),
					
					"compoDvs" : $(param).children(".grid").attr("compoDvs"),
					"realId" : $(param).children(".grid").attr("id"),
					
					"width" : $(param).children(".grid").css("width").replace("px",""),
					"height" : $(param).children(".grid").css("height").replace("px",""),
					"background" : $(param).children(".grid").css("background-color"),
					
					"compType": "grid"
				}	
		}
		else if(checkComp == "gth"){
			vMap = {
					"id" : $(param).attr("cmpid"),
					"class" : $(param).attr("cmpclass"),
					"name" : $(param).attr("cmpname"),
					"label" : $(param).attr("cmplabel"),
					"value" : $(param).attr("cmpvalue"),
						
					"onclick" : $(param).attr("cmponclick"),
					"dblclick" : $(param).attr("cmpdblclick"),
					"keydown" : $(param).attr("cmpkeydown"),
					"keyup" : $(param).attr("cmpkeyup"),
					
					"compoDvs" : $(param).attr("compoDvs"),
					"realId" : $(param).parent().parent().parent().attr("id"),
					
					"width" : $(param).css("width").replace("px",""),
					"height" : $(param).css("height").replace("px",""),
					"background" : $(param).css("background-color"),
					
					"compType": "th"
				}	
		}
		else if(checkComp == "gtd"){
			
		}
	}
	
	if(vMap.realId == "table"){
		if(vMap.compType == "td"){
			
			var row = $("#"+vMap.realId+" td[tablefocus=true]").parent().attr("row");
			var shell = $("#"+vMap.realId+" td[tablefocus=true]").attr("shell");
			
			$("#ibx_propertyTable_param").attr("row",row);
			$("#ibx_propertyTable_param").attr("shell",shell);
		}
		else{
		
		}
		
		
	}
	else if(vMap.realId == "grid"){
		if(vMap.compType == "th"){
			var headerrow = $("#"+vMap.realId+" > tr > th[gridthfocus=true]").parent().attr("headerrow");
			var headercol = $("#"+vMap.realId+" th[gridthfocus=true]").attr("headercol");
			
			$("#ibx_propertyTable_param").attr("headerrow",headerrow);
			$("#ibx_propertyTable_param").attr("headercol",headercol);
		}
		else{
		}
		
	}
	$("#ibx_propertyTable_compoDvs").val(vMap.compoDvs);
	$("#ibx_propertyTable_realId").val(vMap.realId);	

	$("#ibx_propertyTable_id").val(vMap.id);
	$("#ibx_propertyTable_class").val(vMap.class);
	$("#ibx_propertyTable_name").val(vMap.name);
	$("#ibx_propertyTable_label").val(vMap.label);
	$("#ibx_propertyTable_value").val(vMap.value);

	$("#ibx_propertyTable_align").val(vMap.align);
	$("#ibx_propertyTable_float").val(vMap.float);
	$("#ibx_propertyTable_width").val(vMap.width);
	$("#ibx_propertyTable_height").val(vMap.height);
	$("#ibx_propertyTable_background-color").val(vMap.background);

	$("#ibx_propertyTable_onclick").val(vMap.onclick);
	$("#ibx_propertyTable_dblclick").val(vMap.dblclick);
	$("#ibx_propertyTable_keydown").val(vMap.keydown);
	$("#ibx_propertyTable_keyup").val(vMap.keyup);

	$(".compType").val(vMap.compType);

}





	


robot.objectForRecursionOpenPop = function(info,vjParam){
	
	

	if(typeof(vjParam) == "object"){
		
		if(vjParam.forEach == null){
			
			info += "{";
			
			for(var i=0; i<Object.keys(vjParam).length; i++){
				
				info += "\"";
				info += Object.keys(vjParam)[i];
				
				info += "\":";
				var vjParam2 = vjParam[Object.keys(vjParam)[i]];
				if(typeof(vjParam2) == "object"){
					
					info = robot.objectForRecursionOpenPop(info, vjParam2);
					
				} else{
					
					if(typeof(vjParam2) == "string"){
						var split = vjParam2.split("\n");
						vjParam2 = split.join("\\n");
						var split = vjParam2.split("\t");
						vjParam2 = split.join("\\t");
					}
					
					
					info += "\"";
					info += vjParam2;
					info += "\"";
					
					if(Object.keys(vjParam).length-1 != i){
						
						info += ",";
					}
				}
				
			}
			info = info.replace(/,\s*$/, "");
			info += "}";
			
		} else{
			
			info += "[";
			
			for(var i=0; i<vjParam.length; i++){
				
				
				var vjParam2 = vjParam[i];
				if(typeof(vjParam2) == "object"){
					
					info = robot.objectForRecursionOpenPop(info, vjParam2);
					
				} else{
					info += "\"";
					info += vjParam[i];
					info += "\"";
					if(vjParam.length-1 != i){
						info += ",";
					}
				}
				
			}
			info = info.replace(/,\s*$/, "");
			info += "]";
		}
		
		info += ",";
		
	}	
	else if(typeof(vjParam) == "undefined"){
		info = "";
	}
	else{
		info = vjParam;	
	}

	
	return info;
}


robot.objectForRecursion = function(info,vjParam){

	

	if(typeof(vjParam) == "object"){
		
		if(vjParam.forEach == null){
			
			info += "{";
			
			for(var i=0; i<Object.keys(vjParam).length; i++){
				
				info += "'";
				info += Object.keys(vjParam)[i];
				
				info += "':";
				var vjParam2 = vjParam[Object.keys(vjParam)[i]];
				if(typeof(vjParam2) == "object"){
					
					info = robot.objectForRecursion(info, vjParam2);
					
				} else{
					
					info += "'";
					info += vjParam[Object.keys(vjParam)[i]];
					info += "'";
					
					if(Object.keys(vjParam).length-1 != i){
						
						info += ",";
					}
				}
				
			}
			info = info.replace(/,\s*$/, "");
			info += "}";
			
		} else{
			
			info += "[";
			
			for(var i=0; i<vjParam.length; i++){
				
				
				var vjParam2 = vjParam[i];
				if(typeof(vjParam2) == "object"){
					
					info = robot.objectForRecursion(info, vjParam2);
					
				} else{
					info += "'";
					info += vjParam[i];
					info += "'";
					if(vjParam.length-1 != i){
						info += ",";
					}
				}
				
			}
			info = info.replace(/,\s*$/, "");
			info += "]";
		}
		
		info += ",";
		
	}	
	else if(typeof(vjParam) == "undefined"){
		info = "";
	}
	else{
		info = vjParam;	
	}

	
	return info;
}


robot.sysdate = function(param){
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth()+1;
	var date = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var seconds = d.getSeconds();
	var milsec = d.getMilliseconds();
	
	if(String(milsec).length == 2){
		milsec = milsec+"0";
	} else if(String(milsec).length == 1){
		milsec = milsec+"00";
	}
	
	month = robot.sysdateSetting(month);
	date = robot.sysdateSetting(date);
	hours = robot.sysdateSetting(hours);
	minutes = robot.sysdateSetting(minutes);
	seconds = robot.sysdateSetting(seconds);
	
	if(param == null){
		param = "";
	}
	return param+year+month+date+hours+minutes+seconds+milsec;
}

robot.sysdateSetting = function(param){
	if(String(param).length == 1){
		return "0"+param;
	} else {
		return ""+param;
	}
}

fn_hover = function(){
	$(".btn_retrieve1").hover(function()
		{
			$(".btn_retrieve1").css("color","#FFFFFF");
			$(".btn_retrieve1").css("background","black");
			},function()
			{
				$(".btn_retrieve1").css("color","black");
				$(".btn_retrieve1").css("background","#FFFFFF");
		});
	$(".btn_retrieve2").hover(function()
			{
				$(".btn_retrieve2").css("color","#FFFFFF");
				$(".btn_retrieve2").css("background","black");
				},function()
				{
					$(".btn_retrieve2").css("color","black");
					$(".btn_retrieve2").css("background","#FFFFFF");
			});
}

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param str           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 */
robot.nvl = function(str, defaultStr){
    if(typeof str == "undefined" || str == null || str == "")
        str = defaultStr ;
    return str ;
}

/*
 * input, textarea 길이제한 (oninput에서 사용)
 * param     :본인
 * maxlength :최대길이
 * 
 */

robot.handleOnInput = function(param, maxlength){
	if(param.value.length > maxlength){
		param.value = param.value.substr(0, maxlength);
	}
}
