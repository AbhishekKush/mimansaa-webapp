<template>
	<v-card>
		<v-card-title class="py-2 title grey lighten-2">
			<span class>Add New User</span>
			<v-spacer></v-spacer>
			<v-btn icon @click="closeDialog()">
				<v-icon>close</v-icon>
			</v-btn>
		</v-card-title>
		<v-container grid-list-md>
			<v-form v-model="isFormValid" ref="form">
				<v-layout row wrap>
					<v-flex xs12 sm6 md6>
						<v-text-field label="Name*" v-model="newUser.name" required></v-text-field>
					</v-flex>
					<v-flex xs12 sm6 md6>
						<v-text-field
							label="Phone No"
							v-model="newUser.phone"
							:rules="phoneRules"
							hint="10 digit mobile no."
						></v-text-field>
					</v-flex>
					<v-flex xs12 sm6 md9>
						<v-text-field
							label="Address*"
							v-model="newUser.address"
							hint="Type full address along with pincode"
							required
						></v-text-field>
					</v-flex>
					<v-flex xs12 sm6 md3>
						<v-btn color="blue-grey darken-2" outline @click="locationDialog = true">
							<v-icon dark left>location_on</v-icon>Pick Location
						</v-btn>
						<v-dialog v-model="locationDialog" max-width="800px" persistent>
							<v-card>
								<v-card-title class="py-2 title grey lighten-2">
									<span class>Set Location</span>
									<v-spacer></v-spacer>
									<v-btn icon @click="locationDialog = false">
										<v-icon>close</v-icon>
									</v-btn>
								</v-card-title>
								<set-map class="pa-4" @locationChanged="loctionUpdated" />
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary" flat="flat" @click="locationDialog = false">Disagree</v-btn>
									<v-btn color="primary" @click="saveChangedLocation()">Save Location</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-flex>
					<v-flex xs12>
						<v-text-field label="Email*" v-model="newUser.email" required></v-text-field>
					</v-flex>
					<v-flex xs12 md8>
						<v-text-field
							label="Password*"
							v-model="password"
							:type="pVisibility ? 'text' : 'password'"
							:append-icon="pVisibility ? 'visibility' : 'visibility_off'"
							required
							@click:append="pVisibility = !pVisibility;"
						></v-text-field>
					</v-flex>
					<v-flex xs12 md4>
						<v-btn color="primary" outline @click="generatePassword()">
							<v-icon dark left>autorenew</v-icon>Generate Password
						</v-btn>
					</v-flex>
					<v-flex xs12 sm12>
						<v-radio-group v-model="newUser.user_type" row required color="primary">
							<v-radio label="Web Admin" value="webadmin" color="error"></v-radio>
							<v-radio label="Transporter" value="transporter" color="primary"></v-radio>
							<v-radio label="Driver" value="driver" color="primary"></v-radio>
							<v-radio label="Parent" value="parent" color="primary"></v-radio>
							<v-radio label="Guard" value="guard" color="primary"></v-radio>
						</v-radio-group>
					</v-flex>
					<v-flex sm4 v-if="newUser.user_type=='transporter'">
						<v-text-field label="Company ID" v-model="extraTranporterField.company_id"></v-text-field>
					</v-flex>
					<v-flex sm4 v-if="newUser.user_type=='transporter'">
						<v-text-field
							label="Refferal ID"
							v-model="referred_by"
							:success-messages="referred_byName"
							:rules="referred_byRules"
						></v-text-field>
					</v-flex>
					<v-flex sm4 v-if="newUser.user_type=='transporter'">
						<input type="hidden" :value="extraTranporterField.referral_code" id="refferal_code" />
						<h2
							class="display-1 text-xs-center"
							@click="copyToClipboard()"
						>{{extraTranporterField.referral_code}}</h2>
					</v-flex>
				</v-layout>
			</v-form>
		</v-container>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" flat @click="closeDialog()">Close</v-btn>
			<v-btn color="primary darken-1" :disabled="loading || !isFormValid" :loading="loading" @click="addNewUser()">Save</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import setMap from "@/components/setMap";
