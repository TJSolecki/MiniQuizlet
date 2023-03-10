/*
    Questions: Exploring async and defer
        1.) the flashcards no longer have random colors. This is happening because the body of the html code has not loades so when we query for 'li a' selectors, no elements are found and nothing is changed.
        3.) Async: when this attribute is present and true the script will be fetched in parallel to parsing the html and will be evaluated as soon as it is available
            Defer: when this attribute is true, the script will only be executed after the html document has been fully parsed.
        4.) What must occur before the script gets execuded when we add the defer attribute is the creation of the li elements representing the flashcard sets, along with all other elements in the html document.
    
    1. Retrieve all the sets from localStorage
    2. For each set, create a new flashcard. Each flashcard should link its own browse.html page.
        a. To communicate which set is being browsed, set two URL Search Params. One for
        the set name and one for the course.
    3. Because index.js and storage.js are in different files, you'll need to use setInterval to wait
    for the LocalStorage object to be available before retrieving all the sets (and then showing
    them on screen).
    4. All script tags MUST use the async and defer attributes

    Plan:
        - in index.main() add a call to getSetInfo and store it in an array called setNames
        - in a for loop, create a 'li' element for each flashcard set with an 'a' element that links a barebones browse.html page which will be populated using JS and Storage
        - Figure out how the URL search params thing works and use it to pass in course and set name to the browse.html page so it can figure out what cards to load
        - 
*/

const index = {
    functions: {
        colorSets : function () {
            const sets = document.querySelectorAll('li a');
            const colorArr = ['#A0E8AF', '#FFCF56', '#73628A', '#586BA4', '#6F9CEB', '#9CB380', '#A44A3F', '#E574BC', '#EDC79B', '#C490D1'];
            for(let i = 0; i < sets.length; i++)
            {
                sets[i].style.background = index.helpers.getRandomColor();
            }
        }
    },

    helpers: {
        getRandomColor : function () {
            const colorArr = ['#A0E8AF', '#FFCF56', '#73628A', '#586BA4', '#6F9CEB', '#9CB380', '#A44A3F', '#E574BC', '#EDC79B', '#C490D1'];
            return colorArr[Math.floor(Math.random()*9)];
        }
    },

    main: function () {
        if(typeof Storage.getAllSetInfo === 'undefined') return;
        clearInterval(interval);
        setNames = Storage.getAllSetInfo().setList;
        console.log(setNames);
        console.log('there are ', setNames.length, ' set(s)');
        const ul = document.querySelector('ul');
        for(let i = 0; i < setNames.length; i++) // adds each set as a li inside the ul element in index.html
        {
            const set = JSON.parse(localStorage.getItem(setNames[i]));
            const li = document.createElement("li");
            const a = document.createElement('a');

            const setName = set.setName;
            const courseName = set.setCourse;

            const params = new URLSearchParams();
            params.set('setName', setName);
            params.set('courseName', courseName);

            const url = `browse.html?${params.toString()}`; // pass setName and courseName as a key value pairs to the browse page which can be retrived once navigated to

            a.href = url;
            const h2 = document.createElement('h2');
            const h2Text = document.createTextNode(set.setName);
            h2.appendChild(h2Text);
            a.appendChild(h2);

            const p1 = document.createElement('p');
            const p1Text = document.createTextNode(set.setCourse);
            p1.appendChild(p1Text);
            a.appendChild(p1);

            const p2 = document.createElement('p');
            const p2Text = document.createTextNode('' + set.setTermsAndDefs.length + ' words');
            p2.appendChild(p2Text);
            a.appendChild(p2);

            li.appendChild(a);
            ul.appendChild(li);
        }
        index.functions.colorSets();
    }
}
const interval = setInterval(index.main,15);
