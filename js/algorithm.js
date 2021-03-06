function getValue() {
    var ItemSetForm = document.getElementById("ItemSet").value;
    var ItemSetFormArr = ItemSetForm.split(",")
    var itemSet = []
    for (let index = 0; index < ItemSetFormArr.length; index++) {
        itemSet[index] = ItemSetFormArr[index].split("-")
    }
    var minSup = document.getElementById("minSup").value;
    var minCon = document.getElementById("minCon").value;
    console.log("itemSet", itemSet);
    itemSetArray1D = changeArrayTo1D(itemSet)
    var Objmode = findMode(itemSetArray1D)
    var ObjSup = findValueSupportObject(Objmode, itemSet.length, minSup)
    var valueFilterSup = filterWithMinSup(ObjSup, minSup)
    var ArrayOfkeyNames = Object.keys(valueFilterSup).sort()
    var ArrayOfMapping = MappingValue(ArrayOfkeyNames)
    console.log("ArrayOfkeyNames", ArrayOfkeyNames);
    var Container = []
    for (var index = 0; index < ArrayOfkeyNames.length; index++) {
        var ArrayOfIndex = ChangeKeyToIndex(ArrayOfkeyNames);
        var c = combination(ArrayOfIndex)
        var Fstring = filterString(c, index).sort()
        var TranSectionvalue = checkvalue(ArrayOfMapping, itemSet, Fstring);
        var ArrSup = FindSupportFormTvalue(TranSectionvalue, itemSet.length, minSup)
        var ArrIndex = SelectIndexOfArrSupOnMinSup(Fstring, ArrSup, minSup)
        var mergValue = merg(ArrSup, ArrIndex);
        Container.push(mergValue)
    }
    const FrequentItemSetFilter = chageObjKeyWhichNumberToName(Container, ArrayOfMapping)
    console.log("Frequent itemSet", FrequentItemSetFilter);
    TohtmlFraItemSet(FrequentItemSetFilter)
    console.log('Container', Container);
    const StrongRoles = chageObjKeyToNameRole(getStrongRoles(Container, minCon), ArrayOfMapping)
    console.log('StrongRoles', StrongRoles);
    TohtmlStrogRule(StrongRoles)
};

function chageObjKeyToNameRole(ObjRole, MappingValue) {
    console.log('ObjRole', ObjRole);
    var result = []
    for (let n = 0; n < ObjRole.length; n++) {
        var newObj = {}
        Object.keys(ObjRole[n]).forEach(function (keys) {
            var key = keys.split("=>");
            var strKey = ""
            for (let i = 0; i < key.length; i++) {
                var keyName = key[i].split(",");
                for (let j = 0; j < keyName.length; j++) {
                    strKey += MappingValue[keyName[j]] + ","
                }
                strKey = strKey.slice(0, -1);
                strKey += "=>"
            }
            strKey = strKey.slice(0, -2);
            newObj[strKey] = ObjRole[n][keys]
            result.push(newObj)
        })
    }
    result = Array.from(new Set(result));
    return result
}

function getStrongRoles(Container, minCon) {
    var result = []
    for (let index = 1; index < Container.length; index++) {
        Object.keys(Container[index]).forEach(function (keys) {
            const role = combinationsRole(keys.replace(/,/g, ''))
            const RoleItemSet = FindRolesItemSet(role)
            var A = FinsStrongRoles(RoleItemSet, Container, minCon);
            var RoleItemSet2 = [...RoleItemSet]
            var B = FinsStrongRoles(RoleItemSet2.reverse(), Container, minCon);
            result.push(A)
            result.push(B)
        })
    }
    return result
}

