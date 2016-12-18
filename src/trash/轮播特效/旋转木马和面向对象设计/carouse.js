;(function($){
  var Carousel=function(poster){
    this.poster=poster;
    this.posterItemMain=poster.find("ul.poster-list");
    this.nextBtn=poster.find("div.next-btn");
    this.prevBtn=poster.find("div.prev-btn");

    this.posterItems=poster.find("li.poster-item");
    //偶数帧修正
    if(this.posterItems.length%2==0){
      this.posterItemMain.append(this.posterItems.first().clone());

      this.posterItems=poster.find("li.poster-item");
    }

    this.posterFirstItem=this.posterItems.first();
    this.posterLastItem=this.posterItems.last();

    this.rotateFlag=true;
    this.autoTimer=null;
    //默认参数配置
    this.setting={
      "width":1000,//宽度
      "height":270,//高度
      "posterWidth":640,//第一帧宽
      "posterHeight":270,//第一帧高
      "scale":0.9,//缩放
      "speed":500,//切换速度
      "verticalAlign":"middle",//对齐方式 middle top bottom
      "autoPlay":true,
      "delay":2000,
      "defaultDir":"left"
      };
    //将默认配置和人工配置合并
    $.extend(this.setting,this.getSetting());
    // $.extend(this.setting,this.poster.data("setting"));
    // console.log(this.poster.data("setting"),this.setting);

    //init
    this.setSettingValue();
    this.setPosterPos();

    //btn event
    var _this_=this;
    this.nextBtn.click(function(){
      _this_.carouseRotate("left");
    });
    this.prevBtn.click(function(){
      _this_.carouseRotate("right");
    });
    //auto play
    if(this.autoPlay){
      this.autoPlay();
    }
    //
    this.poster.mouseover(function(){
      clearInterval(_this_.autoTimer);
    });
    this.poster.mouseout(function(){
      _this_.autoPlay();
    });

  };

  Carousel.prototype={
    //自动执行
    autoPlay:function(){
      var that=this;

      that.autoTimer=setInterval(function(){

        that.carouseRotate(that.setting.defaultDir);

      },that.setting.delay);
    },
    //旋转
    carouseRotate:function(direction){
      if(!this.rotateFlag){return false;}
      this.rotateFlag=false;

      var that=this;
      var zIndexArr=[];
      if(direction=="left"){

        that.posterItems.each(function(){
          var _this=$(this);

          var prev=_this.prev().get(0)?_this.prev():that.posterLastItem,
              width=prev.width(),
              height=prev.height(),
              // zIndex=prev.css("zIndex"),
              opacity=prev.css("opacity"),
              left=prev.css("left"),
              top=prev.css("top");

          zIndexArr.push(prev.css("zIndex"));
          //运动起来
          _this.animate({

            width:width,
            height:height,
            // zIndex:zIndex,
            opacity:opacity,
            left:left,
            top:top
          },that.setting.speed,function(){
            that.rotateFlag=true;
          });

        });
        // 在外面重新设置index
        that.posterItems.each(function(){
          $(this).css("zIndex",zIndexArr.shift());
        });
      }else if(direction=="right"){
        that.posterItems.each(function(){
          var _this=$(this);

          var next=_this.next().get(0)?_this.next():that.posterFirstItem,
              width=next.width(),
              height=next.height(),
              // zIndex=next.css("zIndex"),
              opacity=next.css("opacity"),
              left=next.css("left"),
              top=next.css("top");

          zIndexArr.push(next.css("zIndex"));
          //运动起来
          _this.animate({

            width:width,
            height:height,
            // zIndex:zIndex,
            opacity:opacity,
            left:left,
            top:top
          },that.setting.speed,function(){
            that.rotateFlag=true;
          });
        });
        // 在外面重新设置index
        that.posterItems.each(function(){
          $(this).css("zIndex",zIndexArr.shift());
        });
      }
    },
    //设置剩余部分样式
    setPosterPos:function(){
      var that=this,

          sliceItems=this.posterItems.slice(1),
          sliceSize=sliceItems.length/2,

          sliceRight=sliceItems.slice(0,sliceSize),
          sliceLeft=sliceItems.slice(sliceSize),

      //common parameter
          level=Math.floor(this.posterItems.length/2),
          gap=(this.setting.width-this.setting.posterWidth)/2/level,
          firstLeft=(this.setting.width-this.setting.posterWidth)/2,

      //right side
          rw=this.setting.posterWidth,
          rh=this.setting.posterHeight;
      
      sliceRight.each(function(i){
        level--;
        rw*=that.setting.scale;
        rh*=that.setting.scale;
        var j=1;
        $(this).css({
          zIndex:level,
          width:rw,
          height:rh,
          opacity:j/(i+1),
          left:firstLeft+that.setting.posterWidth+gap*(i+1)-rw,
          top:that.setVerticalAlign(rh)
        });
      });

      //left side
      var lw= sliceRight.last().width();
      var lh= sliceRight.last().height();
      var oloop=Math.floor(this.posterItems.length/2);
      sliceLeft.each(function(i){
        $(this).css({
          zIndex:i,
          width:lw,
          height:lh,
          opacity:1/oloop--,
          left:i*gap,
          top:that.setVerticalAlign(lh)     
        });
        lw=lw/that.setting.scale;
        lh=lh/that.setting.scale;
      });
    },
    //设置垂直对齐方式
    setVerticalAlign:function(height){
      var type=this.setting.verticalAlign,
          top=0;
      if(type==="middle"){
        top=(this.setting.height-height)/2;
      }else if(type==="top"){
        top=0;
      }else if(type==="bottom"){
        top=this.setting.height-height;
      }else{
        top=(this.setting.height-height)/2;
      };
      return top;
    },
    // 设置基本样式
    setSettingValue:function(){
      this.poster.css({
        width:this.setting.width,
        height:this.setting.height
      });
      this.posterItemMain.css({
        width:this.setting.width,
        height:this.setting.height
      });
      //
      var w=(this.setting.width-this.setting.posterWidth)/2;
      this.nextBtn.css({
        width:w,
        height:this.setting.height,
        zIndex:Math.ceil(this.posterItems.length/2)
      });
      this.prevBtn.css({
        width:w,
        height:this.setting.height,
        zIndex:Math.ceil(this.posterItems.length/2)
      });

      this.posterFirstItem.css({
        width:this.setting.posterWidth,
        height:this.setting.posterHeight,
        left:w,
        top:0,
        zIndex:Math.floor(this.posterItems.length/2)
      });
    },
    //获取人工配置
    getSetting:function(){
      var setting=this.poster.attr("data-setting");
      if(setting&&setting.length>0){
        return $.parseJSON(setting);
      }else{
        return {};
      }
    }
  };

  Carousel.init=function(posters){
    var _this_=this;
    posters.each(function(){
      new _this_($(this));
    });
  };
  
  window["Carousel"]=Carousel;//将函数注册到全局作用域
})(jQuery);