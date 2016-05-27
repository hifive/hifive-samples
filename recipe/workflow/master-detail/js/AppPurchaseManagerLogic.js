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
	// ロジックの定義
	//
	// =========================================================================

	/**
	 * ワークフロー管理アプリロジック
	 *
	 * @class
	 * @name sample.AppPurchaseManagerLogic
	 */
	var controller = {
		__name: 'sample.AppPurchaseManagerLogic',

		//---------------------
		// 子ロジック
		//---------------------

		//---------------------
		// メソッド
		//---------------------
		getShortcutTree: function() {
			return sample.util.ajax(sample.consts.url.FILE_TREE);
		},
		searchPurchaseDatas: function(query) {
			return sample.util.ajax(sample.consts.url.SEARCH_WORKFLOW, query);
		},
		getPurchaseById: function(id) {
			return sample.util.ajax(sample.consts.url.WORKFLOW, {
				id: id
			});
		},
		confirmByIds: function(ids) {
			return sample.util.ajax(sample.consts.url.CONFIRM, {
				ids: ids
			});
		}
	};
	h5.core.expose(controller);
})();