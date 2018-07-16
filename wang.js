window.onload = function(){

	var input_test = document.getElementById("input_test");
	var input_btn = document.getElementById("input_btn");
	var input_clear = document.getElementById("input_clear");
	var selectAll = document.getElementById("selectAll");
	var all_choose = document.getElementById("all_choose");
	var export_excel = document.getElementById("export_excel");
	var a = '';

	input_btn.onclick  = function () {
		var radio = document.getElementsByName("choose");
		var chooseType ;
		for (var k = 0; k < radio.length; k++) {
			if (radio[k].checked) {
				chooseType = radio[k].value;
			}
		}
		if (input_test.value && chooseType){
			aValue = input_test.value
			sort(aValue,chooseType);
		} 
		else {
			alert("请输入或选择输出类型");
		}
	}
	input_clear.onclick  = function () {
		input_test.value = "";
	}
	table_clear.onclick  = function () {
		var tableElm = document.getElementById("tableExcel");
		tableElm.innerHTML = "";
	}

	all_choose.onclick = function () {
		selectText()
	}

	export_excel.onclick = function () {
		var tableElm = document.getElementById("tableExcel");
		method5('tableExcel')
	}

	//读取上传文件
	var inputBox = document.getElementById("inputBox");
	var inputBox = document.getElementById("inputBox");
	inputBox.addEventListener("change",function(){
	  var reader = new FileReader();
	  reader.readAsText(inputBox.files[0]);
	  reader.onload = function(){
	    //读取完成后，数据保存在对象的result属性中
	    input_test.value = this.result;
	  }
	})


	function Tranversing (obj , rep) {
		if (obj.indexOf(rep) == -1) {
			return obj
		}
		obj = obj.replace(rep,"");
	
		return Tranversing (obj,rep);
	}
	function sort(a,choose) {

		// var arrayAll = a.split("}}");
		var arrayUpdate = a.split("{@BLOCK");


		var arrayLIM2 = [];
		var arrayLIM3 = [];
		var arrayElse = [];
		for (var m = 0; m < arrayUpdate.length; m++) {

			arrayUpdate[m] = Tranversing(arrayUpdate[m],"\n");


			if (arrayUpdate[m].indexOf("{@TS") != -1) {
				arrayUpdate[m] = arrayUpdate[m].split("{@TS")[0];
			}

			if (arrayUpdate[m].indexOf("LIM2") != -1) {
				arrayLIM2.push(arrayUpdate[m]);
			} 
			else if (arrayUpdate[m].indexOf("LIM3") != -1) {
				arrayLIM3.push(arrayUpdate[m]);
			}
			else {
				arrayElse.push(arrayUpdate[m]);
			}

		}
		// console.log(arrayLIM2);
		// console.log(arrayLIM3);
		// console.log(arrayElse);

		//处理LIM2，有一些需要特殊处理
		var LIM2 = []; 
		var LIM2_SPECIAL = [];
		var printer1_name = [];
		var printer1_testValue = [];
		var printer1_highValue = [];
		var printer1_lowValue = [];
		var printer1_type = [];

		for (var i = 0; i < arrayLIM2.length; i++) {
			var objectW = {};
			if (arrayLIM2[i].indexOf("MEA|0|") != -1) {

				LIM2_SPECIAL.push(arrayLIM2[i]);

			}
			else if (arrayLIM2[i][0] == "|") {
				objectW.name = arrayLIM2[i].split("|")[1].split("|00")[0]
				objectW.type = arrayLIM2[i].split("|")[2].split("00{@A-")[1];
				objectW.testValue = arrayLIM2[i].split("|0|")[1].split("{@LIM2|")[0]
				objectW.highValue = arrayLIM2[i].split("{@LIM2|")[1].split("|")[0]
				objectW.lowValue = arrayLIM2[i].split("{@LIM2|")[1].split("|")[1].split("}}}")[0];


			} 
			if (objectW.name) {
				LIM2.push(objectW);
				printer1_name.push(objectW.name);
				printer1_type.push(objectW.type);
				printer1_testValue.push(objectW.testValue);
				printer1_highValue.push(objectW.highValue);
				printer1_lowValue.push(objectW.lowValue);
			}
		}
		// console.log(arrayLIM2)
		// console.log(LIM2)
		// console.log(printer1_type)
		// console.log(printer1_name.join("www"))
		// console.log(printer1_testValue.join("www"))
		// console.log(printer1_highValue.join("www"))
		// console.log(printer1_lowValue.join("www"))


		//解决特殊
		var printer_special_name = [];
		var printer_special_type = [];
		var printer_special_value = [];
		var printer_special_highValue = [];
		var printer_special_lowValue = [];

		
		for (var i = 0; i < LIM2_SPECIAL.length; i++) {
			var objectW = {};
			var special = LIM2_SPECIAL[i].split("{@A-");
			objectW.name = special[0].split("|")[1].split("|00")[0];

			for (var j =1; j < special.length; j++) {
				var subName = special[j].split("|0|")[1].split("|")[1].split("{@LIM2")[0];
				var subtype = special[j].split("|0|")[0];
				var subValue = special[j].split("|0|")[1].split("|")[0];
				var subHigh = special[j].split("|0|")[1].split("|")[2];
				var subLow = special[j].split("|0|")[1].split("|")[3].split("}}")[0];
				
				printer_special_name.push(objectW.name + " " +subName);
				printer_special_type.push(subtype);
				printer_special_value.push(subValue);
				printer_special_highValue.push(subHigh);
				printer_special_lowValue.push(subLow);
			}
		}
		// console.log(printer_special_name.join(" "));
		// console.log(printer_special_value.join(" "));





		// 处理LIM3
		// console.log(arrayLIM3);
		var LIM3 = []; 
		var printer2_name = [];
		var printer2_testValue = [];
		var printer2_expectValue = [];
		var printer2_highValue = [];
		var printer2_lowValue = [];
		var printer2_type = [];


		for (var i = 0; i < arrayLIM3.length; i++) {
			var objectW = {};

			if (arrayLIM3[i][0] == "|") {

				objectW.name = arrayLIM3[i].split("|")[1].split("|00")[0]
				objectW.type = arrayLIM3[i].split("|")[2].split("00{@A-")[1];
				objectW.testValue = arrayLIM3[i].split("|0|")[1].split("{@LIM3|")[0]
				objectW.expectValue = arrayLIM3[i].split("{@LIM3|")[1].split("|")[0]
				objectW.highValue = arrayLIM3[i].split("{@LIM3|")[1].split("|")[1]
				objectW.lowValue = arrayLIM3[i].split("{@LIM3|")[1].split("|")[2].split("}}}")[0];

			} 
			LIM3.push(objectW);
			printer2_name.push(objectW.name);
			printer2_type.push(objectW.type);
			printer2_testValue.push(objectW.testValue);
			printer2_expectValue.push(objectW.expectValue);
			printer2_highValue.push(objectW.highValue);
			printer2_lowValue.push(objectW.lowValue);

		}
		// console.log(printer2_name.join("www"))
		// console.log(printer2_testValue.join("www"))
		// console.log(printer2_expectValue.join("www"))
		// console.log(printer2_highValue.join("www"))
		// console.log(printer2_lowValue.join("www"))
		
		// console.log(printer1_name.concat(printer_special_name,printer2_name).join("-")) //输出名字
		// console.log(printer2_expectValue.join("--"))                                       // 输出期望值
		// console.log(printer1_type.concat(printer_special_type,printer2_type).join("--")) //输出类型值
		// console.log(printer1_highValue.concat(printer_special_highValue,printer2_highValue).join("--")) //输出上限值
		// console.log(printer1_lowValue.concat(printer_special_lowValue,printer2_lowValue).join("--")) //输出下限值
		// console.log(printer1_testValue.concat(printer_special_value,printer2_testValue).join("--"))//输出值

		var ValueArray = [];
		console.log(choose)
		switch (choose)
		{
			case "testValue":
			ValueArray = printer1_testValue.concat(printer_special_value,printer2_testValue); //加工数据
			break;

			case "name":
			ValueArray = printer1_name.concat(printer_special_name,printer2_name);         //加工名字
			break;

			case "lowValue":
			ValueArray =  printer1_lowValue.concat(printer_special_lowValue,printer2_lowValue)//加工下限
			break;

			case "highValue":
			ValueArray = printer1_highValue.concat(printer_special_highValue,printer2_highValue)//加工上限
			break;

			case "type":
			ValueArray = printer1_type.concat(printer_special_type,printer2_type)//加工类型
			break;
		}
		// var ValueArray = printer1_name.concat(printer_special_name,printer2_name);         //加工名字
		// var ValueArray = printer1_lowValue.concat(printer_special_lowValue,printer2_lowValue)//加工下限
		// var ValueArray = printer1_highValue.concat(printer_special_highValue,printer2_highValue)//加工上限
		// var ValueArray = printer1_type.concat(printer_special_type,printer2_type)//加工类型


		// console.log(ValueArray.length);

		//操作DOM
		var tableElm = document.getElementById("tableExcel");
		//tableElm.innerHTML = "";
		if (tableElm.innerHTML) {
			// console.log(tableElm.innerHTML.split("<tr>")[1].split("</tr>")[0].split("<td>").length)
			var sourceArray = tableElm.innerHTML.split("<tr>");
			tableElm.innerHTML = "";
			sourceArray.shift();

			for (var n = 0; n < sourceArray.length; n++) {

				sourceArray[n] = sourceArray[n].split("</tr>")[0];	
				tableElm.innerHTML +=  "<tr>" + sourceArray[n] + "<td>" + ValueArray[n]  +  "</td>" + "</tr>"

			}

		} 
		else {
			for (var i = 0; i < ValueArray.length; i++) {
				tableElm.innerHTML += "<tr><td>" + ValueArray[i]  + "</td></tr>"
			}
		}


	}


	//导出excel方法  
	var idTmr;  
	function  getExplorer() {  
	    var explorer = window.navigator.userAgent ;  
	    //ie  
	    if (explorer.indexOf("MSIE") >= 0) {  
	        return 'ie';  
	    }  
	    //firefox  
	    else if (explorer.indexOf("Firefox") >= 0) {  
	        return 'Firefox';  
	    }  
	    //Chrome  
	    else if(explorer.indexOf("Chrome") >= 0){  
	        return 'Chrome';  
	    }  
	    //Opera  
	    else if(explorer.indexOf("Opera") >= 0){  
	        return 'Opera';  
	    }  
	    //Safari  
	    else if(explorer.indexOf("Safari") >= 0){  
	        return 'Safari';  
	    }  
	}  
	function method5(tableid) {  
	    if(getExplorer()=='ie')  
	    {  
	        var curTbl = document.getElementById(tableid);  
	        var oXL = new ActiveXObject("Excel.Application");  
	        var oWB = oXL.Workbooks.Add();  
	        var xlsheet = oWB.Worksheets(1);  
	        var sel = document.body.createTextRange();  
	        sel.moveToElementText(curTbl);  
	        sel.select();  
	        sel.execCommand("Copy");  
	        xlsheet.Paste();  
	        oXL.Visible = true;  
	
	        try {  
	            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");  
	        } catch (e) {  
	            print("Nested catch caught " + e);  
	        } finally {  
	            oWB.SaveAs(fname);  
	            oWB.Close(savechanges = false);  
	            oXL.Quit();  
	            oXL = null;  
	            idTmr = window.setInterval("Cleanup();", 1);  
	        }  
	
	    }  
	    else  
	    {  
	        tableToExcel(tableid)  
	    }  
	}  
	function Cleanup() {  
	    window.clearInterval(idTmr);  
	    CollectGarbage();  
	}  
	var tableToExcel = (function() {  
	    var uri = 'data:application/vnd.ms-excel;base64,',  
	            template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',  
	            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },  
	            format = function(s, c) {  
	                return s.replace(/{(\w+)}/g,  
	                        function(m, p) { return c[p]; }) }  
	    return function(table, name) {  
	        if (!table.nodeType) table = document.getElementById(table)  
	        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}  
	        window.location.href = uri + base64(format(template, ctx))  
	    }  
	})()  


    //全选设置
	function selectText() {
	    if (document.selection) {
	        var range = document.body.createTextRange();
	        range.moveToElementText(document.getElementById('tableExcel'));
	        range.select();
	    } else if (window.getSelection) {
	        var range = document.createRange();
	        range.selectNode(document.getElementById('tableExcel'));
	        window.getSelection().addRange(range);
	    }
	}	

}
