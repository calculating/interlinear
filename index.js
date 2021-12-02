function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function crack() {
    paste = document.getElementsByName('latinpaste')[0].value;
    paste = paste.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\W+/);
    console.log(paste);
    document.getElementsByTagName('body')[0].innerHTML = "";

    function wordSearch(word, def = 0) {

        var url = "https://en.wiktionary.org/w/api.php?action=parse&page=" + word + "&format=json&origin=*";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.setRequestHeader("Accept", "*/*");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                raw = xhr.responseText;
                jason = JSON.parse(xhr.responseText);
                res = "oop";
                if (typeof jason['parse'] !== "undefined") {
                    if (typeof jason['parse']['text'] !== "undefined") {
                        if (typeof jason['parse']['text']['*'] !== "undefined") {
                            res = JSON.parse(xhr.responseText)['parse']['text']['*'];
                        }
                    }
                }
                if (raw.includes('Latin_non-lemma_forms') && def == 0) {
                    res = res.substring(res.indexOf('form-of'), res.length).split('class="Latn mention" lang="la"')[1].split('href')[1].split('"', 3)[1];
                    res = res.split('/')[2].split('#Latin')[0];
                    //console.log('next word is ' + res);
                    wordSearch(res, 1);
                } else if (res.includes('<h2><span class="mw-headline" id="Latin">')) {
                    res = res.split('<h2><span class="mw-headline" id="Latin">', 2)[1];
                    res = res.substring(res.split(/(noun<\/span><span class="mw-editsection">|pronoun<\/span><span class="mw-editsection">|verb<\/span><span class="mw-editsection">|adjective<\/span><span class="mw-editsection">|adverb<\/span><span class="mw-editsection">|preposition<\/span><span class="mw-editsection">|conjunction<\/span><span class="mw-editsection">|interjection<\/span><span class="mw-editsection">)/i)[0].lastIndexOf("<h"), res.length);
                    res = res.substring(0, res.search('</ol>'));
                    document.getElementsByTagName('body')[0].innerHTML += '<div style="width:20%; font-size:12px; float:left;"><h2>' + word + '</h2>'+res+'</div>';
                } else {
                    document.getElementsByTagName('body')[0].innerHTML += '<div style="width:20%; font-size:12px; float:left;"><h2>' + word + '</h2>undefined</div>';
                }
                document.querySelectorAll("dl").forEach(e => e.remove());
                document.querySelectorAll("ul").forEach(e => e.remove());
                document.querySelectorAll(".thumbinner").forEach(e => e.remove());
                var anchors = document.querySelectorAll("A");
                for (var i = 0; i < anchors.length; i++) {
                    var span = document.createElement("SPAN");
                    if (anchors[i].className) {
                        span.className = anchors[i].className;
                    }

                    if (anchors[i].id) {
                        span.id = anchors[i].id;
                    }

                    span.innerHTML = anchors[i].innerHTML;

                    anchors[i].parentNode.replaceChild(span, anchors[i]);
                }
            }
        }

        xhr.send();
    }

    for (var i = 0; i < paste.length; i++) {
        wordSearch(paste[i]);
        await sleep(1000);
    }

}
