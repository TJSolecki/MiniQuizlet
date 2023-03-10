/*
Plan:

    1. Figure out what a csv file is and how to parse it
    2. Once I can parse in the data I can create an array of pairs of words and defs from the file and store them in a global array called termsAndDefs
    3. Then I can just call a function addCardToDoc that will add each card visually to the html page

    4. create an addCard function that will get the text inputs and create a card on the html page

    5. add a createSet funcion that clears all inputs, removes all cards from page, and stores the set in localStorage

    6. create a main function with listeners for each button
*/

const create = {
    termsAndDefs: [],

    parseCSV: function (content) {
        const lines = content.split(/\r?\n/);
        let term = '';
        let def = '';
        const localTermsAndDefs = [];
        // parse the string and store each term+def in termsAndDefs
        for(let i = 0; i < lines.length; i++)
        {
            for(let j = 0; j < lines[i].length; j++)
            {
                if(lines[i].charAt(j) === ',')
                {
                    term = lines[i].substring(0,j);
                    def = lines[i].substring(j+1);
                    localTermsAndDefs.push([term,def]);
                    j = lines[i].length;
                }
            }
        }

        // call addCardToDoc for each set pair of term + def and add each pair to termsAndDefs
        for(let i = 0; i < localTermsAndDefs.length; i++)
        {
            console.log([localTermsAndDefs[i][0],localTermsAndDefs[i][1]]);
            create.addCardToDoc(localTermsAndDefs[i][0],localTermsAndDefs[i][1]);
            create.termsAndDefs.push(localTermsAndDefs[i]);
        }

    },

    addCard: function() {
        
        // first we are going to get the word and defintion from the form
        const wordInput = document.querySelector('#word-input');
        const word = wordInput.value;
        
        const defInput = document.querySelector('#definition-input');
        const def = defInput.value;

        if(word === '' || def === '') return;
        // next we are going to store these into an array of pairs of words and defs
        const termAndDef = [word,def];
        create.termsAndDefs.push(termAndDef);


        // then we are going to create the card on the screen (if it is the first card we are going to set display:none to the "empty-placeholder")
        create.addCardToDoc(word,def);

        // clear fields
        wordInput.value = '';
        defInput.value = '';

    },

    addCardToDoc: function (word, def) {
        const placeholder = document.querySelector('#empty-placeholder');
        placeholder.style.display = 'none';

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
    },

    createSet: function() {
        // check to see if set name and course name are filled
        const nameInput = document.querySelector('#name');
        const name = nameInput.value;

        const courseInput = document.querySelector('#course');
        const course = courseInput.value;

        if(course === '' || name === '') return;
        // get rid of the card elements and bring back the placeholder
        const cards = document.querySelectorAll('#card');
        for(let i = 0; i < cards.length; i++)
        {
            cards[i].remove();
        }

        const placeholder = document.querySelector('#empty-placeholder');
        placeholder.style.display = 'inline';

        // add the set to localstorage & clear termsAndDefs array
        Storage.createSet(name,course,create.termsAndDefs);
        create.termsAndDefs = [];

        // clear fields
        nameInput.value = '';
        courseInput.value = '';
    },

    main: function () {
        const buttonCreateSet = document.querySelector('div.form-actions button.secondary');
        buttonCreateSet.addEventListener("click",create.createSet);

        const buttonAddCard = document.querySelector('button#add-card-button');
        buttonAddCard.addEventListener("click",create.addCard);

        // add a listener for after a csv file has been chosen that calls parseCSV
        const fileInput = document.querySelector('#upload-input');
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener('load', function(event) {
                const content = event.target.result;
                create.parseCSV(content);
            });
        });
    }
};
create.main();