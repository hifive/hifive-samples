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
	 * datagrid部品を使うグリッドコントローラ
	 *
	 * @class
	 * @name sample.grid.DatagridController
	 */
	var controller = {
		__name: 'sample.grid.DatagridController',

		//---------------------
		// 子コントローラ
		//---------------------
		_gridController: datagrid.GridController,

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
		__ready: function() {
			this._createDefaultParam();
		},

		//---------------------
		// イベントハンドラ
		//---------------------
		'{rootElement} gridChangeDataSelect': function() {
			var ids = this._gridController.getSelectedDataIdAll()
			this.trigger('showDetail', ids);
		},

		//------------------ 列入れ替え機能 ------------------//
		'.gridHeaderRowsBox .gridCell h5trackstart': function(context, $el) {
			if ($el.parents('.grid-header-top-left-cells').length !== 0) {
				return;// ヘッダ－カラムは交換させない
			}
			this._selectedHeadderRowIdx = $el.parent().data('h5DynGridColumn') - 2; // ヘッダ分を引いている
		},

		'.gridHeaderRowsBox .gridCell h5trackmove': function(context) {
			this._isMove = true;

			var selector = '[data-h5-dyn-grid-column=' + this._selectedHeadderRowIdx
					+ '] .grid-cell-frame';
			this.$find(selector).addClass('tracking-column');

			this._colsPosArray = this._getColsPos();
			var idx = this._getInterChangeColIdx(context);

			if (idx === this._trackmoveColumnIdx || idx < 2) { // idxがヘッダより左
				return;
			}

			this._trackmoveColumnIdx = idx;

			var selector = '[data-h5-dyn-grid-column=' + idx + '].gridPropertyHeader';

			var $el = this.$find(selector);
			var offset = $el.offset();

			if ($el.length === 0) {
				// 最後列にカラムを移動させるケース
				selector = '[data-h5-dyn-grid-column=' + (idx - 1) + '].gridPropertyHeader';
				$el = this.$find(selector);

				offset = $el.offset();
				offset.left += $el.width();
			}

			var $sign = $('.trackend-sign');
			$sign.removeClass('hidden');
			$sign.offset({
				top: offset.top - 17,
				left: offset.left - 6
			});
		},

		'.gridHeaderRowsBox .gridCell h5trackend': function(context, $el) {
			$('.trackend-sign').addClass('hidden');
			var selector = '[data-h5-dyn-grid-column=' + this._selectedHeadderRowIdx + ']';
			this.$find(selector).removeClass('tracking-column');

			if (this._selectedHeadderRowIdx == null) {
				return;
			}

			if (!this._isMove) {
				return;
			}
			this._isMove = false;

			this._colsPosArray = this._getColsPos();

			var idx = this._getInterChangeColIdx(context);

			this._interChangeColumns(idx);
		},

		//---------------------
		// メソッド
		//---------------------
		filter: function(condition) {
			function filterFunction(data) {
				if (condition.priority && data.priority != condition.priority) {
					return false;
				}
				if (condition.applicantMonth
						&& data.applicationDate.slice(0, 7) != condition.applicantMonth) {
					return false;
				}
				return true;
			}
			this._gridController.search(null, [filterFunction]);
			this._triggerLengthChange();
		},

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
			var dataSource = datagrid.createDataSource({
				idProperty: 'id',
				type: 'local',
				param: data
			});

			// paramを再生成する
			this._createDefaultParam(dummyColNums);

			// FIXME (0,0)にグリッドをスクロール
			this._gridController._viewController._vPos = 0;
			this._gridController._viewController._hPos = 0;

			this._gridController.activate(dataSource, this._param);
			this._gridController.search();
			this._triggerLengthChange();
		},

		refresh: function() {
			this._gridController.refresh();
		},

		_triggerLengthChange: function() {
			this.trigger('changeGridDataLengthChange',
					this._gridController.getDataReferences().length);
		},

		_createDefaultParam: function(dummyColNums) {
			this._param = {
				searcher: {
					type: 'all'
				},
				mapper: {
					type: 'property',
					param: {
						direction: 'vertical',
						visibleProperties: {
							header: ['rowIndex', '_select'],
							main: ['id', 'status', 'priority', 'item', 'price', 'applicant',
									'applicationDate']
						},

						dataDirectionSize: {
							size: 25
						}
					}
				},
				view: {
					type: 'table',
					param: {
						cellClassDefinition: {},
					}
				},

				properties: {
					rowIndex: {
						size: 40,
						sortable: false,
						headerValue: '行番号',
						toValue: function(data, cell) {
							// '行001'の形にフォーマット
							var text = ('00' + cell.index + 1);
							return '行' + text.slice(text.length - 3);
						}
					},
					_select: {
						size: 25,
						enableResize: false,
						formatter: cellFormatter.checkbox(),

						formatter: cellFormatter.checkbox(),
						toValue: function(data, cell) {
							return cell.isSelectedData;
						},
						changeHandler: changeHandler.selectData(),
						headerValue: ''
					},
					id: {
						size: 50,
						sortable: true,
						// FIXME sortの比較関数は文字列ではなく数値比較するよう設定
						headerValue: '#'
					},
					status: {
						sortable: true,
						headerValue: 'ステータス',
						toValue: function(data, cell) {
							return sample.util.statusTextMap[data.status];
						}
					},
					priority: {
						sortable: true,
						headerValue: '優先度',
						toValue: function(data, cell) {
							return sample.util.priorityTextMap[data.priority];
						}
					},
					item: {
						sortable: true,
						headerValue: 'タイトル'
					},
					price: {
						sortable: true,
						headerValue: '金額',
						toValue: function(data, cell) {
							return sample.util.formatInt(data.price);
						}
					},
					applicant: {
						sortable: true,
						headerValue: '申請者'
					},
					applicationDate: {
						sortable: true,
						headerValue: '申請日'
					}
				}
			};
			if (dummyColNums) {
				// ダミー列を追加
				var param = this._param;
				var prefix = 'dummy';
				var orgLength = param.mapper.param.visibleProperties.main.length;
				param.properties.id.toValue = function(data, col) {
					return data.id.slice(1);
				};

				for (var i = 1; i <= dummyColNums - orgLength; i++) {
					var prop = prefix + i;
					// '列001'の形にフォーマット
					var text = ('00' + i);
					text = '列' + text.slice(text.length - 3);
					param.properties[prop] = {
						sortable: true,
						size: 40,
						headerValue: text,
						toValue: (function(t) {
							return function(data) {
								return t.slice(1) + '-' + data.id;
							};
						})(text)
					};
					param.mapper.param.visibleProperties.main.push(prop);
				}
			}
		},

		//--------------- 列入れ替え機能 ---------------//
		/**
		 * 表示されているヘッダーセルのleftとIDを取得する
		 */
		_getColsPos: function() {
			var $td = this.$find('.gridPropertyHeader');
			var array = [];

			$td.each(function() {
				var posLeft = this.getBoundingClientRect().left;
				var colId = $(this).data('h5DynGridColumn');
				array.push({
					left: posLeft,
					id: colId
				});
			});

			return array;
		},
		/**
		 * trackEndのX座標に最も左端が近いセルのインデックスを取得する
		 */
		_getInterChangeColIdx: function(context) {
			var mouseX = context.event.clientX;
			var idx = null;

			for (var i = 0, len = this._colsPosArray.length; i < len; i++) {
				var left = this._colsPosArray[i].left;
				var colId = this._colsPosArray[i].id;

				if (mouseX < left || i === len) {
					idx = colId;
					break;
				}
			}

			if (idx == null) {
				idx = this.$find('.gridPropertyHeader').last().data('h5DynGridColumn') + 1;
			}

			return idx;
		},

		/**
		 * trackStartで選択したセルとtrackEndのX座標に左端が最も近いセルを入れ替える
		 */
		_interChangeColumns: function(idx) {
			var headerColNum = 2;
			idx = idx > headerColNum ? idx : headerColNum;
			var cols = this._param.mapper.param.visibleProperties.main;
			var sCol = cols[this._selectedHeadderRowIdx];// trackStartの発火元のカラム

			// FIXME カラムの入れ替え。外側からパラメータを再定義してやっているが、datagridが対応したらコード修正する
			if (idx < this._selectedHeadderRowIdx + 2) {
				this._selectedHeadderRowIdx += 1;
			}
			if (Math.abs(idx - this._selectedHeadderRowIdx - 2) <= 1) {
				// 入れ替わらない場合
				return;
			}
			cols.splice(idx - 2, 0, sCol);
			cols.splice(this._selectedHeadderRowIdx, 1);
			this._gridController.activate(this._gridController._gridLogic._dataSource, this._param);

			this._gridController.search();
			this._selectedHeadderRowIdx = null;
		}
	};
	h5.core.expose(controller);
})(jQuery);
