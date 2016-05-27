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
	 * 詳細表示コントローラ
	 *
	 * @class
	 * @name sample.DetailController
	 */
	var controller = {
		__name: 'sample.DetailController',

		//---------------------
		// 子コントローラ
		//---------------------

		//---------------------
		// ロジック
		//---------------------

		//---------------------
		// メンバ
		//---------------------
		__init: function() {
			// ビューを作成
			sample.util.createDefaultControllerView(this);
		},

		__ready: function() {
			this.refresh();
		},

		//---------------------
		// ライフサイクル
		//---------------------

		//---------------------
		// イベントハンドラ
		//---------------------
		'{window} resize': function() {
			this.refresh();
		},

		'.confirm click': function(ctx, $el) {
			var ids = '' + $el.data('confirm-targets');
			ids = ids.split(',');
			if (!ids.length) {
				return;
			}
			if (!confirm(ids.length + '件のデータを"承認済"にします。よろしいですか？')) {
				return;
			}
			this.trigger('confirmPurchase', {
				ids: ids
			});
		},

		'.openPurchase click': function(ctx, $el) {
			this.$find('.purchaseDetail').removeClass('hidden');
			$el.addClass('hidden');
		},

		//---------------------
		// メソッド
		//---------------------
		setData: function(data) {
			if (h5.async.isPromise(data)) {
				var indicator = this.indicator();
				indicator.show();
				data.done(this.own(function(d) {
					this.setData(d);
					indicator.hide();
				}));
				return;
			}

			var dataAry = $.isArray(data) ? data : [data];
			var details = [];
			for (var i = 0, l = dataAry.length; i < l; i++) {
				var d = dataAry[i];
				details.push({
					id: d.id,
					idText: d.id.indexOf('_') === -1 ? d.id : d.id.slice(1),
					item: d.item,
					status: d.status,
					statusText: sample.util.statusTextMap[d.status],
					applicant: d.applicant,
					dueDate: d.dueDate,
					reason: d.reason,
					priority: d.priority,
					priorityText: sample.util.priorityTextMap[d.priority],
					applicationDate: d.applicationDate
				});
			}
			this.view.update('{rootElement}', 'purchaseDetail', {
				details: details
			});
			this.refresh();
		},

		confirmExecuted: function(datas) {
			// 詳細から、承認したものの表示を修正
			for (var i = 0, l = datas.length; i < l; i++) {
				var data = datas[i];
				var $box = this.$find('.purchaseBox[data-id="' + data.id + '"]');
				$box.addClass('approved');
				$box.find('.statusInfo').text('承認済');
				$box.find('.purchaseDetail').addClass('hidden');
			}
			var $l = this.$find('.notApprovedIdsLength');
			var newLength = parseInt($l.text()) - datas.length;
			$l.text(newLength < 0 ? 0 : newLength);
			if (newLength < 1) {
				this.$find('.confirmForm .confirm').addClass('hidden');
			}
		},

		refresh: function() {
			this.$find('.detailScroll').height(
					$(this.rootElement).parent().height()
							- this.$find('.confirmForm').outerHeight());
		}
	};
	h5.core.expose(controller);
})(jQuery);
