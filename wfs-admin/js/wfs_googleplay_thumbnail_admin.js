/*****
 * wfs_googleplay_thumbnail_admin.js - Javascript file control admin task and update to json file
 * @version: 1.0 (2013-09-18)
 * @requires: jquery.min.js / jquery-ui.js / perfect-scrollbar-0.4.4.with-mousewheel.min.js
 * @author: WEBFACESCRIPT
 * @website: http://webfacescript.com
*****/

jQuery(document).ready(function()
{ 
	// deleting in view list of contacts
	if(jQuery('.wfs_delete_googleplay_thumbnail'))
	{
		jQuery('.wfs_delete_googleplay_thumbnail').unbind('click');
		jQuery('.wfs_delete_googleplay_thumbnail').bind('click', function()
		{
			if (confirm('Do you want to delete this item?', 'Delete'))  
			{		
				wfsGooglePlayThumbnailAdmin.deleteThumbnailByID(jQuery(this).attr('id'), 'admin.php?page=wfs_googleplay_thumbnails.php');
			}
		});
	}	
});
	
//
//	wfsOrderImageControl
//

var wfsOrderImageControl = 
{
	havingResize : false,

	init: function(targetElement, options)
	{
		/*
			tag structure: <div>(targetElement) - <ul> - <li> - <div> - <a> - <img>
		*/

		/*
		// sample options
		var options = 
		{
			'images' : [
				'_demo/images/order-image-control/images-01.jpg',
				'_demo/images/order-image-control/images-02.jpg',
				'_demo/images/order-image-control/images-03.jpg',
				'_demo/images/order-image-control/images-04.jpg',
				'_demo/images/order-image-control/images-05.jpg',
				'_demo/images/order-image-control/images-06.jpg',
				'_demo/images/order-image-control/images-07.jpg',
				'_demo/images/order-image-control/images-08.jpg',
				'_demo/images/order-image-control/images-09.jpg'
			],
			'imageHeight': ''			
		};
		*/

		//
		jQuery(targetElement).empty();

		var ulTag = jQuery('<ul/>', {'id': 'wfs_sortable', 'class': 'wfs_sortable'}); 
		jQuery(ulTag).sortable();
		jQuery(ulTag).disableSelection();

		for(var i=0; i<options.images.length; i++)
		{ 
			var liTag = jQuery('<li/>');
			var divTag = jQuery('<div/>'); 
			var imageTag = jQuery('<img/>', {'src': options.images[i], 'class': 'wfs_thumbnail_image_key'});

			jQuery(ulTag).append(liTag);
			jQuery(liTag).append(divTag); 
			jQuery(divTag).append(imageTag);  
		}

		jQuery(targetElement).append(ulTag);

		// check responsive when window resize
		var isResizing; 
		function onLatestResizeFunc()
		{ 
			wfsOrderImageControl.havingResize = false;  
			var error = wfsOrderImageControl.checkResponsive(targetElement, options);

			// if has error, check responsive again, with 'true' window's width (wrong case => there has vertical scrollbar
			if(error)
				wfsOrderImageControl.checkResponsive(targetElement, options);
		}
		var windowResizeResponsiveFunc = function()
		{	
			wfsOrderImageControl.havingResize = true;
			clearTimeout(isResizing);
			isResizing = setTimeout(onLatestResizeFunc, 200); 
		};
		jQuery(window).unbind('resize', windowResizeResponsiveFunc);
		jQuery(window).bind('resize', windowResizeResponsiveFunc);

		// check responsive when dragdrop image
		var imageList =  jQuery(targetElement).find('li .wfs_thumbnail_image_key'); 
		var imageMouseUpResponsiveFunc = function()
		{	
			wfsOrderImageControl.havingResize = true;
			clearTimeout(isResizing);
			isResizing = setTimeout(onLatestResizeFunc, 500); 
		};
		jQuery(imageList).unbind('mouseup', imageMouseUpResponsiveFunc);
		jQuery(imageList).bind('mouseup', imageMouseUpResponsiveFunc);


		// check responsive at the first time
		setTimeout(function()
		{
			wfsOrderImageControl.checkResponsive(targetElement, options);
		}, 200);
	},

	checkResponsive: function(targetElement, options)
	{ 
		if(wfsOrderImageControl.havingResize == true)
			return true;	//hunghv 15/12/2013
		else
			wfsOrderImageControl.havingResize = true;

		// hide
		jQuery(targetElement).css('opacity', 0); 

		var galleryWidth = jQuery(targetElement).width(); 
		var widthPerRow = 0;
		var imageList = jQuery(targetElement).find('li'); 
		var imageSize = { 'height': (options.imageHeight == 0 ? 150 : options.imageHeight)};
		var deltaSpace = { 'one': 1, 'two': 2, 'three': 3};
		var firstRowImageIndex = 0;
		var latestRowImageIndex = 0;
		var rowLevel = -1;
		var i, j;

		// reset 
		jQuery(imageList).css({'margin-right': ''});
		jQuery(imageList).find('.wfs_thumbnail_image_key').css({'width': '', 'height': imageSize.height + 'px'});
		jQuery(imageList).find('.wfs_thumbnail_image_key').removeAttr('width');
		jQuery(imageList).find('.wfs_thumbnail_image_key').removeAttr('height');
		jQuery(imageList).find('.wfs_thumbnail_image_key').each(function()
		{
			if(jQuery(this).attr('src').trim() == '')
				jQuery(this).css({'width': imageSize.height + 'px'});
		});

		for( i=0; i<jQuery(imageList).length; i++)
		{
			widthPerRow += jQuery(imageList).eq(i).outerWidth(true); 
			// find new row 
			if(widthPerRow > galleryWidth)
			{				 
				// default value for zoom-in images
				var currentImageWidth = jQuery(imageList).eq(i).outerWidth(true);
				var realCurrentRowWidth = widthPerRow - currentImageWidth;
				var remainSpace = galleryWidth - realCurrentRowWidth; 

				// for case that zoom-out images
				if(remainSpace > currentImageWidth/2)
				{
					i=i+1; // use more one image
					realCurrentRowWidth = widthPerRow;
				}
				latestRowImageIndex = i-1;

				// update image size
				if(latestRowImageIndex - firstRowImageIndex == 0)
				{
					// fix by width for only 1 image in row
					jQuery(imageList).eq(firstRowImageIndex).find('.wfs_thumbnail_image_key').css({
							'width': (galleryWidth - 2) +'px',
							'height': 'auto'
					});
				}
				else
				{
					// fix by height for > 2 images in row				
					var heightRate = parseFloat(galleryWidth/realCurrentRowWidth);					
					var newImageHeight = parseInt(heightRate*imageSize.height) - deltaSpace.one;
					for( j=firstRowImageIndex; j<=latestRowImageIndex; j++) 
					{
						jQuery(imageList).eq(j).find('.wfs_thumbnail_image_key').css({
							'width': 'auto',
							'height': newImageHeight +'px'
						});
					}
				}

				// update row level in each image
				rowLevel++;
				for( j=firstRowImageIndex; j<=latestRowImageIndex; j++) 
				{
					jQuery(imageList).eq(j).find('.wfs_thumbnail_image_key').attr('row', rowLevel);
				}

				// recheck the remainSpace space
				realCurrentRowWidth = 0;
				for( j=firstRowImageIndex; j<=latestRowImageIndex; j++) 
					realCurrentRowWidth += jQuery(imageList).eq(j).outerWidth(true);	
				remainSpace = galleryWidth - realCurrentRowWidth;

				// update margin of <li> to fit space
				var latestItemMarginRight = parseInt(jQuery(imageList).eq(latestRowImageIndex).css('margin-right').replace('px',''));
				// items from first to n-1
				var marginRightRemainSpace = parseInt((remainSpace + latestItemMarginRight)/(latestRowImageIndex - firstRowImageIndex)) - deltaSpace.one;
				for( j=firstRowImageIndex; j<latestRowImageIndex; j++) 
					jQuery(imageList).eq(j).css('margin-right', (parseInt(jQuery(imageList).eq(j).css('margin-right').replace('px', '')) + marginRightRemainSpace) + 'px'); 
				// latest item
				jQuery(imageList).eq(latestRowImageIndex).css('margin-right', '0px'); 

				// continue from i+1, for next row  
				if(i == jQuery(imageList).length)
				{
					break;
				}
				else if(i == jQuery(imageList).length - 1)
				{
					if(jQuery(imageList).eq(i).outerWidth(true) > galleryWidth)
					{
						// fix by width for only 1 image in row
						jQuery(imageList).eq(i).find('.wfs_thumbnail_image_key').css({
								'width': (galleryWidth - 2) +'px',
								'height': 'auto'
						});
						// latest item
						jQuery(imageList).eq(i).css('margin-right', '0px'); 
					}
				}
				else
				{
					widthPerRow = jQuery(imageList).eq(i).outerWidth(true);
					firstRowImageIndex = i;    
				}
			} 
		}	 

		// show
		jQuery(targetElement).css('opacity', 1);
		wfsOrderImageControl.havingResize = false; 

		// check error
		return wfsOrderImageControl.checkWrongRowError(targetElement);
	},

	checkWrongRowError: function(targetElement)
	{
		var imageList = jQuery(targetElement).find('li'); 
		var prevRowLevel = 0;
		var curRowLevel = 0;
		var firstIndex = 0;
		var latestIndex = 0;
		var error = false; 

		for(var i=0; i<jQuery(imageList).length; i++)
		{
			curRowLevel = parseInt(jQuery(imageList).eq(i).find('.wfs_thumbnail_image_key').attr('row'));	

			if(curRowLevel > prevRowLevel)
			{ 
				// for previous row
				latestIndex = i-1; 

				var firstImage = jQuery(imageList).eq(firstIndex);
				var latestImage = jQuery(imageList).eq(latestIndex);

				if(firstImage.offset().left == latestImage.offset().left)
				{
					error = true;
					break;
				}
				else
				{
					// for next row
					prevRowLevel = curRowLevel;
					firstIndex = i; 
				}
			}
		}

		return error;
	},

	doAfterDropFunction : function()
	{}
}

