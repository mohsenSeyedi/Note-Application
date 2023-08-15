const monthsArray = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];


const $ = document
const addBox = $.querySelector('.add-box'),
    popupBox = $.querySelector('.popup-box '),
    popupTitle = $.querySelector('header p'),
    popupClose = $.querySelector('header i'),
    inputElem = $.querySelector('input'),
    textareaElem = $.querySelector('textarea'),
    buttonElem = $.querySelector('button'),
    wrapperElem = $.querySelector('.wrapper')
    

let isUpdate = false
let UpdateId = null
let isCloseMenu=false
let notes = []



function showModal(titleNote , descNote) {
    
    if (isUpdate) {
        popupTitle.innerHTML = 'Update main note'
        buttonElem.innerHTML = 'Update Note'
        inputElem.value=titleNote
        textareaElem.value=descNote
    } else {
        popupTitle.innerHTML = 'Add a new note'
        buttonElem.innerHTML = 'Add Note'
    }
    inputElem.focus()
    popupBox.classList.add('show')
}

function getDateNow() {
    let nowDate =new Date()
    let year= nowDate.getFullYear()
    let data= nowDate.getDate ()
    let months=monthsArray[nowDate.getMonth()] 
    return `${months} ${data}, ${year}`
}

buttonElem.addEventListener('click', () => {

    if(isUpdate){

        let allNots=getLocalStorageNotes()

        allNots.some((note , index) => {

            if(index === UpdateId) {
              note.title=  inputElem.value
              note.description= textareaElem.value
            }
        })
        setNotesInLocalStorage(allNots)
        generateNotes(allNots)
        closeModal()
        clearInputs()

        isUpdate=false
    }
    else{
        let newNote = {
            title: inputElem.value,
            description: textareaElem.value,
            date: getDateNow()
        }
    
        notes.push(newNote)
        setNotesInLocalStorage(notes)
        closeModal()
        generateNotes(notes)
        clearInputs()
    }



})

function clearInputs () {
    inputElem.value = ''
    textareaElem.value = ''
}

function generateNotes(notes) {

    $.querySelectorAll('.note').forEach(note  => note.remove())

    notes.forEach((note , index) => {
        wrapperElem.insertAdjacentHTML('beforeend', `
        <li class="note">
        <div class="details">
          <p>${note.title}</p>
          <span>${note.description}</span>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="uil uil-ellipsis-h" onclick="showSetting(this)"></i>
            <ul class="menu">
              <li onclick="updateNote(${index} ,'${note.title}' ,'${note.description}')">
                <i class="uil uil-pen"></i>Edit
              </li>
              <li  onclick="deleteNote(${index})">
                <i class="uil uil-trash"></i>Delete
              </li>
            </ul>
          </div>
        </div>
      </li>
        `)
    })
}

function showSetting (el) {
    el.parentElement.classList.add('show')


    $.addEventListener("click" , event =>{
        console.log(event.target );

        if(event.target !== el) {
            el.parentElement.classList.remove('show')
        }
    })
}


function getLocalStorageNotes() {
    let localStorageNotes = localStorage.getItem('notes')

    if (localStorageNotes) {
        notes = JSON.parse(localStorageNotes)
    } else {
        notes = []
    }

    return notes
}

function setNotesInLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes))
}

function closeModal () {
    popupBox.classList.remove('show')
}

window.addEventListener('load', () => {
    let notes = getLocalStorageNotes()
    generateNotes(notes)
})

window.addEventListener('keyup', event => {

    if (event.key === 'Escape') {
        closeModal()
    }

})

function deleteNote(noteIndex) {

    let deleted=confirm("are you sure to delete Note ?!")
    
    if(deleted) {
        let newNote=getLocalStorageNotes()

        newNote.splice(noteIndex , 1)
        setNotesInLocalStorage(newNote)
        generateNotes(newNote)
    }

}

function updateNote(noteIid , titleNote , descNote) {
    isUpdate=true
    showModal( titleNote , descNote)
    
    UpdateId=noteIid
}

popupClose.addEventListener('click', closeModal)
addBox.addEventListener('click', showModal)