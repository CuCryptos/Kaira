<?php
/**
 * Kaira Image Studio — admin panel for AI image generation.
 *
 * @package Kaira
 */

class Kaira_Image_Studio {

    /** @var Kaira_Replicate_Client */
    private Kaira_Replicate_Client $client;

    /**
     * Constructor.
     */
    public function __construct() {
        $this->client = new Kaira_Replicate_Client();

        add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        add_action( 'wp_ajax_kaira_generate_image', array( $this, 'ajax_generate_image' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
    }

    /**
     * Register the admin menu page.
     */
    public function add_admin_page(): void {
        add_menu_page(
            'Kaira Image Studio',
            'Image Studio',
            'manage_options',
            'kaira-image-studio',
            array( $this, 'render_page' ),
            'dashicons-camera',
            30
        );
    }

    /**
     * Enqueue admin CSS and JS only on the Image Studio page.
     *
     * @param string $hook The current admin page hook suffix.
     */
    public function enqueue_admin_assets( string $hook ): void {
        if ( 'toplevel_page_kaira-image-studio' !== $hook ) {
            return;
        }

        wp_enqueue_style(
            'kaira-image-studio',
            get_template_directory_uri() . '/assets/css/image-studio.css',
            array(),
            KAIRA_VERSION
        );

        wp_enqueue_script(
            'kaira-image-studio',
            get_template_directory_uri() . '/assets/js/image-studio.js',
            array(),
            KAIRA_VERSION,
            true
        );

        wp_localize_script( 'kaira-image-studio', 'kairaStudio', array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'kaira_image_studio' ),
        ) );
    }

    /**
     * Render the Image Studio admin page.
     */
    public function render_page(): void {
        if ( ! $this->client->is_configured() ) {
            echo '<div class="wrap"><h1>Kaira Image Studio</h1>';
            echo '<div class="notice notice-error"><p>';
            echo 'Replicate API is not configured. Please define <code>KAIRA_REPLICATE_API_TOKEN</code> in your <code>wp-config.php</code>.';
            echo '</p></div></div>';
            return;
        }

        ?>
        <div class="wrap kaira-studio-wrap">
            <h1>Kaira Image Studio</h1>

            <div class="kaira-studio-grid">
                <div class="kaira-studio-form">
                    <h2>Generate Image</h2>

                    <table class="form-table">
                        <tr>
                            <th><label for="kaira-scene-type">Scene Type</label></th>
                            <td>
                                <select id="kaira-scene-type" class="regular-text">
                                    <option value="destination">Destination</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="fitness">Fitness</option>
                                    <option value="intimate">Intimate</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="kaira-preset">Preset</label></th>
                            <td>
                                <select id="kaira-preset" class="regular-text">
                                    <option value="">-- Custom (use description below) --</option>
                                    <?php foreach ( kaira_get_presets() as $key => $preset ) : ?>
                                        <option value="<?php echo esc_attr( $key ); ?>">
                                            <?php echo esc_html( ucwords( str_replace( '_', ' ', $key ) ) ); ?>
                                            — <?php echo esc_html( $preset['description'] ); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="kaira-prompt">Scene Description</label></th>
                            <td>
                                <textarea id="kaira-prompt" class="large-text" rows="5"
                                    placeholder="Describe the scene, outfit, location, mood..."></textarea>
                                <p class="description">Leave blank when using a preset, or add extra details to customise it.</p>
                            </td>
                        </tr>
                    </table>

                    <p class="submit">
                        <button type="button" id="kaira-generate" class="button button-primary button-hero">
                            Generate Image
                        </button>
                        <span id="kaira-spinner" class="spinner" style="float:none;margin-top:0;"></span>
                    </p>
                    <div id="kaira-status"></div>
                </div>

                <div class="kaira-studio-preview">
                    <h2>Preview</h2>
                    <div id="kaira-preview-area">
                        <p class="description">Generated image will appear here.</p>
                    </div>
                    <div id="kaira-preview-actions" style="display:none;">
                        <button type="button" id="kaira-save" class="button button-primary">Save to Media Library</button>
                        <button type="button" id="kaira-discard" class="button">Discard</button>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Handle AJAX requests for generate and save actions.
     */
    public function ajax_generate_image(): void {
        check_ajax_referer( 'kaira_image_studio', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized.' ), 403 );
        }

        $action_type = sanitize_text_field( $_POST['action_type'] ?? '' );

        if ( 'generate' === $action_type ) {
            $this->handle_generate();
        } elseif ( 'save' === $action_type ) {
            $this->handle_save();
        } else {
            wp_send_json_error( array( 'message' => 'Invalid action type.' ) );
        }
    }

    /**
     * Handle the generate action.
     */
    private function handle_generate(): void {
        $scene   = sanitize_text_field( $_POST['scene'] ?? '' );
        $preset  = sanitize_text_field( $_POST['preset'] ?? '' );
        $prompt  = sanitize_textarea_field( $_POST['prompt'] ?? '' );

        // Build the full prompt.
        $full_prompt = $this->get_identity_prompt();

        if ( $preset && $this->get_preset_prompt( $preset ) ) {
            $full_prompt .= ' ' . $this->get_preset_prompt( $preset );
        }

        if ( $prompt ) {
            $full_prompt .= ' ' . $prompt;
        }

        if ( ! $preset && ! $prompt ) {
            wp_send_json_error( array( 'message' => 'Please select a preset or enter a scene description.' ) );
        }

        $model_version = get_option( 'kaira_replicate_model_version', '' );
        if ( empty( $model_version ) ) {
            wp_send_json_error( array( 'message' => 'Replicate model version is not configured. Please set it under Settings &rarr; General.' ) );
        }

        $input = array(
            'prompt'          => $full_prompt,
            'negative_prompt' => $this->get_negative_prompt(),
            'width'           => 1024,
            'height'          => 1536,
            'num_outputs'     => 1,
        );

        $result = $this->client->create_prediction( $model_version, $input );

        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }

        // If the prediction is not yet complete, poll for results.
        if ( isset( $result['status'] ) && ! in_array( $result['status'], array( 'succeeded', 'failed', 'canceled' ), true ) ) {
            $result = $this->client->poll_prediction( $result['id'] );
            if ( is_wp_error( $result ) ) {
                wp_send_json_error( array( 'message' => $result->get_error_message() ) );
            }
        }

        if ( 'failed' === ( $result['status'] ?? '' ) ) {
            wp_send_json_error( array( 'message' => 'Image generation failed: ' . ( $result['error'] ?? 'Unknown error' ) ) );
        }

        if ( 'canceled' === ( $result['status'] ?? '' ) ) {
            wp_send_json_error( array( 'message' => 'Image generation was canceled.' ) );
        }

        $output = $result['output'] ?? array();
        if ( empty( $output ) ) {
            wp_send_json_error( array( 'message' => 'No image was returned by the model.' ) );
        }

        $image_url = is_array( $output ) ? $output[0] : $output;

        wp_send_json_success( array(
            'image_url' => $image_url,
            'prompt'    => $full_prompt,
        ) );
    }

