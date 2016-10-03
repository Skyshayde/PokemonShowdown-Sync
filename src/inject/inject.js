var LAST_SYNC;
// setInterval(trySync, 1000)
function trySync(inTeam) {
    // If neither exist yet, fail
    if (!Storage.teams) return false;
    // Return false if it hasn't changed
    if (Storage.teams == LAST_SYNC) return false;
    if (!LAST_SYNC) LAST_SYNC = Storage.teams.slice();
    document.dispatchEvent(new CustomEvent('sync', {
        detail: {
            inTeam: Storage.teams,
            LAST_SYNC: LAST_SYNC
        }
    }));
    LAST_SYNC = Storage.teams.slice();
}

function addTeam(team) {
    document.dispatchEvent(new CustomEvent('storage_set', {
        detail: team
    }));
}

function addSyncButton() {
    if ('teambuilder' in app.rooms && app.rooms.teambuilder.curTeam == null && !$('#sync').length) {
        var backupbutton = document.getElementsByName('backup')[0]
        var syncbutton = document.createElement('button')
        syncbutton.innerHTML = '\n<i class="fa fa-upload"></i> Synchronize all teams'
        syncbutton.className = 'button'
        syncbutton.id = 'sync'
        syncbutton.onclick = function() {
            syncTeam()
        };
        backupbutton.parentNode.insertBefore(syncbutton, backupbutton.nextSibling)
        backupbutton.parentNode.insertBefore(document.createElement('br'), backupbutton.nextSibling)
    }
}

function syncTeam() {
    debug_upteams()
    debug_downteams()
}

function debug_upteams() {
    addTeam(Storage.teams)
}

function debug_downteams() {
    document.dispatchEvent(new CustomEvent('storage_get'))
}
document.addEventListener('receive_teams', function(e) {
    Storage.teams = e.detail['teams']
    Storage.saveTeams()
    window.app.rooms.teambuilder.close()
    window.app.tryJoinRoom('teambuilder')
});
