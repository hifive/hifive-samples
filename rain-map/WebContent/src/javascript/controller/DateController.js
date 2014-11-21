/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 * 日付を表示するinputのコントローラ
	 */
	var DateController = {

		__name: 'geo.DateController',

		setDate: function(date) {
			var $root = $(this.rootElement);
			$root.val(date);
		},

		'{rootElement} change': function(context, $el) {
			var value = $el.val();
			this.trigger('dateChanged', {date: value});
		}
	};

	h5.core.expose(DateController);
})(jQuery);