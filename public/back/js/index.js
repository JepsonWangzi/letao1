/**
 * Created by 王子臣 on 2018/4/6.
 */


$(function () {



//功能一：点击导航栏部分隐藏左侧
$(".login-menus").click(function () {
  $(".lf_aside").toggleClass("hidemenu");
  $(".lr_main").toggleClass("hidemenu");
  $(".lr_main .menus").toggleClass("hidemenu");
});


  //功能二 二级菜单的显示与隐藏
 $(".two-menus").click(function () {
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

  //功能五：点击菜单栏高亮

  $(".lf_aside .menus li>a").click(function () {
    //
    $(this).addClass("current").parents("li").siblings().children().removeClass("current")
  })




})