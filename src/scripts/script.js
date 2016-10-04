chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var s = document.createElement('script');
            s.src = chrome.extension.getURL('src/inject/inject.js');
            (document.head || document.documentElement).appendChild(s);
            s.onload = function() {
                s.parentNode.removeChild(s);
            };
        }
    }, 10);
});
document.addEventListener('sync', function(e) {
    if (!e.detail.inTeam || !e.detail.LAST_SYNC) return false;
    syncTeams(e.detail.inTeam, relativeComplement(e.detail.LAST_SYNC, e.detail.inTeam))
});

function syncTeams(newTeams, deleted, callback) {
    chrome.storage.sync.get("teams", function(currTeams) {
        if (typeof currTeams.teams == 'undefined') {
            chrome.storage.sync.set({
                'teams': newTeams
            })
        } else {
            currTeams = currTeams.teams
        }
        var final = uniq(newTeams.concat(currTeams)).filter(function(el) {
            if (el != {}) return true;
        })
        // Remove teams if they are in the deleted list
        final = final.filter(function(x) {
            return deleted.indexOf(x) < 0
        })
        console.log(final)
        chrome.storage.sync.set({
            'teams': final
        })
        document.dispatchEvent(new CustomEvent('sync_down', {
            detail: e
        }));
    })
}
