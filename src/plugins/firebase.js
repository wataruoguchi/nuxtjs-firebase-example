import firebase from 'firebase'
import 'firebase/firestore'
const serviceAccount = require('~/../serviceAccountKey.json')

firebase.initializeApp({ ...serviceAccount })
const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings(settings)
export { db }
