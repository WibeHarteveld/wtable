
jQuery(document).ready(function($) {
	'use strict';

	var getTheadThContent = function (table) {
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
				polisName = $.trim( th.innerHTML );
				polisNames.push( polisName );
			}
		}

		return polisNames;
	},

	// Set each td content
	toggleTdSpan = function ( tbodyTrs, nodeContent ) {
		var i, j, length,
		trChild,
		tdNum,
		thInjected;

		// Set optional nodeContent
		nodeContent = (typeof nodeContent === 'undefined') ? false : nodeContent;

		// Iterate over each tr
		for (i = 0, length = tbodyTrs.length; i < length; i++) {
			tdNum = 0;

			// Iterate over each td in tr
			for (j = 0, length = tbodyTrs[i].children.length; j < length; j++) {
				trChild = tbodyTrs[i].children[j];

				// Only td's go through
				if ( trChild.tagName !== 'TH' ) {
					thInjected = $(trChild).find('.th-injected');

					// Add or remove div in td (with thead th content)
					if ( nodeContent && thInjected.length === 0 ) {
						trChild.innerHTML = '<div aria-hidden="true" class="th-injected">' +
							nodeContent[ tdNum ] + '</div>' + trChild.innerHTML;
					} else if ( thInjected.length !== 0 ) {
						trChild.removeChild( thInjected[0] );
					}

					tdNum += 1;
				}
			}
		}
	},

	i, length,
	table = $('.table.reflow'),
	tbodyTrs = table.find('> tbody > tr'),
	tdWithColspan = table.find('td[colspan]'),
	curTdWithColspan,
	colspanNum,
	theadThsContent = getTheadThContent( table ),
	mediaQueryBreakpoint = '767px',
	mediaQueryIsSet = false;

	// Initiate table reflow when media query breakpoint is reached
	if( Modernizr.mq('(max-width: ' + mediaQueryBreakpoint + ')') ) {
		// Insert span tags with th content in each td
		toggleTdSpan( tbodyTrs, theadThsContent );

		mediaQueryIsSet = true;
	}

	// Add an event listener for checking browser resizing
	$(window).on('resize', function() {

		// Check if media query breakpoint is reached
		if( Modernizr.mq('(max-width: ' + mediaQueryBreakpoint + ')') ) {

			// Assuring that toggleTdSpan will be invoked only once
			if ( !mediaQueryIsSet ) {
				// Add div .th-injected for each td
				toggleTdSpan( tbodyTrs, theadThsContent );

				mediaQueryIsSet = true;
			}
		}
		// Assuring that toggleTdSpan will be invoked only once
		else if ( mediaQueryIsSet ) {

			// Remove div .th-injected for each td
			toggleTdSpan( tbodyTrs );

			mediaQueryIsSet = false;
		}
	});







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