//
//	wfsOtherControl
//

var wfsOtherControl = 
{
	appendLayerDisplayControl: function(target, layerName, isChecked)
	{
		jQuery(target).append(
			'<div>Display: '
			+'<input id="chk_display_'+layerName+'"'+ (isChecked ? ' checked' : '') +' type="checkbox" class="wfs_chk_layer_display">'
			+'<label id="lbl_display_'+layerName+'" for="chk_display_'+layerName+'" class="wfs_admin_button'+ (isChecked ? ' selected' : '') +'">Display</label>'
			+'</div>'
		);			

		// change style 
		jQuery(target).find('#chk_display_'+layerName).change(function()
		{ 
			if(this.checked) 
				jQuery('#lbl_display_'+layerName).addClass('selected'); 
			else 
				jQuery('#lbl_display_'+layerName).removeClass('selected'); 
		});
	},

	appendLayerLocationControl: function(target, layerName, selectedValue)
	{
		switch(layerName)
		{
			case 'bullet':
				jQuery(target).append( 
					'<div style="float: left;" id="btn_location_' + layerName + '" class="wfs_btn_layer_location">Location: '
					+'<label href="#" location="top left" class="wfs_admin_button">Top Left</label> '
					+'<label href="#" location="top right" class="wfs_admin_button">Top Right</label> '
					+'<label href="#" location="top center" class="wfs_admin_button">Top Center</label> '
					+'<label href="#" location="bottom left" class="wfs_admin_button">Bottom Left</label> '
					+'<label href="#" location="bottom right" class="wfs_admin_button">Bottom Right</label> ' 
					+'<label href="#" location="bottom center" class="wfs_admin_button">Bottom Center</label> ' 
					+'</div>'
				);				
			break;
			case 'thumbnail':
				jQuery(target).append( 
					'<div style="float: left;" id="btn_location_' + layerName + '" class="wfs_btn_layer_location">Location: '
					+'<label href="#" location="top" class="wfs_admin_button">Top</label> '
					+'<label href="#" location="bottom" class="wfs_admin_button">Bottom</label> '
					+'<label href="#" location="left" class="wfs_admin_button">Left</label> '
					+'<label href="#" location="right" class="wfs_admin_button">Right</label> ' 
					+'</div>'
				);
			case 'title':
				// remove class wfs_btn_layer_location, different with bullet and thumbnail case!
				jQuery(target).append( 
					'<div style="float: left" id="btn_location_' + layerName + '" class="">Quick location: '
					+'<label href="#" location="top" class="wfs_admin_button">Top</label> '
					+'<label href="#" location="bottom" class="wfs_admin_button">Bottom</label> '
					+'<label href="#" location="left" class="wfs_admin_button">Left</label> '
					+'<label href="#" location="right" class="wfs_admin_button">Right</label> ' 
					+'</div>'
				);
			break;
		}

		switch(layerName)
		{
			case 'bullet':
			case 'thumbnail':
				// set selected item
				jQuery(target).find('#btn_location_'+layerName + ' label').each(function()
				{ 
					if(jQuery(this).attr('location') == selectedValue)
						jQuery(this).addClass('selected');
				});
			break;
		}
	},

	appendButton: function(target, controlID, controlText, buttonWidth)
	{
		jQuery(target).append('<label id="'+controlID+'" class="wfs_admin_button" style="width:'+ (buttonWidth != '' ? buttonWidth: '50px') +'; float: left;">'+controlText+'</label>');
	},

	appendCheckButton: function(target, controlID, controlText, buttonWidth, isChecked)
	{
		jQuery(target).append(
			'<div class="wfs_admin_checkbox">'
			+'<input id="'+controlID+'"'+ (isChecked ? ' checked' : '') +' type="checkbox" class="wfs_chk_layer_display">'
			+'<label id="lbl_'+controlID+'" for="'+controlID+'" class="wfs_admin_button'+ (isChecked ? ' selected' : '') +'" style="width:'+ (buttonWidth != '' ? buttonWidth: '50px') +';" >'+controlText+'</label>'
			+'</div>'
		);

		// event
		jQuery(target).find('#'+controlID).bind('change', function()
		{
			if(this.checked) 
				jQuery('#lbl_'+controlID).addClass('selected'); 
			else 
				jQuery('#lbl_'+controlID).removeClass('selected'); 
		}); 
	},

	changeCheckButton: function(controlID, isChecked)
	{ 
		var chkButton = jQuery('#'+controlID); 
		jQuery(chkButton).prop('checked', isChecked); 

		if(isChecked == true) 
			jQuery('#lbl_'+controlID).addClass('selected'); 
		else 
			jQuery('#lbl_'+controlID).removeClass('selected');  
	},

	appendTextbox: function(target, controlID, controlTitle, defaultValue, textBoxWidth, note)
	{
		var required = controlTitle.indexOf('(*)') != -1 ? true : false; 

		jQuery(target).append(
			'<div class="wfs_admin_textbox">'
			+'<label style="' + (required == true ? 'font-weight:bold;' : '') + '">'+controlTitle+'</label>'
			+'<input id="'+controlID + '" type="textbox" value="'+defaultValue
				+'" style="width:'+(textBoxWidth == '' ? '50px' : textBoxWidth)+ '; ' + (required == true ? 'background-color:yellow;' : '') +'" >'
			+ (note != '' ? note : '' )
			+'</div>'
		);
	}, 		

	appendTextArea: function(target, controlID, controlTitle, defaultValue)
	{
		jQuery(target).append(
			'<div class="wfs_admin_textbox">'
			+'<label>'+controlTitle+'</label>' 
			+'<textarea id="'+controlID+'" rows="4" cols="35">'+defaultValue+'</textarea>'
			+'</div>'
		);
	}, 	

	appendSelectionControl: function(target, controlID, controlTitle, valueArr, textArr, defaultValue)
	{
		var options = '';			
		for(var i = 0; i < valueArr.length; i++)
		{
			options += '<option value="'+valueArr[i]+'" '+ (defaultValue == valueArr ? 'selected' : '') +'>'+textArr[i]+'</option>';
		}
		jQuery(target).append(
			'<div class="float: left;">'
			+'<label>'+controlTitle+'</label>' 
			+'<select style="margin: 5px;" id="'+controlID+'">'
				+options
			+'</select>' 
			+'</div>'
		);
	}

}

