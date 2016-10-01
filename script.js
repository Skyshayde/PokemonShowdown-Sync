addSyncButton()
changeUpdate()

function changeUpdate() {
    window.app.rooms.teambuilder.oldUpdate = window.app.rooms.teambuilder.update
    window.app.rooms.teambuilder.update = function() {
        window.app.rooms.teambuilder.oldUpdate()
        addSyncButton()
    }
}
// Takes object from unpackAllTeams() and extracts name from it
// returns true if sucessful, false if duplicate
function addTeam(team) {
    document.dispatchEvent(new CustomEvent('storage_set', {
        detail: team
    }));
}

function addSyncButton() {
    if (window.app.rooms.teambuilder.curTeam == null) {
        var backupbutton = document.getElementsByName('backup')[0]
        var syncbutton = document.createElement('button')
        syncbutton.innerHTML = '\n<i class="fa fa-upload"></i> Synchronize all teams'
        syncbutton.className = 'button'
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
