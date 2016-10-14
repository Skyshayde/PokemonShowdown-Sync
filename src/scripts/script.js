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
    syncTeams(relativeComplement(e.detail.inTeam, e.detail.LAST_SYNC), relativeComplement(e.detail.LAST_SYNC, e.detail.inTeam))
});

function syncTeams(newTeams, deleted) {
    console.log("adding " + JSON.stringify(newTeams))
    console.log("removing " + JSON.stringify(deleted))
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
        deleted_names = deleted.map(function(el) {
            return el.name
        })
        final = final.filter(function(x) {
            return deleted_names.indexOf(x.name) == -1
        })
        chrome.storage.sync.set({
            'teams': final
        })
        document.dispatchEvent(new CustomEvent('sync_down', {
            detail: final
        }));
    })
}
// Return items which are in list a but not b
function relativeComplement(a, b) {
    var b_names = b.map(function(el) {
        return el.name
    })
    var final = []
    a.forEach(function(el, index) {
        if (b_names.indexOf(el.name) == -1) {
            final.push(el)
        }
    })
    return final
}
// Removes duplicates from a
function uniq(a) {
    var indexes = []
    a.sort(sortByName)
    a.map(function(team, index) {
        if (index == 0) {
            return
        }
        if (a[index].name == a[index - 1].name) {
            indexes.push(index)
        }
    })
    indexes.reverse()
    indexes.forEach(function(el) {
        a.splice(el, 1)
    })
    return a
}

function sortByName(a, b) {
    if (a.name == b.name) {
        return 0
    }
    if (a.name > b.name) {
        return 1
    }
    return -1
}
document.addEventListener('check_store', function() {
    chrome.storage.sync.get("teams", function(currTeams) {
        console.log(currTeams)
    })
});