//
// wfsTabControl
//

var wfsTabControl = 
{
	init: function(targetElement, tabOptions)
	{
		/*
		// option example!

		var tabOptions = 
		{
			topControls: [
				{
					'id': 'btnCancel',
					'title': '<== Back',
					'class': ''
				}, 
				{
					'id': 'btnSave',
					'title': 'Save',
					'class': 'pink'
				}
			],

			tabControls: [
				{
					'tab': {
						'id': 'wfs_admin_tab1',
						'title': 'Tab 1',
						'selected': true,						
					},
					'content': {
						'id': 'wfs_admin_tab1_content',
						'hasSubTab': true,
						'hasShowAll': true,
						'subTabs': [
							{
								'id': 'wfs_admin_tab1_subtab1',
								'title': 'Subtab 1',
								'selected': true
							},
							{
								'id': 'wfs_admin_tab1_subtab2',
								'title': 'Subtab 2',
								'selected': false
							},
							{
								'id': 'wfs_admin_tab1_subtab3',
								'title': 'Subtab 3',
								'selected': false
							},
							{
								'id': 'wfs_admin_tab1_subtab4',
								'title': 'Subtab 4',
								'selected': false
							}	
						]
					}
				},
				{
					'tab': {
						'id': 'wfs_admin_tab2',
						'title': 'Tab 2',
						'selected': false,						
					},
					'content': {
						'id': 'wfs_admin_tab2_content',
						'hasSubTab': false,
						'hasShowAll': false,
						'subTabs': []
					}
				}
			]
		};
		*/

		//
		jQuery(targetElement).empty();

		//
		var adminPanelTab = jQuery('<div/>', {'class': 'wfs_admin_panel_tabs', 'id': 'wfs_admin_panel_tabs'});
		jQuery(targetElement).append(adminPanelTab);

		var adminPanelContent = jQuery('<div/>', {'class': 'wfs_admin_panel_content', 'id': 'wfs_admin_panel_content'});
		jQuery(targetElement).append(adminPanelContent);

		var adminPanelContentBody = jQuery('<div/>', {'class': 'wfs_admin_panel_content_body', 'id': 'wfs_admin_panel_content_body'});
		jQuery(targetElement).append(adminPanelContentBody);

		for(var i=0; i<tabOptions.topControls.length; i++)
		{
			jQuery(adminPanelTab).append(jQuery('<label/>', {
				'class': 'wfs_admin_top_button ' + tabOptions.topControls[i].class, 
				'id': tabOptions.topControls[i].id, 
				'html': tabOptions.topControls[i].title
			}));
		}

		for(var i=0; i<tabOptions.tabControls.length; i++)
		{
			var tabControl = tabOptions.tabControls[i];

			//
			// tabs
			//
			jQuery(adminPanelTab).append(jQuery('<a/>',{
				'id': tabControl.tab.id,
				'for_content': tabControl.content.id,
				'class': (tabControl.tab.selected == true ? 'selected' : ''),
				'html': tabControl.tab.title				
			}));	

			//
			// content tab
			//
			var adminTabContent = jQuery('<div/>', {
				'id': tabControl.content.id,
				'style': 'display:' + (tabControl.tab.selected == true ? 'block' : 'none')
			}); 
			jQuery(adminPanelContent).append(adminTabContent);

			if(tabControl.content.hasSubTab == true)
			{ 
				var adminSubTab = jQuery('<div/>', {
					'class': 'wfs_admin_sub_tabs'
				});

				jQuery(adminTabContent).addClass('has_sub_tabs');
				jQuery(adminTabContent).append(adminSubTab);

				// sub tabs
				for(var j=0; j<tabControl.content.subTabs.length; j++)
				{
					var subTab = tabControl.content.subTabs[j];

					// sub-tab
					jQuery(adminSubTab).append(jQuery('<a/>',{
						'class': (subTab.selected == true ? 'selected' : ''),
						'for_content': subTab.id,
						'html': subTab.title			
					}));

					// content
					jQuery(adminTabContent).append(jQuery('<div/>',{
						'style': 'display:' + (subTab.selected == true ? 'block' : 'none'),
						'id': subTab.id			
					}).append('<div class="wfs_content_container"></div>'));
				}	

				// show all sub tab
				if(tabControl.content.hasShowAll == true)
				{
					jQuery(adminSubTab).append(jQuery('<a/>',{ 
						'for_content': '',
						'html': '-Show All-'
					}));
				}		

				// sub tab events
				var subTabList = jQuery(adminSubTab).children('a');
				var subTabClickFunc = function()
				{ 					
					// not use 'adminTabContent' because it always be the latest variable => wrong value
					var container = jQuery(this).parent().parent();

					// selected style
					jQuery(subTabList).removeClass('selected'); 
					jQuery(this).addClass('selected');

					// show				
					if(jQuery(this).attr('for_content') == '')
					{
						jQuery(container).children('div').show(0); 
					}
					else
					{
						jQuery(container).children('div').hide(0);
						jQuery(container).find('.wfs_admin_sub_tabs').show(0);
						jQuery(container).find('#' + jQuery(this).attr('for_content')).show(0);
					} 
				};
				jQuery(subTabList).unbind('click', subTabClickFunc);
				jQuery(subTabList).click('click', subTabClickFunc);
			}
			else
			{
				jQuery(adminTabContent).append('<div><div class="wfs_content_container"></div></div>');
			}

			// content body
			var adminTabContentBody = jQuery('<div/>', {
				'id': tabControl.content.id + '_body',
				'style': 'display:' + (tabControl.tab.selected == true ? 'block;' : 'none;') + ' border: 0px;'
			}); 
			jQuery(adminPanelContent).append(adminTabContentBody);
		}

		// tab events
		var tabList = jQuery(adminPanelTab).children('a');
		var tabClickFunc = function()
		{
			var contentList = jQuery(adminPanelContent).children('div');
			var contentID = jQuery(this).attr('for_content');

			jQuery(tabList).removeClass('selected');
			jQuery(contentList).css({display: 'none'});

			jQuery(this).addClass('selected');
			jQuery(adminPanelContent).find('#'+contentID).css({display: 'block'});
			jQuery(adminPanelContent).find('#'+contentID+'_body').css({display: 'block'});
		};
		jQuery(tabList).unbind('click', tabClickFunc);
		jQuery(tabList).bind('click', tabClickFunc);		
	},

	appendOptionItem: function(targetTag, width)
	{
		var optionItemTag = jQuery('<div/>', {'class': 'wfs_option_item', 'style': 'width:' + width + 'px'});
		jQuery(targetTag).find('.wfs_content_container').append(optionItemTag);
		return optionItemTag;
	}
}

