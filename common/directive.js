// var app = angular.module('myApp', ['ui.router']);
// 正在加载中提示
app.directive('toast', function () {
    return {
        restrict: 'E',
        scope: {
            content: '@',
            className: '@'
        },
        template: `
        <div id="toast">
            <div class="weui-mask_transparent"></div>
            <div class="weui-toast-text">
                <i class="weui-icon_toast {{className}}" ng-if="className"></i>
                <p class="weui-toast_content">{{content}}</p>
            </div>
        </div>`,
        replace: true
    }
})

    // 已完成 weui-icon-success-no-circle  数据加载中 weui-loading
    .directive('dialog', function () {
        return {
            restrict: 'E',
            scope: {
                content: '@'
            },
            template: `
            <div id="dialog">
                <div class="weui-mask"></div>
                <div class="weui-dialog">
                    <div class="weui-dialog__bd">{{content}}</div>
                    <div class="weui-dialog__ft">
                        <a  ng-click="close()" class="weui-dialog__btn weui-dialog__btn_primary">确定</a>
                    </div>
                </div>
            </div>`,
            replace: true,
            link: function (scope, ele, attr) {
                scope.close = function () {
                    $('#dialog').fadeOut();
                }
            }
            // transclude: true
        }
    })
    .directive("slideFollow", function ($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: "@",
                datasetData: "="
            },
            template: "<li ng-repeat = 'data in datasetData'>{{data.option}}</li>",
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    var className = $("." + $(elem).parent()[0].className);
                    // var className = $(".slideUl");
                    className.css("margin-top", "-20px");
                    var i = 0, sh;
                    var liLength = className.children("li").length;
                    var liHeight = className.children("li").height() + parseInt(className.children("li").css('border-bottom-width'));
                    className.html(className.html() + className.html());

                    // 开启定时器
                    sh = setInterval(slide, 3000);

                    function slide() {
                        if (parseInt(className.css("margin-top")) > (-liLength * liHeight)) {
                            i++;
                            className.animate({
                                marginTop: -liHeight * i + "px"
                            }, "slow");
                        } else {
                            i = 0;
                            className.css("margin-top", "0");
                        }
                    }


                }, 500)

            }
        }
    })