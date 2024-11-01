<?php

/*
Plugin Name: WFS GooglePlay Thumbnail
Plugin URI: http://webfaceScript.com
Description: Create slideshow including videos and images like googleplay
Version: 0.5
Author: WebfaceScript
Author URI: http://webfaceScript.com
*/

/*  
Copyright 2013  WebfaceScript.com 
*/ 
 
 
 
/*
	Menu
*/

require_once( dirname( __FILE__ ) . '/thumbnails.php' );
require_once( dirname( __FILE__ ) . '/thumbnail.php' );
require_once( dirname( __FILE__ ) . '/thumbnail_admin.php' );
require_once( dirname( __FILE__ ) . '/wfs-googleplay-thumbnail-widget.php' );
require_once( dirname( __FILE__ ) . '/ajax.php' );

if(!function_exists('wfs_register_main_menu'))
{
	function wfs_googleplay_thumbnailregister_main_menu()
	{
		// add_menu_page( $page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position );
		add_menu_page( 
			'WFS GooglePlay Thumbnail List', 
			'WFS GPlay Thumbnails', 
			'edit_posts', 
			'wfs_googleplay_thumbnails.php', // this key is used in other pages
			'load_wfs_googleplay_thumbnails', 
			plugins_url('assets/images/menu_icon.png', __FILE__ ), 
			9001
		); 
		
		// add_submenu_page( $parent_slug, $page_title, $menu_title, $capability, $menu_slug, $function );
		add_submenu_page(
			'wfs_googleplay_thumbnails.php',
			'Add New WFS Googleplay Thumbnail', 
			'Add New', 
			'edit_posts', 
			'add_wfs_googleplay_thumbnail.php', 
			'add_wfs_googleplay_thumbnail'
		); 
		
		// hidden submenu
		add_submenu_page(
			'wfs_googleplay_thumbnail_hidden_menu',
			'Edit New WFS Googleplay Thumbnail', 
			'Edit', 
			'edit_posts', 
			'edit_wfs_googleplay_thumbnail.php', 
			'edit_wfs_googleplay_thumbnail'
		); 
	}	
}

add_action( 'admin_menu', 'wfs_googleplay_thumbnailregister_main_menu' );


/*
	add short code to display on page, post
*/
function wfs_googleplay_thumbnail_shortcode_func( $atts ) {
	extract( shortcode_atts( array(
		'key' => ''
	), $atts ) );

	display_wfs_googleplay_thumbnail($key);
}
add_shortcode( 'wfs_googleplay_thumbnail', 'wfs_googleplay_thumbnail_shortcode_func' );

/*
	widget
*/
function register_wfs_googleplay_thumbnail_widget() {
    register_widget( 'wfs_googleplay_thumbnail_widget' );
}
add_action( 'widgets_init', 'register_wfs_googleplay_thumbnail_widget' );


/*
* adding scripts 
*/ 
add_action( 'init', 'wfs_googleplay_thumbnail_script_enqueuer' );	// this function name must be distinct
function wfs_googleplay_thumbnail_script_enqueuer() {
	wp_register_script( "wfs_script_scrollbar", WP_PLUGIN_URL.'/wfs_googleplay_thumbnail/_ex/js/perfect-scrollbar-0.4.4.with-mousewheel.min.js', array('jquery') );
   
	wp_register_script( "wfs_script_backend", WP_PLUGIN_URL.'/wfs_googleplay_thumbnail/wfs-admin/js/wfs_googleplay_thumbnail_admin.js', array('jquery') );
	wp_localize_script( 'wfs_script_backend', 'myAjax', array( 'ajaxUrl' =>  admin_url( 'admin-ajax.php' )));

	wp_register_script( "wfs_script_frontend", WP_PLUGIN_URL.'/wfs_googleplay_thumbnail/wfs-frontend/js/wfs_googleplay_thumbnail.js', array('jquery') );
   
}

add_action("wp_ajax_update_wfs_googleplay_thumbnail", "update_wfs_googleplay_thumbnail");
add_action("wp_ajax_get_wfs_googleplay_thumbnail_byJSON", "get_wfs_googleplay_thumbnail_byJSON");
add_action("wp_ajax_delete_wfs_googleplay_thumbnail", "delete_wfs_googleplay_thumbnail");

?>