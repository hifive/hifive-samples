$(function() {
	// コントローラの元となるオブジェクトを作成
	var baloonController = {
		_air : 100,
		_capacity : 30000,
		_bangSound : new Audio('res/sound/bang.m4a'),
		_WAITTIME : 1000,

		__name : 'pump.controller.BaloonController',
		__construct : function() {
			this.log.info('{0}を実行', '__construct');
		},
		__init : function() {
			this.log.info('{0}を実行', '__init');
		},
		__ready : function() {
			this.log.info('{0}を実行', '__ready');
			var $pumpPicContainer = this.$find('#pumpPicContainer');
			var tiedY = $pumpPicContainer.offset().top
					+ $pumpPicContainer.height() - 20;
			var tiedX = $pumpPicContainer.offset().left
					+ ($pumpPicContainer.width() * 0.25) + 20;
			this.tie(tiedX, tiedY);
		},

		'{document} pump' : function(context, $el) {
			this._air += context.evArg.blow;
			this._drawLine();
			if (this._air > this._capacity) {
				this.bang();
				return;
			}
			var r = this._squareRt(this._air);
			var $baloon = this.$find('.baloon');
			this.log.debug('baloonの半径を{0}に設定', r);
			$baloon.css({
				width : r * 2,
				height : r * 2
			});
		},

		tie : function(x, y) {
			this._isTied = true;
			this._tiedX = x;
			this._tiedY = y;
			this._drawLine();
		},

		_drawLine : function() {
			var $baloon = this.$find('.baloon');
            if(!$baloon[0])
                return;
			var x = parseInt($baloon.offset().left) + parseInt($baloon.width())
					* 0.5;
			var y = parseInt($baloon.offset().top) + parseInt($baloon.height())
					* 0.5;
			var $pumpPicContainer = this.$find('#pumpPicContainer');
			var tiedY = $pumpPicContainer.offset().top
					+ $pumpPicContainer.height() - 20;
			var tiedX = $pumpPicContainer.offset().left
					+ ($pumpPicContainer.width() * 0.25) + 30;
			var $line = this.$find("#stringSvg #string");
			this.log.debug('from({0}, {1}) to({2}, {3})', x, y, tiedX, tiedY);

			$line.attr('x1', tiedX);
			$line.attr('y1', tiedY);
			$line.attr('x2', x);
			$line.attr('y2', y);
		},

		_cubeRt : function(v) {
			return Math.pow(v * 0.75, 1 / 3);
		},
		_squareRt : function(v) {
			return Math.pow(v / (Math.PI * 2), 1 / 2);
		},

		bang : function() {
			this.$find('.baloon').remove();
			if (this._bangSound.readyState !== 4) {
				this._bangSound.load();
			}
			this._bangSound.play();

			this.$find('#string').css({visibility: "hidden"});
			
			this._air = 100;
			setTimeout(this.own(function() {
				this.$find('.baloonContainer').append(
						'<div class="baloon"></div>');
			    this.$find('#string').css({visibility: "visible"});
                this._drawLine();
			}), this._WAITTIME);
		}
	};

	h5.core.expose(baloonController);
	// baloonControllerを要素にバインド
	h5.core.controller('#container', baloonController);
});
