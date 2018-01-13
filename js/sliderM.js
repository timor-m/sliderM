/*! sliderM v1.0  @Timor-M/license */
;(function(){
    function SliderM(elem,options){
        this.page=-1;//定义轮播播放的索引值,默认为:-1	
        this.slideBox=elem;//获得轮播容器
        this.imgBox=this.slideBox.children().eq(0);
        this.pageBox=$("<ul class='sliderM-page'></ul>");
        this.imgLi=this.imgBox.find("li");
        this.len = this.imgLi.size();//获取轮播图片的个数
        this.timer = null;//定义一个定时器
        this.pageLi= '';
        this.defaults={
            duration:500,//动画切换时间
            time:3000,//周期性切换等待时间
            width:730,//父级轮播容器的宽度
            height:454,//父级轮播容器的高度
            controls:true//是否需要控制按钮
        },
        this.options = $.extend({},this.defaults,options);
        this.slideBox.css({
            "width":this.options.width,
            "height":this.options.height
        })
    }
    //通过原型设置继承方法
    SliderM.prototype={
        //生成按钮容器
        createPageBox:function(){
            for(var i=0;i<this.len;i++){
                this.pageLi+='<li></li>';
            }
            this.pageBox.html(this.pageLi);
            this.slideBox.append(this.pageBox);
            //设置按钮页居中问题
            var w =this.pageBox.width();
            console.log(this)
            this.pageBox.css("margin-left",-w/2);
            this.pageLi=this.pageBox.find("li"); //插入完按钮的li 重新获取元素
        },
        //用于控制图片/按钮 效果 :index为当前需要显示的索引值
        Move:function(index){
        //把所有图片隐藏
        this.imgLi.hide();
        //把所有按钮的红色样式去除
        this.pageLi.removeClass("active");
        //指定图片显示
        this.imgLi.eq(index).fadeIn(this.options.duration).css({"z-index":1}).siblings().css("z-index",0).stop();
        //指定一个按钮样式
        this.pageLi.eq(index).addClass("active");

    },
        //定义一个自动轮播函数
       autoMove:function(){
        var _this_ = this;//先接收当前函数
        this.page++;
        this.page%=this.len;//用于判断轮播页面是否超出当前数量,如果超出,从0开始
        this.Move(this.page);
        this.timer = setTimeout(function(){
            _this_.autoMove()
        },_this_.options.time);
    },
    //给轮播父级容器添加悬停,暂停自动播放功能
   hoverEvent:function(){
        var _this_ = this;
        this.slideBox.hover(function(){
            clearTimeout(_this_.timer);
            _this_.slideBox.children("a").fadeIn();
        },function(){
            _this_.timer = setTimeout(function(){
                _this_.autoMove()
            },_this_.options.time)
            _this_.slideBox.children("a").fadeOut();
        })
    },
        //鼠标悬停到某个按钮,显示对应的图片	
       hoverPage:function(){
        var _this_ = this;
        this.pageLi.mouseover(function(){
            _this_.Move($(this).index());//让当前按钮的对应的图片显示
            _this_.page = $(this).index();
        })
    },
        //给控制轮播的a标签设置点击事件
       control:function(){
        var _this_ = this;
         this.slideBox.append('<a href="javascript:void(0)" class="control-left">&lt;</a> <a href="javascript:void(0)" class="control-right">&gt;</a>')
        _this_.slideBox.children("a").click(function(){
            if($(this).is(".control-left")){
                _this_.page--;
                if(_this_.page<0) _this_.page=_this_.len-1;
                _this_.Move(_this_.page);
            }else{
                _this_.page++;
                _this_.page%=_this_.len; //用于判断轮播页面是否超出当前数量,如果超出,从0开始
                _this_.Move(_this_.page);
            }
        })
    },
    init:function(){
        this.createPageBox();
        this.autoMove();
        this.hoverEvent();
        this.hoverPage();
        if(this.options.controls){//如果需要控制模块，则添加
            this.control();
        }
    }
    }
    //在插件中使用sliderM对象
    $.fn.sliderM=function(options){
        this.each(function(){
            //console.log(this)
            //创建对象实例
            var slider = new SliderM($(this),options);
            slider.init();
        })
    }
})(jQuery);