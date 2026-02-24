<?php
/**
 * Kaira Theme functions and definitions.
 *
 * @package Kaira
 */

if ( ! defined( 'KAIRA_VERSION' ) ) {
    define( 'KAIRA_VERSION', '2.0.0' );
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

    wp_enqueue_script(
        'kaira-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-cursor',
        get_template_directory_uri() . '/assets/js/cursor.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-tilt',
        get_template_directory_uri() . '/assets/js/tilt.js',
        array(),
        KAIRA_VERSION,
        true
    );

    wp_enqueue_script(
        'kaira-split-text',
        get_template_directory_uri() . '/assets/js/split-text.js',
        array(),
        KAIRA_VERSION,
        true
    );

    if ( is_front_page() ) {
        wp_enqueue_script(
            'kaira-particles',
            get_template_directory_uri() . '/assets/js/particles.js',
            array(),
            KAIRA_VERSION,
            true
        );
    }

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

/**
 * Remove Bluehost/NFD framework styles and scripts that conflict with theme CSS.
 */
function kaira_dequeue_nfd_assets() {
    global $wp_styles, $wp_scripts;

    $blocked_prefixes = array( 'nfd-', 'jeep-', 'bluehost-', 'newfold-', 'wonder-', 'jeep_starter' );

    if ( ! empty( $wp_styles->registered ) ) {
        foreach ( $wp_styles->registered as $handle => $dep ) {
            foreach ( $blocked_prefixes as $prefix ) {
                if ( strpos( $handle, $prefix ) === 0 ) {
                    wp_dequeue_style( $handle );
                    wp_deregister_style( $handle );
                    break;
                }
            }
        }
    }

    if ( ! empty( $wp_scripts->registered ) ) {
        foreach ( $wp_scripts->registered as $handle => $dep ) {
            foreach ( $blocked_prefixes as $prefix ) {
                if ( strpos( $handle, $prefix ) === 0 ) {
                    wp_dequeue_script( $handle );
                    wp_deregister_script( $handle );
                    break;
                }
            }
        }
    }
}
add_action( 'wp_enqueue_scripts', 'kaira_dequeue_nfd_assets', 999 );

/**
 * Reset Site Editor template overrides when theme version changes.
 * Forces WordPress to use our theme file templates instead of stale DB copies.
 */
function kaira_reset_templates_on_update() {
    $stored = get_option( 'kaira_template_version', '' );
    if ( $stored === KAIRA_VERSION ) {
        return;
    }

    $templates = get_posts( array(
        'post_type'      => array( 'wp_template', 'wp_template_part' ),
        'posts_per_page' => -1,
        'no_found_rows'  => true,
        'tax_query'      => array(
            array(
                'taxonomy' => 'wp_theme',
                'field'    => 'slug',
                'terms'    => get_stylesheet(),
            ),
        ),
    ) );

    foreach ( $templates as $template ) {
        wp_delete_post( $template->ID, true );
    }

    update_option( 'kaira_template_version', KAIRA_VERSION );
}
add_action( 'after_setup_theme', 'kaira_reset_templates_on_update' );

require get_template_directory() . '/inc/custom-post-types.php';
require get_template_directory() . '/inc/replicate-api.php';
require get_template_directory() . '/inc/kaira-presets-generated.php';

require get_template_directory() . '/inc/woocommerce.php';

if ( is_admin() ) {
    require get_template_directory() . '/inc/image-studio.php';
    new Kaira_Image_Studio();
}
