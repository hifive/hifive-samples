$(function() {
	// コントローラの元となるオブジェクトを作成
	var pumpController = {
		_WAITTIME : 200,
		_PUMP2AIRRATE : 800,
		_PICPATH : 'res/picture/pump',
		__name : 'pump.controller.PumpController',

		shooSound : null,

		_shakeController : pump.controller.ShakeController,

		__construct : function() {
			this.log.info('{0}を実行', '__construct');
		},
		__init : function() {
			this.log.info('{0}を実行', '__init');
		},
		__ready : function() {
			this.log.info('{0}を実行', '__ready');
            this.shooSound = document.getElementById('shooSound');
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

            this.shooSound.currentTime = 0;
			this.shooSound.play();
            //this.shooSound = new Audio(this.shooSound.src);
		},
		_pumpUp : function() {
			this.log.info('pumpUp');
			var $pumpPic = this.$find('.pumpPic');
			$pumpPic.attr('class', 'pumpPic pumpPic1');
		},

		_wait : function() {
			setTimeout(function() {
				return;
			}, this._WAITTIME);
		},

        loadSounds : function(){
			if (this.shooSound.readyState !== 4) {
                this.log.debug('loading sounds');
				this.shooSound.load();
			}
        }
	};

    h5.core.expose(pumpController);
	// id="container"である要素にコントローラをバインド
	//h5.core.controller('#container', pumpController);
});
