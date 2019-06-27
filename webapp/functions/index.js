const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.createWUser = functions.https.onCall((data) => {
 
      const email = data.email;
      const password = data.password;
      
    
       return admin.auth().createUser({
            email: email,
          //  phoneNumber:phone,
        //    emailVerified: isEmailVerified,
            password: password,
        //    displayName: displayName,
            disabled: false
          }).then((user) => {
      
           // if(!isEmailVerified)
             // admin.auth().sendVerificationEmail()
             
           console.log(JSON.stringify(user))
         	return {user: user}
          })
          .catch(function(error){
            console.log(error)
            throw new functions.https.HttpsError('unknown', error.message, error);
          })
    
     
    });
    // [END createUser]