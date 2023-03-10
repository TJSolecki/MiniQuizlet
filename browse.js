/*
    Plan:
        - Check search params for setName and courseName
        - Update h1 with setName
        - call Storage.retriveEntries to get a list of terms and defintions to populate the page with
        - update the DOM with dl and dt elements
        - Add event listener for create button and have it call a function called createNewCard
*/

const params = new URLSearchParams(window.location.search);

const set = params.get('setName');
const h1 = document.querySelector('h1');
h1.textContent = set + ' Flashcards';
const course = params.get('courseName');

const checkIfLoaded = function () {

    if(typeof Storage.retriveEntries !== 'undefined')
    {
        clearInterval(interval);
        const entries = Storage.retriveEntries(set,course);
        let word = '';
        let def = '';
        for(let i = 0; i < entries.length; i++)
        {
            word = entries[i][0];
            def = entries[i][1];
            const dl = document.querySelector('dl');
            const div = document.createElement('div');
            div.id = 'card';

            const dt = document.createElement('dt');
            dt.textContent = word;
            div.appendChild(dt);

            const dd = document.createElement('dd');
            dd.textContent = def;
            div.appendChild(dd);

            dl.appendChild(div);
        }
    }
};

const interval = setInterval(checkIfLoaded,15);

const addTermAndDef = function ()
{

    // get textContent of inputs
    const termInput = document.getElementById('termInput');
    const defInput = document.getElementById('defInput');
    const newterm = termInput.value;
    const newdef = defInput.value;

    if(newterm === '' || newdef === '')
    {
        document.querySelector('#createDiv').remove();
        return;
    }

    // add to localStorage
    Storage.addCards(set,course,[newterm,newdef]);

    // create div with dt&dd and corresponding term and definition & update DOM
    const dl = document.querySelector('dl');
    const div = document.createElement('div');
    div.id = 'card';

    const dt = document.createElement('dt');
    dt.textContent = newterm;
    div.appendChild(dt);

    const dd = document.createElement('dd');
    dd.textContent = newdef;
    div.appendChild(dd);

    document.querySelector('#createDiv').remove();  
    dl.insertBefore(div,dl.children[0]);

}

const createNewCard = function () {
    console.log('ding');
    // check if the div with text inputs is created, if it is remove it
    if(document.querySelector('#createDiv') != null)
    {
        console.log('bad');
        document.querySelector('#createDiv').remove();
    }
    // else, create new div with two text inputs, and buttons for done and cancel
    else
    {
        console.log('here')
        const createDiv = document.createElement('div');
        createDiv.id='createDiv';
        const termInput = document.createElement('input');
        termInput.id='termInput';
        termInput.type='text';
        termInput.placeholder='Enter the name of the term';
        const defInput = document.createElement('input');
        defInput.id='defInput';
        defInput.type='text';
        defInput.placeholder='Enter the definition';
        const buttonDiv = document.createElement('div')
        buttonDiv.id='buttonDiv';
        const cancelButton = document.createElement('button');
        cancelButton.id='cancel';
        cancelButton.textContent='Cancel';
        const doneButton = document.createElement('button');
        doneButton.id='done';
        doneButton.textContent='Done';

        // update dom
        console.log('update dom')
        createDiv.appendChild(termInput);
        createDiv.appendChild(defInput);
        buttonDiv.appendChild(cancelButton);
        buttonDiv.appendChild(doneButton);
        createDiv.appendChild(buttonDiv);
        const dl = document.querySelector('dl');
        dl.insertBefore(createDiv,dl.children[0]);
        console.log('done')

        // add event listeners to done and cancel buttons
        cancelButton.addEventListener('click',createNewCard);
        doneButton.addEventListener('click', addTermAndDef);
        console.log('listening')
    }
};

const createButton = document.querySelector('#add-button');
createButton.addEventListener('click', createNewCard);
