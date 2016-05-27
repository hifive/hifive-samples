(function($) {
	// =========================================================================
	//
	// 定数の定義
	//
	// =========================================================================


	// =========================================================================
	//
	// 外部モジュールのキャッシュ
	//
	// =========================================================================

	// =========================================================================
	//
	// コントローラの定義
	//
	// =========================================================================

	/**
	 * デスクトップ風ビューを提供するコントローラ
	 * <p>
	 * 子コントローラにアプリケーションコントローラ(AppXxxxController)を持つ
	 * </p>
	 *
	 * @class
	 * @name sample.PageController
	 */
	var pageController = {

		__name: 'sample.PageController',

		__templates: 'template/sample-template.ejs',

		_currentAppCtrl: null,

		_currentAppName: null,

		_dividedBoxController: h5.ui.components.DividedBox.DividedBox,

		// アプリケーションコントローラ
		// 複数アプリある場合は切り替えられるように動的に管理する
		_appPurchaseManagerController: sample.AppPurchaseManagerController,

		appRootDividedBox: h5.ui.components.DividedBox.DividedBox,

		__meta: {
			_appPurchaseManagerController: {
				rootElement: '.appRoot'
			}
		},

		__postInit: function() {
			// ヘッダ直後のdividerは非表示
			this._dividedBoxController.hideDivider(0);
		},

		'{window} resize': function() {
			this._dividedBoxController.refresh();
		}
	};
	h5.core.expose(pageController);
})(jQuery);