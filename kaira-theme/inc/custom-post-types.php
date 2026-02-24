<?php
/**
 * Register custom post types and taxonomies for Kaira.
 *
 * @package Kaira
 */

function kaira_register_post_types() {
    // Gallery CPT
    register_post_type( 'kaira_gallery', array(
        'labels' => array(
            'name'               => 'Gallery',
            'singular_name'      => 'Gallery Item',
            'add_new'            => 'Add New Item',
            'add_new_item'       => 'Add New Gallery Item',
            'edit_item'          => 'Edit Gallery Item',
            'view_item'          => 'View Gallery Item',
            'all_items'          => 'All Gallery Items',
            'search_items'       => 'Search Gallery',
            'not_found'          => 'No gallery items found.',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array( 'slug' => 'gallery-item' ),
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'show_in_rest' => true,
    ) );

    // Gallery Category taxonomy
    register_taxonomy( 'gallery_category', 'kaira_gallery', array(
        'labels' => array(
            'name'          => 'Gallery Categories',
            'singular_name' => 'Gallery Category',
            'add_new_item'  => 'Add New Gallery Category',
        ),
        'public'       => true,
        'hierarchical' => true,
        'rewrite'      => array( 'slug' => 'gallery-category' ),
        'show_in_rest' => true,
    ) );

    // Destination CPT
    register_post_type( 'kaira_destination', array(
        'labels' => array(
            'name'               => 'Destinations',
            'singular_name'      => 'Destination',
            'add_new'            => 'Add New Destination',
            'add_new_item'       => 'Add New Destination',
            'edit_item'          => 'Edit Destination',
            'view_item'          => 'View Destination',
            'all_items'          => 'All Destinations',
            'search_items'       => 'Search Destinations',
            'not_found'          => 'No destinations found.',
        ),
        'public'       => true,
        'has_archive'  => true,
        'rewrite'      => array( 'slug' => 'destination' ),
        'menu_icon'    => 'dashicons-location-alt',
        'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'show_in_rest' => true,
    ) );

    // Location taxonomy for Destinations
    register_taxonomy( 'location', 'kaira_destination', array(
        'labels' => array(
            'name'          => 'Locations',
            'singular_name' => 'Location',
            'add_new_item'  => 'Add New Location',
        ),
        'public'       => true,
        'hierarchical' => true,
        'rewrite'      => array( 'slug' => 'location' ),
        'show_in_rest' => true,
    ) );
}
add_action( 'init', 'kaira_register_post_types' );
