(function() {
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
	 * ワークフロー管理アプリ
	 *
	 * @class
	 * @name sample.AppPurchaseManagerController
	 */
	var controller = {
		__name: 'sample.AppPurchaseManagerController',

		//---------------------
		// 子コントローラ
		//---------------------
		/**
		 * レイアウト管理コントローラ
		 *
		 * @type Controller
		 * @memberOf sample.AppPurchaseManagerController
		 */
		_accordionPanelController: h5.ui.components.AccordionPanel.AccordionPanelController,

		_treeViewController: sample.TreeViewController,
		_gridViewerController: sample.GridViewerController,

		__meta: {
			_treeViewController: {
				rootElement: '.shortcut'
			},
			_gridViewerController: {
				rootElement: '.gridViewer'
			}
		},

		//---------------------
		// ロジック
		//---------------------
		_appLogic: sample.AppPurchaseManagerLogic,

		//---------------------
		// ライフサイクル
		//---------------------
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);
		},

		__ready: function() {
			// ツリービュー(エクスプローラ)にデータを設定
			this._treeViewController.setTreeData(this._appLogic.getShortcutTree());
			this._gridViewerController.setData(this._appLogic.searchPurchaseDatas());
		},

		__unbind: function() {
			$(this.rootElement).empty();
		},

		'{window} resize': function() {
			this._accordionPanelController.refresh();
		},

		'{rootElement} boxSizeChange': function(ctx) {
			if ($(ctx.event.target).find('.gridViewer').length) {
				// gridViewerを持つボックスサイズ変更ならrefresh
				this._gridViewerController.refresh();
			}
		}
	//---------------------
	// メソッド
	//---------------------
	};
	h5.core.expose(controller);
})();