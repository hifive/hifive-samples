/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 * データファイルを読み込むためのロジック
	 * 単にファイルの内容を文字列として取得
	 */
	var LoadDataLogic = {

		__name: 'geo.LoadDataLogic',

		loadData: function(url) {
			var request = new XMLHttpRequest();
			request.open("GET", url, false);
			request.send();

			var text = request.responseText;
			return text;
		}
	};

	h5.core.expose(LoadDataLogic);

})(jQuery);