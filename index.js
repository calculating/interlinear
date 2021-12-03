function crack() {
    paste = document.getElementsByName('latinpaste')[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    word_array = paste.split(/\W+/);
    punc_array = paste.split(' ');
    
    //console.log(word_array)
    //console.log(punc_array)
    
    document.getElementsByTagName('body')[0].innerHTML = '';

    function def_card(word, punc, form_of = '') {
        url = "https://en.wiktionary.org/w/api.php?action=parse&page=" + word.toLowerCase() + "&format=json&origin=*";
        //console.log(url)
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                //console.log(xhr.responseText);
                raw = xhr.responseText;
                text = JSON.parse(xhr.responseText);
                //console.log(text);
                if (typeof text['parse'] !== 'undefined') {
                    if (typeof text['parse']['text'] !== 'undefined') {
                        if (typeof text['parse']['text']['*'] !== 'undefined') {
                            res = text['parse']['text']['*'];
                        }
                    }
                }

                if (typeof res == 'undefined') {
                    if (word.substr(word.length - 3) == 'que') {
                        def_card(word.substr(0, word.length - 3), punc)
                    }
                } else if (res.includes('<span class="mw-headline" id="Latin">')) {
                    res = res.split('<span class="mw-headline" id="Latin">')[1].split('<hr>')[0]
                    //console.log('lemma '+ raw.includes('Latin_non-lemma_forms'))
                    if (raw.includes('Latin_non-lemma_forms') && form_of == '') {
                        next_word = res.split('<span class="form-of-definition-link">')[1].split('<a href="/wiki/')[1].split('#Latin" title')[0]
                        form_trace = res.substr(res.search('<span class="form-of-definition use-with-mention">'), res.search('<span class="form-of-definition-link">'))
                        form_trace += '</span>'
                        //console.log(form_trace)
                        //console.log(next_word)
                        def_card(next_word, punc, form_trace);
                    } else {
                        indices = [...res.matchAll(/(Noun|Pronoun|Verb|Adjective|Adverb|Preposition|Conjunction|Interjection)<\/span><span class="mw-editsection">/g)]
                        content = ''
                        for (ix = 0; ix < indices.length; ix++) {
                            content += '<span>' + res.substr(indices[ix]['index'], res.search('</ol>',indices[ix]['index']))
                            //console.log(content)
                        }
                        document.getElementsByTagName('body')[0].innerHTML += '<div style="width:12%; padding-right:3%; font-size:12px; float:left;"><h2>' + punc + '</h2>' + form_of + 'definition' + content + '</div>';
                    }
                }                

            }
        }
        xhr.send();
    }

    for (var wordCount = 0; wordCount < word_array.length; wordCount++) {
        def_card(word_array[wordCount], punc_array[wordCount]);
    }

    document.querySelectorAll("dl").forEach(e => e.remove());
    document.querySelectorAll("ul").forEach(e => e.remove());
    document.querySelectorAll("table").forEach(e => e.remove());
    document.querySelectorAll(".thumbinner").forEach(e => e.remove());
    document.querySelectorAll(".maintenance-box").forEach(e => e.remove());
    
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
