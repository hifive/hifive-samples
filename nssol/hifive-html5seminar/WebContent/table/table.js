(function($) {
	var DEFAULT_NUM = 1000;
	var NUM_PER_PAGE = 10;
	var controller = {
		__name: 'sample.PageController',
		currentList: null,
		currentPageIndex: null,
		currentSortCondition: null,
		changeData: {},
		__init: function() {
			this.currentList = util.getData(DEFAULT_NUM);
			this.$find('[name="list-num"]').val(DEFAULT_NUM);
			this.refreshTable();
		},
		'.create click': function(ctx, $el) {
			var num = parseInt(this.$find('[name="list-num"]').val());
			this.currentList = util.getData(num);
			if (this.currentPageIndex !== null) {
				this.currentPageIndex = 0;
			}
			this.refreshTable();
		},
		'.sort click': function(ctx, $el) {
			var desc = $el.data('sort-order') === 'desc';
			var prop = $el.data('sort-prop') || 'id';
			this.currentSortCondition = {
				desc: desc,
				prop: prop
			};
			this.sort(desc, prop);
		},
		'.editable dblclick': function(ctx, $el) {
			var id = $el.closest('[data-row-id]').data('row-id');
			var prop = $el.data('edit-prop');
			// input要素を表示
			this.$currentEditInput = $('<input class="edit-input form-control" data-edit-prop="'
					+ prop + '" type="text">');
			$el.empty().append(this.$currentEditInput);
			var val = null;
			for (var i = 0, l = this.currentList.length; i < l; i++) {
				if (id === this.currentList[i].id) {
					val = this.currentList[i][prop];
					break;
				}
			}
			this.$currentEditInput.focus().val(val);
		},
		'.edit-input keydown': function(ctx, $el) {
			// エンターキーで確定
			if (ctx.event.keyCode !== 13) {
				return;
			}
			this.editDone();
		},
		'{document} click': function(ctx) {
			// セル編集中なら中断
			if (this.$currentEditInput && ctx.event.target !== this.$currentEditInput[0]) {
				this.editDone();
			}
		},
		'[name="paging"] change': function(ctx, $el) {
			var on = $el.prop('checked');
			if (on) {
				this.enablePaging();
				this.$find('.paging-ctrls').addClass('on');
			} else {
				this.disablePaging();
				this.$find('.paging-ctrls').removeClass('on');
			}
		},
		'.paging-ctrls button click': function(ctx, $el) {
			var lastPageIndex = parseInt((this.currentList.length - 1) / NUM_PER_PAGE);
			switch ($el.data('page-link')) {
			case 'first':
				this.currentPageIndex = 0;
				break;
			case 'last':
				this.currentPageIndex = lastPageIndex;
				break;
			case 'next':
				if (this.currentPageIndex === lastPageIndex) {
					return;
				}
				this.currentPageIndex++;
				break;
			case 'prev':
				if (this.currentPageIndex === 0) {
					return;
				}
				this.currentPageIndex--;
			}
			this.refreshTable(this.currentPageIndex);
		},
		sort: function(desc, prop) {
			var changeData = this.changeData;
			this.currentList.sort(function(a, b) {
				var aId = a.id;
				var bId = b.id;
				var aVal = changeData[aId] && changeData[aId][prop] ? changeData[aId][prop]
						: a[prop];
				var bVal = changeData[bId] && changeData[bId][prop] ? changeData[bId][prop]
						: b[prop];

				if (aVal > bVal) {
					return desc ? -1 : 1;
				} else {
					return desc ? 1 : -1;
				}
			});
			this.refreshTable();
		},
		enablePaging: function() {
			this.currentPageIndex = 0;
			this.refreshTable();
		},
		disablePaging: function() {
			this.currentPageIndex = null;
			this.refreshTable();
		},
		editDone: function() {
			var $input = this.$currentEditInput;
			var id = $input.closest('[data-row-id]').data('row-id');
			var prop = $input.data('edit-prop');
			var val = $input.val();
			var oldVal = null;
			for (var i = 0, l = this.currentList.length; i < l; i++) {
				if (id === this.currentList[i].id) {
					oldVal = this.currentList[i][prop];
					break;
				}
			}
			var $parent = $input.parent();
			$input.remove();
			this.$currentEditInput = null;
			$parent.text(val);
			if (val === oldVal) {
				return;
			}
			this.changeData[id] = this.changeData[id] || {};
			this.changeData[id][prop] = val;
		},
		refreshTable: function() {
			var list;
			if (this.currentPageIndex !== null) {
				var dataIndex = this.currentPageIndex * NUM_PER_PAGE;
				list = this.currentList.slice(dataIndex, dataIndex + NUM_PER_PAGE);
			} else {
				list = this.currentList;
			}
			var $tableWrapper = this.$find('.table-wrapper');
			this.view.update($tableWrapper, 'table', {
				list: list,
				changeData: this.changeData
			});
			if (this.currentPageIndex === null) {
				this.$find('.main-table').addClass('scrollable');
				return;
			}
			this.$find('.main-table').removeClass('scrollable');
			var isFirstPage = this.currentPageIndex === 0;
			var isLastPage = this.currentPageIndex === parseInt((this.currentList.length - 1)
					/ NUM_PER_PAGE);
			var $pagingCtrls = this.$find('.paging-ctrls');
			$pagingCtrls.find('[data-page-link="first"]').prop('disabled', isFirstPage);
			$pagingCtrls.find('[data-page-link="prev"]').prop('disabled', isFirstPage);
			$pagingCtrls.find('[data-page-link="next"]').prop('disabled', isLastPage);
			$pagingCtrls.find('[data-page-link="last"]').prop('disabled', isLastPage);
		}
	};
	h5.core.expose(controller);
})(jQuery);