function crack() {
    paste = document.getElementsByName('latinpaste')[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    word_array = paste.split(/\W+/);
    punc_array = paste.split(' ');

    document.getElementsByTagName('body')[0].innerHTML = '';

    function def_card(word, punc, form_of = '') {
        url = "https://en.wiktionary.org/w/api.php?action=parse&page=" + word + "&format=json&origin=*";
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.setRequestHeader("Accept", "*/*");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {


                text = xhr.responseText;
                if (typeof text['parse'] !== 'undefined') {
                    if (typeof text['parse']['text'] !== 'undefined') {
                        if (typeof text['parse']['text']['*'] !== 'undefined') {
                            res = text['parse']['text']['*'];
                        }
                    }
                }

                content = ''
                if (typeof res == 'undefined') {
                    if (word.substr(word.length - 3) == 'que') {
                        def_card(word.substr(0, word.length - 3), punc)
                        return;
                    }
                } else if (res.includes('<span class=\"mw-headline\" id=\"Latin\">Latin</span>')) {
                    console.log('has latin')
                    res = res.split('<span class="mw-headline" id="Latin">Latin</span>')[1].split('<hr>')[0]
                    if (raw.includes('Latin_non-lemma_forms') && form_of == '') {
                        next_word = res.split('<span class="form-of-definition-link">')[1].split('<a href="/wiki/')[1].split('#Latin" title')[0]
                        form_trace = res.split('<span class=\"form-of-definition use-with-mention\">')[1].split('</span></li>')[0]
                        wordSearch(next_word, punc, form_trace);
                    } else {
                        console.log('looking for definitions')
                        regex = /(noun|pronoun|verb|adjective|adverb|preposition|conjunction|interjection)<\/span><span class="mw-editsection">/i,
                            result, indices = [];
                        while ((result = regex.exec(res))) {
                            indices.push(result.index);
                        }
                        console.log(indices)
                        for (i = 0; i < indices.length; i++) {
                            content += '<span>' + res.substr(indices[i], res.search('</ol>'))
                        }

                    }
                }
                document.getElementsByTagName('body')[0].innerHTML += '<div style="width:12%; padding-right:3%; font-size:12px; float:left;"><h2>' +
                    punc + '</h2>' + content + '</div>';

            }
        }
        xhr.send();
    }

    for (var i = 0; i < word_array.length; i++) {
        def_card(word_array[i], punc_array[i]);
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