//
// wfsGooglePlayThumbnailAdmin
//

var wfsGooglePlayThumbnailAdmin = 
{
	options: {},

	id: 0,

	jsonFile: '',

	init: function(targetElement, jsonFile)
	{  
		wfsGooglePlayThumbnailAdmin.jsonFile = jsonFile; 
		//
		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: myAjax.ajaxUrl,
			data: {
				action: 'get_wfs_googleplay_thumbnail_byJSON',
				json_file: jsonFile
			},		
			success: function(data)
			{   
				wfsGooglePlayThumbnailAdmin.options = data;
				//
				wfsGooglePlayThumbnailAdmin.initTabs(targetElement);
				//
				wfsGooglePlayThumbnailAdmin.initGeneralAdmin(targetElement);			
				//
				wfsGooglePlayThumbnailAdmin.initImageAdmin(targetElement);
				//			
				wfsGooglePlayThumbnailAdmin.initVideoAdmin(targetElement);  
			},
			error: function(errorThrown){
				alert(errorThrown.responseText);
			} 
		});
	},

	initWithOptions: function(targetElement, options, thumbnailID)
	{
		wfsGooglePlayThumbnailAdmin.options = options;  
		wfsGooglePlayThumbnailAdmin.id = thumbnailID;  
		//
		wfsGooglePlayThumbnailAdmin.initTabs(targetElement);
		//
		wfsGooglePlayThumbnailAdmin.initGeneralAdmin(targetElement);			
		//
		wfsGooglePlayThumbnailAdmin.initImageAdmin(targetElement);
		//			
		wfsGooglePlayThumbnailAdmin.initVideoAdmin(targetElement); 
	},

	initTabs: function(targetElement)
	{
		var tabOptions = 
		{
			topControls: [ 			
				{
					'id': 'btnReturn',
					'title': 'Return',
					'class': ''
				},
				{
					'id': 'btnSave',
					'title': 'Save',
					'class': 'pink'
				}
			],

			tabControls: [
				{
					'tab': {
						'id': 'wfs_admin_tab_general',
						'title': 'General',
						'selected': true					
					},
					'content': {
						'id': 'wfs_admin_tab_general_content',
						'hasSubTab': false,
						'hasShowAll': false,
						'subTabs': []
					}
				},
				{
					'tab': {
						'id': 'wfs_admin_tab_videos',
						'title': 'Videos',
						'selected': false					
					},
					'content': {
						'id': 'wfs_admin_tab_videos_content',
						'hasSubTab': false,
						'hasShowAll': false,
						'subTabs': []
					}
				},
				{
					'tab': {
						'id': 'wfs_admin_tab_images',
						'title': 'Images',
						'selected': false					
					},
					'content': {
						'id': 'wfs_admin_tab_images_content',
						'hasSubTab': false,
						'hasShowAll': false,
						'subTabs': []
					}
				}
			]
		};

		wfsTabControl.init(targetElement, tabOptions);

		//
		// More events
		// 		
		var returnClickFunc = function()
		{ 
			if (confirm('Do you want to return?', 'Cancel')) 
				wfsGooglePlayThumbnailAdmin.returnFunc(); 
		}
		jQuery(targetElement).find('#btnReturn').unbind('click', returnClickFunc);
		jQuery(targetElement).find('#btnReturn').bind('click', returnClickFunc);	

		var saveClickFunc = function()
		{
			wfsGooglePlayThumbnailAdmin.options.name = jQuery(targetElement).find('#txtName').val().trim();

			if(wfsGooglePlayThumbnailAdmin.options.name.trim() == '')
			{
				alert('Thumbnail setting data is not blank');
				return;
			}			 

			if (confirm('All your editing will be saved?', 'Save'))  
			{
				wfsGooglePlayThumbnailAdmin.saveThumbnail(wfsGooglePlayThumbnailAdmin.options, wfsGooglePlayThumbnailAdmin.id); 
			}
		}
		jQuery(targetElement).find('#btnSave').unbind('click', saveClickFunc);
		jQuery(targetElement).find('#btnSave').bind('click', saveClickFunc);
	},

	initGeneralAdmin: function(targetElement)
	{
		// tab panel
		var panel = jQuery(targetElement).find('#wfs_admin_tab_general_content');		
		var optionItem1 = wfsTabControl.appendOptionItem(panel, 150);
		wfsOtherControl.appendButton(optionItem1, 'btnGeneralUpdate', 'Update', '100px');

		var optionItem2 = wfsTabControl.appendOptionItem(panel, 800);
		wfsOtherControl.appendTextbox(optionItem2, 'txtName', 'Name (*):', wfsGooglePlayThumbnailAdmin.options.name, '300px', '(Click Update button to change Name)');
		wfsOtherControl.appendTextbox(optionItem2, 'txtThumbnailHeight', 'Thumbnail Height (*):', wfsGooglePlayThumbnailAdmin.options.thumbnailsHeight.replace('px',''), '60px', '');		
		wfsOtherControl.appendTextbox(optionItem2, 'txtExpandPagesContainerMaxHeight', 'Max Height when expand (blank for 100%):', wfsGooglePlayThumbnailAdmin.options.expandPagesContainerMaxHeight.replace('px',''), '60px', '');

		// preview
		wfsGooglePlayThumbnailAdmin.preview(targetElement);

		//
		// events
		//
		var generalClickFunc = function()
		{
			wfsGooglePlayThumbnailAdmin.preview(targetElement);
		};
		jQuery(targetElement).find('#wfs_admin_tab_general').unbind('click', generalClickFunc);
		jQuery(targetElement).find('#wfs_admin_tab_general').bind('click', generalClickFunc);

		//
		var generalUpdateClickFunc = function()
		{
			var optionName = jQuery(targetElement).find('#txtName').val().trim();
			var thumbnailHeight = jQuery(targetElement).find('#txtThumbnailHeight').val().trim();
			var expandPagesContainerMaxHeight = jQuery(targetElement).find('#txtExpandPagesContainerMaxHeight').val().trim();

			if(optionName == '' || thumbnailHeight == '')
			{
				alert('Please put all values.');
				return;
			}		

			if(jQuery.isNumeric(thumbnailHeight) == false)
			{
				alert('Thumbnail Height must be number.');
				return;
			}

			if(expandPagesContainerMaxHeight != '')
			{
				if(jQuery.isNumeric(expandPagesContainerMaxHeight) == false)
				{
					alert('Max Height must be number.');
					return;
				}
			}

			wfsGooglePlayThumbnailAdmin.options.name = optionName;
			wfsGooglePlayThumbnailAdmin.options.thumbnailsHeight = thumbnailHeight + 'px';
			wfsGooglePlayThumbnailAdmin.options.expandPagesContainerMaxHeight = expandPagesContainerMaxHeight == '' ? '' : expandPagesContainerMaxHeight + 'px';

			//
			wfsGooglePlayThumbnailAdmin.preview(targetElement);
		}
		jQuery(targetElement).find('#btnGeneralUpdate').unbind('click', generalUpdateClickFunc);
		jQuery(targetElement).find('#btnGeneralUpdate').bind('click', generalUpdateClickFunc);
	},

	initImageAdmin: function(targetElement)
	{  
		//
		// panel
		//		
		var panel = jQuery(targetElement).find('#wfs_admin_tab_images_content');		

		var optionItem1 = wfsTabControl.appendOptionItem(panel, 280);
		wfsOtherControl.appendButton(optionItem1, 'btnImageAdd', 'Add', '100px');
		wfsOtherControl.appendButton(optionItem1, 'btnImageUpdate', 'Update', '100px');
		wfsOtherControl.appendButton(optionItem1, 'btnImageDelete', 'Delete', '100px');

		var optionItem2 = wfsTabControl.appendOptionItem(panel, 650);
		wfsOtherControl.appendTextbox(optionItem2, 'txtSmallImageUrl', 'Small Image url (*):', '', '400px', '');
		wfsOtherControl.appendTextbox(optionItem2, 'txtLargeImageUrl', 'Large Image url (*):', '', '400px', '');

		jQuery(panel).find('.wfs_content_container').width(jQuery(optionItem1).outerWidth(true) + jQuery(optionItem2).outerWidth(true));

		//
		// order images, small images
		//
		var imageContentBody =  jQuery(targetElement).find('#wfs_admin_tab_images_content_body');  
		var imageGallery = jQuery('<div/>', {'style': 'float:left; height: auto; overflow: hidden;'}); 
		jQuery(imageContentBody).append(imageGallery);
		function initImageGallery()
		{ 			
			var options = {
				'images': [],
				'imageHeight': 150			
			}; 
			var imageArr = wfsGooglePlayThumbnailAdmin.options.images;
						
			for(var i=0; i< imageArr.length; i++)
				options.images.push(imageArr[i].small); 

			// init
			wfsOrderImageControl.init(imageGallery, options);	

			// update 
			var imageList = jQuery(imageGallery).find('li');	
			for(var i=0; i<jQuery(imageList).length; i++) 
			{
				jQuery(imageList).eq(i).find('.wfs_thumbnail_image_key').attr('large-src', imageArr[i].large);
			}		
		}
		function responsiveImageGallery()
		{ 
			var options = { 
				'imageHeight': 150			
			};   

			// init
			wfsOrderImageControl.checkResponsive(imageGallery, options);	
		}
		initImageGallery();

		//
		// large image
		//  
		jQuery(imageContentBody).append(
			'<div style="float:left; height: auto; overflow: hidden;">'
				+'<h3>Large image:</h5>'
				+'<div style="max-width: 400px; margin: auto;">'
					+'<img style="max-width: 400px; max-height: 300px;" id="imgImageLargeView" src="">'
				+'</div>'
			+'</div>'
		);

		// 
		// Events
		//
		var imageClickFunc = function()
		{
			var imageList = jQuery(imageGallery).find('li');

			// selected style
			jQuery(imageList).removeClass('wfs-selected-item');
			jQuery(this).addClass('wfs-selected-item');

			// put information to panel
			var imageIndex = jQuery(imageList).index(this);
			jQuery('#txtSmallImageUrl').val(wfsGooglePlayThumbnailAdmin.options.images[imageIndex].small);
			jQuery('#txtLargeImageUrl').val(wfsGooglePlayThumbnailAdmin.options.images[imageIndex].large);

			// large image view
			jQuery(targetElement).find('#imgImageLargeView').css('opacity', 0);
			jQuery(targetElement).find('#imgImageLargeView').attr('src', wfsGooglePlayThumbnailAdmin.options.images[imageIndex].large);	 
			setTimeout(function(){jQuery(targetElement).find('#imgImageLargeView').css('opacity', 1);}, 500);			
		};
		jQuery(imageGallery).find('li').unbind('click', imageClickFunc);
		jQuery(imageGallery).find('li').bind('click', imageClickFunc);

		//
		var imageMouseUpFunc = function()
		{ 
			// work when drag-drop or ...
			// 

			function updateImageOrder()
			{
				var imageList = jQuery(imageGallery).find('li'); 

				for(var i=0; i<jQuery(imageList).length; i++) 
				{
					var imageTag = jQuery(imageList).eq(i).find('.wfs_thumbnail_image_key').first();
					wfsGooglePlayThumbnailAdmin.options.images[i].small = jQuery(imageTag).attr('src');
					wfsGooglePlayThumbnailAdmin.options.images[i].large = jQuery(imageTag).attr('large-src'); 
				}  
			}

			function refreshImage()
			{
				var imageList = jQuery(imageGallery).find('li');

				// selected style 
				var selectedImage = jQuery(imageGallery).find('li.wfs-selected-item');

				// put information to panel
				var imageIndex = jQuery(imageList).index(selectedImage);
				jQuery('#txtSmallImageUrl').val(wfsGooglePlayThumbnailAdmin.options.images[imageIndex].small);
				jQuery('#txtLargeImageUrl').val(wfsGooglePlayThumbnailAdmin.options.images[imageIndex].large); 

				// large image view
				jQuery(targetElement).find('#imgImageLargeView').attr('src', wfsGooglePlayThumbnailAdmin.options.images[imageIndex].large);			
			}

			setTimeout(function()
			{
				updateImageOrder(); 
				//
				refreshImage(); 
			},500); 
		};
		jQuery(imageGallery).find('li').unbind('mouseup', imageMouseUpFunc);
		jQuery(imageGallery).find('li').bind('mouseup', imageMouseUpFunc);

		//
		var addClickFunc = function()
		{
			// check
			var smallImageUrl = jQuery('#txtSmallImageUrl').val().trim();
			var largeImageUrl = jQuery('#txtLargeImageUrl').val().trim();
			if(smallImageUrl == '' || largeImageUrl == '')
			{
				alert('Please put image url.');
				return;
			}		

			// remove selection
			 jQuery(imageGallery).find('li').removeClass('wfs-selected-item');

			// add new
			var ulTag = jQuery(imageGallery).find('ul');			
			var liTag = jQuery('<li/>', {'class': 'wfs-selected-item'});
			var divTag = jQuery('<div/>'); 
			var imageTag = jQuery('<img/>', {
							'class': 'wfs_thumbnail_image_key',
							'src': smallImageUrl, 
							'large-src': largeImageUrl
						});	

			jQuery(ulTag).append(liTag);
			jQuery(liTag).append(divTag); 
			jQuery(divTag).append(imageTag);

			jQuery(liTag).unbind('click', imageClickFunc);
			jQuery(liTag).bind('click', imageClickFunc);			
			jQuery(liTag).unbind('mouseup', imageMouseUpFunc);
			jQuery(liTag).bind('mouseup', imageMouseUpFunc);

			// update large image view			
			jQuery(targetElement).find('#imgImageLargeView').attr('src', largeImageUrl);

			// add option
			wfsGooglePlayThumbnailAdmin.options.images.push(
			{
				'small': smallImageUrl,
				'large': largeImageUrl
			});

			//
			responsiveImageGallery(); 
		};		
		jQuery(targetElement).find('#btnImageAdd').unbind('click', addClickFunc);
		jQuery(targetElement).find('#btnImageAdd').bind('click', addClickFunc);

		//
		var updateClickFunc = function()
		{
			var imageList = jQuery(imageGallery).find('li');
			var selectedImage = jQuery(imageGallery).find('li.wfs-selected-item').first();
			var selectedIndex = jQuery(imageList).index(selectedImage);

			if(selectedIndex == -1)
			{
				alert('Please select an image.');
				return;
			}  

			var smallImageUrl = jQuery('#txtSmallImageUrl').val().trim();
			var largeImageUrl = jQuery('#txtLargeImageUrl').val().trim();
			if(smallImageUrl == '' || largeImageUrl == '')
			{
				alert('Please put image url.');
				return;
			}		

			// update options
			wfsGooglePlayThumbnailAdmin.options.images[selectedIndex].small = smallImageUrl;
			wfsGooglePlayThumbnailAdmin.options.images[selectedIndex].large = largeImageUrl;

			// update tags
			var imageTag = jQuery(imageGallery).find('li').eq(selectedIndex).find('.wfs_thumbnail_image_key');
			jQuery(imageTag).attr('src', smallImageUrl);			
			jQuery(imageTag).attr('large-src', largeImageUrl);			
			jQuery(targetElement).find('#imgImageLargeView').attr('src', largeImageUrl);

			//
			responsiveImageGallery(); 
		};		
		jQuery(targetElement).find('#btnImageUpdate').unbind('click', updateClickFunc);
		jQuery(targetElement).find('#btnImageUpdate').bind('click', updateClickFunc);

		//
		var deleteClickFunc = function()
		{
			var imageList = jQuery(imageGallery).find('li');
			var selectedImage = jQuery(imageGallery).find('li.wfs-selected-item').first();
			var selectedIndex = jQuery(imageList).index(selectedImage);

			if(selectedIndex == -1)
			{
				alert('Please select an image');
				return;
			}

			if(confirm('Do you want to delete this image?'))
			{
				jQuery(selectedImage).remove();				
				//
				jQuery(targetElement).find('#imgImageLargeView').attr('src', '');
				jQuery('#txtSmallImageUrl').val('');
				jQuery('#txtLargeImageUrl').val('');
				//
				wfsGooglePlayThumbnailAdmin.options.images.splice(selectedIndex, 1);  
			} 
		};		
		jQuery(targetElement).find('#btnImageDelete').unbind('click', deleteClickFunc);
		jQuery(targetElement).find('#btnImageDelete').bind('click', deleteClickFunc);
	},

	initVideoAdmin: function(targetElement)
	{
		//
		// panel
		//		
		var panel = jQuery(targetElement).find('#wfs_admin_tab_videos_content');		

		var optionItem1 = wfsTabControl.appendOptionItem(panel, 280);
		wfsOtherControl.appendButton(optionItem1, 'btnVideoAdd', 'Add', '100px');
		wfsOtherControl.appendButton(optionItem1, 'btnVideoUpdate', 'Update', '100px');
		wfsOtherControl.appendButton(optionItem1, 'btnVideoDelete', 'Delete', '100px');

		var optionItem2 = wfsTabControl.appendOptionItem(panel, 880);
		wfsOtherControl.appendTextbox(optionItem2, 'txtVideoEmbedSrc', 'Video url (embed) (*):', '', '425px', '');
//		wfsOtherControl.appendCheckButton(optionItem2, 'chkAutoHide', 'Auto hide', '60px', true);
		wfsOtherControl.appendTextbox(optionItem2, 'txtVideoWidth', 'Video Width (*):', '', '60px', '');
		wfsOtherControl.appendTextbox(optionItem2, 'txtVideoThumbnailSrc', 'Video thumbnail url:', '', '425px', '');
		wfsOtherControl.appendTextbox(optionItem2, 'txtvideoHeight', 'Video Height (*):', '', '60px', '');
//		wfsOtherControl.appendCheckButton(optionItem2, 'chkAutoPlay', 'Auto play', '60px', true);

		jQuery(panel).find('.wfs_content_container').width(jQuery(optionItem1).outerWidth(true) + jQuery(optionItem2).outerWidth(true));

		//
		// order video
		//
		var videoContentBody =  jQuery(targetElement).find('#wfs_admin_tab_videos_content_body'); 
		var videoGallery = jQuery('<div/>', {'style': 'float:left; height: auto; overflow: hidden;'}); 
		jQuery(videoContentBody).append(videoGallery);

		function initVideoGallery()
		{ 				
			var i = 0;
			var options = {
				'images': [],
				'imageHeight': 150			
			}; 
			var videoArr = wfsGooglePlayThumbnailAdmin.options.videos;
						
			for( i=0; i< videoArr.length; i++) 
				options.images.push(videoArr[i].videoThumbnail); 

			// init 
			wfsOrderImageControl.init(videoGallery, options);

			// update 
			var videoList = jQuery(videoGallery).find('li');
			for( i=0; i<jQuery(videoList).length; i++) 
			{
				jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').attr('video-width', videoArr[i].width);
				jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').attr('video-height', videoArr[i].height);
				jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').attr('video-embed-src', wfsGooglePlayThumbnail.getFullURL(videoArr[i]));
				jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').attr('video-auto-hide', videoArr[i].autoHide);
				jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').attr('video-auto-play', videoArr[i].autoPlay);
			}		
		}
		function responsiveVideoGallery()
		{ 
			var options = { 
				'imageHeight': 150			
			};  

			// init
			wfsOrderImageControl.checkResponsive(videoGallery, options);	
		}
		initVideoGallery();

		//
		// preview video
		//  
		wfsOtherControl.appendButton(videoContentBody, 'btnPreviewVideo', 'Preview Video', '100px'); 

		// 
		// Events
		//
		var videoClickFunc = function()
		{ 
			var videoList = jQuery(videoGallery).find('li');

			// selected style
			jQuery(videoList).removeClass('wfs-selected-item');
			jQuery(this).addClass('wfs-selected-item');

			// put information to panel
			var videoIndex = jQuery(videoList).index(this); 
			jQuery('#txtVideoEmbedSrc').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].src);
			jQuery('#txtVideoWidth').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].width.replace('px', ''));
			jQuery('#txtvideoHeight').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].height.replace('px', '')); 
			jQuery('#txtVideoThumbnailSrc').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].videoThumbnail); 
