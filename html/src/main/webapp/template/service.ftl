package ${packagePath}.${businessNm}.service;

import java.util.List;
import java.util.Map;


/**
 * ${businessNm} service
 * @author
 * @since ${now}
 */
public interface ${businessNm} {

	/**
	 * ${businessNm} 목록
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}List(Map<String,Object> paramMap);	

	/**
	 * ${businessNm} 등록 폼
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}RegistForm(Map<String,Object> paramMap);	

	/**
	 * ${businessNm} 등록 처리
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}Regist(Map<String,Object> paramMap);	

	/**
	 * ${businessNm} 수정 폼
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}UpdtForm(Map<String,Object> paramMap);	

	/**
	 * ${businessNm} 수정 처리
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}Updt(Map<String,Object> paramMap);	

	/**
	 * ${businessNm} 삭제
	 * @param paramMap
	 * @return
 	 */
	Map<String,Object> ${businessNm}Delete(Map<String,Object> paramMap);	
}