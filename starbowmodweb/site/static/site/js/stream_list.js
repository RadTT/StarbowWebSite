var StreamListHandler = (function () {
	var ICONS = {
		"protoss": "protoss_icon_small.png",
		"zerg": "zerg_icon_small.png",
		"terran": "terran_icon_small.png",
		"random": "random_icon_small.png"
	};
	var TEAMS = {
		"axiom": {
			id: "axiom",
			name: "Axiom",
			icon: "axiom.png"
		},
		"acer": {
			id: "acer",
			name: "Acer",
			icon: "acer.png"
		},
		"root": {
			id: "root",
			name: "ROOT",
			icon: "root.png"
		}
	};
	
	var TOURNEY_LIVE_ICON_BG_COLOR = "#560d0d";
	var TOURNEY_LIVE_ICON_FLASH_COLOR = "#FFEA04";
	
	var _streamList = null;
  var _staticPath = "/static/site/";
	
	var init = function (streamListLocation) {
		updateStreamList(streamListLocation, function () {
      populatePlayerStreamList();
      populateTournamentStreamList();
      //initGraphics();
      initBindings();
      //setTimeout(animateTourneyIcons, 3000);
    });
	};
	
	var updateStreamList = function (streamListLocation, callbackFunc) {
    $.ajax({
      url: streamListLocation,
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (!response.success) {
          alert("not successful");
          return;
        }
        _streamList = response;
        if (typeof callbackFunc != "undefined") {
          callbackFunc();
        }
      },
      error: function (a,b,c) {
        alert("error getting streams list: " + c);
      }
    });
	};
	
	var populatePlayerStreamList = function () {
		var streamListTemplate = getTemplate("/static/site/tpl/user_stream.html");
		$.each(_streamList.users, function (i, userObj) {
			var user = $.extend({}, userObj);
			$.extend(user, {
				isProtoss: user.race == "p" ? true : false,
				isZerg: user.race == "z" ? true : false,
				isTerran: user.race == "t" ? true : false,
				isRandom: user.race == "r" ? true : false
			});
			if (typeof user.team != "undefined" && user.team != "") {
				$.extend(user, {
					teamIcon: TEAMS[userObj.team].icon,
					teamName: TEAMS[userObj.team].name
				});
			}
			switch (user.rank) {
				case "diamond+":
					user.rankIcon = "rank_diamond_p.png";
					break;
				case "diamond":
					user.rankIcon = "rank_diamond.png";
					break;
				case "platinum+":
					user.rankIcon = "rank_platinum_p.png";
					break;
				case "platinum":
					user.rankIcon = "rank_platinum.png";
					break;
				case "gold+":
					user.rankIcon = "rank_gold_p.png";
					break;
				case "gold":
					user.rankIcon = "rank_gold.png";
					break;
				case "silver+":
					user.rankIcon = "rank_silver_p.png";
					break;
				case "silver":
					user.rankIcon = "rank_silver.png";
					break;
				case "bronze+":
					user.rankIcon = "rank_bronze_p.png";
					break;
				case "bronze":
					user.rankIcon = "rank_bronze.png";
					break;
			}
			var html = Mustache.render(streamListTemplate, $.extend({staticPath: _staticPath}, user));
			$("#player_stream_list").append(html);
		});
	};
	
	var populateTournamentStreamList = function () {
		var streamListTemplate = getTemplate("/static/site/tpl/tournament_stream_live.html");
		$.each(_streamList.tournaments, function (i, tournamentObj) {
			var tournament = $.extend({}, tournamentObj);
			$.extend(tournament, {
				isLive: tournament.live == "true",
				isNotLive: tournament.live != "true"
			});
			var html = Mustache.render(streamListTemplate, $.extend({staticPath: _staticPath}, tournament));
			$("#live_tournament_stream_list").append(html);
		});
    
    var streamListTemplate = getTemplate("/static/site/tpl/tournament_stream_soon.html");
		$.each(_streamList.tournaments, function (i, tournamentObj) {
			var tournament = $.extend({}, tournamentObj);
			$.extend(tournament, {
				isLive: tournament.live == "true",
				isNotLive: tournament.live != "true"
			});
			var html = Mustache.render(streamListTemplate, $.extend({staticPath: _staticPath}, tournament));
			$("#soon_tournament_stream_list").append(html);
		});
	};
	
	var initGraphics = function () {
		$(".sl_tourney_live .sl_tourney_icon").css({backgroundColor: TOURNEY_LIVE_ICON_BG_COLOR});
	};
	
	var initBindings = function () {
		bindTournamentInfo();
		bindStreamHover();
		bindStreamLinks();
    
		//temp
		$("#sl_listing_info").on("click", function () {
			$("#sl_listing_info_more").slideToggle();
		});
	};
	
	var bindTournamentInfo = function () {
		$(".sl_tourney_title").on("mouseover", function () {
			$(this).find(".sl_tourney_name").css("text-decoration", "underline");
		});
		$(".sl_tourney_title").on("mouseout", function () {
			$(this).find(".sl_tourney_name").css("text-decoration", "normal");
		});
		$(".sl_tourney_title").on("click", function () {
			var tournamentId = $(this).attr("data-tourney-id");
			$(".sl_tourney_info[data-tourney-id='"+ tournamentId +"']").slideToggle();
		});
	};
	
	var bindStreamHover = function () {
		var textToColor = "#560d0d";
		$(".sl_stream_link, .sl_player").on("mouseover", function () {
			var $marker = $(this).find(".sl_marker_1");
			$marker.stop().animate({
				left: "-14px",
				width: "7px"
			}, 150);
		});
		$(".sl_stream_link, .sl_player").on("mouseout", function () {
			var $marker = $(this).find(".sl_marker_1");
			$marker.stop().animate({
				left: "-7px",
				width: "0px"
			}, 150);
		});
	};
  
  var bindStreamLinks = function () {
    $(".sl_stream_link").on("click", function () {
      var url = $(this).attr("data-stream-url");
      window.open(url, "_blank");
    });
  };
	
	var animateTourneyIcons = function () {
		setTimeout(function () {
			$(".sl_tourney_live .sl_tourney_icon").each(function () {
				var tourneyId = $(this).attr("data-tourney-id");
				setTimeout("UIHandler.animateTourneyIcon('"+ tourneyId +"')", 500);
			});
		}, 300);
	};
	
	var animateTourneyIcon = function (tourneyId) {
		$iconContainer = $(".sl_tourney_icon[data-tourney-id='"+ tourneyId +"']");
		
		var $a1 = $iconContainer.find(".tourney_icon_a1");
		var $a2 = $iconContainer.find(".tourney_icon_a2");
		var $a3 = $iconContainer.find(".tourney_icon_a3");
		var $a4 = $iconContainer.find(".tourney_icon_a4");
		
		resetTourneyIconAnimation($iconContainer, $a1, $a2, $a3, $a4);
		
		$a2.animate({
			width: "100%"
		}, 1500, "easeInQuart", function () {
			$a2.animate({
				width: "0%",
				left: "100%"
			}, 100, "linear", function () {
				$a2.animate({
					width: "0%",
					left: "0"
				}, 50, function () {
					$a2.animate({
						width: "100%"
					}, 100, "linear", function () {
						$a2.animate({
							width: "0%",
							left: "100%"
						}, 100, function () {
							$a1.css({width: "100%"});
							$a1.animate({
								height: "100%",
								top: "0",
								marginTop: "0"
							}, 150, function () {
								$a3.show();
								$a4.show();
								$a1.animate({
									backgroundColor: TOURNEY_LIVE_ICON_BG_COLOR
								}, 5000, function () {
									$a3.animate({
										backgroundColor: TOURNEY_LIVE_ICON_BG_COLOR
									}, 5000);
									$a4.animate({
										backgroundColor: TOURNEY_LIVE_ICON_BG_COLOR
									}, 5000);
									setTimeout("UIHandler.animateTourneyIcon('"+ tourneyId +"')", 65000);
								});
							});
						});
					});
				});
			});
		});
		
	};
	
	var resetTourneyIconAnimation = function ($iconContainer, $a1, $a2, $a3, $a4) {
		$iconContainer.css({
			backgroundColor: TOURNEY_LIVE_ICON_BG_COLOR
		});
		$a1.css({
			height: "2px",
			top: "50%",
			left: "0",
			marginTop: "-1px",
			width: "0",
			backgroundColor: TOURNEY_LIVE_ICON_FLASH_COLOR
		});
		$a2.css({
			height: "2px",
			top: "50%",
			left: "0",
			marginTop: "-1px",
			width: "0",
			backgroundColor: TOURNEY_LIVE_ICON_FLASH_COLOR
		});
		$a3.css({
			height: "2px",
			top: "50%",
			left: "0px",
			marginTop: "-1px",
			width: "100%",
			backgroundColor: TOURNEY_LIVE_ICON_FLASH_COLOR,
			display: "none"
		});
		$a4.css({
			height: "6px",
			top: "50%",
			right: "0px",
			marginTop: "-3px",
			width: "3px",
			backgroundColor: TOURNEY_LIVE_ICON_FLASH_COLOR,
			display: "none"
		});
	};
	
	var getTemplate = function (templateName) {
		var tpl;
		$.ajax({
			url: templateName,
			type: "GET",
			async: false,
			success: function (response) {
				tpl = response;
			},
			error: function (a,b,c) {
				alert("Error getting template: " + c);
			}
		});
		return tpl;
	};
	
	var publicObj = {
		init: init,
		animateTourneyIcons: animateTourneyIcons,
		animateTourneyIcon: animateTourneyIcon
	};
	return publicObj;
})();