(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var presetSelect   = document.getElementById('kaira-preset');
        var promptTextarea = document.getElementById('kaira-prompt');
        var generateBtn    = document.getElementById('kaira-generate');
        var spinner        = document.getElementById('kaira-spinner');
        var statusEl       = document.getElementById('kaira-status');
        var previewArea    = document.getElementById('kaira-preview-area');
        var previewActions = document.getElementById('kaira-preview-actions');
        var saveBtn        = document.getElementById('kaira-save');
        var discardBtn     = document.getElementById('kaira-discard');

        // Not on the studio page — bail.
        if (!generateBtn) {
            return;
        }

        var currentImageUrl = '';

        // Update placeholder text when a preset is selected.
        presetSelect.addEventListener('change', function () {
            if (this.value) {
                promptTextarea.placeholder = 'Preset selected. Add extra details here or leave blank.';
            } else {
                promptTextarea.placeholder = 'Describe the scene, outfit, location, mood...';
            }
        });

        // Generate button.
        generateBtn.addEventListener('click', function () {
            var scene  = document.getElementById('kaira-scene-type').value;
            var preset = presetSelect.value;
            var prompt = promptTextarea.value.trim();

            if (!preset && !prompt) {
                statusEl.innerHTML = '<div class="notice notice-warning inline"><p>Please select a preset or enter a scene description.</p></div>';
                return;
            }

            generateBtn.disabled = true;
            spinner.classList.add('is-active');
            statusEl.innerHTML = '<p>Generating image&hellip; This may take up to two minutes.</p>';
            previewActions.style.display = 'none';

            var data = new FormData();
            data.append('action', 'kaira_generate_image');
            data.append('nonce', kairaStudio.nonce);
            data.append('action_type', 'generate');
            data.append('scene', scene);
            data.append('preset', preset);
            data.append('prompt', prompt);

            fetch(kairaStudio.ajaxUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    generateBtn.disabled = false;
                    spinner.classList.remove('is-active');

                    if (result.success) {
                        currentImageUrl = result.data.image_url;
                        previewArea.innerHTML = '<img src="' + currentImageUrl + '" alt="Generated preview" />';
                        previewActions.style.display = 'flex';
                        statusEl.innerHTML = '<div class="notice notice-success inline"><p>Image generated successfully.</p></div>';
                    } else {
                        statusEl.innerHTML = '<div class="notice notice-error inline"><p>' + (result.data.message || 'Generation failed.') + '</p></div>';
                    }
                })
                .catch(function (err) {
                    generateBtn.disabled = false;
                    spinner.classList.remove('is-active');
                    statusEl.innerHTML = '<div class="notice notice-error inline"><p>Request failed: ' + err.message + '</p></div>';
                });
        });

        // Save button.
        saveBtn.addEventListener('click', function () {
            if (!currentImageUrl) {
                return;
            }

            saveBtn.disabled = true;
            statusEl.innerHTML = '<p>Saving to Media Library&hellip;</p>';

            var data = new FormData();
            data.append('action', 'kaira_generate_image');
            data.append('nonce', kairaStudio.nonce);
            data.append('action_type', 'save');
            data.append('image_url', currentImageUrl);
            data.append('scene', document.getElementById('kaira-scene-type').value);

            fetch(kairaStudio.ajaxUrl, {
                method: 'POST',
                credentials: 'same-origin',
                body: data,
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    saveBtn.disabled = false;

                    if (result.success) {
                        statusEl.innerHTML =
                            '<div class="notice notice-success inline"><p>' +
                            result.data.message +
                            ' <a href="' + result.data.edit_url + '" target="_blank">View in Media Library</a></p></div>';
                        previewActions.style.display = 'none';
                        currentImageUrl = '';
                    } else {
                        statusEl.innerHTML = '<div class="notice notice-error inline"><p>' + (result.data.message || 'Save failed.') + '</p></div>';
                    }
                })
                .catch(function (err) {
                    saveBtn.disabled = false;
                    statusEl.innerHTML = '<div class="notice notice-error inline"><p>Save request failed: ' + err.message + '</p></div>';
                });
        });

        // Discard button.
        discardBtn.addEventListener('click', function () {
            previewArea.innerHTML = '<p class="description">Generated image will appear here.</p>';
            previewActions.style.display = 'none';
            currentImageUrl = '';
            statusEl.innerHTML = '';
        });
    });
})();
