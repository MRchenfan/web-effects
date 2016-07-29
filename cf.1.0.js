/*
*	date: 2016.6.14
*	author: cf
*	note:1.domEnhance includes some dom enhance function
*          domEnhance.getElementsByClass(clsName,parent_id);
*		   domEnhance.addClass(element,class_name);
*          domEnhance.getNextElement(node);
*		   domEnhance.getStyle(element,"style");
*		 2.eventUtil includes event bindings 
*			eventUtil.addEvent(element,event_type,handler);
*			eventUtil.removeEvent(element,event_type,handler);
*	   		eventUtil.getEvent(event);
*  			eventUtil.preventDefault(event);
*			eventUtil.stopPropagation(event);
*		 3.startMove(element,json,function);
*			bug:
*		 4.addLoadEvent(function); function without parameters
*		 5.myTime includes some functions about time
*			myTime.setTime(element); write current time to element.innerHTML
*			myTime.timeLeft(element); write left time to element.innerHTML;
*		 6. $("#id")=function(element){document.querySelector(element);)
*/
var domEnhance={
	//the parent_id is needed if not,will be document
	getElementsByClass:function(clsName,parent_id){
		var parent=parent_id?document.getElementById(parent_id):document;
		var eles=[];
		var elements=parent.childNodes;
		for(var i=0;i<elements.length;i++){
			if(elements[i].className==clsName){
				eles.push(elements[i]);
			}
		}
		return eles;
	},
	//
	addClass:function(element,value){
		if(element.className){
			element.className+=" "+value;
		}else{
			element.className=value;
		}
	},
	//
	getNextElement:function(node){
		if(node.nodeType==1){
			return node;
		}
		if(node.nextSibling){
			return domEnhance.getNextElement(node.nextSibling);
		}
		return null;
	},
	//
	getStyle:function(element,attr){
	    if(element.currentStyle){
	        return element.currentStyle(attr);//ie
	    }else{
	        return getComputedStyle(element,false)[attr];//firefox
	    }
	},

}//domEnhance end

