(function() {
	var controller = {
		__name: 'sample.AppPurchaseManagerController',

		_accordionPanelController: h5.ui.components.AccordionPanel.AccordionPanelController,
		
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);
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