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
          }
        })
      }
    })
  };


})