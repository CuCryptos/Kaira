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
                                    <option value="mykonos_pool">Mykonos Pool</option>
                                    <option value="paris_night">Paris Night</option>
                                    <option value="bali_sunset">Bali Sunset</option>
                                    <option value="dubai_skyline">Dubai Skyline</option>
                                    <option value="tulum_beach">Tulum Beach</option>
                                    <option value="amalfi_coast">Amalfi Coast</option>
                                    <option value="gym_workout">Gym Workout</option>
                                    <option value="high_fashion">High Fashion</option>
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
        return 'A stunning woman named Kaira with radiant tan skin, striking dark eyes, long flowing dark hair, high cheekbones, and a confident elegant expression. She has a fit, graceful figure and exudes luxury and sophistication.';
    }

    /**
     * Return the negative prompt used for all generations.
     *
     * @return string
     */
    private function get_negative_prompt(): string {
        return 'deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, mutated hands, extra fingers, missing fingers, blurry, low quality, watermark, text, signature';
    }

    /**
     * Return a scene-specific prompt for the given preset.
     *
     * @param string $preset Preset key.
     * @return string Prompt text, or empty string if unknown.
     */
    private function get_preset_prompt( string $preset ): string {
        $presets = array(
            'mykonos_pool'  => 'Relaxing by an infinity pool in Mykonos, Greece, wearing a designer swimsuit, white-washed buildings in the background, golden hour lighting, Mediterranean luxury.',
            'paris_night'   => 'Walking down a cobblestone Parisian street at night, wearing an elegant black dress, Eiffel Tower softly lit in the background, warm streetlamp glow, cinematic.',
            'bali_sunset'   => 'Standing on a cliff overlooking the ocean in Bali at sunset, wearing a flowing white dress, tropical foliage, golden orange sky, serene and majestic.',
            'dubai_skyline' => 'On a luxury rooftop terrace in Dubai, wearing a glamorous evening gown, Burj Khalifa and city skyline in the background, twilight blue hour, opulent.',
            'tulum_beach'   => 'On a pristine beach in Tulum, Mexico, wearing a bohemian bikini and sarong, turquoise water, rustic beach cabana, relaxed tropical luxury.',
            'amalfi_coast'  => 'On a terrace overlooking the Amalfi Coast, wearing a sundress and wide-brimmed hat, colorful Italian coastal village below, bright Mediterranean sunlight.',
            'gym_workout'   => 'In a high-end modern gym, wearing stylish athletic wear, mid-workout with perfect form, dramatic lighting, fitness and strength.',
            'high_fashion'  => 'High fashion editorial shoot in a luxury studio, wearing a couture gown, dramatic lighting with shadows, confident powerful pose, fashion magazine quality.',
        );

        return $presets[ $preset ] ?? '';
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
