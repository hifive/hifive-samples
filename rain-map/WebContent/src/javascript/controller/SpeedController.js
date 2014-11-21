/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 * 再生速度を調整するコントローラ
	 */
	var SpeedController = {

		__name: 'geo.SpeedController',

		//速度は1から20まで
		_REGEXP: new RegExp('^(20)|(1[0-9])|([1-9])'),

		'{rootElement} change': function() {
			var speed = this.getSpeed();
			this.trigger('speedChanged', {speed: speed});
		},

		getSpeed: function() {
			var speed = this.$find('#speed').val();
			if (!this.validate(speed)) {
				alert('speed should be a numeric between 1 to 20');
				this.setSpeed(1);
				return 1;
			}
			speed = Number(speed);
			return speed;
		},

		setSpeed: function(speed) {
			this.$find('#speed').val(speed).change();
		},

		//1～20までの数値かをチェック
		validate: function(value) {

			if (typeof value === 'number' ) {
				value = value.toString();
			}

			var index = value.search(this._REGEXP);
			if (index === -1) {
				return false;
			}
			else {
				return true;
			}
		},

		'#plus click': function() {
			var speed = this.getSpeed();
			if ( this.validate(speed) ) {
				var validatedSpeed = Number(speed);
				if (validatedSpeed >= 20) {
					alert('speed should be a numeric between 1 to 20');
				}
				else {
					validatedSpeed++;
					this.setSpeed(validatedSpeed);
				}
			}
			else {
				this.setSpeed(1);
			}
		},

		'#minus click': function() {
			var speed = this.getSpeed();
			if ( this.validate(speed) ) {
				var validatedSpeed = Number(speed);
				if (validatedSpeed <= 1) {
					alert('speed should be a numeric between 1 to 20');
				}
				else {
					validatedSpeed--;
					this.setSpeed(validatedSpeed);
				}
			}
			else {
				this.setSpeed(1);
			}
		}
	};

	h5.core.expose(SpeedController);

})(jQuery);