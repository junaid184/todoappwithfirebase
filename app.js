const register = ()=>{
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    var uid = userCredential.user.uid;
    let user = {
        email: email.value,
        username: username.value
    }
    firebase.database().ref(`users/${uid}`).set(user)
    .then((userCredential)=>{
        alert('user registered')
    })
    .catch((error)=>{
        console.log(error.message);
    })
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ..
  });
}

const login = ()=>{
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in
    var uid = userCredential.user.uid;
    firebase.database().ref(`users/${uid}`).on('value',(data)=>{
        
        console.log(data.val());
        let userData = data.val();
        location.href = 'todo.html';
        console.log(userData);
    })
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
}

const signout = ()=>{
    firebase.auth().signOut().then(() => {
        location.href = 'signin.html'
      }).catch((error) => {
        console.log(error.message);
      });
}

const getUser = ()=>{
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          firebase.database().ref(`users/${uid}`).on('value',(data)=>{
        
            let userData = data.val();
            let username = document.getElementById('username');
            let email = document.getElementById('email');
            username.innerHTML = userData.username;
            email.innerHTML = userData.email;
        })
          // ...

          firebase.database().ref(`users/${uid}/todoList`).on('child_added', (data)=>{
            console.log(data.val());
            var ul = document.getElementById('list');
            var li = document.createElement('li');
            var liText = document.createElement('input');
    liText.setAttribute("value", data.val().value);
    ul.appendChild(li);
    //creating delete button
    var dltbtn = document.createElement('button');
    var dltbtnText = document.cra
    console.log(li.appendChild(liText));
    var dltbtn = document.createElement('button');
    var dltbtnText = document.createElement('img');
    dltbtnText.setAttribute('src', 'https://toppng.com/uploads/preview/recycling-bin-vector-delete-icon-png-black-11563002079w1isxqyyiv.png')
    dltbtn.setAttribute('onclick', 'delbtn(this)');
    dltbtn.setAttribute('id',data.val().key);
    dltbtn.appendChild(dltbtnText);
    li.appendChild(dltbtn);
    var hr = document.createElement('hr');
    li.appendChild(hr);
        })
        }
         else {
          // User is signed out
          // ...
          console.log('user is signed out');
          let email = document.getElementById('email');
          email.innerHTML = 'User is Signed Out'
        }
      });
}

const add = ()=>{
    var input = document.getElementById('input');
    var ul = document.getElementById('list');
    
    

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          var uid = user.uid;
          var key = firebase.database().ref(`users/${uid}/todoList`).push().key;
        let todoList ={
        value: input.value,
        key: key
        }
            firebase.database().ref(`users/${uid}/todoList/${key}`).set(todoList);
            input.value = "";

          // ...
        } else {
          // User is signed out
          // ...
          console.log('user is signed out');
          let email = document.getElementById('email');
          email.innerHTML = 'User is Signed Out'
        }
      });
}

const delbtn = (d)=>{
    firebase.auth().onAuthStateChanged((user) => {
        if(user) {
            var uid = user.uid;
            console.log(d.id)
            firebase.database().ref(`users/${uid}/todoList/${d.id}`).remove();
            console.log('deleted successfully');
            d.parentNode.remove();
        }
        else {
            console.log('usernot found')
        }
    });

}   

const delAll =(a)=>{
    firebase.auth().onAuthStateChanged((user)=>{
        if(user) {
            var uid = user.uid;
            firebase.database().ref(`users/${uid}/todoList`).remove();
            var ul = document.getElementById('list');
            ul.innerHTML = "";
        }
    })
}