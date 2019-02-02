// Initialize Firebase
var config = {
  apiKey: "AIzaSyAocY7p-bSgxenvdNJMvWwOezztANrtaQI",
  authDomain: "scoutchortongithubio.firebaseapp.com",
  databaseURL: "https://scoutchortongithubio.firebaseio.com",
  projectId: "scoutchortongithubio",
  storageBucket: "scoutchortongithubio.appspot.com",
  messagingSenderId: "313319819423"
};
firebase.initializeApp(config);

var dbRef = firebase.database().ref();
var hitsRef = dbRef.child('hits');

hitsRef.on('value', function(s){document.getElementById('fbHits').innerHTML = JSON.stringify(s.val());});

function getHits(page, id) {
  hits = JSON.parse(document.getElementById('fbHits').innerHTML);
  if(page) {
    if(id === null) {
      return hits[page];
    } else if(id) {
      document.getElementById(id).innerHTML = page + ": " + hits[page];
    } else {
      if(!document.getElementById('hitsDisplay')){
        throw "Please create <div> or <p> with the id 'hitsDisplay', or specify the id in the second arguement (first is the page).";
      } else {
        document.getElementById('hitsDisplay').innerHTML = page + ": " + hits[page];
      }
    }
  } else if(page === null) {
    return hits;
  } else {
    if(id) {
      document.getElementById(id).innerHTML = "home: " + hits.home;
    } else {
      if(!document.getElementById('hitsDisplay')){
        throw "Please create <div> or <p> with the id 'hitsDisplay', or specify the id in the second arguement (first is the page).";
      } else {
        document.getElementById('hitsDisplay').innerHTML = "home: " + hits.home;
      }
    }
  }
}

function updateHits(page) {
  try {
    var h = getHits(null);
    console.log(h);
    h[page] = h[page] + 1;
    console.log(h);
    hitsRef.update(h, function(){console.log("Success")});
  } catch(err) {
    if(err === "SyntaxError") {
      console.log("Syntax error when getting hits.");
    } else {
      console.log((err.name).split("").slice(0, err.name.split("").length-5));
      console.log(((err.name.split("").slice(0, err.name.split("").length-5)).join("")) + " error when running code.");
    }
  }
}
