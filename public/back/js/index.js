/**
 * Created by 王子臣 on 2018/4/6.
 */

//功能五进度条
// 配置禁用小圆环
NProgress.configure({ showSpinner: false });

$(document).ajaxStart(function() {
  NProgress.start();
  NProgress.configure({ ease: 'ease', speed: 500 });
});


// ajaxStop 所有的 ajax 结束调用
$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    NProgress.done();
  }, 500)
});
//***********************************************

//功能六 登陆拦截
if(location.href.indexOf("login.html")===-1){
  $.ajax({
    url:'/employee/checkRootLogin',
    type:'get',
    success:function (info) {
      console.log(info);
      if(info.success){
        console.log(666);
      }
      if(info.error===400){
        //拦截登陆
        location.href="login.html"
      }
    }
  })
}

$(function () {



//功能一：点击导航栏部分隐藏左侧
$(".login-menus").click(function () {
  $(".lf_aside").toggleClass("hidemenu");
  $(".lr_main").toggleClass("hidemenu");
  $(".lr_main .menus").toggleClass("hidemenu");
});


  //功能二 二级菜单的显示与隐藏
 $(".two-menus").click(function () {
   //console.log(666);
   $(this).next().stop().slideToggle();
 });


  //功能三：点击图标,显示模态框，退出网页，请求Ajax
  $(".login-exit").click(function () {
    $('#logoutModal').modal("show");
  });

  //功能四：点击模态框退出请求ajax
  $("#logoutBtn").click(function () {
    //console.log(666);
    //请求Ajax
    $.ajax({
      url: "/employee/employeeLogout",
      type: "GET",
      dataType: "json",
      success:function ( info ) {
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })
  });









})