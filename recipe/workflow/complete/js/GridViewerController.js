(function() {
	// =========================================================================
	//
	// 定数の定義
	//
	// =========================================================================
	var datagrid = h5.ui.components.datagrid;
	var cellFormatter = datagrid.view.dom.cellFormatter;
	var changeHandler = datagrid.view.dom.changeHandler;

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
	 * 検索コントローラ
	 *
	 * @class
	 * @name sample.GridViewerController
	 */
	var controller = {
		__name: 'sample.GridViewerController',

		//---------------------
		// 子コントローラ
		//---------------------
		_gridWrapperController: sample.grid.GridWrapperController,

		/**
		 * フィルタ用フォームとグリッドを分けるためのDividedBox
		 */
		_innerDividedBoxController: h5.ui.components.DividedBox.DividedBox,

		__meta: {
			_innerDividedBoxController: {
				rootElement: '.innerDividedBox'
			},
			_gridWrapperController: {
				rootElement: '.grid'
			}
		},

		//---------------------
		// ロジック
		//---------------------

		//---------------------
		// メンバ
		//---------------------
		_param: null,

		//---------------------
		// ライフサイクル
		//---------------------
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);
		},

		__ready: function() {
			this._innerDividedBoxController.hideDivider(0);
			this.refresh();
		},

		__unbind: function() {
			this.empty();
		},

		//---------------------
		// イベントハンドラ
		//---------------------
		'{window} resize': function() {
			this.refresh();
		},

		'.filterForm change': function(ctx, $el) {
			var filter = {};
			$el.find('select').each(function() {
				var $this = $(this);
				if ($this.val()) {
					filter[$this.attr('name')] = $this.val();
				}
			});
			this._gridWrapperController.filter(filter);
		},

		'{rootElement} changeGridDataLengthChange': function(ctx) {
			var length = ctx.evArg;
			this.$find('.gridDataLength').text(length);
		},

		//---------------------
		// メソッド
		//---------------------
		/**
		 * @param {Array|Promise}
		 * @param {boolean} isMass グリッド動作確認用に大量ダミーデータかどうか
		 */
		setData: function(data, dummyColNums) {
			if (h5.async.isPromise(data)) {
				var indicator = this.indicator();
				indicator.show();
				data.done(this.own(function(d) {
					this.setData(d, dummyColNums);
					indicator.hide();
				}));
				return;
			}
			this._gridWrapperController.setData(data, dummyColNums);
			this.$find('.dataLength').text(data.length);
		},

		refresh: function() {
			this._innerDividedBoxController.refresh();
			this._gridWrapperController.refresh();
		}
	};
	h5.core.expose(controller);
})(jQuery);
