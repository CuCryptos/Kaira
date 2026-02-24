<?php
/**
 * Replicate API client for Kaira image generation.
 *
 * @package Kaira
 */

class Kaira_Replicate_Client {

    private string $api_token;
    private string $api_base = 'https://api.replicate.com/v1';

    public function __construct() {
        $this->api_token = defined( 'KAIRA_REPLICATE_API_TOKEN' )
            ? KAIRA_REPLICATE_API_TOKEN
            : '';
    }

    public function is_configured(): bool {
        return ! empty( $this->api_token );
    }

    /**
     * Create a prediction (start image generation).
     *
     * @param string $model_version The model version ID on Replicate.
     * @param array  $input         Input parameters for the model.
     * @return array|WP_Error Response data or error.
     */
    public function create_prediction( string $model_version, array $input ) {
        $response = wp_remote_post( $this->api_base . '/predictions', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_token,
                'Content-Type'  => 'application/json',
                'Prefer'        => 'wait',
            ),
            'body'    => wp_json_encode( array(
                'version' => $model_version,
                'input'   => $input,
            ) ),
            'timeout' => 120,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        $code = wp_remote_retrieve_response_code( $response );

        if ( $code >= 400 ) {
            return new WP_Error(
                'replicate_api_error',
                $body['detail'] ?? 'Replicate API error',
                array( 'status' => $code )
            );
        }

        return $body;
    }

    /**
     * Get a prediction's status and output.
     *
     * @param string $prediction_id The prediction ID.
     * @return array|WP_Error
     */
    public function get_prediction( string $prediction_id ) {
        $response = wp_remote_get( $this->api_base . '/predictions/' . $prediction_id, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_token,
                'Content-Type'  => 'application/json',
            ),
            'timeout' => 30,
        ) );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        $code = wp_remote_retrieve_response_code( $response );

        if ( $code >= 400 ) {
            return new WP_Error(
                'replicate_api_error',
                $body['detail'] ?? 'Replicate API error',
                array( 'status' => $code )
            );
        }

        return $body;
    }

    /**
     * Poll a prediction until it completes or fails.
     *
     * @param string $prediction_id The prediction ID.
     * @param int    $max_attempts  Max poll attempts.
     * @param int    $interval      Seconds between polls.
     * @return array|WP_Error
     */
    public function poll_prediction( string $prediction_id, int $max_attempts = 60, int $interval = 2 ) {
        for ( $i = 0; $i < $max_attempts; $i++ ) {
            $result = $this->get_prediction( $prediction_id );

            if ( is_wp_error( $result ) ) {
                return $result;
            }

            if ( in_array( $result['status'], array( 'succeeded', 'failed', 'canceled' ), true ) ) {
                return $result;
            }

            sleep( $interval );
        }

        return new WP_Error( 'replicate_timeout', 'Prediction timed out.' );
    }

    /**
     * Download an image URL and import it into the WordPress Media Library.
     *
     * @param string $image_url  Remote image URL.
     * @param string $title      Attachment title.
     * @param string $category   Gallery category for tagging.
     * @return int|WP_Error Attachment ID or error.
     */
    public function import_to_media_library( string $image_url, string $title = '', string $category = '' ): int|WP_Error {
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $tmp_file = download_url( $image_url );
        if ( is_wp_error( $tmp_file ) ) {
            return $tmp_file;
        }

        $file_array = array(
            'name'     => sanitize_file_name( ( $title ?: 'kaira-generated' ) . '.png' ),
            'tmp_name' => $tmp_file,
        );

        $attachment_id = media_handle_sideload( $file_array, 0, $title );

        if ( is_wp_error( $attachment_id ) ) {
            @unlink( $tmp_file );
            return $attachment_id;
        }

        update_post_meta( $attachment_id, '_kaira_generated', true );
        update_post_meta( $attachment_id, '_kaira_category', sanitize_text_field( $category ) );

        return $attachment_id;
    }
}
