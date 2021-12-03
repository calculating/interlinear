function crack() {
    paste = document.getElementsByName('latinpaste')[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    word_array = paste.split(/\W+/);
    punc_array = paste.split(' ');
    
    //console.log(word_array)
    //console.log(punc_array)
    
    document.getElementById('stuff').innerHTML = '';

    function def_card(word, punc, form_of = '') {
        carded = false;
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
                    if (word.slice(0, word.length - 3) == 'que') {
                        def_card(word.slice(0, word.length - 3), punc)
                        console.log('eque')
                        carded = true;
                    }
                } else if (res.includes('<span class="mw-headline" id="Latin">')) {
                    res = res.split('<span class="mw-headline" id="Latin">')[1].split('<hr>')[0]
                    //console.log('lemma '+ raw.includes('Latin_non-lemma_forms'))
                    if (raw.includes('Latin_non-lemma_forms') && res.includes('<span class="form-of-definition-link"><i class="Latn mention" lang="la">') && form_of == '') {
                        next_word = res.split('<span class="form-of-definition-link">')[1].split('<a href="/wiki/')[1].split('#Latin" title')[0]
                        //console.log(res)
                        //console.log(res.search('<span class="form-of-definition use-with-mention">'))
                        //console.log(res.search('form-of-definition-link'))
                        form_trace = res.slice(res.search('<span class="form-of-definition use-with-mention">'), res.search('<span class="form-of-definition-link">')) + "a "
                        //form_trace += '</span>'
                        //console.log(form_trace)
                        //console.log(next_word)
                        def_card(next_word, punc, form_trace);
                        carded = true;
                    } else {
                        indices = res.matchAll(/(Noun|Pronoun|Verb|Adjective|Adverb|Preposition|Particle|Participle|Determiner|Conjunction|Interjection)<\/span><span class="mw-editsection">/g)
                        
                        content = ''
                        for (const match of indices){
                            block = res.slice(match.index, res.search('</ol>',match.index))
                            content += '<span>' + block.slice(0,block.search('\\[')) + block.slice(block.search('\\]')+1,block.length)    
                        }
                        
                        document.getElementById('stuff').innerHTML += '<div style="width:12%; padding-right:3%; font-size:12px; float:left;"><h2>' + punc + '</h2>' + form_of + content + '</div>';
                        carded = true;
                    }
                }                

            }
        }
        xhr.send();
        if (!carded) {
            document.getElementById('stuff').innerHTML += '<div style="width:12%; padding-right:3%; font-size:12px; float:left;"><h2>' + punc + '</h2></div>';
        }
    }
    
    var inc = 0,
       delay = 10; // 100 milliseconds

   function timeoutLoop() {
       
       def_card(word_array[inc], punc_array[inc]);
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
        document.getElementById('stuff').innerHTML = document.getElementById('stuff').innerHTML.replace(/<span[^>]*>/g, '').replace(/<[^>]*span>/g, '');

        if (++inc < word_array.length)
            setTimeout(timeoutLoop, delay);
        }

   setTimeout(timeoutLoop, delay);    

}