//			wfsOtherControl.changeCheckButton('chkAutoHide', wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].autoHide == '1' ? true : false);
//			wfsOtherControl.changeCheckButton('chkAutoPlay', wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].autoPlay == '1' ? true : false);
		};
		jQuery(videoGallery).find('li').unbind('click', videoClickFunc);
		jQuery(videoGallery).find('li').bind('click', videoClickFunc);

		//
		var videoMouseUpFunc = function()
		{ 
			// work when drag-drop or ...
			//  

			function updateVideoOrder()
			{
				var videoList = jQuery(videoGallery).find('li');  

				for(var i=0; i<jQuery(videoList).length; i++) 
				{ 
					var videoTag = jQuery(videoList).eq(i).find('.wfs_thumbnail_image_key').first();
					wfsGooglePlayThumbnailAdmin.options.videos[i].videoThumbnail = jQuery(videoTag).attr('src'); 
					wfsGooglePlayThumbnailAdmin.options.videos[i].width = jQuery(videoTag).attr('video-width'); 
					wfsGooglePlayThumbnailAdmin.options.videos[i].height = jQuery(videoTag).attr('video-height'); 
					wfsGooglePlayThumbnailAdmin.options.videos[i].src = jQuery(videoTag).attr('video-embed-src'); 
					wfsGooglePlayThumbnailAdmin.options.videos[i].autoHide = jQuery(videoTag).attr('video-auto-hide'); 
					wfsGooglePlayThumbnailAdmin.options.videos[i].autoPlay = jQuery(videoTag).attr('video-auto-play'); 
				}  
			}

			function refreshVideo()
			{
				var videoList = jQuery(videoGallery).find('li');  
				var selectedVideo = jQuery(videoGallery).find('li.wfs-selected-item');

				// put information to panel
				var videoIndex = jQuery(videoList).index(selectedVideo); 
				jQuery('#txtVideoEmbedSrc').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].src);
				jQuery('#txtVideoWidth').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].width.replace('px', ''));
				jQuery('#txtvideoHeight').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].height.replace('px', ''));
				jQuery('#txtVideoThumbnailSrc').val(wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].videoThumbnail); 	
