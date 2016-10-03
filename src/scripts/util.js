// Return items which are in list a but not b
function relativeComplement(a, b) {
    var final = []
    a.map(function(el, index) {
        if (b.indexOf(el) == -1) final.push(el)
    })
    return final
}
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
