<?php

if ( ! function_exists( 'display_wfs_googleplay_thumbnail' ) ) 
{
	function display_wfs_googleplay_thumbnail($thumbnail_key) 	
	{
		$thumbnail_key = trim($thumbnail_key);
		$divID = 'wfs_googleplay_thumbnail_key_'.$thumbnail_key;
		
		if($thumbnail_key != '')
		{
			$posts = get_posts(array('name' => $thumbnail_key, 'post_type' => 'wfs_gp_thumbnail'));
			
			if(count($posts) > 0)
			{
				$post = $posts[0];?>
				
				<?php wp_enqueue_script('jquery'); ?>
				<?php wp_enqueue_script('wfs_script_scrollbar'); ?>

				<?php wp_enqueue_script('wfs_script_frontend'); ?>

				<link href="<?php echo plugins_url('wfs-admin/css/wfs_googleplay_thumbnail_admin.css', __FILE__); ?>" rel="Stylesheet" /> 
				<link href="<?php echo plugins_url('_ex/css/perfect-scrollbar-0.4.4.min.css', __FILE__); ?>" rel="stylesheet" /> 
				<link href="<?php echo plugins_url('wfs-frontend/css/wfs_googleplay_thumbnail.css', __FILE__); ?>" rel="Stylesheet" />

				<script>
					jQuery(document).ready(function()
					{ 				
						options = <?php echo $post->post_content; ?>;
						wfsGooglePlayThumbnail.initWithOptions(jQuery('#<?php echo $divID; ?>'), options);   
					});
				</script> <?php
			
			}
		}?>
		
		<div id="<?php echo $divID; ?>">
			
		</div> <?php
	}
}

	
?>