//				wfsOtherControl.changeCheckButton('chkAutoHide', wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].autoHide == '1' ? true : false);
//				wfsOtherControl.changeCheckButton('chkAutoPlay', wfsGooglePlayThumbnailAdmin.options.videos[videoIndex].autoPlay == '1' ? true : false);
			}

			setTimeout(function()
			{
				updateVideoOrder(); 
				// 
				refreshVideo();
			},500);
		}; 
		jQuery(videoGallery).find('li').unbind('mouseup', videoMouseUpFunc);
		jQuery(videoGallery).find('li').bind('mouseup', videoMouseUpFunc);

		//
		var addClickFunc = function()
		{
			// check
			var videoWidth = jQuery('#txtVideoWidth').val().trim();
			var videoHeight = jQuery('#txtvideoHeight').val().trim();
			var videoEmbedSrc = jQuery('#txtVideoEmbedSrc').val().trim();
			var videoThumbnailSrc = jQuery('#txtVideoThumbnailSrc').val().trim();
			var videoAutoHide = 0;//jQuery('#chkAutoHide').prop('checked') ? '1' : '0';
			var videoAutoPlay = 0;//jQuery('#chkAutoPlay').prop('checked') ? '1' : '0';

			if(videoWidth == '' || videoHeight == '' || videoEmbedSrc == '')
			{
				alert('Please put all values.');
				return;
			}		

			if(jQuery.isNumeric(videoWidth) == false)
			{
				alert('Video width must be number.');
				return;
			}

			if(jQuery.isNumeric(videoHeight) == false)
			{
				alert('Video height must be number.');
				return;
			}

			// remove selection
			jQuery(videoGallery).find('li').removeClass('wfs-selected-item');

			// add new
			var ulTag = jQuery(videoGallery).find('ul');			
			var liTag = jQuery('<li/>', {'class': 'wfs-selected-item'});
			var divTag = jQuery('<div/>'); 
			var videoTag = jQuery('<img/>', {
							'class': 'wfs_thumbnail_image_key',
							'src': videoThumbnailSrc, 
							'video-width': videoWidth+'px',
							'video-height': videoHeight+'px',
							'video-embed-src': videoEmbedSrc,
							'video-auto-hide': videoAutoHide,
							'video-auto-play': videoAutoPlay
						});	

			jQuery(ulTag).append(liTag);
			jQuery(liTag).append(divTag); 
			jQuery(divTag).append(videoTag);

			jQuery(liTag).unbind('click', videoClickFunc);
			jQuery(liTag).bind('click', videoClickFunc);			
			jQuery(liTag).unbind('mouseup', videoMouseUpFunc);
			jQuery(liTag).bind('mouseup', videoMouseUpFunc);

			// add option
			wfsGooglePlayThumbnailAdmin.options.videos.push(
			{
				'src': videoEmbedSrc,
				'width': videoWidth+'px',
				'height': videoHeight+'px',
				'videoThumbnail': videoThumbnailSrc,
				'autoHide': videoAutoHide,
				'autoPlay': videoAutoPlay
			}); 

			//
			responsiveVideoGallery(); 
		};		
		jQuery(targetElement).find('#btnVideoAdd').unbind('click', addClickFunc);
		jQuery(targetElement).find('#btnVideoAdd').bind('click', addClickFunc);

		//
		var updateClickFunc = function()
		{
			var videoList = jQuery(videoGallery).find('li');
			var selectedVideo = jQuery(videoGallery).find('li.wfs-selected-item').first();
			var selectedIndex = jQuery(videoList).index(selectedVideo);

			if(selectedIndex == -1)
			{
				alert('Please select a video.');
				return;
			}  

			var videoWidth = jQuery('#txtVideoWidth').val().trim();
			var videoHeight = jQuery('#txtvideoHeight').val().trim();
			var videoEmbedSrc = jQuery('#txtVideoEmbedSrc').val().trim();
			var videoThumbnailSrc = jQuery('#txtVideoThumbnailSrc').val().trim();
			var videoAutoHide = 0;//jQuery('#chkAutoHide').prop('checked') ? '1' : '0';
			var videoAutoPlay = 0;//jQuery('#chkAutoPlay').prop('checked') ? '1' : '0';

			// validate
			if(videoWidth == '' || videoHeight == '' || videoEmbedSrc == '')
			{
				alert('Please put all values.');
				return;
			}		

			if(jQuery.isNumeric(videoWidth) == false)
			{
				alert('Video width must be number.');
				return;
			}

			if(jQuery.isNumeric(videoHeight) == false)
			{
				alert('Video height must be number.');
				return;
			}

			// update options
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].src = videoEmbedSrc; 
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].width = videoWidth;
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].height = videoHeight;
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].videoThumbnail = videoThumbnailSrc; 
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].autoHide = videoAutoHide; 
			wfsGooglePlayThumbnailAdmin.options.videos[selectedIndex].autoPlay = videoAutoPlay; 

			// update tags
			var videoTag = jQuery(videoGallery).find('li').eq(selectedIndex).find('.wfs_thumbnail_image_key');
			jQuery(videoTag).attr('src', videoThumbnailSrc);			
			jQuery(videoTag).attr('video-width', videoWidth);		
			jQuery(videoTag).attr('video-height', videoHeight);		
			jQuery(videoTag).attr('video-embed-src', videoEmbedSrc);	
			jQuery(videoTag).attr('video-auto-hide', videoAutoHide);	
			jQuery(videoTag).attr('video-auto-play', videoAutoPlay);	

			//
			responsiveVideoGallery(); 
		};		
		jQuery(targetElement).find('#btnVideoUpdate').unbind('click', updateClickFunc);
		jQuery(targetElement).find('#btnVideoUpdate').bind('click', updateClickFunc);

		//
		var deleteClickFunc = function()
		{
			var videoList = jQuery(videoGallery).find('li');
			var selectedVideo = jQuery(videoGallery).find('li.wfs-selected-item').first();
			var selectedIndex = jQuery(videoList).index(selectedVideo);

			if(selectedIndex == -1)
			{
				alert('Please select a video.');
				return;
			}

			if(confirm('Do you want to delete this video?'))
			{
				jQuery(selectedVideo).remove();				
				//
				wfsGooglePlayThumbnailAdmin.options.videos.splice(selectedIndex, 1);  
				//
				jQuery('#txtVideoEmbedSrc').val('');
				jQuery('#txtVideoWidth').val('');
				jQuery('#txtvideoHeight').val(''); 
				jQuery('#txtVideoThumbnailSrc').val(''); 
//				wfsOtherControl.changeCheckButton('chkAutoHide', true);
//				wfsOtherControl.changeCheckButton('chkAutoPlay', true);
			} 
		};		
		jQuery(targetElement).find('#btnVideoDelete').unbind('click', deleteClickFunc);
		jQuery(targetElement).find('#btnVideoDelete').bind('click', deleteClickFunc);

		// preview video click
		function previewVideoClickFunc()
		{			
			var selectedVideo = jQuery(videoGallery).find('li.wfs-selected-item .wfs_thumbnail_image_key');
			if(jQuery(selectedVideo).length == 0)
			{
				alert('Please select a video.');
				return;
			}

			var videoPreview = jQuery('body').find('.wfs-modal-dialog.wfs-video-preview'); 		
			var videoOverlay = jQuery('body').find('.wfs-modal-dialog-overlay.wfs-video-preview');			

			// get current video size
			videoWidth = parseInt(jQuery(selectedVideo).attr('video-width').replace('px', ''));
			videoHeight = parseInt(jQuery(selectedVideo).attr('video-height').replace('px', ''));

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

			// update full url with auto hide, play
//			var videoAutoHide = jQuery(selectedVideo).attr('video-auto-hide');
//			var videoAutoPlay = jQuery(selectedVideo).attr('video-auto-play'); 
			var videoEmbedSrc = jQuery(selectedVideo).attr('video-embed-src');
//			videoEmbedSrc = wfsGooglePlayThumbnail.getFullURL({
//				'src': videoEmbedSrc,
//				'autoHide': videoAutoHide,
//				'autoPlay': videoAutoPlay
//			});

			jQuery(videoPreview).find('.wfs-contents').append(
					'<iframe width="'+videoWidth+'" '
						+ 'height="'+videoHeight+'" '
						+ 'frameborder="0" '
						+ 'src="'+videoEmbedSrc+'" ' 
						+ 'allowfullscreen></iframe>');
		}
		jQuery(targetElement).find('#btnPreviewVideo').unbind('click', previewVideoClickFunc);
		jQuery(targetElement).find('#btnPreviewVideo').bind('click', previewVideoClickFunc);
	},

	preview: function(targetElement)
	{
		var generalContentBody = jQuery(targetElement).find('#wfs_admin_tab_general_content_body');
		jQuery(generalContentBody).css('padding-top', '30px');

		wfsGooglePlayThumbnail.initWithOptions(generalContentBody, wfsGooglePlayThumbnailAdmin.options);	
		jQuery(generalContentBody).find('.wfs-details-section.wfs-screenshots').css({'height': 'auto'});	
	},

	returnFunc: function()
	{
		window.location = 'admin.php?page=wfs_googleplay_thumbnails.php';
	},

	saveThumbnail: function(configData, thumbnailID)
	{     
		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: myAjax.ajaxUrl,
			data: {
				action: 'update_wfs_googleplay_thumbnail',
				json_data: JSON.stringify(configData),				
				json_name: configData.name,
				thumbnail_id: thumbnailID		
			},			
			success: function(data)
			{   
				if(data == true)
					alert('Save successfully!');
				else
					alert('There have a problem when saving!');
			},
			error: function(errorThrown){
				alert(errorThrown.responseText);
			}
		});
	}, 

	deleteThumbnailByID: function(thumbnailID, returnLink)
	{ 			
		jQuery.ajax({
			type: 'POST',
			dataType: 'json',
			url: myAjax.ajaxUrl,
			data: {
				action: 'delete_wfs_googleplay_thumbnail',
				thumbnail_id: thumbnailID			
			},			
			success: function(data)
			{   
				if(data == true) 
					if(returnLink != '') window.location = returnLink; 
				else if(data == 'access_denined')
					alert('Access denined.')
				else 
					alert('There have a problem when saving!' + data); 
			},
			error: function(errorThrown){
				alert(errorThrown.responseText);
			}
		}); 
	}

} 
