(function($) {
	var DEFAULT_NUM = 1000;
	var NUM_PER_PAGE = 10;
	var controller = {
		__name: 'sample.PageController',
		currentList: null,
		currentPageIndex: null,
		currentSortCondition: null,
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
			this.currentList.sort(function(a, b) {
				if (a[prop] > b[prop]) {
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
				list: list
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