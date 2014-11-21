/*
 * Copyright (C) 2014 NS Solutions Corporation
 */
$(function() {

	var managerName = 'IndicatorManager';
	var namespace = 'geo'
	var manager = h5.core.data.createManager(managerName, namespace);

	var descripter = {

		name: 'IndicatorModel',

		schema: {

			id: {
				id: true,
			},

			percent: {
				type: 'integer',
				defaultValue: 0
			}
		}


	};

	manager.createModel(descripter);
});