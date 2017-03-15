document.write("<script type=\"text/javascript\" src=\"/js/grc_std_lib.js\"></script>");
document.write("<script type=\"text/javascript\" src=\"/js/jsbn.js\"></script>");

function pageInit() {
    trace("Page load complete.");
    classCounts = [0, 0, 0, 0];
    classNames = ["Uppercase", "Lowercase", "Digit", "Symbol"];
    classDepth = [26, 26, 10, 33];
    oPasscode = document.getElementById("passcode");
    EventHook.add(oPasscode, "keyup", updateState);
    EventHook.add(oPasscode, "keypress", updateState);
    updateState();
    if (window.location.hostname != "www.steve") {
        oPasscode.focus();
    }
}

function wrapStringToFit(string) {
    var pos = string.length - 3;
    while (pos > 0) {
        string = string.substring(0, pos) + "," + string.substring(pos, string.length);
        pos -= 3;
    }
    var pos = string.length - 23;
    while (pos > 0) {
        string = string.substring(0, pos) + "<br />" + string.substring(pos, string.length);
        pos -= 24;
    }
    return string + "&nbsp";
}

function formatSearchDuration(seconds) {
    if (seconds == 0) {
        return "&#8212;";
    }
    if (seconds < 1) {
        var secs = seconds.toFixed(20);
        var i = 2;
        while (secs.charAt(i) == "0") {
            ++i;
        }
        secs = seconds.toFixed(i + 1);
        return secs.replace(/0*$/, "") + " seconds";
    }
    if (seconds < 60) {
        return seconds.toFixed(2) + " seconds";
    }
    minutes = seconds / 60;
    if (minutes < 60) {
        return minutes.toFixed(2) + " minutes";
    }
    hours = minutes / 60;
    if (hours < 24) {
        return hours.toFixed(2) + " hours";
    }
    days = hours / 24;
    if (days < 7) {
        return days.toFixed(2) + " days";
    }
    weeks = days / 7;
    if (weeks < 4.333333333333333) {
        return weeks.toFixed(2) + " weeks";
    }
    months = weeks / 4.333333333333333;
    if (months < 12) {
        return months.toFixed(2) + " months";
    }
    years = months / 12;
    if (years < 100) {
        return years.toFixed(2) + " years";
    }
    centuries = years / 100;
    var suffix = " centuries";
    while (centuries > 1000000000000) {
        centuries /= 1000000000000;
        suffix = " trillion" + suffix;
    }
    while (centuries > 1000000000) {
        centuries /= 1000000000;
        suffix = " billion" + suffix;
    }
    while (centuries > 1000000) {
        centuries /= 1000000;
        suffix = " million" + suffix;
    }
    while (centuries > 1000) {
        centuries /= 1000;
        suffix = " thousand" + suffix;
    }
    while (centuries > 100) {
        centuries /= 100;
        suffix = " hundred" + suffix;
    }
    return centuries.toFixed(2) + suffix;
}

function convertCharToClass(char) {
    if (isNaN(char)) {
        return null;
    }
    if (char >= 65 && char <= 90) {
        return 0;
    }
    if (char >= 97 && char <= 122) {
        return 1;
    }
    if (char >= 48 && char <= 57) {
        return 2;
    }
    return 3;
}

function getClassOfPasscodeChar(pos) {
    return convertCharToClass(oPasscode.value.charCodeAt(pos));
}

function updateClassCounts() {
    var c, i, s, t;
    classCount = [0, 0, 0, 0];
    if (oPasscode.value.length) {
        for (i = 0; i < oPasscode.value.length; ++i) {
            ++classCount[getClassOfPasscodeChar(i)];
        }
    }
    for (c = 0; c < 4; ++c) {
        i = classCount[c];
        document.getElementById("c" + c + "i").src = i ? "/image/GreenLight.png" : "/image/RedLight.png";
        s = document.getElementById("c" + c + "t");
        t = "&nbsp;" + (i ? i : "No") + "&nbsp;" + classNames[c];
        if (i != 1 && c > 1) {
            t += "s";
        }
        s.innerHTML = t;
        s.style.color = i ? "#080" : "#800";
    }
}

function updateSearchSpace() {
    var txt = "";
    var total = 0;
    var len = oPasscode.value.length;
    var exact = new BigInteger("0");
    var power = 0;
    for (var c = 0; c < 4; ++c) {
        if (classCount[c]) {
            if (txt) {
                txt += "+";
            }
            txt += classDepth[c];
            total += classDepth[c];
        }
    }
    if (txt.indexOf("+") == -1) {
        txt = total ? txt : "none";
    } else {
        txt += " = <b>" + total + "</b>";
    }
    document.getElementById("depth").innerHTML = txt;
    if (len) {
        for (e = 1; e <= len; ++e) {
            exact = exact.add((new BigInteger(total.toString())).pow(e));
            power += Math.pow(total, e);
        }
    }
    document.getElementById("exact").innerHTML = wrapStringToFit(exact.toString());
    document.getElementById("power").innerHTML = power.toExponential(2).replace(/e\+/, " x 10<sup>") + "</sup>";
    return power;
}

function setSearchEstimate(element, factor) {
    var obj = document.getElementById(element);
    var txt = formatSearchDuration(factor);
    obj.innerHTML = txt;
    obj.style.background = txt.match(/centuries/) || factor == 0 ? "" : "#fdd";
}
updateState = function(e) {
    var i = oPasscode.value.length;
    var size;
    var t = (i ? i : "No") + " Character";
    if (i != 1) {
        t += "s";
    }
    document.getElementById("total").innerHTML = t;
    var t = (i ? i : "no") + " character";
    if (i != 1) {
        t += "s";
    }
    document.getElementById("length").innerHTML = t;
    updateClassCounts();
    size = updateSearchSpace();
    setSearchEstimate("online", size / 1000);
    setSearchEstimate("offline", size / 100000000000);
    setSearchEstimate("quantum", size / 100000000000000);
};
