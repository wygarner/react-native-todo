import firebase from 'firebase/app'
import 'firebase/database'
import "firebase/auth"

const app = firebase.initializeApp({

})

export const auth = app.auth()
export default app