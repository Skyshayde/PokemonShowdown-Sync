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
    if (!e.detail.inTeam || !e.detail.LAST_SYNC) {
        console.log('failing');
        return false;
    }
    console.log(relativeComplement(e.detail.inTeam, e.detail.LAST_SYNC))
    console.log(relativeComplement(e.detail.LAST_SYNC, e.detail.inTeam))
    addTeams(relativeComplement(e.detail.inTeam, e.detail.LAST_SYNC))
    removeTeams(relativeComplement(e.detail.LAST_SYNC, e.detail.inTeam))
    // getTeams()
});
document.addEventListener('storage_get', function() {
    getTeams()
});
document.addEventListener('storage_set', function(e) {
    addTeams(e.detail)
});

function removeTeams(deleted) {
    chrome.storage.sync.get("teams", function(currTeams) {
        if (typeof currTeams.teams == 'undefined') {
            currTeams.teams = []
            return true
        } else {
            currTeams = currTeams['teams']
        }
        chrome.storage.sync.set({
            'teams': currTeams.filter(function(x) {
                return deleted.indexOf(x) < 0
            })
        })
    })
}

function addTeams(inTeam) {
    chrome.storage.sync.get("teams", function(currTeams) {
        inTeam.forEach(function(i) {
            i.date = new Date().getTime()
        })
        if (typeof currTeams.teams == 'undefined') {
            chrome.storage.sync.set({
                'teams': inTeam
            })
            return true
        } else {
            currTeams = currTeams['teams']
        }
        chrome.storage.sync.set({
            'teams': uniq(inTeam.concat(currTeams))
        })
    })
}

function getTeams() {
    chrome.storage.sync.get("teams", function(e) {
        console.log(e['teams'])
        document.dispatchEvent(new CustomEvent('receive_teams', {
            detail: e
        }));
    })
}
