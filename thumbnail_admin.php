<?php

if ( ! function_exists( 'admin_wfs_googleplay_thumbnail' ) ) 
{
	function admin_wfs_googleplay_thumbnail($post_id, $copied_id) 
	{?>
		<?php wp_enqueue_script('jquery'); ?>
		<?php wp_enqueue_script('jquery-ui-sortable'); ?>	
		<?php wp_enqueue_script('wfs_script_scrollbar'); ?>
 	  
		<?php wp_enqueue_script('wfs_script_backend'); ?>	  
		<?php wp_enqueue_script('wfs_script_frontend'); ?>
		
		<link href="<?php echo plugins_url('wfs-admin/css/wfs_googleplay_thumbnail_admin.css', __FILE__); ?>" rel="Stylesheet" /> 
		<link href="<?php echo plugins_url('_ex/css/perfect-scrollbar-0.4.4.min.css', __FILE__); ?>" rel="stylesheet" /> 
		<link href="<?php echo plugins_url('wfs-frontend/css/wfs_googleplay_thumbnail.css', __FILE__); ?>" rel="Stylesheet" />
		
		<script>
			jQuery(document).ready(function($)
			{
				wfsGooglePlayThumbnailAdmin.returnFunc = function()
				{
					window.location = 'admin.php?page=wfs_googleplay_thumbnails.php';
				};<?php
				
				if($post_id == 0) 
				{ 
					if($copied_id == 0)
					{?>
						wfsGooglePlayThumbnailAdmin.init($('#wfs_control_panel'), 'wfs_googleplay_thumbnail_blank.json'); <?php
					}
					else
					{
						$post = get_post($copied_id);		
					?>
						options = <?php echo $post->post_content; ?>;
						thumbanilID = 0; 
						wfsGooglePlayThumbnailAdmin.initWithOptions($('#wfs_control_panel'), options, thumbanilID); <?php
					}
				}
				else
				{ 					
					$post = get_post($post_id);		
				?>
					options = <?php echo $post->post_content; ?>;
					thumbanilID = <?php echo $post_id;?>; 
					wfsGooglePlayThumbnailAdmin.initWithOptions($('#wfs_control_panel'), options, thumbanilID); <?php
				}?>
			});
		</script>
		<?php
		if($post_id == 0) {
			if($copied_id == 0){?>
				<h2>Add new thumbnail</h2>
			
				<div>	
					<strong style="color:red;">Note:</strong>
					<ul>
						<li>- Remember adding thumbnail "Name" and other required fields!</li> 
						<li>- You can use blank video, image to add your first video, image</li>
						<li>- If you have no video, please remove blank video item</li>
						<li>- If you have no image, please remove blank image item</li>							
					</ul>
				</div> <?php
			}else{?>
				<h2>Copy a thumbnail</h2><?php
			}
		}else{?>
			<h2>Edit a thumbnail</h2><?php
		}?>
			
		<div id="wfs_control_panel"><br/>Waiting ...
		</div> <?php
	}
}


if ( ! function_exists( 'add_wfs_googleplay_thumbnail' ) ) 
{
	function add_wfs_googleplay_thumbnail() 
	{ 
		$thumbnailID = $_REQUEST["thumbnail_copied_id"] == '' ? 0 : intval($_REQUEST["thumbnail_copied_id"]); 		
		admin_wfs_googleplay_thumbnail(0, $thumbnailID) ;
	}
} 

if ( ! function_exists( 'edit_wfs_googleplay_thumbnail' ) ) 
{
	function edit_wfs_googleplay_thumbnail() 
	{
		$thumbnailID = $_REQUEST["thumbnail_id"] == '' ? 0 : intval($_REQUEST["thumbnail_id"]);  		
		admin_wfs_googleplay_thumbnail($thumbnailID, 0) ;
	}
} 
	
	
?>