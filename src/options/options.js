// Saves options to chrome.storage.sync.
function save_options() {
    var animationsEnabled = document.getElementById('animations').checked;
    var reverseEnabled = document.getElementById('reverse').checked;
    var sensitivity = document.getElementById('sensitivity').value;
    chrome.storage.sync.set({
        animationsEnabled: animationsEnabled,
        reverseEnabled: reverseEnabled,
        sensitivity: isNormalInteger(sensitivity) ? sensitivity : 25
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.innerHTML = '<span class="success">Options saved.</span>';
        setTimeout(function () {
            status.textContent = '';
        }, 2000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        animationsEnabled: true,
        reverseEnabled: false,
        sensitivity: 25
    }, function (items) {
        document.getElementById('animations').checked = items.animationsEnabled;
        document.getElementById('reverse').checked = items.reverseEnabled;
        document.getElementById('sensitivity').value = items.sensitivity;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}