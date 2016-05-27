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
	 * ツリービューコントローラ
	 *
	 * @class
	 * @name sample.TreeViewController
	 */
	var controller = {
		__name: 'sample.TreeViewController',

		//---------------------
		// 子コントローラ
		//---------------------

		//---------------------
		// ロジック
		//---------------------

		//---------------------
		// メンバ
		//---------------------
		_$tree: null,
		_currentSelected: null,

		//---------------------
		// ライフサイクル
		//---------------------
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);

			// jstreeのターゲットを設定
			this._$tree = this.$find('.jstree');
		},

		//---------------------
		// イベントハンドラ
		//---------------------
		'{this._$tree} changed.jstree': function(ctx) {
			var data = ctx.evArg;
			var selected = data.selected[0];
			if (selected === this._currentSelected) {
				return;
			}
			this._currentSelected = selected;
			this.trigger('selected', selected);
		},

		//---------------------
		// メソッド
		//---------------------
		setTreeData: function(dataOrPromise, opt) {
			if (h5.async.isPromise(dataOrPromise)) {
				var indicator = this.indicator().show();
				dataOrPromise.done(this.own(function(treeData) {
					this._setTreeData(treeData, opt);
					indicator.hide();
				}));
			} else {
				this._setTreeData(dataOrPromise, opt);
			}
		},

		_setTreeData: function(treeData, opt) {
			// TODO 各オプションは設定可能
			opt = opt || {};
			this._$tree.jstree({
				core: {
					animation: opt.animation || 0,
					multiple: opt.multiple || false,
					data: treeData
				},
				themes: opt.themes || {
					stripes: true
				}
			});
		}
	};
	h5.core.expose(controller);
})(jQuery);