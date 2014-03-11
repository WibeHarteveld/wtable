;(function ( $, window, document, undefined ) {
	'use strict';

	// Create the defaults once
	var pluginName = 'wtable',
	defaults = {
		mediaQuery: '(max-width: 991px)' // $screen-xs-max = 767px | $screen-sm-max = 991px
	};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element   = element;
		this.settings  = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name     = pluginName;
		this.init();
	}

	Plugin.prototype = {

		init: function () {

			var table        = $(this.element),
			tbodyTrs         = table.find('> tbody > tr'),
			theadThs         = table.find('> thead > tr').children(0),
			theadThsContent  = this.getCellContent( theadThs ),
			mediaQueryIsSet  = false,
			that             = this;

			// Initiate table reflow when media query breakpoint is reached
			if( Modernizr.mq( this.settings.mediaQuery ) ) {
				// Insert span tags with th content in each td
				this.injectDiv( tbodyTrs, theadThsContent );

				mediaQueryIsSet = true;
			}

			// Add an event listener for checking browser resizing
			$(window).on('resize', function() {

				// Check if media query breakpoint is reached
				if( Modernizr.mq( that.settings.mediaQuery ) ) {

					// Assuring that injectDiv will be invoked only once
					if ( !mediaQueryIsSet ) {
						// Add div .th-injected for each td
						that.injectDiv( tbodyTrs, theadThsContent );

						mediaQueryIsSet = true;
					}
				}
				// Assuring that injectDiv will be invoked only once
				else if ( mediaQueryIsSet ) {

					// Remove div .th-injected for each td
					that.injectDiv( tbodyTrs );

					mediaQueryIsSet = false;
				}
			});
		},

		getCellContent: function ( cellParents ) {
			var i, length,
			cell,
			cellContent,
			cellContentArray = [];

			// If table cells not found, exit functions
			if ( !cellParents ) { return; }

			// If table cells found, push the content of each cell in an array
			for ( i = 0, length = cellParents.length; i < length; i++ ) {
				cell = cellParents[i];

				cellContent = $.trim( cell.innerHTML );
				cellContentArray.push( cellContent );
			}

			return cellContentArray;
		},

		// Set each tbody > td content
		injectDiv: function ( tbodyTrs, nodeContent ) {
			var i, j, k, iLen, jLen, kLen,
			trChild,
			thNum,
			colNum,
			thInjected,
			thInjectedContent;

			// Set optional nodeContent
			nodeContent = (typeof nodeContent === 'undefined') ? false : nodeContent;

			// Iterate over each tbody > tr
			for (i = 0, iLen = tbodyTrs.length; i < iLen; i++) {

				// When tr has .extra class, use those th's instead of thead > th's
				if ( $(tbodyTrs[i]).hasClass('extra') ) {
					nodeContent = this.getCellContent( $(tbodyTrs[i]).children(0) );
				}

				// Reset thNum
				thNum = 0;

				// Iterate over each td in tbody > tr
				for (j = 0, jLen = $( tbodyTrs[i] ).children().length; j < jLen; j++) {
					trChild = $( tbodyTrs[i] ).children()[j];

					// Only td's that are not empty will be processed
					if ( trChild.tagName !== 'TH' ) {

						// If tbody > td has a colspan attr, set multiple thead > th's in
						// tbody > td based on colspan number.
						if ( trChild.hasAttribute('colspan') ) {

							thInjectedContent = '';

							// Get value of colspan
							colNum = trChild.getAttribute('colspan');

							// Iterate over each col number and append thead > td's content
							// to current tbody > td
							for ( k = 0, kLen = colNum; k < kLen; k++ ) {

								// Append thInjectedContent
								thInjectedContent += '<div>' + nodeContent[ j + k ] + '</div>';

								thNum += 1;
							}
						// If td has no colspan attr, append only one thead's > td content to
						// the injected div (.th-injected).
						} else {
							thInjectedContent = nodeContent[ thNum ];

							thNum += 1;
						}

						// Find .th-injected if already exists
						thInjected = $(trChild).find('.th-injected');

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
					} else {
						//
						thNum += 1;
					}
				}
			}
		}

	};

	// Plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options ) {
		this.each(function() {
			if ( !$.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
			}
		});

		// chain jQuery functions
		return this;
	};

})( jQuery, window, document );
