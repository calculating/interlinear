function crack() {
    paste = document.getElementsByName('latinpaste')[0].value;
    paste = paste.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\W+/);
    document.getElementsByTagName('body')[0].innerHTML = "";

    paste.forEach(word => wordSearch(word));    

    function wordSearch(word, def = 0) {
        
        console.log(word);
        var url = "https://en.wiktionary.org/w/api.php?action=parse&page=" + word + "&format=json&origin=*";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.setRequestHeader("Accept", "*/*");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                raw = xhr.responseText;
                if (typeof JSON.parse(xhr.responseText)['parse']['text']['*'] == "undefined") {
                    break;
                }
                res = JSON.parse(xhr.responseText)['parse']['text']['*'];
                if (raw.includes('Latin_non-lemma_forms') && def == 0) {
                    res = res.substring(res.indexOf('form-of'), res.length).split('class="Latn mention" lang="la"')[1].split('href')[1].split('"', 3)[1];
                    res = res.split('/')[2].split('#Latin')[0];
                    console.log('next word is ' + res);
                    wordSearch(res, 1);
                } else if (res.includes('<h2><span class="mw-headline')){
                    res = res.split('<h2><span class="mw-headline" id="Latin">', 2)[1];
                    res = res.substring(res.split(/(noun<\/span><span class="mw-editsection">|pronoun<\/span><span class="mw-editsection">|verb<\/span><span class="mw-editsection">|adjective<\/span><span class="mw-editsection">|adverb<\/span><span class="mw-editsection">|preposition<\/span><span class="mw-editsection">|conjunction<\/span><span class="mw-editsection">|interjection<\/span><span class="mw-editsection">)/i)[0].lastIndexOf("<h"), res.length);
                    res = res.substring(0, res.search('</ol>'));
                    document.getElementsByTagName('body')[0].innerHTML += '<div style="width:10%; font-size:15px; float:left;"><h2>'+word+'</h2>'+res+'</div>';
                    


                }
            }
        }

        xhr.send();
    }
document.querySelectorAll("dl").forEach(e => e.remove());
                    document.querySelectorAll("ul").forEach(e => e.remove());
                    document.querySelectorAll(".thumbinner").forEach(e => e.remove());

}
