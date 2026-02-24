<?php
/**
 * WooCommerce integration for Kaira theme.
 *
 * @package Kaira
 */

function kaira_woocommerce_setup() {
    if ( ! class_exists( 'WooCommerce' ) ) {
        return;
    }
    add_theme_support( 'woocommerce', array(
        'thumbnail_image_width' => 600,
        'single_image_width'    => 900,
        'product_grid'          => array(
            'default_rows'    => 3,
            'min_rows'        => 1,
            'default_columns' => 3,
            'min_columns'     => 1,
            'max_columns'     => 4,
        ),
    ) );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'kaira_woocommerce_setup' );

function kaira_woocommerce_styles() {
    if ( ! class_exists( 'WooCommerce' ) ) {
        return;
    }
    wp_enqueue_style(
        'kaira-woocommerce',
        get_template_directory_uri() . '/assets/css/woocommerce.css',
        array(),
        KAIRA_VERSION
    );
}
add_action( 'wp_enqueue_scripts', 'kaira_woocommerce_styles' );
