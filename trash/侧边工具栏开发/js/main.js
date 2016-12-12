requirejs.config({
  path:{
    cf:"cf.1.0"
  }
});
requirejs(["cf.1.0"],function(cf){
  $("body").style.background="#BC1B1B";
});