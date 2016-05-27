(function() {
	var controller = {
		__name: 'sample.AppPurchaseManagerController',

		_accordionPanelController: h5.ui.components.AccordionPanel.AccordionPanelController,

		_treeViewController: sample.TreeViewController,
		
		__meta: {
			_treeViewController: {
				rootElement: '.shortcut'
			}
		},
		
		_appLogic: sample.AppPurchaseManagerLogic,
		
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);
		},

		__ready: function() {
			// ツリービュー(エクスプローラ)にデータを設定
			this._treeViewController.setTreeData(this._appLogic.getShortcutTree());
		},
		
		'{window} resize': function() {
			this._accordionPanelController.refresh();
		},

		'{rootElement} boxSizeChange': function(ctx) {
		}
	//---------------------
	// メソッド
	//---------------------
	};
	h5.core.expose(controller);
})();