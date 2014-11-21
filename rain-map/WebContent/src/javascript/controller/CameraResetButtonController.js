/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
(function($) {
	/**
	 * カメラをデフォルトの状態に戻すボタンのコントローラ
	 */
	var CameraResetButtonController = {

		__name: 'geo.CameraResetButtonController',

		'{rootElement} click' : function(context, $el) {
			this.trigger('cameraResetClicked', null);
		}

	};

	h5.core.expose(CameraResetButtonController);
})(jQuery)