function FinsStrongRoles(Roles, MapOfFrequent, minCon) {
    var newObj = {}
    for (var index = 0; index < Roles[0].length; index++) {
        var keyLeft = Roles[0][index].split("").join()
        var keyRight = Roles[1][index].split("").join()
        keyLeft = keyLeft + "," + keyRight
        keyRight = Roles[0][index].split("").join()
        const supA = FindKeyInArrayOnObject(MapOfFrequent, keyLeft)
        const supB = FindKeyInArrayOnObject(MapOfFrequent, keyRight)
        const arrow = Roles[0][index].split("").join() + "=>" + Roles[1][index].split("").join()
        const confident = (supA / supB).toFixed(2) * 100;
        if (confident >= minCon)
            newObj[arrow] = confident
    }
    return newObj
}

function FindKeyInArrayOnObject(MapOfFrequent, key) {
    var result = null
    for (let index = 0; index < MapOfFrequent.length; index++) {
        Object.keys(MapOfFrequent[index]).forEach(function (keys) {
            if (key == keys) {
                result = MapOfFrequent[index][key]
            } else if (compareString(key, keys) && key.length > 2) {
                result = MapOfFrequent[index][keys]
            }
        })
    }
    return result
}

function compareString(key, keys) {
    var count = 0,
        bool = !1
    const charA = key.split(",")
    const charB = keys.split(",")
    for (var i = 0; i < charA.length; i++) {
        for (var j = 0; j < charB.length; j++) {
            if (charA[i] == charB[j] && charA.length == charB.length) {
                count++
            }
        }
    }
    if (count == charA.length)
        bool = !0
    return bool
}

function FindRolesItemSet(strArr) {
    strArr.shift();
    const halfOflength = Math.ceil(strArr.length / 2)
    const leftSide = strArr.splice(0, halfOflength);
    const rightSide = [...strArr].reverse()
    const Bundle = [leftSide, rightSide]
    return Bundle
}

function TohtmlFraItemSet(ArrOfObj) {
    var tableMock = "<table class='nes-table is-bordered is-dark'>";
    tableMock += "<tr>";
    tableMock += "<th>No.</th>";
    tableMock += "<th>Frequent itemSet</th>";
    tableMock += "<th>Support (%)</th>";
    tableMock += "</tr>";
    for (var i = 0, j = 1; i < ArrOfObj.length; i++) {
        Object.keys(ArrOfObj[i]).forEach(function (key) {
            tableMock += "<tr>";
            tableMock += "<td>" + j + "</td>";
            tableMock += "<td>" + key + "</td>";
            tableMock += "<td>" + ArrOfObj[i][key].toFixed(2) + "</td>";
            tableMock += "</tr>";
            j++
        })
    }
    tableMock += "</table>"
    $("#result1").html(tableMock)
}

function TohtmlStrogRule(ArrOfObj) {
    var tableMock = "<table class='nes-table is-bordered is-dark'>";
    tableMock += "<tr>";
    tableMock += "<th>No.</th>";
    tableMock += "<th>Frequent itemSet</th>";
    tableMock += "<th>Support (%)</th>";
    tableMock += "</tr>";
    for (var i = 0, j = 1; i < ArrOfObj.length; i++) {
        Object.keys(ArrOfObj[i]).forEach(function (key) {
            tableMock += "<tr>";
            tableMock += "<td>" + j + "</td>";
            tableMock += "<td>" + key + "</td>";
            tableMock += "<td>" + ArrOfObj[i][key].toFixed(2) + "</td>";
            tableMock += "</tr>";
            j++
        })
    }
    tableMock += "</table>"
    $("#result2").html(tableMock)
}

function findMode(store) {
    distribution = {}, max = 0, result = [];
    store.forEach(function (a) {
        distribution[a] = (distribution[a] || 0) + 1;
        if (distribution[a] > max) {
            max = distribution[a];
            result = [a];
            return
        }
        if (distribution[a] === max) {
            result.push(a)
        }
    });
    return distribution
}

function changeArrayTo1D(array2D) {
    var newArr = [];
    for (var i = 0; i < array2D.length; i++) {
        for (var j = 0; j < array2D[i].length; j++) {
            newArr.push(array2D[i][j])
        }
    }
    return newArr
}

