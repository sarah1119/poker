//获取
function getClass(classname,range){
	//设置默认范围
	var range=range||document
	if(range.getElementsByClassName){
		return range.getElementsByClassName(classname)
	}else{
		var all=range.getElementsByTagName('*');
		var arr=[];
		//正则判断 class='box one cc' 找出box
		var reg=new RegExp('\\b'+classname+'\\b','g')
		for(var i=0;i<all.length;i++){
			if(reg.test(all[i].className)){
				arr.push(all[i]);
			}
		}
		return arr;
	}
}

//形参 类名 范围
function $(selector,range){
	if(typeof selector=='string'){
		// 
		if(/^<[a-zA-Z][a-zA-Z1-6]{0,9}>$/.test(selector)){
			return document.createElement(selector.slice(1,-1))			
		}
		//拆分选择器 <div id='one'><div> #box .one one-box one_box 
			var reg=/(?:#|.)?[a-zA-Z0-9_\-]{1,}/g;
			var arr=selector.match(reg);
			//[.box div]
			// elms=getElms(.box,document)
			// elms=getElms(div,elms)
			range=range||document;
			//判断传入的范围(集合)
			var elms=range.length?range:[range];
			//elms必须是一个集合
			for(var i=0;i<arr.length;i++){
				elms=getElms(arr[i],elms)

			}
			return elms;
	}else if(typeof selector=='function'){
		on(window,'load',selector)
	}

}

//处理循环  [#box .box]
function getElms(sel,elms){
	//获取函数  去除前后的空格
	sel=trim(sel);

	if(sel.charAt(0)=='#'){
		return [document.getElementById(sel.slice(1))]
	}else if(sel.charAt(0)=='.'){
		var all=[];
		for(var i=0;i<elms.length;i++){
			var arr=getClass(sel.slice(1),elms[i]);
			for(var j=0;j<arr.length;j++){
				all.push(arr[j])
			}

		}
		return all;
		//标签
	}else if(/^[a-zA-Z][a-zA-Z1-6]{0,9}$/.test(sel)){
		var all=[];
		for(var i=0;i<elms.length;i++){
			var arr=elms[i].getElementsByTagName(sel);
			for(var j=0;j<arr.length;j++){
				all.push(arr[j])
			}

		}
		return all;
	}
}


function trim(str,t){
	var t=t||'lr';
		if(t=='lr'){
			return str.replace(/^\s+|\s+$/g,"");
		}else if(t=='l'){
			return str.replace(/^\s+/g,"");
		}else if(t=='r'){
			return str.replace(/\s+$/g,"");
		}else if(t=='a'){
			return str.replace(/\s+/g,"");
		}
}

function on(obj,ev,callback){
	if(obj.addEventListener){
		obj.addEventListener(ev,callback)
	}else{
		obj.attachEvent('on'+ev,callback)
	}
}