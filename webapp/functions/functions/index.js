const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.createWUser = functions.https.onCall((data) => {

	const email = data.email;
	const password = data.password;
	const displayName = data.name
	const phone = "+91" + data.phone

	return admin.auth().createUser({
		email: email,
		phoneNumber: phone,
		emailVerified: true,
		password: password,
		displayName: displayName,
		disabled: false
	}).then((user) => {

		// if(!isEmailVerified)
		// admin.auth().sendVerificationEmail()
		return { user: user }
	})
		.catch(function (error) {
			console.log(error)
			throw new functions.https.HttpsError('unknown', error.message, error);
		})


});
// [END createUser]

// [ StartchangeWpassword]
exports.changeWPassword = functions.https.onCall((data) => {
	console.log(data)
	return admin.auth().updateUser(data.uid, { password: data.password }).then((user) => {
		return { user: user }
	})
		.catch(function (error) {
			console.log(error)
			throw new functions.https.HttpsError('unknown', error.message, error);
		})
});
// [END changeWPassword]


// [ Start updateWUser]
exports.updateWUser = functions.https.onCall((data) => {
	console.log(data)

	return admin.auth().updateUser(data.uid, {
		email: data.email,
		phoneNumber: data.phone,
		displayName: data.name,
		disabled: !data.status_active
		})
		.then((user) => {
			return { user: user }
		})
		.catch(function (error) {
			console.log(error)
			throw new functions.https.HttpsError('unknown', error.message, error);
		})
});
// [END updateWUser]
