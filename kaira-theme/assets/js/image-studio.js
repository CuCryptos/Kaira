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
                statusEl.textContent = '';
                var warningDiv = document.createElement('div');
                warningDiv.className = 'notice notice-warning inline';
                var warningP = document.createElement('p');
                warningP.textContent = 'Please select a preset or enter a scene description.';
                warningDiv.appendChild(warningP);
                statusEl.appendChild(warningDiv);
                return;
            }

            generateBtn.disabled = true;
            spinner.classList.add('is-active');
            statusEl.textContent = '';
            var genP = document.createElement('p');
            genP.textContent = 'Generating image\u2026 This may take up to two minutes.';
            statusEl.appendChild(genP);
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
                        var img = document.createElement('img');
                        img.src = currentImageUrl;
                        img.alt = 'Generated preview';
                        img.style.maxWidth = '100%';
                        img.style.border = '1px solid #333';
                        previewArea.textContent = '';
                        previewArea.appendChild(img);
                        previewActions.style.display = 'flex';
                        statusEl.textContent = '';
                        var successDiv = document.createElement('div');
                        successDiv.className = 'notice notice-success inline';
                        var successP = document.createElement('p');
                        successP.textContent = 'Image generated successfully.';
                        successDiv.appendChild(successP);
                        statusEl.appendChild(successDiv);
                    } else {
                        statusEl.textContent = '';
                        var errorDiv = document.createElement('div');
                        errorDiv.className = 'notice notice-error inline';
                        var errorP = document.createElement('p');
                        errorP.textContent = result.data.message || 'Generation failed.';
                        errorDiv.appendChild(errorP);
                        statusEl.appendChild(errorDiv);
                    }
                })
                .catch(function (err) {
                    generateBtn.disabled = false;
                    spinner.classList.remove('is-active');
                    statusEl.textContent = '';
                    var catchDiv = document.createElement('div');
                    catchDiv.className = 'notice notice-error inline';
                    var catchP = document.createElement('p');
                    catchP.textContent = 'Request failed: ' + err.message;
                    catchDiv.appendChild(catchP);
                    statusEl.appendChild(catchDiv);
                });
        });

        // Save button.
        saveBtn.addEventListener('click', function () {
            if (!currentImageUrl) {
                return;
            }

            saveBtn.disabled = true;
            statusEl.textContent = '';
            var savingP = document.createElement('p');
            savingP.textContent = 'Saving to Media Library\u2026';
            statusEl.appendChild(savingP);

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
                        statusEl.textContent = '';
                        var saveSuccessDiv = document.createElement('div');
                        saveSuccessDiv.className = 'notice notice-success inline';
                        var saveSuccessP = document.createElement('p');
                        saveSuccessP.textContent = result.data.message + ' ';
                        var viewLink = document.createElement('a');
                        viewLink.href = result.data.edit_url;
                        viewLink.target = '_blank';
                        viewLink.textContent = 'View in Media Library';
                        saveSuccessP.appendChild(viewLink);
                        saveSuccessDiv.appendChild(saveSuccessP);
                        statusEl.appendChild(saveSuccessDiv);
                        previewActions.style.display = 'none';
                        currentImageUrl = '';
                    } else {
                        statusEl.textContent = '';
                        var saveErrorDiv = document.createElement('div');
                        saveErrorDiv.className = 'notice notice-error inline';
                        var saveErrorP = document.createElement('p');
                        saveErrorP.textContent = result.data.message || 'Save failed.';
                        saveErrorDiv.appendChild(saveErrorP);
                        statusEl.appendChild(saveErrorDiv);
                    }
                })
                .catch(function (err) {
                    saveBtn.disabled = false;
                    statusEl.textContent = '';
                    var saveCatchDiv = document.createElement('div');
                    saveCatchDiv.className = 'notice notice-error inline';
                    var saveCatchP = document.createElement('p');
                    saveCatchP.textContent = 'Save request failed: ' + err.message;
                    saveCatchDiv.appendChild(saveCatchP);
                    statusEl.appendChild(saveCatchDiv);
                });
        });

        // Discard button.
        discardBtn.addEventListener('click', function () {
            previewArea.textContent = '';
            var placeholderP = document.createElement('p');
            placeholderP.className = 'description';
            placeholderP.textContent = 'Generated image will appear here.';
            previewArea.appendChild(placeholderP);
            previewActions.style.display = 'none';
            currentImageUrl = '';
            statusEl.textContent = '';
        });
    });
})();
