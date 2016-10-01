chrome.extension.sendMessage({}, function(response) {
    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            var s = document.createElement('script');
            s.src = chrome.extension.getURL('script.js');
            (document.head || document.documentElement).appendChild(s);
            s.onload = function() {
                s.parentNode.removeChild(s);
            };
        }
    }, 10);
});

document.addEventListener('storage_get', function() {
    chrome.storage.sync.get("teams", function(e) {
        console.log(e['teams'])
        document.dispatchEvent(new CustomEvent('receive_teams', {
            detail: e
        }));
    })

});

document.addEventListener('storage_set', function(e) {
    chrome.storage.sync.get("teams", function(currTeams) {
        inTeam = e.detail
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
        // console.log(uniq(inTeam.concat(currTeams)))
        chrome.storage.sync.set({
            'teams': uniq(inTeam.concat(currTeams))
        })
    })
});

// Takes object from unpackAllTeams() and returns md5 of it
function md5Team(team) {
    return md5(JSON.stringify(team))
}

function sortNamesByDate(a) {
    a.sort(sortByName)
    var final = []
    var stage = []

    a.forEach(function(el, index) {
        if (index + 1 == a.length || a[index + 1].name != el.name) {
            stage.push(el)
            stage.sort(sortByDate)
            final.push(stage)
            stage = []
            return
        }
        if (a[index + 1].name == el.name) {
            stage.push(el)
        }
        // if (a[index + 1].name != el.name) {
        //     stage.push(el)
        //     stage.sort(sortByDate)
        //     final.push(stage)
        //     stage = []
        // }
    })
    return final
}

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

function removeDate(teams) {
    teams.forEach(function(team, index) {
        delete teams[index].date
    })
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
