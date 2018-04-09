/**
 * Created by 王子臣 on 2018/4/9.
 */



$(function () {
    var currentPage=1;
    var page=2;
    var picArr = []; // 专门用来保存图片对象
    //1：渲染数据
    render();
    function render(){
        $.ajax({
            url:'/product/queryProductDetailList',
            type:'get',
            data:{
                page:currentPage,
                pageSize:page
            },
            success:function (info) {
                //console.log(info);
                $("#pro-render").html(template("pro-tmp",info));

                //渲染分页
                $("#pagination").bootstrapPaginator({
                    //需要指定版本号
                    bootstrapMajorVersion:3,
                    //当前页
                    currentPage:info.page,
                    //总页数
                    totalPages:Math.ceil(info.total/info.size),
                    //点击触发
                    onPageClicked:function (a,b,c,page) {
                        currentPage=page;
                        render();
                    },
                    //配置按钮大小
                    size:"normal",
                    //配置每个按钮的文字
                    itemTexts:function (type,page,current) {
                        //console.log(type,page,current);
                        switch( type ) {
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return page;
                        }
                    },
                    //配置提示文字
                    tooltipTitles:function (type,page,current) {
                        switch (type){
                            case "first":
                            return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return "前往第"+page+"页";
                        }
                    },
                    //组件的提示
                    useBootstrapTooltip:true
                })

            }

        })


    }

    //2：模态框的显示

    $("#addbtn").click(function () {
        $("#product_modal").modal("show");

        //3:发送ajax请求，请求二级分类的数据，进行渲染到下拉菜单
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            success:function (info) {
                console.log(info);
                //请求数据成功，开始渲染到下拉菜单
                $(".dropdown-menu").html(template("dropdownTpl",info));

            }
        })
    });


  //4:注册委托事件，把选择的二级菜单渲染到当前文本上
    $(".dropdown-menu").on("click","a",function () {
        var txt=$(this).text();
        //取出id
        var id=$(this).data("id");
        $("#dropdownText").text(txt);
        $('[name="brandId"]').val(id);
    });



    //6：配置图片的上传的回掉函数，渲染在盒子里
    $("#fileupload").fileupload({
        dataType:'json',
        done:function (e,data) {
            //console.log(data);

            //获取图像的地址
            var picObj=data.result;
            var picAddr=picObj.picAddr;

            //将获得的数组push到创建好的全局数组中
            picArr.unshift(picObj);
            //然后把图片加到盒子里
            $('#imgBox').prepend('<img src="'+ picAddr +'" width="100">');

            //判断图片的个数只能三个，多了就要pop掉

            if(picArr.length>3){
                picArr.pop();
                //然后数组里的图片只能是三个，同时清除盒子的最后一张图片
                $("#imgBox img:last-of-type").remove();
            }

            //这个时候图片校验的话要重置一下

            if ( picArr.length === 3 ) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }


        }

    });



    //5:校验表单

    $('#form').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段
        fields: {
             //二级分类id, 归属品牌
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
             //商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            // 商品库存
            // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
            // 数字: \d
            // + 表示一个或多个
            // * 表示零个或多个
            // ? 表示零个或1个
            // {n} 表示出现 n 次
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });






    //7:点击提交的时候提交数据
    $("#form").on("success.form.bv", function( e ) {
        // 阻止默认的提交
        e.preventDefault();

        // 表单提交得到的参数字符串
        var params = $('#form').serialize();

        console.log(params);


        params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        console.log(params);

        // 通过 ajax 进行添加请求
        $.ajax({
            url: "/product/addProduct",
            type: "post",
            data: params,
            success: function( info ) {
                console.log( info )
                if (info.success) {
                    // 关闭模态框
                    $('#product_modal').modal("hide");
                    // 重置校验状态和文本内容
                    $('#form').data("bootstrapValidator").resetForm(true);
                    // 重新渲染第一页
                    currentPage = 1;
                    render();

                    // 手动重置, 下拉菜单
                    $('#dropdownText').text("请选择二级分类")

                    // 删除结构中的所有图片
                    $('#imgBox img').remove();
                    // 重置数组 picArr
                    picArr = [];

                }
            }
        })
    })
})