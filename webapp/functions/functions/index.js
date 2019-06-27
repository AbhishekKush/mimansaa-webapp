const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.createWUser = functions.https.onCall((data) => {
    // [END addFunctionTrigger]
      // [START readAddData]
      console.log(data)
      // Numbers passed from the client.
      const email = data.email;
      const password = data.password;
      // [END readAddData]
    
       admin.auth().createUser({
            email: email,
          //  phoneNumber:phone,
        //    emailVerified: isEmailVerified,
            password: password,
        //    displayName: displayName,
            disabled: false
          }).then(function(user) {
      
           // if(!isEmailVerified)
             // admin.auth().sendVerificationEmail()
             //response.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
           console.log(JSON.stringify(user))
         return JSON.stringify(user)
         // 	response.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
          //  return response.set('Access-Control-Allow-Origin', '*').status(200).send(JSON.stringify(user))
          })
          .catch(function(error){
            console.log(error)
            return JSON.stringify(error)
          })
    
     
    });
    // [END createUser]