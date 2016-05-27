(function() {
	/**
	 * 共通関数
	 *
	 * @name sample.const
	 */
	h5.u.obj.expose('sample.util', {
		//--------------------------------------------
		// publicメソッド
		//--------------------------------------------
		/**
		 * コントローラのデフォルトビューを設定
		 * <p>
		 * コントローラ名と同じテンプレートIDがあることが前提
		 * </p>
		 *
		 * @memberOf sample.util
		 */
		createDefaultControllerView: function(ctrl, param) {
			ctrl.view.update(ctrl.rootElement, ctrl.__name, param);
		},

	//--------------------------------------------
	// privateメソッド
	//--------------------------------------------
	});
})();