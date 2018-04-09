/**
 * Created by 王子臣 on 2018/4/7.
 */
$(function () {
    var currentPage=1;
    var page=5;
  render();
  function render() {
    $.ajax({
      url:'/category/querySecondCategoryPaging',
      type:'get',
      data:{
        page:currentPage,
        pageSize:page
      },
      success:function (info) {
        //console.log(info);

        $("#second").html(template("tmp-second",info));


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
          },

        })
      }
    })
  };

//显示模态框
  $("#addbtn").click(function () {
      $("#second_modal").modal("show");
    //请求一级菜单，渲染下拉框
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100,

      },
      success:function(info){
        console.log(info.rows);
        $(".dropdown-menu").html(template("tmp-first",{list:info.rows}));
      }
    })

  });

//模态框渲染的一级菜单委托事件
  $(".dropdown-menu").on("click","a",function () {
      var txt=$(this).text();
      var id=$(this).data("id");

    //修改文本内容
    $("#dropdownText").text(txt);

    //将id 设置到input表单元素中
    $("[name='categoryId']").val(id);


    //校验
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });


  //配置图片
  $('#fileupload').fileupload({
    //指定数据json
    dataType:'json',
    //done 当图片上传完成时响应回来时调用
    done:function (e,data) {
      //console.log(data);
      //获取地址
      var picAddr=data.result.picAddr;
      //设置图片地址
      $("#imgBox img").attr("src",picAddr);

      //鸡贼，把图片地址存在隐藏域中
      $('[name="brandLogo"]').val(picAddr);

      //重置校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
    }
  })

  //表单验证

  $("#form").bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //校验字段
    fields:{
      brandName:{
        //规则
        validators:{
          notEmpty:{
            message:'请输入二级分类名称'
          }
        }
      },
      categoryId:{
        //规则
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }
        }

      },
      //图片的地址
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请上传图片'
          }
        }
      }




    }
  });

  //通过ajax进行添加

  $("#form").on("success.form.bv",function (e) {
    e.preventDefault();

    $.ajax({
      url: "/category/addSecondCategory",
      type:'post',
      data:$("#form").serialize(),
      success:function (info) {
        console.log(info);
        //关闭模态框
        $("#second_modal").modal("hide");

        //重新渲染
        currentPage=1;
        render();
        //重置图片的路径
        $("#imgBox img").attr("src","images/none.png");
        //重置一级文本
        $("#dropdownText").text("请选择1级分类");
        //重置二级文本
        $('[name="brandName"]').val('');
        //重置校验
        $("#form").data("bootstrapValidator").resetForm();
      }
    })
  })
})