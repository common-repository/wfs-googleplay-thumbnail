/*****
 * wfs_googleplay_thumbnail.js - Javascript file for play thumbnail
 * @version: 1.0 (2013-09-18)
 * @requires: jquery.min.js / jquery-ui.js / perfect-scrollbar-0.4.4.with-mousewheel.min.js
 * @author: WEBFACESCRIPT
 * @website: http://webfacescript.com
*****/

var wfsGooglePlayThumbnail = 
{
	//
	// init functions
	//	
	initWithOptions: function(containerTag, options)
	{
		// remove old tags
		jQuery(containerTag).empty(); 
	
		// start, hide tag
		jQuery(containerTag).css('opacity', 0);
		
		// append tags by options
		wfsGooglePlayThumbnail.appendTags(containerTag, options); 
		
		// after append tags, do final tasks
		wfsGooglePlayThumbnail.initWithExistTags(containerTag);
		
		// end, show tag
		setTimeout(function()
		{
			jQuery(containerTag).css('opacity', 1);
		}, 200);
	},
	
	initWithExistTags: function(containerTag)
	{
		// google thumbnail style
		wfsGooglePlayThumbnail.applyEffectsAndStyles(containerTag);
		
		// scrollbar 
		setTimeout(function()
		{
			wfsGooglePlayThumbnail.appendScrollbar(containerTag);
		}, 1000);
	},
	
	//
	// work with options and tags
	//
	appendTags: function(containerTag, options)
	{
		//
		// functions
		//
		function appendVideos(options)
		{
			var value = '';
			
			for(var i=0; i<options.videos.length; i++)
			{
				var video = options.videos[i];
				var fullURL = wfsGooglePlayThumbnail.getFullURL(video); 
				
				value += 
						'<span class="wfs-details-trailer">'
							+'<span class="wfs-video-image-wrapper">'
								+'<img src="'+video.videoThumbnail+'" class="wfs-video-image">'
							+'</span>'
							+'<span video-embed-src="' + fullURL + '" '
									+'video-width="' + video.width +'" '
									+'video-height="' + video.height +'" '
									+'class="wfs-play-click-target">'
								+'<span class="wfs-play-action-container">'
									+'<span class="wfs-play-action">'
									+'</span>'
								+'</span>'
							+'</span>'
						+'</span>';
			} 
			
			return value;
		}
		
		function appendSmallImages(options)
		{
			var value = '';
			
			for(var i=0; i<options.images.length; i++)
			{
				var image = options.images[i];
				value += '<img src="'+image.small+'" class="wfs-screenshot wfs-clickable" '+(i==options.images.length - 1 ? 'style="margin-right: 0px;"' : '')+'>';
			} 
			
			return value;
		}
		
		function appendLargeImages(options)
		{
			var value = '';
			
			for(var i=0; i<options.images.length; i++)
			{
				var image = options.images[i];
				value += 
						'<div class="wfs-expand-page" style="opacity: 0;">'
							+'<div style="display: inline-block;" class="wfs-screenshot-container">'
								+'<div class="wfs-screenshot-align">'
									+'<div class="wfs-screenshot-align-inner">'
										+'<img src-data="'+image.large+'" class="wfs-full-screenshot wfs-clickable">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>';
			} 
			
			return value;
		}
		
		//
		// append tags
		// 
		jQuery(containerTag).append(
			'<div class="wfs-details-section wfs-screenshots">'
				+'<div class="wfs-details-section-contents">'
					+'<div class="wfs-details-section-body wfs-expandable">'
						+'<div>'
							+'<div class="wfs-expand-pages-container" min-height="'+(options.thumbnailsHeight.trim() == '' ? '353px' :  (parseInt(options.thumbnailsHeight.trim().replace('px', '')) + 4) + 'px') +'" '
																+'max-height="'+ options.expandPagesContainerMaxHeight.trim() +'">'
								+'<div class="wfs-expand-page wfs-scrollbar" style="opacity: 1;">'
									+'<div class="wfs-thumbnails" style="height:'+(options.thumbnailsHeight.trim() == '' ? '349px' : options.thumbnailsHeight.trim())+'">'
										+ appendVideos(options)
										+ appendSmallImages(options)
									+'</div>'
								+'</div>'
								+ appendLargeImages(options)
							+'</div>'
						+'</div>'
						+'<div class="wfs-expand-button wfs-expand-next">'
							+'<div class="wfs-arrow-image-wrapper">'
								+'<div class="wfs-arrow-image">'
								+'</div>'
							+'</div>'
							+'<div class="wfs-play-button">'
								+'<div class="wfs-button-image-wrapper">'
									+'<div class="wfs-button-image">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="wfs-expand-button wfs-expand-prev" style="display: none;">'
							+'<div class="wfs-arrow-image-wrapper">'
								+'<div class="wfs-arrow-image">'
								+'</div>'
							+'</div>'
							+'<div class="wfs-play-button">'
								+'<div class="wfs-button-image-wrapper">'
									+'<div class="wfs-button-image">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="wfs-expand-close wfs-play-button" style="display: none;">'
							+'<div class="wfs-close-image"></div>'
						+'</div>'
						+'<div class="wfs-expand-loading" style="display: none;">'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'); 
	},
	
	applyEffectsAndStyles: function(containerTag)
	{
		//
		// 01. variables
		// 
		var expandPagesContainer = jQuery(containerTag).find('.wfs-expand-pages-container');
		var expandPagesList = jQuery(expandPagesContainer).find('.wfs-expand-page');
		var nextButton = jQuery(containerTag).find('.wfs-expand-button.wfs-expand-next');
		var prevButton = jQuery(containerTag).find('.wfs-expand-button.wfs-expand-prev');
		var closeButton = jQuery(containerTag).find('.wfs-expand-close.wfs-play-button');
		var loadingTag = jQuery(containerTag).find('.wfs-expand-loading');
		var animateTime = 400; 
		var havingThreat = false;
		var videoWidth = 853; // default
		var videoHeight = 480; // default
		var isCheckingResponsive = false;
		
		//
		// 02. functions
		//
		
		// load when clicked, reduce data at the first time
		function loadImage(imageTag)
		{
			var src = jQuery(imageTag).attr('src') + ''; 
			if(src == 'undefined')
				jQuery(imageTag).attr('src', jQuery(imageTag).attr('src-data'));
		}
		
		function expandPagePlay(isNext, curIndex)
		{		
			if(havingThreat == true)
			{
				havingThreat = false;
				return;
			}
			else
				havingThreat = true;
				
			// show loading
			jQuery(loadingTag).css('display', '');
				
			var curExpandPage = jQuery(expandPagesList).filter(function() {
				return jQuery(this).css('opacity') != '0';
			}); 
			var curExpandPageIndex = (curIndex == -1 ? jQuery(expandPagesList).index(curExpandPage) : curIndex);
			var nextExpandPageIndex = isNext == true ? (curExpandPageIndex + 1) : (curExpandPageIndex - 1); 
			if(nextExpandPageIndex > jQuery(expandPagesList).length - 1)
			{
				isNext = false;
				nextExpandPageIndex = 0;
			}
			var percent = -nextExpandPageIndex*100;
			
			// prev, next and close button
			if(isNext == false && nextExpandPageIndex == 0)
			{
				jQuery(closeButton).css('display', 'none');	
				expandPageResponsive(true);
			}
			else if(jQuery(closeButton).css('display') == 'none' || jQuery(closeButton).css('display') == '')
			{
				jQuery(closeButton).css('display', 'block'); 
				expandPageResponsive(false);	
			}
			else
			{
				expandPageResponsive(false);			
			}
			
			jQuery(prevButton).css('display', 'inline-block');
			jQuery(nextButton).css('display', 'inline-block');	
			if(nextExpandPageIndex == jQuery(expandPagesList).length - 1) 
				jQuery(nextButton).css('display', 'none');  
			else if(nextExpandPageIndex == 0) 
				jQuery(prevButton).css('display', 'none');	 
			
			// images
			loadImage(jQuery(expandPagesList).eq(nextExpandPageIndex).find('.wfs-full-screenshot'));
			jQuery(expandPagesList).animate({'opacity': 1}, 0); 		
			jQuery(expandPagesContainer).animate({'left': percent + '%'}, animateTime, function()
			{
				jQuery(expandPagesList).animate({'opacity': 0}, 0);
				jQuery(expandPagesList).eq(nextExpandPageIndex).animate({'opacity': 1}, 0);			
				havingThreat = false;	
			}); 
			
			// hide loading
			jQuery(loadingTag).css('display', 'none');
			
			// scroll to top of containerTag
			window.location.hash = jQuery(containerTag).attr('id'); 
		}
		
		function expandPageResponsive(initStatus)
		{			
			if(isCheckingResponsive == true)
			{
				isCheckingResponsive = false;
				return;
			}
			else
				isCheckingResponsive = true;
		
			var minHeight = parseInt(jQuery(expandPagesContainer).attr('min-height').replace('px', ''));
			var maxHeight = jQuery(window).height(); 
			if(jQuery(expandPagesContainer).attr('max-height') != '')
				maxHeight = parseInt(jQuery(expandPagesContainer).attr('max-height').replace('px', ''));
			
			var width = jQuery(containerTag).width() - 128;
				
			if(initStatus == true)
			{				
				jQuery(expandPagesContainer).animate({'height': minHeight}, animateTime/2, function()
				{
					// each video trailer
					jQuery(expandPagesContainer).find('.wfs-details-trailer').each(function()
					{
						jQuery(this).css('width', jQuery(this).find('.wfs-video-image-wrapper').css('width')); 					
					});
				});	
				
				// video
				if(jQuery(videoOverlay).css('display') != 'none')
				{
					var windowW = jQuery(window).width();
					var windowH = jQuery(window).height();
					var top = 0, left = 0;			
					if(windowW > videoWidth)
						left = (windowW - videoWidth)/2;
					if(windowH > videoHeight)
						top = (windowH - videoHeight)/2 + document.documentElement.scrollTop;
					jQuery(videoPreview).css({
						'display': 'block',
						'top': top,
						'left': left
					});
				}
			}
			else	
			{ 
				var height = width > 272 ? maxHeight - 5 : minHeight;
				var windowScale = width/height;
				var delta = 1;
				
				jQuery(expandPagesContainer).animate({'height': height}, 0);	
				jQuery(containerTag).find('.wfs-full-screenshot').each(function()
				{
					// hide image
					jQuery(this).css('display', 'none');
					
					var src = jQuery(this).attr('src') + '';
					
					// when first time, src is not loaded
					if(src == 'undefined')
					{
						jQuery(this).css('max-height', height - 2*parseInt(jQuery(this).css('margin-top').replace('px', '')));  
						jQuery(this).css('max-width', width - 2*parseInt(jQuery(this).css('margin-left').replace('px', ''))); 
					}
					else
					{					
						var imageScale = jQuery(this).width() / jQuery(this).height(); 
						if(windowScale > imageScale) 
						{
							jQuery(this).css('max-height', height - 2*parseInt(jQuery(this).css('margin-top').replace('px', '')));  
							jQuery(this).css('max-width', '');
						}
						else 
						{
							jQuery(this).css('max-width', width - 2*parseInt(jQuery(this).css('margin-left').replace('px', '')));  
							jQuery(this).css('max-height', '');
						}
					}
					
					// show image
					jQuery(this).css('display', '');
				});
			}
			
			isCheckingResponsive = false;
		}
		
		
		//
		// 03. create tags
		//	 
		if(jQuery('body').find('#wfs_modal_dialog_overlay').length == 0)
		{
			jQuery('body').append('<div id="wfs_modal_dialog_overlay" class="wfs-modal-dialog-overlay wfs-video-preview" style="display:none;"></div>');		
		}
		var videoOverlay = jQuery('body').find('#wfs_modal_dialog_overlay');
		
		//
		if(jQuery('body').find('#wfs_modal_dialog').length == 0)
		{
			jQuery('body').append(
				'<div id="wfs_modal_dialog" class="wfs-modal-dialog wfs-video-preview" style="display:none;">'
				+'	<div class="wfs-contents-wrapper">'
				+'		<div class="wfs-contents"></div>'
				+'	</div>'
				+'</div>');
		}
		var videoPreview = jQuery('body').find('#wfs_modal_dialog'); 
		
		//
		// 04. events
		//
		
		// next button
		var playNextClickFunc = function()
		{
			expandPagePlay(true, -1);
		}; 
		jQuery(nextButton).find('.wfs-play-button').unbind('click', playNextClickFunc);
		jQuery(nextButton).find('.wfs-play-button').bind('click', playNextClickFunc);
		
		// prev button
		var playPrevClickFunc = function()
		{
			expandPagePlay(false, -1);
		};
		jQuery(prevButton).find('.wfs-play-button').unbind('click', playPrevClickFunc);
		jQuery(prevButton).find('.wfs-play-button').bind('click', playPrevClickFunc);			
		
		// close button
		var closeButtonFunc = function()
		{
			expandPagePlay(false, 1);
		};
		jQuery(closeButton).unbind('click', closeButtonFunc);	
		jQuery(closeButton).bind('click', closeButtonFunc);	
		
		// each screenshot image
		var screenshotClickFunc = function()
		{
			var thumbnailList = jQuery(containerTag).find('.wfs-thumbnails .wfs-screenshot.wfs-clickable');
			var curExpandPageIndex =  jQuery(thumbnailList).index(this); 
			expandPagePlay(true, curExpandPageIndex);
		};
		jQuery(containerTag).find('.wfs-screenshot.wfs-clickable').unbind('click', screenshotClickFunc);
		jQuery(containerTag).find('.wfs-screenshot.wfs-clickable').bind('click', screenshotClickFunc);
		
		// each full screenshot image
		var fullScreenshotClickFunc = function()
		{
			expandPagePlay(true, -1);
		};
		jQuery(containerTag).find('.wfs-full-screenshot.wfs-clickable').unbind('click', fullScreenshotClickFunc);
		jQuery(containerTag).find('.wfs-full-screenshot.wfs-clickable').bind('click', fullScreenshotClickFunc);
		
		// trailer video
		var showVideoClickFunc = function()
		{
			// get current video size
			videoWidth = parseInt(jQuery(this).attr('video-width').replace('px', ''));
			videoHeight = parseInt(jQuery(this).attr('video-height').replace('px', ''));
			
			// display 
			jQuery(videoOverlay).css('display', 'block');
			
			//
			var windowW = jQuery(window).width();
			var windowH = jQuery(window).height();
			var top = 0, left = 0;			
			if(windowW > videoWidth)
				left = (windowW - videoWidth)/2;
			if(windowH > videoHeight)
				top = (windowH - videoHeight)/2 + document.documentElement.scrollTop;
			
			jQuery(videoPreview).css({
				'display': 'block',
				'top': top,
				'left': left
			});
			
			jQuery(videoPreview).find('.wfs-contents').append(
					'<iframe width="'+videoWidth+'" '
						+ 'height="'+videoHeight+'" '
						+ 'frameborder="0" '
						+ 'src="'+jQuery(this).attr('video-embed-src')+'" ' 
						+ 'webkitallowfullscreen="webkitallowfullscreen"></iframe>');
		};
		jQuery(containerTag).find('.wfs-details-trailer .wfs-play-click-target').unbind('click', showVideoClickFunc);
		jQuery(containerTag).find('.wfs-details-trailer .wfs-play-click-target').bind('click', showVideoClickFunc);
				
		// overlay video
		var closeVideoClickFunc = function()
		{
			jQuery(this).css('display', 'none');
			
			jQuery(videoPreview).css('display', 'none');
			jQuery(videoPreview).find('iframe').remove();
		};
		jQuery(videoOverlay).unbind('click', closeVideoClickFunc);
		jQuery(videoOverlay).bind('click', closeVideoClickFunc);
		
		// window resize
		var windowResizeFunc = function()
		{
			// check responsive
			var curExpandPage = jQuery(expandPagesList).filter(function() {
				return jQuery(this).css('opacity') == '1';
			}); 
			var curExpandPageIndex =  jQuery(expandPagesList).index(curExpandPage); 
			if(curExpandPageIndex == 0)
				expandPageResponsive(true);
			else
				expandPageResponsive(false);				

			// update scrollbar		
			setTimeout(function()
			{
				wfsGooglePlayThumbnail.updateScrollbar(containerTag);
			}, 500);
		};
		jQuery(window).unbind('resize', windowResizeFunc);
		jQuery(window).bind('resize', windowResizeFunc);
		
		//
		// 05. load data
		//
		expandPageResponsive(true);
	},
	
	updateThumbnailWidth: function(containerTag)
	{		
		// update thumbnail
		var thumbnailWidth = 0;
		jQuery(containerTag).find('.wfs-expand-page.wfs-scrollbar .wfs-thumbnails').children().each(function()
		{
			thumbnailWidth += jQuery(this).outerWidth(true);
		});
		
		jQuery(containerTag).find('.wfs-expand-page.wfs-scrollbar .wfs-thumbnails').width(thumbnailWidth);
	},
	
	//
	// scrollbar
	//
	appendScrollbar: function(containerTag)
	{	
		wfsGooglePlayThumbnail.updateThumbnailWidth(containerTag);
		
		jQuery(containerTag).find('.wfs-expand-page.wfs-scrollbar').perfectScrollbar( );
		jQuery(containerTag).find('.ps-scrollbar-y').hide(0); // hide the scrollbar-y
	},
	
	updateScrollbar: function(containerTag)
	{	 	
		wfsGooglePlayThumbnail.updateThumbnailWidth(containerTag);
		
		jQuery(containerTag).find('.wfs-expand-page.wfs-scrollbar').scrollTop(0);
		jQuery(containerTag).find('.wfs-expand-page.wfs-scrollbar').perfectScrollbar('update');
	},

	//
	// others
	//
	getFullURL: function(video)
	{ 	
		function updateURL(url, par_name, par_value)
		{
//			if(url.indexOf('&'+par_name) != -1)
//			{
//				var index = url.indexOf('&'+par_name);
//				var index1 = url.indexOf('&', index + 1);
//				url = url.replace(url.substring(index, index1), '');
//			}
//			else if( url.indexOf('&amp;'+par_name) != -1)
//			{		
//				var index = url.indexOf('&amp;'+par_name);
//				var index1 = url.indexOf('&', index + 1); 
//				url = url.replace(url.substring(index, index1), '');
//			} 		
//			else if( url.indexOf('?'+par_name) != -1)
//			{		
//				var index = url.indexOf('?'+par_name);
//				var index1 = url.indexOf('&', index + 1); 
//				url = url.replace(url.substring(index, index1), '');
//			} 
			
			return url ;//+ '&' + par_name + '=' + par_value; 
		}
		
		var fullURL = updateURL(video.src, 'autohide', video.autoHide);
		fullURL = updateURL(fullURL, 'autoplay', video.autoPlay);
		
		return fullURL;
	}
}