import firebase from "firebase";
export default {
	components: {
		setMap
	},
	data() {
		return {
			loading:false,
			newUser: {
				name: "",
				phone: "",
				phone_verified: true,
				address: "",
				home_latitude: 0,
				home_longitude: 0,
				status_active: true,
				email: "",
				email_verified: true,
				user_type: ""
			},
			extraTranporterField: {
				company_id: "",
				referral_code: ""
			},
			referred_by: "",
			referred_byUid: "",
			referred_byName: "",
			password: "",
			isValidReferralID: false,
			pVisibility: false,
			locationDialog: false,
			templat: null,
			templng: null,
			isFormValid: false,
			phoneRules: [
				v => !!v || "Phone no is required",
				// v => v.length == 13 || "+91 Enter valid phone no. ",
				v =>
					/^((\+){1}91){1}[1-9]{1}[0-9]{9}$/.test(v) || "Enter valid phone no."
			]
		};
	},
	props: ["s"],
	watch: {},
	created() {
		this.generateRandomStringCode();
	},
	computed: {
		referred_byRules() {
			firebase
				.database()
				.ref("info_transporter/")
				.orderByChild("referral_code")
				.equalTo(this.referred_by)
				.once("value")
				.then(snapshot => {
					var obj = snapshot.val();

					if (obj) {
						this.isValidReferralID = true;
						firebase
							.database()
							.ref("all_users")
							.orderByChild("uid")
							.equalTo(Object.keys(obj)[0])
							.once("value")
							.then(snapshot => {
								const referralDetail = snapshot.val();
								this.referred_byUid = referralDetail[Object.keys(obj)[0]].uid;
								this.referred_byName = referralDetail[Object.keys(obj)[0]].name;
							});
					} else {
						this.referred_byName = "";
						this.referred_byUid = "";
						this.isValidReferralID = false;
					}
				});

			if (this.referred_by == "") {
				this.isValidReferralID = true;
			}

			return [this.isValidReferralID || "Enter Valid Referral ID"];
		}
	},
	methods: {
		copyToClipboard() {
			document.querySelector("#refferal_code").select();
			document.execCommand("copy");
			this.$store.dispatch("showSnackbar", {
				snackbar: {
					message: "Code Copied",
					type: "success"
				}
			});
		},
		loctionUpdated(location) {
			this.templat = location.lat;
			this.templng = location.lng;
		},
		addNewUser() {
			this.loading=true
			var newUser = this.newUser;
			var createUser = firebase.functions().httpsCallable("createWUser");
			createUser({
				email: this.newUser.email,
				password: this.password,
				phone: this.newUser.phone,
				name: this.newUser.name
			})
				.then(result => {
					var currentTimestamp = Date.now();
					var uid = result.data.user.uid;
					const ref = firebase.database().ref("all_users/");
					ref
						.child(uid)
						.set(newUser)
						.then(data => {
							ref.child(uid).update({ uid: uid, createdOn: currentTimestamp });
							//-------------------------------------------------------------------------------------
							if (this.newUser.user_type == "transporter") {
								const setExtra = firebase.database().ref("info_transporter/");
								setExtra
									.child(uid)
									.set(this.extraTranporterField)
									.then(data => {
										setExtra.child(uid).update({ uid: uid });
										this.generateRandomStringCode();
									});
								if (this.referred_by != "") {
									const setReferredBy = firebase
										.database()
										.ref("transporter_referral/");
									setReferredBy
										.child(this.referred_byUid)
										.child(uid)
										.set({ uid: uid, addedOn: Date.now() })
										.then(data => {
											this.generateRandomStringCode();
										});
								}
							}
							this.loading=false
							this.$refs.form.reset();
							this.referred_by = "";
							this.$store.dispatch("showSnackbar", {
								snackbar: {
									message: "User added successfully",
									type: "success"
								}
							});
							// ------------------------------------------------------
						})
						.catch(error => {
							this.loading=false
							console.log(error);
							this.$store.dispatch("showSnackbar", {
								snackbar: {
									message: error.message,
									type: "error"
								}
							});
						});
				})
				.catch(error => {
					this.loading=false
					this.$store.dispatch("showSnackbar", {
						snackbar: {
							message: error.message,
							type: "error"
						}
					});
				});
		},
		generateRandomStringCode(codeLength = 6) {
			var generatedCode = "";
			var alphabets = "";
			var ch = 0,
				i = 0;
			for (ch = 65; ch <= 90; ch++) alphabets += String.fromCharCode(ch);
			for (ch = 0; ch <= 9; ch++) alphabets += ch.toString();

			for (i = 1; i <= codeLength; i++)
				generatedCode += alphabets.charAt(
					Math.floor(Math.random() * alphabets.length)
				);
			this.extraTranporterField.referral_code = generatedCode.toUpperCase();
		},
		generatePassword() {
			var length = 8;
			var chars =
				"abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
			var pass = "";
			for (var x = 0; x < length; x++) {
				var i = Math.floor(Math.random() * chars.length);
				pass += chars.charAt(i);
			}
			this.password = pass;
		},
		saveChangedLocation() {
			this.locationDialog = false;
			this.newUser.lat = this.templat;
			this.newUser.lng = this.templng;
		},
		closeDialog() {
			this.$emit("closeDialog");
		}
	}
};
</script>