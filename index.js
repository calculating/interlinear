function crack() {
    pData = document.getElementsByName('fpacket')[0].value;
    pData = pData.split("</option>")
    pData.splice(-1)
    classArr = [];
    pData.forEach(classify)
    function classify(x, i) {
        long = x.slice(x.lastIndexOf(">") + 1)
        medium = long.slice(long.indexOf(" ")) + "<br>"
        short = medium.slice(0, medium.lastIndexOf("("))

        if (short[short.length - 1] == "1") {
            short += "st"
        } else if (short[short.length - 1] == "2") {
            short += "nd"
        } else if (short[short.length - 1] == "3") {
            short += "rd"
        } else {
            short += "th"
        }
        short += " period"

        teach = medium.slice(medium.lastIndexOf(")")+3)

        classArr[parseInt(short[short.length - 10])] = short + teach + "<br>"
    }

    classes = ""

    classArr.forEach(e => classes += e);
    document.getElementsByClassName("slideContainer")[0].remove()
    document.getElementsByClassName("watermark")[0].innerHTML = "schedulecheck.org"
    document.getElementById("result").innerHTML = classes
}

