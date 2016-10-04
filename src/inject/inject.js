var LAST_SYNC;
// setInterval(trySync, 1000)
function trySync(inTeam) {
    // If neither exist yet, fail
    if (!Storage.teams) return false;
    // Return false if it hasn't changed
    if (Storage.teams == LAST_SYNC) return false;
    // Cache if it hasn't already been done
    if (!LAST_SYNC) LAST_SYNC = Storage.teams.slice();
    document.dispatchEvent(new CustomEvent('sync', {
        detail: {
            inTeam: Storage.teams,
            LAST_SYNC: LAST_SYNC
        }
    }));
    // Update LAST_SYNC
    LAST_SYNC = Storage.teams.slice();
}
document.addEventListener('sync_down', function(e) {
    Storage.teams = e.detail
    Storage.saveTeams()
    window.app.rooms.teambuilder.close()
    window.app.tryJoinRoom('teambuilder')
});
