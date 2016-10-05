var Sync = {}
Sync.LAST_SYNC;
Sync.trySync = function trySync() {
    // If neither exist yet, fail
    if (!Storage.teams) return;
    // Cache if it hasn't already been done
    if (!Sync.LAST_SYNC) Sync.LAST_SYNC = Storage.teams.slice();
    // Return false if it hasn't changed
    if (JSON.stringify(Storage.teams) == JSON.stringify(Sync.LAST_SYNC)) return;
    Sync.doSync();
}
Sync.doSync = function doSync() {
    document.dispatchEvent(new CustomEvent('sync', {
        detail: {
            inTeam: Storage.teams,
            LAST_SYNC: Sync.LAST_SYNC
        }
    }));
    // Update LAST_SYNC
    Sync.LAST_SYNC = Storage.teams.slice();
}
document.addEventListener('sync_down', function(e) {
    if (!e.detail) return
    Storage.teams = e.detail
    Storage.saveAllTeams()
});
document.addEventListener('update_ui', function() {
    if (app.rooms.teambuilder) {
        app.rooms.teambuilder.close()
        app.tryJoinRoom('teambuilder')
    }
});
setInterval(Sync.trySync, 1000);
setInterval(Sync.doSync, 30000);
function test() {
  document.dispatchEvent(new CustomEvent('check_store'))
}
