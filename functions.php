<?php
/**
 * Kaira Theme functions and definitions.
 *
 * @package Kaira
 */

if ( ! defined( 'KAIRA_VERSION' ) ) {
    define( 'KAIRA_VERSION', '1.0.0' );
}

function kaira_setup() {
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', array(
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
}
add_action( 'after_setup_theme', 'kaira_setup' );

function kaira_enqueue_assets() {
    wp_enqueue_style(
        'kaira-style',
        get_stylesheet_uri(),
        array(),
        KAIRA_VERSION
    );

    wp_enqueue_style(
        'kaira-custom',
        get_template_directory_uri() . '/assets/css/custom.css',
        array(),
        KAIRA_VERSION
    );

    if ( is_page_template( 'page-gallery' ) || is_page( 'gallery' ) ) {
        wp_enqueue_script(
            'kaira-gallery',
            get_template_directory_uri() . '/assets/js/gallery.js',
            array(),
            KAIRA_VERSION,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'kaira_enqueue_assets' );

require get_template_directory() . '/inc/custom-post-types.php';
require get_template_directory() . '/inc/replicate-api.php';

if ( class_exists( 'WooCommerce' ) ) {
    require get_template_directory() . '/inc/woocommerce.php';
}

if ( is_admin() ) {
    require get_template_directory() . '/inc/image-studio.php';
    new Kaira_Image_Studio();
}
