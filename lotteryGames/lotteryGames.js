var app = angular.module('myApp', []);
app.controller('lotteryGamesCtrl', ['$scope', '$interval', '$timeout', '$http',
	function ($scope, $interval, $timeout, $http) {
		// 数据可以根据自己使用情况更换
		$scope.datasetData = [
			{ option: "恭喜：183****获得10元代金劵" },
			{ option: "恭喜：183****获得10元代金劵" },
			{ option: "恭喜：183**** 获得10元代金劵" },
			{ option: "恭喜：183**** 获得10元代金劵" },
			{ option: "恭喜：183**** 获得10元代金劵" },
			{ option: "恭喜：183**** 获得10元代金劵" }
		]

		$scope.isAction = true;
		$scope.sendData = {

			realName: "",
			phone: ""
		};
		$scope.myScore = 0;
		// $scope.openId = '';
		// getOpenId();
		// 获取用户信息
		$http({
			url: serviceUrl + "/cuser",
			method: "GET",
		}).success(function (data) {
			if (!data.oid) {
				$timeout(function () {
					window.location.href = "http://www.vvpet.net/activity/start";
				}, 50)

			} else {
				$scope.openId = data.oid;
				getWxJsSignatureInfo($scope.openId)
			}

		})
		// if (!$scope.openId) {
		// 	$timeout(function () {
		// 		window.location.href = "http://www.vvpet.net/activity/start";
		// 	}, 50)
	
		// } else {
		
		// }

		// 分享接口
		function getWxJsSignatureInfo(openId) {
			$http({
				url: serviceUrl + "/wechat/getWxJsSignatureInfo",
				method: "GET",
				params: {
					url: location.href
				}
			}).success(function (data) {
				wx.config({
					// debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
					appId: data.appId, // 必填，公众号的唯一标识  
					timestamp: data.timestamp, // 必填，生成签名的时间戳  
					nonceStr: data.nonceStr, // 必填，生成签名的随机串  
					signature: data.signature,// 必填，签名，见附录1  
					jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
					//当前客户端版本是否支持指定JS接口,分享到朋友圈,分享给朋友  
				});
				wx.ready(function () {
					//朋友圈  
					wx.onMenuShareTimeline({
						title: '幸运大转盘', // 分享标题  
						desc: '幸运大转盘', // 分享描述  
						link: 'http://www.vvpet.net/activity/start?fid=' + openId, // 分享链接  
						imgUrl: 'http://www.vvpet.net/cxkjWeb/wx-cxkjWeb/lotteryGames/images/prize/4.png',
						success: function (res) {
							alert('分享成功');
							$http({
								url: serviceUrl + "/score/add",
								method: "GET",
								params: {
									type: 2
								}
							}).success(function (data) {
								$scope.msg = "分享成功";
								$('toast').show();
								$timeout(function () { $('toast').hide(); }, 500)
							})
						},
						cancel: function (res) {
							// alert('已取消');
						},
						fail: function (res) {
							alert(JSON.stringify(res));
						}
					});

					//朋友  
					wx.onMenuShareAppMessage({
						title: '幸运大转盘', // 分享标题  
						desc: '幸运大转盘', // 分享描述   
						link: 'http://www.vvpet.net/activity/start?fid=' + openId, // 分享链接  
						imgUrl: 'http://www.vvpet.net/cxkjWeb/wx-cxkjWeb/lotteryGames/images/prize/4.png',
						type: '', // 分享类型,music、video或link，不填默认为link  
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空  
						success: function () {
							$http({
								url: serviceUrl + "/score/add",
								method: "GET",
								params: {
									type: 2
								}
							}).success(function (data) {
								$scope.msg = "分享成功";
								$('toast').show();
								$timeout(function () { $('toast').hide(); }, 500)
							})
						},
						cancel: function () {
							// 用户取消分享后执行的回调函数  
							// alert("取消分享");
						}
					});

				});
			})
		}







		// 按钮效果
		$scope.isGo = true;
		$scope.isShare = true;
		$scope.isRule = true;

		// 从开始页面跳转
		$scope.jumpquestion = function () {
			$scope.isAction = false;
			// 获取积分
			$http({
				url: serviceUrl + "/score/myScore",
				method: "GET"
			}).success(function (data) {
				if (data) {
					$scope.myScore = data;
				} else {
					$timeout(function () {
						window.location.href = "http://www.vvpet.net/activity/start";
					}, 50)
				}

			})
			// 公告滚动


		}



		// 幸运抽奖 九宫格
		$scope.canDrawNum = 2;  //抽奖次数
		var luck = {
			index: -1,	//当前转动到哪个位置，起点位置
			count: 0,	//总共有多少个位置
			timer: 0,	//setTimeout的ID，用clearTimeout清除
			speed: 500,	//初始转动速度
			times: 0,	//转动次数
			cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
			prize: -1,	//中奖位置
			init: function (id) {
				this.count = 8;
				// $scope.index = this.index;
				// if ($("#" + id).find(".luck-unit").length > 0) {
				// 	$luck = $("#" + id);
				// 	$units = $luck.find(".luck-unit");
				// 	this.obj = $luck;
				// 	this.count = $units.length;

				// 	// $luck.find(".luck-unit-" + this.index).addClass("active");
				// };
			},
			roll: function () {

				var index = this.index;
				var count = this.count;
				var luck = this.obj;
				// $scope.index = this.index;
				// $(luck).find(".luck-unit-" + index).removeClass("active");
				index += 1;

				if (index > count - 1) {
					index = 0;
					$scope.index = index;
				};
				this.index = index;

				$scope.index = index;
				// $(luck).find(".luck-unit-" + index).addClass("active");
				// console.log($scope.index );
				return false;
			},
			stop: function (index) {
				this.prize = index;
				return false;
			}
		};
		function roll() {
			luck.times += 1;
			luck.roll();
			if (luck.times > luck.cycle + 10 && luck.prize == luck.index) {
				clearTimeout(luck.timer);
				if (luck.prize == 7) { //没中奖
					$('.draw-info-fail').fadeIn();
					luck.prize = -1;
					luck.times = 0;
					click = false;
				} else if (luck.prize == 3) { //四等奖
					$scope.prizeName = "定制公仔一个";
					$('.draw-info-win').fadeIn();
					luck.prize = -1;
					luck.times = 0;
					click = false;
				} else if (luck.prize == 0) {//五等奖
					$scope.prizeName = "狗粮一份";
					$('.draw-info-win').fadeIn();
					luck.prize = -1;
					luck.times = 0;
					click = false;
				} else if (luck.prize == 6) {//六等奖
					$scope.prizeName = "零食一份";
					$('.draw-info-win').fadeIn();
					luck.prize = -1;
					luck.times = 0;
					click = false;
				}

			} else {
				if (luck.times < luck.cycle) {
					luck.speed -= 10;
				} else if (luck.times == luck.cycle) {
					// var index = Math.random() * (luck.count)| 0;  
					// luck.prize = index;
				} else {
					if (luck.times > luck.cycle + 10 && ((luck.prize == 0 && luck.index == 7) || luck.prize == luck.index + 1)) {
						luck.speed += 110;
					} else {
						luck.speed += 20;
					}
				}
				if (luck.speed < 40) {
					luck.speed = 40;
				};

				luck.timer = $timeout(roll, luck.speed);
			}
			return false;
		}
		//闪灯效果
		// $scope.isBling = true;
		// var num = 0;
		// var timer = $interval(function () {
		// 	num++;
		// 	if (num % 2 == 0) {
		// 		$scope.isBling = false;
		// 	} else {
		// 		$scope.isBling = true;
		// 	}

		// }, 500);
		var click = false;
		luck.init('luck');
		$scope.luckStart = function () {
			if (click) {
				return false;
			}
			else {

				$scope.isGo = false;
				$scope.canDrawNum--;
				luck.speed = 200;

				$http({
					url: serviceUrl + "/reward/draw",
					method: "GET"
				}).success(function (data) {
					console.log(data)
					if (data == 40) {
						$scope.msg = "您的积分不足";
						$('#dialog').fadeIn();
					} else if (data == 4) {
						$scope.myScore -= 100;
						luck.prize = 3;
						roll();
					} else if (data == 5) {
						$scope.myScore -= 100;
						luck.prize = 0;
						roll();
					} else if (data == 6) {
						$scope.myScore -= 100;
						luck.prize = 6;
						roll();
					} else {
						$scope.myScore -= 100;
						luck.prize = 7;
						roll();
					}

				})
				click = true;
				return false;
			}

		};
		// 再来一次
		$scope.nextDraw = function () {
			$('.luck-unit').removeClass('active');
			$scope.isGo = true;
			$('.draw-info-fail').fadeOut();
		}
		// 去领奖
		$scope.getPrize = function () {
			$('.luck-unit').removeClass('active');
			$scope.isGo = true;
			//   input校验    //姓名
			var customerName = /^[\u4E00-\u9FA5]{1,30}$/;
			if (!$scope.sendData.realName) {
				$scope.msg = "请输入姓名";
				$('#dialog').fadeIn();
				return;
			} else if (!customerName.test($scope.sendData.realName)) {
				$scope.msg = "客户姓名，只能输入汉字";
				$('#dialog').fadeIn();
				return;
			}

			//手机验证
			var isMob = /^(1[3456789][0-9]{9})$/;
			if (!$scope.sendData.phone) {
				$scope.msg = "请输入手机号码";
				$('#dialog').fadeIn();
				return;
			} else if (!isMob.test($scope.sendData.phone)) {
				$scope.msg = "你输入的电话号码格式有误";
				$('#dialog').fadeIn();
				return;
			}
			$http({
				url: serviceUrl + "/reward/setinfo",
				method: "GET",
				params: {
					realName: $scope.sendData.realName,
					phone: $scope.sendData.phone
				}
			}).success(function (data) {
				if (data == 1) {
					$('.draw-info-win').fadeOut();
					$scope.msg = "信息已发送，工作人员会尽快与您联系";
					$('#dialog').fadeIn();
				}
			})
			// click
		}
		// 关闭领奖
		$scope.closeDrawDialog = function () {
			$('.luck-unit').removeClass('active');
			$scope.isGo = true;
			$('.draw-info-win').fadeOut();
		}
		//   提示框

		$scope.close = function () {
			$('.draw-info').fadeOut();
			$scope.msg = '';
			// $('#iosDialog2').fadeOut();

		}
		//    显示签到规则
		$scope.ruleShow = function () {
			// $('#toast').fadeIn();
			$('#rule_dialog').css("display", "block");
		}
		//    关闭签到规则
		$scope.ruleClose = function () {
			$('#rule_dialog').css("display", "none");
		}

		// 分享
		$scope.shareHandle = function () {
			$('#share_dialog').css("display", "block");
		}
		$scope.closeShare = function () {
			$('#share_dialog').css("display", "none");
		}



		// }
	}])