function findValueSupportObject(Objmode, totalOfTransection, minSup) {
    var result = {}
    Object.keys(Objmode).forEach(key => result[key] = (Objmode[key] / totalOfTransection) * 100)
    return result
}

function filterWithMinSup(Objmode, minSup) {
    Object.keys(Objmode).forEach(function (key) {
        if (Objmode[key] < minSup) {
            delete Objmode[key]
        }
    })
    return Objmode
}

function combination(str) {
    const result = [];
    for (let i = 1; i < Math.pow(2, str.length) - 1; i++)
        result.push([...str].filter((_, pos) => (i >> pos) & 1).join(","));
    return result
}

function filterString(stringArr, AmoutOfcomma) {
    return stringArr.filter(stringArr => (stringArr.match(new RegExp(",", "g")) || []).length == AmoutOfcomma)
}

function ChangeKeyToIndex(Arrkey) {
    for (var i = 0; i < Arrkey.length; i++) {
        Arrkey[i] = i + 1
    }
    return Arrkey
}

function MappingValue(Arrkey) {
    var newArr = []
    for (var i = 0; i < Arrkey.length; i++) {
        newArr[Arrkey[i]] = i + 1
    }
    return swap(newArr)
}

function checkvalue(MappingValue, itemSet, Fstring) {
    var TranSectionCount = new Array(Fstring.length).fill(0)
    for (var i = 0; i < Fstring.length; i++) {
        const element = Fstring[i].split(",")
        for (var m = 0; m < itemSet.length; m++) {
            var count = new Array(element.length).fill(null)
            for (var n = 0; n < itemSet[m].length; n++) {
                for (var j = 0; j < element.length; j++) {
                    if (itemSet[m][n] == MappingValue[element[j]]) {
                        count[j] = !0
                    }
                }
            }
            if (count.every(returnTrue)) {
                TranSectionCount[i]++
            }
        }
    }
    return TranSectionCount
}

function FindSupportFormTvalue(TranSectionArr, totalOfTransection, minSup) {
    for (var index = 0; index < TranSectionArr.length; index++) {
        TranSectionArr[index] = (TranSectionArr[index] / totalOfTransection) * 100
    }
    return TranSectionArr
}

function SelectIndexOfArrSupOnMinSup(Fstring, ArrSup, minSup) {
    var element = new Array(ArrSup.length).fill(null)
    for (let index = 0; index < ArrSup.length; index++) {
        if (ArrSup[index] >= minSup) {
            element[index] = Fstring[index]
        }
    }
    return element
}

function merg(filter2D, InsentValue) {
    var objMerg = {}
    for (var i = 0; i < InsentValue.length; i++) {
        if (InsentValue[i] != null)
            objMerg[InsentValue[i]] = filter2D[i]
    }
    return objMerg
}

function chageObjKeyWhichNumberToName(fArr, MappingValue) {
    var result = []
    for (let index = 0; index < fArr.length; index++) {
        var newObj = {}
        Object.keys(fArr[index]).forEach(function (stringKey) {
            var stringKeyArr = stringKey.split(",")
            var keyConnect = ""
            for (var i = 0; i < stringKeyArr.length; i++) {
                keyConnect = keyConnect + MappingValue[stringKeyArr[i]] + ","
            }
            keyConnect = keyConnect.slice(0, -1);
            newObj[keyConnect] = fArr[index][stringKeyArr]
        })
        result.push(newObj)
    }
    return result
}

function returnTrue(value) {
    return value == !0
}

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key
    }
    return ret
}

function perm(xs) {
    let ret = [];
    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
        if (!rest.length) {
            ret.push([xs[i]])
        } else {
            for (let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }
    return ret
}

function combinationsRole(str) {
    var fn = function (active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active)
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a)
        }
        return a
    }
    return fn("", str, [])
}