setInterval(addSyncButton, 1000)

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
    // localStorage.setItem('showdown_teams', window.Storage.packAllTeams(e.detail['teams']))
    Storage.teams = e.detail['teams']
    Storage.saveTeams()
    window.app.rooms.teambuilder.close()
    window.app.tryJoinRoom('teambuilder')
    addSyncButton()
        // window.app.rooms.teambuilder.update()
});
