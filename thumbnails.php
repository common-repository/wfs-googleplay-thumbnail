<?php

if ( ! function_exists( 'load_wfs_googleplay_thumbnails' ) ) 
{
	function load_wfs_googleplay_thumbnails() 
	{
		global $post;
		$args = array( 
			'posts_per_page' => 10000, 
			'post_type' => 'wfs_gp_thumbnail' 
		);
		$myposts = get_posts( $args );
		?>
		
		<div style="padding-right: 10px;">				
			<?php wp_enqueue_script('jquery'); ?>
			<?php wp_enqueue_script('wfs_script_backend'); ?> 
			
			<h2>WFS GooglePlay Thumbnail plugin</h2>
			<h4>Version 0.5 - Minimum control panel</h4>
			<strong>Sample - key to add plugin in page/post:</strong>
			<p>[wfs_googleplay_thumbnail key="wfs_googleplay_thumbnail_script_20130925094146"]</p>
			<strong>Sample - key to add widget:</strong>
			<p>wfs_googleplay_thumbnail_script_20130925094146</p>
			
			<p>
				<a class="button" href="/wp-admin/admin.php?page=add_wfs_googleplay_thumbnail.php">ADD NEW</a>
			</p>
			
			<table cellspacing="0" class="wp-list-table widefat fixed posts">
				<thead>
					<tr>
						<th style="" class="manage-column column-title sortable desc" id="title" scope="col">
							<a href="#">
								<span>Thumbnail Title</span>
								<span class="sorting-indicator"></span>
							</a>
						</th> 
						<th style="" class="manage-column" scope="col">
							Thumbnail Key
						</th>  
						<th style="" class="manage-column column-date sortable asc" id="date" scope="col">
							<a href="#">
								<span>Date</span>
								<span class="sorting-indicator"></span>
							</a>
						</th>
					</tr>
				</thead> 
				<tbody id="the-list">		
				
				<?php 
				foreach ( $myposts as $post ) : 
					setup_postdata( $post ); ?> 
					
					<tr valign="top" id="<?php echo 'post-'.$post->ID;?>"> 		
						<td class="post-title page-title column-title">
							<strong>
								<a title="Edit WFS GooglePlay Thumnail Script" class="row-title"
									href="<?php echo 'admin.php?page=edit_wfs_googleplay_thumbnail.php&thumbnail_id='.$post->ID; ?>">
								<?php the_title(); ?></a>
							</strong>
							<div class="locked-info">
								<span class="locked-avatar"></span><span class="locked-text"></span>
							</div>
							<div class="row-actions">
								<span class="edit">
									<a href="<?php echo 'admin.php?page=edit_wfs_googleplay_thumbnail.php&thumbnail_id='.$post->ID; ?>">
									Edit</a> | 
								</span> 
								<span class="edit">
									<a href="<?php echo 'admin.php?page=add_wfs_googleplay_thumbnail.php&thumbnail_copied_id='.$post->ID; ?>">
									Copy</a> | 
								</span> 
								<span class="delete">
									<a href="javascript:void(0);" id="<?php echo $post->ID;?>" class="submitdelete wfs_delete_googleplay_thumbnail">
									Delete</a> 
								</span> 
							</div> 
						</td>          
						<td class="date column-date"> 
							<p><?php echo $post->post_name; ?></p>
							<p>[wfs_googleplay_thumbnail key="<?php echo $post->post_name; ?>"]</p>
						</td>            
						<td class="date column-date">
							<abbr title="<?php echo $post->post_date;?>">
								<?php 
									$date = new DateTime($post->post_date);
									echo $date->format('Y/m/d');
								?></abbr>
						</td>
					</tr> 
					
				<?php endforeach;
				wp_reset_postdata(); ?>
				
				</tbody>
			</table>
		</div><?php
	}
}
?>