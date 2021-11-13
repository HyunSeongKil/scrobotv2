package ${packagePath}.${businessNm}.service;

import java.util.List;
import java.util.Map;


/**
 * ${businessNm} vo
 * @author
 * @since ${now}
 */
public class ${businessNm}Vo implements Serializable {
	
	<#list datas as item>
		/** ${item.comment} */
		private String ${item.businessNm};
	</#list>
}