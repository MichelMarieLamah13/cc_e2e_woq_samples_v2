import { DATA, NOTE } from "./data.js";


function add_note() {
    const note = document.querySelector("#section-0 .note")
    note.innerHTML = ""
    NOTE.forEach(content => {
        const li = document.createElement("li")
        li.innerHTML = content
        note.appendChild(li)
    })

}

function add_toc(parent, id, title) {
    const li = document.createElement("li")
    li.innerHTML = `<li><a href='#section-${id}'>${title}</a></li>`
    parent.appendChild(li)
}

function add_section(data) {
    const section = document.createElement("div")
    section.id = "section-" + data.id
    section.className = "section"

    const previous = document.getElementById("section-" + (data.id - 1))

    const h2 = document.createElement("h2")
    h2.innerHTML = data.title
    section.appendChild(h2)
   
    if (data.description){
        const DESC  = document.createElement("ul");
        data.description.forEach(content => {
            const li = document.createElement("li")
            li.innerHTML = content
            DESC.appendChild(li)
        })
        section.appendChild(DESC)
    }

    // --- AJOUT : création du dropdown ---
    const select = document.createElement("select")
    const defaultOption = document.createElement("option")
    defaultOption.text = "-- Select an audio --"
    defaultOption.disabled = true
    defaultOption.selected = true
    select.id = "dropdown-" + data.id
    select.appendChild(defaultOption)

    // ajouter les IDs disponibles
    data.content.forEach(d => {
        if (!d.hide) {
            const opt = document.createElement("option")
            opt.value = d.id
            opt.text = d.id + "["+d.gender+"]"
            select.appendChild(opt)
        }
    })

    section.appendChild(select)

    // conteneur pour afficher les audios
    const displayDiv = document.createElement("div")
    displayDiv.className = "audio-display"
    section.appendChild(displayDiv)
    // --- fin ajout dropdown ---

    // --- Événement : afficher les audios quand on change d'ID ---
    select.addEventListener("change", (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const value = selectedOption.value;  // the value attribute
        const text  = selectedOption.text; 
        displayDiv.innerHTML = "" // vider avant d'afficher le nouveau contenu

        const d = data.content.find(item => item.id === value)
        if (!d) return

        // Partie déjà fournie (réutilisée telle quelle)
        const h3 = document.createElement("h3")
        h3.innerHTML = text
        displayDiv.appendChild(h3)

        if (d.transcription){
            const p = document.createElement("p")
            let t = d.transcription
            t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
            p.innerHTML = `<p><b>Transcription</b>: ${t}</p>`
            displayDiv.appendChild(p)
        }

        const divs = document.createElement("div")
        divs.className = "playlist"

        // Original
        const originalDiv = document.createElement("div")
        originalDiv.className = "labeled-audio labeled-audio2"
        originalDiv.innerHTML = `
            <p class='text text2'>Original</p>
            <audio preload='metadata' controls>
              <source src='${d.path}' type='audio/mpeg'>
            </audio>
        `
        divs.appendChild(originalDiv)


        // Audios compressés
        d.content.forEach(c => {
            if (!c.hide) {
                const div = document.createElement("div")
                div.className = "labeled-audio labeled-audio2"
                div.innerHTML = `
                    <p class='text text2'>${c.title}</p>
                    <audio preload='metadata' controls>
                      <source src='${c.path}' type='audio/mpeg'>
                    </audio>
                `
                divs.appendChild(div)
            }
        })
        displayDiv.appendChild(divs)
    })

    const hr = document.createElement("hr")
    previous.after(hr)
    hr.after(section)
}


function clear_sections() {
    const targetSection = document.getElementById("section-0");
    
    if (targetSection) {
        let current = targetSection.nextElementSibling;

        while (current) {
            const next = current.nextElementSibling;

            if (current.id && current.id.toLowerCase().includes("section")) {
                current.remove()
            }

            current = next;
        }
    }
}
function create_content() {
    add_note()
    const toc = document.querySelector("#section-0 .toc")
    toc.innerHTML = ""

    const hrs = document.querySelectorAll("hr")
    hrs.forEach(hr => {
        hr.remove()
    })

    const divs = document.querySelectorAll(".labeled-audio")
    divs.forEach(div => {
        div.remove()
    })

    clear_sections()

    DATA.forEach((d, pos) => {
        d.id = pos+1
        if (!d.hide) {
            add_toc(toc, d.id, d.title)
            add_section(d)
        }
    })

}

document.addEventListener("DOMContentLoaded", function () {
    create_content()
});