    /**
     * Handle the save action — import generated image into Media Library.
     */
    private function handle_save(): void {
        $image_url = esc_url_raw( $_POST['image_url'] ?? '' );

        if ( empty( $image_url ) ) {
            wp_send_json_error( array( 'message' => 'No image URL provided.' ) );
        }

        $parsed = wp_parse_url( $image_url );
        $allowed_hosts = array( 'replicate.delivery', 'pbxt.replicate.delivery', 'replicate.com' );
        if ( ! isset( $parsed['host'] ) || ! in_array( $parsed['host'], $allowed_hosts, true ) ) {
            wp_send_json_error( array( 'message' => 'Invalid image source domain.' ) );
        }

        $scene  = sanitize_text_field( $_POST['scene'] ?? 'general' );
        $title  = 'Kaira — ' . ucfirst( str_replace( '_', ' ', $scene ) );

        $attachment_id = $this->client->import_to_media_library( $image_url, $title, $scene );

        if ( is_wp_error( $attachment_id ) ) {
            wp_send_json_error( array( 'message' => $attachment_id->get_error_message() ) );
        }

        wp_send_json_success( array(
            'attachment_id'  => $attachment_id,
            'attachment_url' => wp_get_attachment_url( $attachment_id ),
            'edit_url'       => get_edit_post_link( $attachment_id, 'raw' ),
            'message'        => 'Image saved to Media Library.',
        ) );
    }

    /**
     * Return Kaira's identity description for prompt building.
     *
     * @return string
     */
    private function get_identity_prompt(): string {
        return kaira_get_base_prompt(
            defined( 'KAIRA_TRIGGER_TOKEN' ) ? KAIRA_TRIGGER_TOKEN : 'KAIRA'
        );
    }

    /**
     * Return the negative prompt used for all generations.
     *
     * @return string
     */
    private function get_negative_prompt(): string {
        return kaira_get_negative_prompt();
    }

    /**
     * Return a scene-specific prompt for the given preset.
     *
     * @param string $preset Preset key.
     * @return string Prompt text, or empty string if unknown.
     */
    private function get_preset_prompt( string $preset ): string {
        $presets = kaira_get_presets();
        return $presets[ $preset ]['scene'] ?? '';
    }

    /**
     * Register the Replicate model version setting on the General Settings page.
     */
    public function register_settings(): void {
        register_setting( 'general', 'kaira_replicate_model_version', array(
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default'           => '',
        ) );

        add_settings_section(
            'kaira_replicate_section',
            'Kaira Image Studio',
            function () {
                echo '<p>Configure the Replicate model used for AI image generation.</p>';
            },
            'general'
        );

        add_settings_field(
            'kaira_replicate_model_version',
            'Replicate Model Version',
            function () {
                $value = get_option( 'kaira_replicate_model_version', '' );
                echo '<input type="text" name="kaira_replicate_model_version" value="' . esc_attr( $value ) . '" class="regular-text" />';
                echo '<p class="description">The Replicate model version hash (e.g. from Stable Diffusion or FLUX).</p>';
            },
            'general',
            'kaira_replicate_section'
        );
    }
}
