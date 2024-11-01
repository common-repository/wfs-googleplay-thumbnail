<?php

if(!function_exists('update_wfs_googleplay_thumbnail'))
{
	function update_wfs_googleplay_thumbnail()
	{				
		if(current_user_can('edit_posts') === false) 
		{
			echo 'access_denined';
		}
		else
		{	 
			$thumbnailID = $_REQUEST["thumbnail_id"] == '' ? 0 : intval($_REQUEST["thumbnail_id"]); 

			$thumbnailName = $_REQUEST["json_name"]; 
			$thumbnailData = str_replace('\\', '',  $_REQUEST["json_data"]); 

			// Create post object
			$date = new DateTime();
			$key = $date->format('_YmdHis');		

			// Insert the post into the database
			if($thumbnailID == 0)
			{
				$thumbnail = array( 
					'post_title'    	=> $thumbnailName,
					'post_name'			=> str_replace(' ', '_', strtolower($thumbnailName)).$key,
					'post_content'  	=> $thumbnailData,
					'post_status'   	=> 'publish',
					'post_type' 		=> 'wfs_gp_thumbnail'		  
				);
				wp_insert_post( $thumbnail ); 
			}
			else 
			{
				$thumbnail = array(
					'ID'				=> $thumbnailID,
					'post_title'    	=> $thumbnailName, 
					'post_content'  	=> $thumbnailData,	  
				);
				wp_update_post( $thumbnail );
			}

			echo 'true';
		}
			
		die();
	}
}

if(!function_exists('get_wfs_googleplay_thumbnail_byJSON'))
{
	function get_wfs_googleplay_thumbnail_byJSON()
	{	
		$thumbnailFile =  $_REQUEST["json_file"];
		echo file_get_contents('config/'.$thumbnailFile, true);
		
		die();
	} 
}


if(!function_exists('delete_wfs_googleplay_thumbnail'))
{
	function delete_wfs_googleplay_thumbnail()
	{		 	
		if(current_user_can('edit_posts') === false) 
		{
			echo 'access_denined';
		}
		else
		{
			$thumbnailID = $_REQUEST["thumbnail_id"] == '' ? 0 : intval($_REQUEST["thumbnail_id"]); 

			if($thumbnailID == 0){
				echo 'false';
			}else{
				wp_delete_post($thumbnailID, true);
				echo 'true'; 
			}
		}
		
		die();
	} 
}

?>