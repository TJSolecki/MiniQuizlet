/*
  Plan:
    - Start off with the storage.js file from the todo example in class
    - This already ahs the storage object which will contain our funcitons
    - create the getSetName function
      - have the function concatonate 2 strings, replacing all uppercase letters with lowercase, and all spaces with dashes
    - Create the function getAllSetInfo and use the getAllTodos function as reference for how to use localStorage.getItem()
      - Look into the documentation on JSON.parse
    - Create the function createSet((string) name, (string) course, (array of pairs) termsAndDefs)
      - add meta data to the "sets" key
      - Retreive the existing value of the set from local storage and update it
      - Look up how to convert the list of terms and definitions to s csv file and save it to localstorage
    - Create function that adds new cards to an existing set
      - retrive set info from localstorage JSON / CSV file
      - add terms and defintions from parameters to the JSON / CSV file and save it
    - Create function to retrive all the entries from a set
      - retrieve JSON / CSV file from local storage
      - parse the data
      - return the data
*/

const Storage = {
  // retrieve a list of all todo items
  getAllSetInfo: function () {
    // here for the lab you are going to want to essentially do the same thing. Instead of todos it will be sets
    const allSets = localStorage.getItem("sets");
    if (!allSets) {
      return [];
    }

    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
    return JSON.parse(allSets);
  },

  createSet: function (name,course,termsAndDefs) {
    let setName = Storage.getSetName(name,course);
    

    // handles sets wrapper object and makes sure all sets are listed within it
    let sets = localStorage.getItem('sets');
    
    if(!sets)
    {
      const allSets = {
        setList: [setName]
      };
      localStorage.setItem('sets', JSON.stringify(allSets));
    }
    else
    {
      sets = JSON.parse(sets);
      sets.setList.unshift(setName);
      localStorage.setItem('sets', JSON.stringify(sets))
    }
    
    // creates new set object
    const set = {
      setName: name,
      setCourse: course,
      setTermsAndDefs: termsAndDefs
    }

    // stores set object within localStorage in JSON format with setName as the key
    localStorage.setItem(setName, JSON.stringify(set));
  },

  addCards: function(name, course, termAndDef) {
    console.log('been called ',name,course,termAndDef)
    let setName = Storage.getSetName(name,course);
    let set = JSON.parse(localStorage.getItem(setName));
    if(!set){
      console.log("this set does not yet exit so you can't add to it");
      return;
    }
    set.setTermsAndDefs.unshift(termAndDef);
    localStorage.setItem(setName, JSON.stringify(set));
  },

  getSetName: function (name, course) {
    let result = "" + name + course;
    result = result.toLowerCase();
    for(let i = 0; i < result.length; i++)
    {
      if(result.charAt(i) === ' ') { result = result.substring(0,i) + '-' + result.substring(i+1); }
    }
    return result;
  },

  retriveEntries: function(name, course)
  {
    let setName = Storage.getSetName(name,course);
    if(!localStorage.getItem(setName)) { console.log('this set does not exist'); return; }
    const set = JSON.parse(localStorage.getItem(setName));
    return set.setTermsAndDefs;
  }
};
