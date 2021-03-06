function crack() {
    paste = document.getElementsByName('latinpaste')[0].value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    paste += ' '
    word_array = paste.split(/\W+/);
    punc_array = paste.split(' ');
    
    //console.log(word_array)
    //console.log(punc_array)
    
    document.getElementById('stuff').innerHTML = '';

    function def_card(word, punc, form_of = '', previous_word = '') {
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
                    return;
                } else if (raw.includes("The page you specified doesn't exist.")){
                    //console.log(word.slice(word.length-3))
                    if (word.slice(word.length-3) == 'que') {
                        def_card(word.slice(0,word.length-3), punc)
                        //console.log(word.slice(0,word.length-3))
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
                        
                        def_card(next_word, punc, form_trace.replace(/<a[^>]*>/g, '').replace(/<[^>]*a>/g, ''), word);
                        carded = true;
                    } else {
                        regex = /(Noun|Pronoun|Verb|Adjective|Adverb|Preposition|Particle|Participle|Determiner|Conjunction|Interjection)<\/span><span class="mw-editsection">/g;
                        indices = [...res.matchAll(regex)]
                        
                        content = ''
                        block = res.slice(indices[0].index, res.search('</ol>',indices[0].index))
                        content += '<span>' + block.slice(0,block.search('\\[')) + block.slice(block.search('\\]')+1,block.length)    
                        content = content.replace(/<a[^>]*>/g, '').replace(/<[^>]*a>/g, '');
                        
                        if (previous_word !== '') {
                            word = previous_word;
                        }
                        
                        document.getElementById('stuff').innerHTML += '<div style="width:12%; height:30em; overflow-y:auto; padding-right:3%; font-size:12px; float:left;"><h2><a href="https://en.wiktionary.org/wiki/'+word+'#Latin" target="_blank">' + punc + '</a></h2>' + form_of + content + '</div>';
                        carded = true;
                    }
                }                

            }
        }
        xhr.send();
        if (!carded) {
            document.getElementById('stuff').innerHTML += '<div style="width:12%; height:30em; overflow-y:auto; padding-right:3%; font-size:12px; float:left;"><h2>' + punc + '</h2></div>';
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

        if (++inc < word_array.length - 1)
            setTimeout(timeoutLoop, delay);
        }

   setTimeout(timeoutLoop, delay);    

}
