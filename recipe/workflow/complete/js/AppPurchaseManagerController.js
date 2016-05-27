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
		_detailController: sample.DetailController,

		__meta: {
			_treeViewController: {
				rootElement: '.shortcut'
			},
			_gridViewerController: {
				rootElement: '.gridViewer'
			},
			_detailController: {
				rootElement: '.detail'
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
		//---------------------
		// イベントハンドラ
		//---------------------
		'.shortcut selected': function(ctx) {
			var selected = ctx.evArg;
			if (selected === 'all') {
				this._gridViewerController.setData(this._appLogic.searchPurchaseDatas());
				return;
			}
			if (selected.indexOf('*') !== -1) {
				var t = selected.split('*');
				var colNum = parseInt(t[1]);
				// 10000*10000のグリッド表示
				this._gridViewerController.setData(this._appLogic.searchPurchaseDatas({
					mass: true
				}), colNum);
				return;
			}
			if (selected.indexOf('.') === -1) {
				// ディレクトリの場合は何もしない
				return;
			}
			// ショートカットからクエリ作成
			var keyVals = selected.split(',');
			var query = {};
			for (var i = 0, l = keyVals.length; i < l; i++) {
				var keyVal = keyVals[i].split('.');
				query[keyVal[0]] = keyVal[1];
			}
			this._gridViewerController.setData(this._appLogic.searchPurchaseDatas(query));
		},

		'.gridViewer showDetail': function(ctx) {
			var id = ctx.evArg;
			if (!id) {
				return;
			}
			var isMass = ($.isArray(id) ? id[0] : id).indexOf('_') === '0';
			var data = this._appLogic.getPurchaseById(id);
			this._detailController.setData(data, isMass);
		},

		'{window} resize': function() {
			this._accordionPanelController.refresh();
		},

		'{rootElement} confirmPurchase': function(ctx) {
			var ids = ctx.evArg.ids;
			var promise = this._appLogic.confirmByIds(ids);
			this.indicator({
				promises: promise
			}).show();
			promise.done(this.own(function(datas) {
				this._detailController.confirmExecuted(datas);
				this._gridViewerController.refresh();
				alert(datas.length + '件の申請を承認しました');
			}));
		},

		'{rootElement} boxSizeChange': function(ctx) {
			if ($(ctx.event.target).find('.gridViewer').length) {
				// gridViewerを持つボックスサイズ変更ならrefresh
				this._gridViewerController.refresh();
			}
			if ($(ctx.event.target).find('.detailScroll').length) {
				this._detailController.refresh();
			}
		}
	//---------------------
	// メソッド
	//---------------------
	};
	h5.core.expose(controller);
})();