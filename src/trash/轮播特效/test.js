//add ready functions
addLoadEvent(banner_1);
addLoadEvent(tabChange_2);

function banner_1(){
  var imgBox=$(".template-1 .img-box");
  var btnBox=$(".template-1 .buttons");
  var sideBtns=$(".template-1 .side-btn");
  var container=$(".template-1 .container");
  var moveFlag=true;
  var timer=null;
  var imgs=imgBox.getElementsByTagName("img"),
      imgNum=imgs.length;
      imgWidth=imgs[0].offsetWidth;
  //init imgBox width 
  imgBox.style.width=imgNum*imgWidth+"px";
  //btns createdom
  var frag=document.createDocumentFragment();
  for(var i=0;i<imgNum-2;i++){
    var span=document.createElement("span");
    span.index=i+1;
    frag.appendChild(span);
  }
  btnBox.innerHTML=null;
  btnBox.appendChild(frag);
  //init
  renderBtn();
  autoPlay();
  //mouseover event
  eventUtil.addEvent(container,"mouseover",function(){
    clearInterval(timer);
  });
  eventUtil.addEvent(container,"mouseout",function(){
    autoPlay();
  });
  //btns bind event
  eventUtil.addEvent(btnBox,"click",function(e){
    // 运动结束后才能起作用
    if(!moveFlag){return false;}
    moveFlag=false;
    var e=eventUtil.getEvent(e);
    var target=eventUtil.getTarget(e);
    var targetPos=-target.index*imgWidth;
    startMove(imgBox,{"left":targetPos},renderBtn);    
  });
  //side btns bind event
  eventUtil.addEvent(sideBtns,"click",function(e){
    if(!moveFlag){return false;}
    moveFlag=false;
    var e=eventUtil.getEvent(e);
    var target=eventUtil.getTarget(e);
    var currentPos=parseInt(imgBox.style.left); 
    if(target.className=="btn-prev"){
      startMove(imgBox,{"left":currentPos+imgWidth},renderBtn);
    }else{
      startMove(imgBox,{"left":currentPos-imgWidth},renderBtn); 
    }
  });

  function autoPlay(){
    timer=setInterval(function(){
      if(!moveFlag){return false;}
      moveFlag=false;
      var currentPos=parseInt(imgBox.style.left);
      startMove(imgBox,{"left":currentPos-imgWidth},renderBtn);
    },2000);
  } 
  function renderBtn(){
    //运动结束标志
    moveFlag=true;
    // 运动结束后调整底部按钮
    var index=parseInt(imgBox.style.left)/(-imgWidth);
    if(index==imgNum-1){
      index=1;
    }
    if(index==0){
      index=imgNum-2;
    }
    for(var i=0;i<btnBox.childNodes.length;i++){
      btnBox.childNodes[i].className="";
    }
    btnBox.childNodes[index-1].className="on";
    //运动结束后调整位置
    var currentPos=parseInt(imgBox.style.left);
    if(currentPos==-(imgNum-1)*imgWidth){
      currentPos=-imgWidth;
      imgBox.style.left=currentPos+"px";
    }else if(currentPos==0){
      currentPos=-(imgNum-2)*imgWidth;
      console.log(currentPos);
      imgBox.style.left=currentPos+"px";
    }
  }
}

function tabChange_2(){
  var tabs=$(".tab").getElementsByTagName("li");
  var timer=null;

  //init
  autoPlay();

  for(var i=0;i<tabs.length;i++){
    eventUtil.addEvent(tabs[i],"mouseover",function(){
      clearInterval(timer);
      for(var j=0;j<tabs.length;j++){
        tabs[j].className="";
      }
      this.className="active";
    });
    eventUtil.addEvent(tabs[i],"mouseout",function(){
      autoPlay();
    });
  }

  function autoPlay(){
    //get current active tab
    var index=0;
    for(var i=0;i<tabs.length;i++){
      if(tabs[i].className=="active"){
        index=i;
      }
    }

    timer=setInterval(function(){
      //hide other tabs
      /*for(var i=0;i<tabs.length;i++){
        tabs[i].className="";
      }*/
      if(index==0){
        tabs[tabs.length-1].className="";
      }else{
        tabs[index-1].className="";
      }
      //set current tab to show
      tabs[index].className="active";
      index++;
      if(index==tabs.length){
        index=0;
      }
    },1000);
  }
}