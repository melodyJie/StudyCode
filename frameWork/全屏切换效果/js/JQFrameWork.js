(function($) {
    //定义私有方法
    var privateFun = function() {
        //
    }
    var _prefix = (function(temp) {
        var aPrefix = ["webkit", "moz", "ms", "o"],
            props = "";
        for (var i in aPrefix) {
            props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined) {
                return "-" + aPrefix[i] + "-";
            }
        }
        if (temp.style["transition"] !== undefined) {
            return "";
        }
        return false;
    })(document.createElement("div"));

    var PageSwitch = (function() {
        function PageSwitch(element, options) {
            this.element = element;
            if ($.type(options) === "object") {
                //外部的script文件中用:
                //$("#***").PageSwitch( {direction : "herizontal"} );  来调用init方法
                this.settings = $.extend(true, $.fn.PageSwitch.default, options || {});
                this.element = element;
                this.init();
            } else if ($.type(options) === "string") {
                //外部的script文件中用:
                //$("div").PageSwitch( "init" )  来调用init方法
                this.settings = $.fn.PageSwitch.default;
                this[options]();
            }
        }
        PageSwitch.prototype = {
            //实现: 插件初始化
            //实现: 初始化dom结构, 布局, 分页及绑定事件
            init: function() {

                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.settings.selectors.sections);
                me.section = me.element.find(me.settings.selectors.section);

                me.direction = me.settings.direction === "vertical" ? true : false;
                me.pagesCount = me.pagesCount();
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

                //能否调用滑动函数
                me.canScroll = true;

                //如果是横屏:
                if (!me.direction) {
                    me._initLayout();
                }

                //如果需要分页的页眉(四个小点点)
                if (me.settings.pagination) {
                    me._initPaging();
                }


                me._initEvent();
            },
            //说明: 获取滑动页面的数量
            pagesCount: function() {
                return this.section.length;

            },
            //说明: 获取滑动的宽度(横屏滑动) 或高度 (竖屏滑动)
            switchLength: function() {
                return this.direction ? this.element.height() : this.element.width();

            },
            //向上滑动执行函数
            prev: function() {
                var me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.index == 0) {
                    if (me.settings.loop) {
                        me.index = me.pagesCount - 1;
                    }
                }
                me._scrollPage();
            },
            //向下滑动执行函数
            next: function() {
                var me = this;
                if (me.index < me.pagesCount - 1) {
                    me.index++;
                } else if (me.index == me.pagesCount - 1) {
                    if (me.settings.loop) {
                        me.index = 0;
                    }
                }
                me._scrollPage();
            },
            //说明: 页面的滑动函数
            _scrollPage: function() {
                var me = this,
                    dest = me.section.eq(me.index)[0];
                /*dest = me.section.eq(me.index).position();
                console.log(me.index)
                console.log(me.section.eq(me.index)[0].offsetLeft) //zhengque
                console.log(me.section.eq(me.index).position())  //cuowu*/
                me.canScroll = false;
                if (!dest) return;
                if (_prefix) {
                    me.sections.css(_prefix + "transition", "all " + me.settings.duration + "ms " + me.settings.easing);

                    //方法1:  (为什么不能用opsition?  因为translateX()影响了position(),所以这里使用绝对定位加left的方法)
                    /*var translate= me.direction?-dest.top+"px":-dest.left+"px";
                    me.element.css("position","relative");
                    me.sections.css("position","absolute");
                    me.sections.css(me.direction?"top":"left",translate)*/

                    //方法2:
                    var translate = me.direction ? "translateY(-" + dest.offsetTop + "px)" : "translateX(-" + dest.offsetLeft + "px)";
                    me.sections.css(_prefix + "transform", translate);

                } else {
                    var animateCss = me.direction ? { top: -dest.offsetTop + "px" } : { left: -dest.offsetLeft + "px" };
                    me.element.css("position", "relative");
                    me.sections.css("position", "absolute");
                    me.sections.animate(animateCss, me.settings.duration, function() {
                    	me.canScroll=true;
                        if (me.settings.callback && $.type(me.settings.callback) === "function") {
                            me.settings.callback.apply(me.section.eq(me.index),null);
                        }
                    });
                }
                //修改分页的页眉的样式(active)
                me.pageItem.eq(me.index).addClass(me.activeClass).siblings().removeClass(me.activeClass);
            },
            //说明: 主要针对横屏情况进行页面布局
            _initLayout: function() {
                var me = this;
                var width = (this.pagesCount * 100) + "%",
                    cellWidth = (100 / this.pagesCount).toFixed(2) + "%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float", "left");
            },
            //说明: 实现分页的页眉的dom结构及css样式
            _initPaging: function() {
                var me = this,
                    pageClass = me.settings.selectors.page.substring(1);
                me.activeClass = me.settings.selectors.active.substring(1);
                var pageHtml = "<ul class=" + pageClass + ">";
                for (var i = 0; i < me.pagesCount; i++) {
                    pageHtml += "<li><p></p></li>";
                }
                pageHtml += "</ul>";
                me.element.append(pageHtml);
                var $pages = me.element.find(me.settings.selectors.page); //me.element是一个jQ对象哦;
                //console.log($page);
                me.pageItem = $pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    $pages.addClass("vertical");
                } else {
                    $pages.addClass("horizontal");
                }

            },
            //说明: 初始化插件事件
            _initEvent: function() {
                var me = this;
                //添加分页的页眉的点击事件
                if (me.settings.pagination) {
                    me.element.on('click', me.selectors.page + " li", function() {
                        if (me.canScroll) {
                            me.index = $(this).index();
                            console.log([me.index, $(this).index()])
                            me._scrollPage();
                        }
                    })
                }
                //添加鼠标滚轮事件
                //其他浏览器通过 mousewheel 判断滚轮事件, 火狐 浏览器通过 DOMMouseScroll来判断
                me.element.on("mousewheel DOMMouseScroll", function(e) {
                    //向下滚动,wheelDelta(mousewheel)都是 -120. 但是 detail(DOMMouseScroll)却是 3
                    // 都存放在originalEvent 对象下
                    if (me.canScroll) {
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if (delta > 0) {
                            me.prev();
                        } else if (delta < 0) {
                            me.next();
                        }
                    }
                });

                //添加键盘点击事件
                //jQ 解决了兼容性问题,可直接使用 .witch属性 和 .keyCode属性来确定按下了哪个键
                if (me.settings.keyboard) {
                    $(window).on("keydown", function(e) {
                        if (me.canScroll) {
                            var keyCode = e.keyCode;
                            if (keyCode == 37 || keyCode == 38) {
                                me.prev();
                            } else if (keyCode == 39 || keyCode == 40) {
                                me.next();
                            }
                        }
                    });
                }
                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function(){
                	me.canScroll=true;
                	if (me.settings.callback && $.type(me.settings.callback) === "function") {
                        //me.settings.callback();
                        me.settings.callback.apply(me.section.eq(me.index),null);
                    }

                })
            }
        }
        return PageSwitch;
    })();

    $.fn.PageSwitch = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data("PageSwitch");
            if (!instance) {
                instance = new PageSwitch(me, options);
                me.data("PageSwitch", instance);
            }
            /*if ($.type(options) === "string") {  //完全多余 教程多此一举
                return instance[options](); //$("div").PageSwitch("init")  来调用init方法
            }*/
        });
    }

    $.fn.PageSwitch.default = { //翻页对象的默认参数
        selectors: {
            sections: ".sections", //翻页也页面的容器
            section: ".section", //页面
            page: ".pages", //
            active: ".active" //页面加的行为类
        },
        index: 0, //从第几页开始翻页
        easing: "ease", //翻页的过渡效果
        duration: 500, //翻页的延时
        loop: true, //是否循环翻页
        pagination: true, //是否进行分页
        keyboard: true, //是否有键盘事件
        direction: "vertical", //horizontal:水平翻页  vertical:垂直翻页
        callback: "" //回调函数
    }
})(jQuery);
