
jQuery(document).ready(function($) {
	'use strict';

	var getTheadThContent = function (table) {
		var i, length, th,
		tableTheadThs = table.find('> thead > tr > th'),
		polisName = '',
		polisNames = [];

		// If table thead th's found set a data-attribute for each td with a polis name
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
		var i, j, k, iLen, jLen, kLen,
		trChild,
		tdNum,
		colNum,
		thInjected,
		thInjectedContent;

		// Set optional nodeContent
		nodeContent = (typeof nodeContent === 'undefined') ? false : nodeContent;

		// Iterate over each tbody > tr
		for (i = 0, iLen = tbodyTrs.length; i < iLen; i++) {
			tdNum = 0;

			// Iterate over each td in tbody > tr
			for (j = 0, jLen = tbodyTrs[i].children.length; j < jLen; j++) {
				trChild = tbodyTrs[i].children[j];

				// Only td's will be processed
				if ( trChild.tagName !== 'TH' ) {
					thInjected = $(trChild).find('.th-injected');

					// If tbody > td has a colspan attr, set multiple thead > th's in
					// tbody > td based on colspan number.
					if ( trChild.hasAttribute('colspan') ) {

						thInjectedContent = '';

						// Get value of colspan
						colNum = trChild.getAttribute('colspan');
						console.log(colNum);

						// Iterate over each col number and append thead > td's content
						// to current tbody > td
						for ( k = 0, kLen = colNum; k < kLen; k++ ) {

							// Append thInjectedContent
							thInjectedContent += '<div>' + nodeContent[ (j - 1) + k ] + '</div>';

						}
					// If td has no colspan attr, append only one thead's > td content to
					// the injected div (.th-injected).
					} else {
						thInjectedContent = nodeContent[ tdNum ];
					}

					// If nodeContent argument is passed with function, add div .th-injected in td
					// which include thead > th content).
					if ( nodeContent && thInjected.length === 0 ) {
						trChild.innerHTML = '<div aria-hidden="true" class="th-injected">' +
							thInjectedContent + '</div>' + trChild.innerHTML;
					}
					// Else remove injected div element if exists
					else if ( thInjected.length !== 0 ) {
						trChild.removeChild( thInjected[0] );
					}

					tdNum += 1;
				}
			}
		}
	},

	table = $('.table.reflow'),
	tbodyTrs = table.find('> tbody > tr'),
	theadThsContent = getTheadThContent( table ),
	mediaQueryBreakpoint = '991px', // $screen-xs-max = 767px | $screen-sm-max = 991px
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
});
