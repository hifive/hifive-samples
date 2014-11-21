/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {

	var IndicatorController = {

		__name: 'geo.IndicatorController',
		indicatorItem: null,
		_indicatorHandler: null,

		__ready: function(context) {

			this._indicatorHandler = this.indicator({});
			var $root = $(this.rootElement);


			//アイテムの生成
			var id = '#' + $root[0].id;
			this.indicatorItem = geo.IndicatorManager.models.IndicatorModel.create( {
				id: id
			});

			var controller = this;
			this.indicatorItem.addEventListener('change', function(ev) {
				var newValue = ev.props['percent'].newValue;
				controller.updateIndicator(newValue);
			});

		},

		showIndicator: function() {
			this._indicatorHandler.show();
		},

		updateIndicator: function(value) {
			this._indicatorHandler.percent(value);
			if (value >= 100) {
				this._indicatorHandler.hide();
			}
		}

	}

	h5.core.expose(IndicatorController);

})(jQuery);