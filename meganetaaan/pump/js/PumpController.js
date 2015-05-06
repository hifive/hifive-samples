$(function() {
	// コントローラの元となるオブジェクトを作成
	var pumpController = {
		_WAITTIME : 200,
		_PUMP2AIRRATE : 100,
		_PICPATH : 'res/picture/pump',
		__name : 'pump.controller.PumpController',

		_shooSound : new Audio('res/sound/shoo.m4a'),
		_cockSound : new Audio('res/sound/cock.m4a'),

		_shakeController : pump.controller.ShakeController,

		__construct : function() {
			this.log.info('{0}を実行', '__construct');
		},
		__init : function() {
			this.log.info('{0}を実行', '__init');
		},
		__ready : function() {
			this.log.info('{0}を実行', '__ready');
		},

		'{rootElement} shake' : function(context, $el) {
			var maxAc = context.evArg.maxAc;
			this.$find('#debugWindow')
					.append('pump: ' + String(maxAc) + '<br>');

			var blow = maxAc * this._PUMP2AIRRATE;
			this.trigger('pump', {'blow' : blow});
			this._pumpDown();
			setTimeout(this.own(this._pumpUp), this._WAITTIME);
		},

		_pumpDown : function() {
			this.log.info('pumpDown');
			var $pumpPic = this.$find('.pumpPic');
			$pumpPic.attr('class', 'pumpPic pumpPic2');
			if (this._shooSound.readyState !== 4) {
				this._shooSound.load();
			}
			this._shooSound.play();
		},
		_pumpUp : function() {
			this.log.info('pumpUp');
			var $pumpPic = this.$find('.pumpPic');
			$pumpPic.attr('class', 'pumpPic pumpPic1');
            /*
			if (this._cockSound.readyState !== 4) {
				this._cockSound.load();
			}
			this._cockSound.play();
            */
		},

		_wait : function() {
			setTimeout(function() {
				return;
			}, this._WAITTIME);
		}
	};

	// id="container"である要素にコントローラをバインド
	h5.core.controller('#container', pumpController);
});
