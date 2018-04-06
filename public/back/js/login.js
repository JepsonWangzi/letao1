/**
 * Created by 王子臣 on 2018/4/6.
 */
$(function () {

  //表单的验证
$("#form").bootstrapValidator({

  //配置图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  //对字段进行验证
  fields:{
    //对用户名进行验证
    username:{
      //校验的规则
      validators:{
        //1:非空校验
        notEmpty:{
          //为空显示的信息
          message:'用户名不能为空'
        },
        //2:长度校验
        stringLength:{
          min:2,
          max:8,
          message:'用户名长度为2到8位哦'
        }

      }
    },
    //密码验证
    password:{
      validators:{
        notEmpty:{
          message:'密码不能为空'
        },
        stringLength:{
          min:5,
          max:12,
          message:'密码应为5到12位'
        }


      }

    }
  }
});


  //登陆功能的提交Ajax,表单插件提交有默认的行为，刷新了页面，需要阻止
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    //用表单序列化提交数据
    //console.log($("#form").serialize());
    $.ajax({
      type:'post',
      url: "/employee/employeeLogin",
      data:$("#form").serialize(),
      success:function (info) {
        //console.log(info);
        if(info.success){
          //alert("登陆成功");
          location.href="index.html";
        }
        if(info.error===1001){
          //alert("密码错误")
          //当提交的时候密码错误的时候，校验的标记没有消失，需要一种方法,来判断是否正确
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
        if(info.error===1000){
          //alert("用户名错误")
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }
      }
    })
  });


  //重置功能
  $("[type='reset']").click(function () {
    //reset会重置文字，但是校验的标记没有去掉，需要重置；
    $("#form").data("bootstrapValidator").resetForm();
  })

})