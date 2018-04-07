/**
 * Created by 王子臣 on 2018/4/7.
 */
$(function () {
  var currentPage=1;
  var pageSize=5;
  render();
  function render () {
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $("#first").html(template("tmp-first",info));

        //分页渲染
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
    })
  }


  //显示模态框
  $("#addbtn").on("click",function () {
      $("#first_modal").modal("show");
  });
  //校验插件
  $("#form").bootstrapValidator({

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      categoryName: {
        // 校验规则
        validators: {
          // 非空检验
          notEmpty: {
            // 提示信息
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });

  //添加分类
   $("#form").on("success.form.bv",function (e) {
     e.preventDefault();
     $.ajax({
       url:'/category/addTopCategory',
       type:'post',
       data:$("#form").serialize(),
       success:function (info) {
         console.log(info);
         if(info.success){
           $("#first_modal").modal("hide");
           render();
         }

       }
     })
})
})