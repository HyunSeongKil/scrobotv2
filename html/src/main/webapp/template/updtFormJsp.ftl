<!DOCTYPE html>
<html lang="ko">


	<head>
		<meta charset="utf-8">
		
		<title></title>

	</head>
	
	<body>
	
		<#list datas as item>
			
			<div>
				<!-- ${item.kor} -->
				<label for="${item.businessNm}"/>
				<input type="text" id="${item.businessNm}" name="${item.businessNm}" value="" >
			</div>
		</#list>
	
	</body>
	
</html>
