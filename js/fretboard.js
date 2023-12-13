var slideSpeed = 300;
var noteToShow = "All";
var canClick = true;
var currentNote = document.querySelector('.note-picker .active');
var currentChord;
var currentModifier;
var chordToShow;

var notes = {
    e: ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    a: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', "A"],
    d: ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    g: ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    b: ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
};

for (let i = 0; i < notes.e.length; i++) {
    document.getElementById('mask_low_e_list').insertAdjacentHTML('beforeend', '<li note=' + notes.e[i] + '>' + notes.e[i] + '</li>');
    document.getElementById('mask_a_list').insertAdjacentHTML('beforeend', '<li note=' + notes.a[i] + '>' + notes.a[i] + '</li>');
    document.getElementById('mask_d_list').insertAdjacentHTML('beforeend', '<li note=' + notes.d[i] + '>' + notes.d[i] + '</li>');
    document.getElementById('mask_g_list').insertAdjacentHTML('beforeend', '<li note=' + notes.g[i] + '>' + notes.g[i] + '</li>');
    document.getElementById('mask_b_list').insertAdjacentHTML('beforeend', '<li note=' + notes.b[i] + '>' + notes.b[i] + '</li>');
    document.getElementById('mask_high_e_list').insertAdjacentHTML('beforeend', '<li note=' + notes.e[i] + '>' + notes.e[i] + '</li>');
};

docReady( () => {
    console.log("DocReady");
    
    document.querySelector('.controls a.down').addEventListener('click', () => {
        if (!canClick) { return false; };
        canClick = false;
        
        const mask = document.getElementsByClassName('mask');
        Array.from(mask).forEach(el => {
            let nextNote = el.querySelector('li:nth-child(12)').textContent;

            el.animate({ right: -268 }, slideSpeed);
            setTimeout(function () {
                el.querySelector('ul').insertAdjacentHTML('afterbegin', '<li note=' + nextNote + '>' + nextNote + '</li>');
                el.querySelector('li:last-child').remove();
                el.style.right = -189;
            }, slideSpeed + 20);
        });

        setTimeout(() => {
            changeOpenNotes();
            showNotes(noteToShow);
            canClick = true;
        }, slideSpeed + 20);

        return false;
    });

    document.querySelector('.controls a.up').addEventListener('click', () => {
        if (!canClick) { return false; };
        canClick = false;
        const mask = document.getElementsByClassName('mask');
        
        Array.from(mask).forEach(el => {
            let nextNote = el.querySelector('li:nth-child(2)').textContent;

            el.querySelector('ul').insertAdjacentHTML('beforeend', '<li note=' + nextNote + '>' + nextNote + '</li>');
            el.style.right = -268;
            el.querySelector('li:first-child').remove();
            el.animate({ right: -189 }, slideSpeed);

        });

        changeOpenNotes();
        showNotes(noteToShow);

        setTimeout(function () {
            canClick = true;
        }, slideSpeed + 20);
        return false;
    });

    document.querySelectorAll('.controls .note-picker li').forEach(notes => {
        notes.addEventListener('click', event => {
            noteToShow = event.target.textContent;
            currentNote = document.querySelector('.note-picker .active');
            showNotes(noteToShow);
            
            if(!event.target.classList.contains('active')) {
                if(currentChord) currentChord.classList.remove('active');
                if(currentModifier) currentModifier.classList.remove('active');
                event.target.classList.toggle('active');
                if (currentNote) currentNote.classList.toggle('active');
            };

            currentNote = event.target;
            chordToShow = null;
        });
    });

    document.querySelectorAll('.controls .chord-base li').forEach(chord => {
        chord.addEventListener('click', event => {
            chordToShow = event.target.textContent;
            showChord(chordToShow);

            if(!event.target.classList.contains('active')) {
                event.target.classList.toggle('active');
                if(currentChord && currentChord !== event.target) {
                    currentChord.classList.remove('active');
                }
                if(currentNote.classList.contains('active')) currentNote.classList.toggle('active');
                currentChord = event.target;
            }
        });
    });

    document.querySelectorAll('.controls .chord-modifiers li').forEach(modifier => {
        modifier.addEventListener('click', event => {
            mod = event.target.textContent;
            console.log(chordToShow, mod);
            showChord(chordToShow, mod);

            if(chordToShow) {
                if (!event.target.classList.contains('active')) {
                    event.target.classList.toggle('active');
                    if (currentModifier && currentModifier !== event.target) {
                        currentModifier.classList.remove('active');
                    };
                    currentModifier = event.target;
                }
            }
        });
    });
})

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    

function showNotes(noteToShow) {
    if (noteToShow == "All") {
        let all = document.querySelectorAll('.guitar-neck .notes li');
        all.forEach( el => {
            //el.animate({ opacity: 1 }, 500);
            el.style.opacity = 1;
        });

    } else {
        let notesToRemove = document.querySelectorAll('.guitar-neck .notes li:not([note="'+ noteToShow +'"])');
        notesToRemove.forEach(el => {
            //el.animate({ opacity: 0 }, 500);
            el.style.opacity = 0;
        })
        let notesToShow = document.querySelectorAll('.guitar-neck .notes li[note="' + noteToShow + '"]')
        notesToShow.forEach(el => {
            //el.animate({ opacity: 1 }, 500);
            el.style.opacity = 1;
        })
    }
}

function showChord(chordToShow, modifier) {
    if(!modifier) modifier = '5';
    let chordNotes = chords[modifier][chordToShow];
    let notesToShow;
    let notesToRemove = document.querySelectorAll('.guitar-neck .notes li');
    notesToRemove.forEach(el => {
        //el.animate({ opacity: 0 }, 500);
        el.style.opacity = 0;
    })
    
    chordNotes.forEach(note => {
        notesToShow = document.querySelectorAll('.guitar-neck .notes li[note="' + note + '"]');
        notesToShow.forEach(el => {
            //el.animate({ opacity: 1 }, 500);
            el.style.opacity = 1;
        })
        console.log(chordNotes);
    })
}

function changeOpenNotes() {
    masks = document.querySelector('.notes .mask');
    Array.from(masks).forEach(el => {
        let elClass = el.attr('class').split(' ')[1];
        let note = el.find('li:last-child').text();

        document.querySelector('.open-notes .' + elClass).text(note);
    });
}