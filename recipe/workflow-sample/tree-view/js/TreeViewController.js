(function() {
	var controller = {
		__name: 'sample.TreeViewController',

		_$tree: null,
		_currentSelected: null,

		__init: function() {
			sample.util.createDefaultControllerView(this);
			this._$tree = this.$find('.jstree');
		},

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