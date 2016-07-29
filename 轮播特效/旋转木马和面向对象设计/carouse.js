;(function($){
  var Carousel=function(poster){

  };
  Carousel.prototype={

  };

  Carousel.init=function(posters){
    var _this_=this;
    posters.each(function(){
      new _this_($(this));
    });
  };
  
  window["Carousel"]=Carousel;//将函数注册到全局作用域
})(jQuery);