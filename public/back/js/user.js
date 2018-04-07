/**
 * Created by 王子臣 on 2018/4/7.
 */
$(function () {
    //渲染user界面的表格数据

  var currentPage=1;
  var pageSize=5;
  render();
  function render(){
    $.ajax({
      url:'/user/queryUser',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function (info) {
        //console.log(info);
        $('#users').html(template( "tmp-user", info ));

      // 分页的配置
      $("#pagination").bootstrapPaginator({
        //需要指定版本号
        bootstrapMajorVersion:3,
        //当前页
        currentPage:info.page,
        //总页数
        totalPages:Math.ceil(info.total/info.size),
        //点击页面时触发
        onPageClicked:function (a,b,c,page) {
            //page当前的页码
          currentPage=page;
          render();
        }

      })
      }
    });

  };





  //事件委托弹出模态框，改变操作
  $("#users").on("click",".btn",function () {
    //console.log(66);
    //弹出模态框
    $("#promiss").modal("show");

    var id=$(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    console.log(isDelete);

    //解绑点击事件，继续注册点击事件
    $("#submitBtn").off("click").on("click",function () {
      //console.log(666);
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete:isDelete
        },
        success: function( info ) {
          console.log( info )
          if ( info.error===400 ) {
            // 关闭模态框
            $('#userModal').modal("hide");
            // 重新渲染
            render();
          }
        }
      })
    })
  })

})