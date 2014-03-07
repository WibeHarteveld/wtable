
jQuery(document).ready(function($) {
	'use strict';

	var i, length,
	table = $('.table.reflow'),
	tbodyTrs = table.find('> tbody > tr'),
	tdWithColspan = table.find('td[colspan]'),
	curTdWithColspan,
	colspanNum,
	tdDataAttributes,

	getPolisNames = function (table) {
		var i, length, th,
		tableTheadThs = table.find('> thead > tr > th'),
		polisName = '',
		polisNames = [];

		// If table thead th's found set a data-attribute for each td with a polisName
		// from thead.
		if ( !tableTheadThs ) { return; }

		for (i = 0, length = tableTheadThs.length; i < length; i++) {
			th = tableTheadThs[i];

			// if th is not empty, push polis name in polisnames array
			if ( th.childNodes.length !== 0 ) {
				polisName = $.trim( th.childNodes[0].nodeValue );
				polisNames.push( polisName );
			}
		}

		return polisNames;
	},

	// Set each td with a data-attribute polis to set polis names in css
	setDataAttributes = function (tbodyTrs, dataAttributeArray) {
		var i, j, length,
		trChild,
		tdNum;

		// Iterate over each tr
		for (i = 0, length = tbodyTrs.length; i < length; i++) {
			tdNum = 0;

			// Iterate over each td in tr
			for (j = 0, length = tbodyTrs[i].children.length; j < length; j++) {
				trChild = tbodyTrs[i].children[j];

				// Only td's go through
				if ( trChild.tagName !== 'TH' ) {
					console.log(tdNum);
					$(trChild).attr( 'data-polis', dataAttributeArray[ tdNum ] );
					tdNum += 1;
				}
			}
		}
	};

	tdDataAttributes = getPolisNames( table );
	setDataAttributes( tbodyTrs, tdDataAttributes );

	// Set for each td a data-polis attr
	// for (i = 0, length = td.length; i < length; i++) {
	// 	$(td).attr('data-polis', '')
	// }

	// Iterate over each td that has a colspan attribute set
	for (i = 0, length = tdWithColspan.length; i < length; i++) {
		curTdWithColspan = $(tdWithColspan[i]);

		// Get colspan number
		colspanNum = curTdWithColspan.prop('colspan');


		// Set height on td

		// Set content on td:before
	}
});
