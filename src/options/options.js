// Saves options to chrome.storage.sync.
function save_options() {
  var animationsEnabled = document.getElementById('animations').checked;
  chrome.storage.sync.set({
    animationsEnabled: animationsEnabled
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    animationsEnabled: true
  }, function(items) {
    document.getElementById('animations').checked = items.animationsEnabled;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);