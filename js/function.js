//

function $(selector,range){
	//获取元素
	if(typeof selector=="string"){
		var range=range||document;
		if(selector.charAt(0)=="#"){
			return range.getElementById(selector.slice(1));
		}
		if(selector.charAt(0)=="."){
			return getClass(selector.substr(1),range);
		}
		if(/^[a-zA-Z][a-zA-Z1-6]{0,9}$/.test(selector)){
			return range.getElementsByTagName(selector)		
		}
		if(/^<[a-zA-Z][a-zA-Z1-6]{0,9}>$/.test(selector)){
			return document.createElement(selector.slice(1,-1));
		}

		// alert("字符");
	}
	//页面加载 ?
	if(typeof selector=="function"){
		// window.onload=selector;
		// alert("hanshu");
		on(window,"load",selector)
	}
}


//classname兼容
function getClass(classname,range){
	if(range.getElementsByClassName){
		return range.getElementsByClassName(classname);
	}else{
		var arr=[];
		//获取所有的标签
		var all=range.getElementsByTagName('*');
		//遍历 根据类名查找所需类
		for (var i = 0; i < all.length; i++){
			if(checkClass(all[i].className,classname)){
			arr.push(all[i]);
			}
		}
	return arr; 
	}
}
//检测当前元素的类名中是否包含查找的元素
function checkClass(tagClass,classname){
	var arr=tagClass.split(" ");//
	for(var i=0;i<arr.length;i++){
		if(arr[i]==classname){
			return true;
		}
	}
	return false;
}


//文本兼容
function textContent(obj,val){
	if(val==undefined){
		if(obj.textContent!=undefined){
			return obj.textContent;
		}else{
			return obj.innerText;
		}
	}else{
		if(obj.textContent!=undefined){
			obj.textContent=val;
		}else{
			obj.innerText=val;
		}
	}
}

//获取通用兼容
//getStyle(obj,attr)
//obj 要获取的对象 attr 要获取的属性
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		// if(getComoutedStyle(obj,null).attr){
		return window.getComputedStyle(obj,null)[attr];
		}
}



//获取子节点
function getChilds(obj){
	var Arry=[];
	var childs=obj.childNodes;
	for (var i = 0; i < childs.length; i++){
		// if(!(childs[i].nodeType==8||(childs[i].nodeType==3&&trim(childs[i].inerHTML)==""))){
		// 	Arry.push(childs[i]);
		// }
if(!(childs[i].nodeType==8||(childs[i].nodeType==3&&trim(childs[i].nodeValue)==""))){
			Arry.push(childs[i]);
		}	
	}
	return Arry;
}


//处理空格
function trim(str){
	// -------用空字符串代替内容为空的text
	return str.replace(/^\s+|\s+$/g,"");
}
function getFirst(parent){
	var childs=getChilds(parent);
	return childs[0];
}
function getLast(parent){
	var childs=getChilds(parent);
	return childs[childs.length-1];
}
function getRandom(parent,i){
	var childs=getChilds(parent);
	return childs[i-1]
}

//查找下一个兄弟节点
function next(obj){
	var next=obj.nextSibling;
	if(!next){return false}
		while(next.nodeType==8||(next.nodeType==3&&trim(next.nodeValue)=="")){
			next=next.nextSibling;
			if(!next){return false}
		}
	return next;
}


//查找上一个兄弟节点
function previous(obj){
	var previous=obj.previousSibling;
	if(!previous){return false;}
	while(previous.nodeType==8||(previous.nodeType==3&&trim(previous.nodeValue)=="")){
		previous=previous.previousSibling;
		if(!previous){return false;}
	}
	return previous;

}

//在指定对象后插入对象(获取的节点的下一个，然后用indertBefore插入到之前)
 //obj1  要出入的对象
 //obj2  要插入的位置
function insert(obj1,obj2){
	// 获取插入位置的下一个节点
   var a=next(obj2);
   //获取对象的父节点
   var parent=obj2.parentNode;
   //判断下一个是否存在 存在用insertBfore插入到之前
   if(a){
   	return parent.insertBefore(obj1,a);
   }else{//不存在就直接插入到最后
   	return parent.appendChild(obj1)
   }

}
//事件兼容处理 
//添加事件处理
function on(obj,ev,callback){
	//判断是否支持
	if(obj.addEventListener){
		obj.addEventListener(ev,callback)
	}else{
		//IE6-8
		// obj.fffnnn=function(){
		// 	//对象冒充
		// 	callback.call(obj)
		// }
		obj.attachEvent("on"+ev,callback)
	}
}
//   ?this问题
//删除事件处理
function off(obj,ev,callback){
	if(obj.addEventListener){
		obj.removeEventListener(ev,callback)
	}else{
		obj.detachEvent("on"+ev,callback)
	}
}

// 滚轮事件
function mouseWheel(obj,upcallback,downcallback){
	if(document.attachEvent){
	obj.attachEvent("onmousewheel",scrollFn); //IE、 opera
	}else if(document.addEventListener){
	obj.addEventListener("mousewheel",scrollFn,false);
	//chrome,safari -webkit-
	obj.addEventListener("DOMMouseScroll",scrollFn,false);
	//firefox -moz-
	}
	//判断滚轮方向
	function scrollFn(e){
		var ev=e||window.event;
		var dir=ev.detail||ev.wheelDelta;
		if(dir==120||dir==-3){//上
			upcallback.call(obj)
		}else if(dir==-120||dir==3){//下
			downcallback.call(obj) //冒充
		}
		//处理浏览器默认动作
		if(ev.prevenDefault){
				ev.preventDefault()
		}else{
				ev.returnValue=false;
		}
	}
}






function scrollFn(e){
	//获取事件对象
	var ev=e||window.event;
	var dir=ev.detail||ev.wheelDelta;
	if(dir==120||dir==-3){
		upcallback.call(obj)
	}else if(dir==-120||dir==3){
		downcallback.call(obj)
	}
	if(ev.preventDefault){
		ev.preventDefault();
	}else{
		ev.returnValue=false;
	}
}