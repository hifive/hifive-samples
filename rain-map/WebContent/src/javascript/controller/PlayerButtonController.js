/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	var PLAYBUTTONSELECTOR=  '#playButton';
	var PAUSEBUTTONSELECTOR = '#pauseButton';

	/**
	 * Playerのボタン
	 */
	var PlayerButtonController = {

		__name: 'geo.PlayerButtonController',


		'{rootElement} click' : function(context, $el) {
			this.trigger('playerClicked', null);
		},

		switchButtonImage: function(onPlayFlg) {
			if (onPlayFlg ) {
				this.$find(PLAYBUTTONSELECTOR).css('display', 'none');
				this.$find(PAUSEBUTTONSELECTOR).css('display', 'inline');
			}
			else {
				this.$find(PAUSEBUTTONSELECTOR).css('display', 'none');
				this.$find(PLAYBUTTONSELECTOR).css('display', 'inline');
			}
		}
	};
	h5.core.expose(PlayerButtonController);
})(jQuery);