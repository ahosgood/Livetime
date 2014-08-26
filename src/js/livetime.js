/**
 * ================================================================================
 * LiveTime
 * --------------------------------------------------------------------------------
 * Author:      Andrew Hosgood
 * Version:     1.0.0
 * Date:        27/05/2014
 * ================================================================================
 */

(
	function( $ ) {
		try {
			if( window.jQuery ) {

				$.fn.livetime = function( objUserOptions ) {
						var objOptions = $.extend( {}, $.fn.livetime.objDefaultOptions, objUserOptions ),
						fltYearDays = 356.2425,
						intMonthSeconds = ( fltYearDays / 12 ) * 86400,
						prettyAge = function( intSecondsDifference ) {
								var strOut = '',
										blFuture = intSecondsDifference < 0;

								if( intSecondsDifference < 60 ) {
									if( objOptions.justnow
											&& !blFuture
											&& intSecondsDifference < 10 ) {
										return 'Just now';
									} else {
										return blFuture ? 'In a moment' : 'A moment ago';
									}
								} else if( intSecondsDifference < 120 ) {
									return ( blFuture ) ? 'In an minute' : 'A minute ago';
								} else if( intSecondsDifference < 3600 ) {
									strOut = Math.floor( intSecondsDifference / 60 ) + ' minutes';
								} else if( intSecondsDifference < 7200 ) {
									return ( blFuture ) ? 'In an hour' : 'An hour ago';
								} else if( intSecondsDifference < 86400 ) {
									strOut = Math.floor( intSecondsDifference / 3600 ) + ' hours';
								} else if( intSecondsDifference < 172800 ) {
									return ( blFuture ) ? 'Tomorrow' : 'Yesterday';
								} else if( intSecondsDifference < intMonthSeconds ) {
									strOut = Math.floor( intSecondsDifference / 86400 ) + ' days';
								} else if( intSecondsDifference < intMonthSeconds * 2 ) {
									return ( blFuture ) ? 'In a month' : 'A month ago';
								} else if( intSecondsDifference < fltYearDays * 86400 ) {
									strOut = Math.floor( intSecondsDifference / intMonthSeconds ) + ' months';
								} else if( intSecondsDifference < fltYearDays * 86400 * 2 ) {
									return ( blFuture ) ? 'In a year' : 'A year ago';
								} else {
									strOut = Math.floor( intSecondsDifference / ( fltYearDays * 86400 ) ) + ' years';
								}

								return ( blFuture ) ? 'In ' + strOut : strOut + ' ago';
							},
						setTicker = function( jqoTime ) {
								var intSecondsDifference = Math.floor( ( ( new Date() ).getTime() / 1000 ) - jqoTime.data( 'starttime' ) ),
								intAbsSecondsDifference = Math.abs( intSecondsDifference );

								jqoTime.text( prettyAge( intSecondsDifference ) );

								for( var intTimeoutIndex in arrTimeouts ) {
									if( arrTimeouts[intTimeoutIndex] <= objOptions.maxtick ) {
										if( intAbsSecondsDifference < arrTimeouts[intTimeoutIndex] ) {
											setTimeout(
												function() {
													setTicker( jqoTime );
												}, arrTimeouts[intTimeoutIndex] * 1000
											);

											break;
										}
									} else {
										break;
									}
								}
							},
						arrTimeouts = [60, 120, 3600, 7200, 86400, 172800, intMonthSeconds, intMonthSeconds * 2, fltYearDays * 86400, fltYearDays * 86400 * 2];

						if( objOptions.justnow ) {
							arrTimeouts.unshift( 10 );
						}

						return this.each(
							function() {
								var jqoThisTime = $( this ),
								strThisNodeName = jqoThisTime[0].nodeName.toLowerCase(),
								datStart;

								if( strThisNodeName === 'time' ) {
									if( jqoThisTime.attr( 'datetime' ) ) {
										datStart = new Date( jqoThisTime.attr( 'datetime' ) );
									} else {
										datStart = new Date( jqoThisTime.text() );
									}
								} else {
									datStart = new Date( jqoThisTime.text() );
									//LOG - BAD IDEA
								}

								jqoThisTime.data( 'starttime', datStart.getTime() / 1000 );

								setTicker( jqoThisTime );
							}
						);
					},
				$.fn.livetime.objDefaultOptions = {
						justnow: true,
						maxtick: 86400
					};
			} else {
				throw 'LiveTime requires jQuery to run';
			}
		} catch( err ) {
			if( window.console ) {
				if( window.console.error ) {
					console.error( err );
				} else if( window.console.log ) {
					console.log( err );
				}
			}
		}
	}
)( jQuery );