/*
*	date:
*	author:
*	note:
*		1.事件绑定程序
*		2.
*		3.
*		4.
*/
var eventUtil={
	 	// 添加句柄
	 	addEvent:function(element,type,handler){
	       if(element.addEventListener){
	         element.addEventListener(type,handler,false);
	       }else if(element.attachEvent){
	         element.attachEvent('on'+type,handler);
	       }else{
	         element['on'+type]=handler;
	       }
	 	},
	 	// 删除句柄
	 	removeEvent:function(element,type,handler){
	       if(element.removeEventListener){
	         element.removeEventListener(type,handler,false);
	       }else if(element.detachEvent){
	         element.detachEvent('on'+type,handler);
	       }else{
	         element['on'+type]=null;
	       }
	 	},
	  getEvent:function(event){
	    return event?event:window.event;
	  },
	  getType:function(event){
	    return event.type;
	  },
	  getTarget:function(event){
	    return event.target || event.srcElement;
	  },
	  preventDefault:function(event){
	    if(event.preventDefault){
	      event.preventDefault();
	    }else{
	      event.returnValue=false;
	    }
	  },
	 stopPropagation:function(event){
	   if(event.stopPropagation){
	     event.stopPropagation();
	   }else{
	     event.cancelBubble=true;
	   }
	 },
	//String.formCharCode(charCode);
	getCharCode:function(event){
		if(typeof event.charCode=="number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},
	getRelatedTarget:function(event){
		if(event.relatedTarget){
			return event.relatedTarget;
		}else if(event.toElement){
			return event.toElement;
		}else if(event.fromElement){
			return event.fromElement;
		}else{
			return null;
		}
	},
	getButton:function(event){
		if(document.implementation.hasFeature("MouseEvents","2.0")){
			return event.button;
		}else{
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},
	getWheelDelta:function(event){
		if(event.wheelDelta){
			return (client.engine.opera&&client.engine.opera<9.5?-event.wheelDelta:event.wheelDelta);
		}else{
			return -event.detail*40;
		}
	}
  }//eventUtil end

/*
*	date:
*	author:
*	note:
*		1.运动框架
*		2.json={width:200;height:2300}
*		3.
*		4.框架可以改变尺寸类的运动，但是也可以用来改变颜色
*/
function startMove(element,json,fn){	
	clearInterval(element.timer);			
	element.timer=setInterval(function(){
		var flag=true;
		for(var attr in json){
			//1.获取当前值
			var icur=0;
			if(attr=="opacity"){
				icur=parseFloat(domEnhance.getStyle(element,attr))*100;
				icur=Math.round(icur);
			}else{
				icur=parseInt(domEnhance.getStyle(element,attr));
			}	
			//2.计算速度
			var speed=(json[attr]-icur)/8;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			//3.判断停止和刷新
			if(icur!=json[attr]){
				flag=false;
				if(attr=="opacity"){
					element.style.filter="alpha(opacity:'+(icur+speed)+')";
					element.style.opacity=(icur+speed)/100;
				}else{
					element.style[attr]=icur+speed+"px";
				}						
			}
			if(flag){
				clearInterval(element.timer);
				if(fn){
					fn();
				}
			}
		}
	},10)	
}
/*
*	date:
*	author:
*	note:
*		1.常用函数
*		2.
*		3.
*		4.
*/
function addLoadEvent(new_load){
	var old_load=window.onload;
	if(typeof old_load!="function"){
		window.onload=new_load;
	}else{
		window.onload=function(){
			old_load();
			new_load();
		}
	}
}
/*
*	date:
*	author:
*	note:
*		1.
*		2.
*		3.
*		4.
*/
var myTime={
	timeSet:function(time_box){
	setInterval(function(){
		var my_date = new Date();
		var year=my_date.getFullYear();
		var month=my_date.getMonth()+1;
		var date=my_date.getDate();
		var d=my_date.getDay();
		var week_day=new Array();
		    week_day[0]="星期日";
		    week_day[1]="星期一";
		    week_day[2]="星期二";
		    week_day[3]="星期三";
		    week_day[4]="星期四";
		    week_day[5]="星期五";
		    week_day[6]="星期六";
		var h=my_date.getHours();
		var m=my_date.getMinutes();
		var s=my_date.getSeconds();
		if(m<10){
			m="0"+m;
		}
		if(s<10){
			s="0"+s;
		}
		time_box.innerHTML=year+"年"+month+"月"+date+"日"+week_day[d]+h+":"+m+":"+s;
		},300)
	},
//剩下的时间，天，时，分
	timeLeft:function(box,end_time,some_day){
		var timer=setInterval(function(){
		var cur_date=new Date();
		var end_date=new Date(end_time)
		var left_time=end_date.getTime()/1000-cur_date.getTime()/1000;//seconds
		var left_days=parseInt(left_time/(60*60*24));
		var left_hours=parseInt(left_time/(60*60)%24);
		var left_minutes=parseInt(left_time/(60)%60);
		var left_seconds=parseInt(left_time%60);
		box.innerHTML="距离"+some_day+"还有"+left_days+"天"+
		left_hours+"时"+left_minutes+"分"+left_seconds+"秒";
		if(left_time<=0){
			box.innerHTML="倒计时已结束";
			clearInterval(timer);
		}
		},500)			
	},
}
/*
*	date:
*	author:
*	note:
*		1.
*		2.
*		3.
*		4.
*/
$=function(ele){
	return document.querySelector(ele);
}

/*
*	date:
*	author:
*	note:
*		1.文本增强
*		2.添加trim()方法，ie8及一下hack
*		3.
*		4.
*/
if(typeof String.trim=="undefined"){
	String.prototype.trim=function(){
		return this.replace(/(^\s*)|(\S*$)/g,"");
	}	
};