import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, push, update, increment, get} from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const configKeys = {
  apiKey: "AIzaSyAMSlLchU8dx6n34iF5CtR7UNFBdS3Gp4Q",
  authDomain: "university-knu-project.firebaseapp.com",
  projectId: "university-knu-project",
  storageBucket: "university-knu-project.appspot.com",
  messagingSenderId: "720296560819",
  appId: "1:720296560819:web:72b294689536428ff2c8c6"
}

const firebaseConfig = {
  apiKey: configKeys.apiKey,
  authDomain: configKeys.authDomain,
  projectId: configKeys.projectId,
  storageBucket: configKeys.storageBucket,
  messagingSenderId: configKeys.messagingSenderId,
  appId: configKeys.appId,
  databaseURL: "https://university-knu-project-default-rtdb.europe-west1.firebasedatabase.app"
};

const firebaseApp = initializeApp(firebaseConfig);
const dataBase = getDatabase(firebaseApp)
const storage = getStorage(firebaseApp);


const getAllPosts = get(ref(dataBase,  `posts`))

const getAuthor = (authorFirstName, authorLastName) => get(ref(dataBase, `posts/${authorFirstName?.toString()?.trim()}_${authorLastName?.toString()?.trim()}`))
const setAuthor = (authorFirstName, authorLastName, email) => set(ref(dataBase, `posts/${authorFirstName?.toString()?.trim()}_${authorLastName?.toString()?.trim()}`), {
  postsAmount: 0,
  email: email
})
const writePost = ({postName, postCategory, authorName, imageUrl, postMarkup}) => {
  const uid = crypto.randomUUID()

  const userPost = {
    name: postName ?? `${authorName}_post`,
    category: postCategory ?? `all`,
    imagePreview : imageUrl ?? `https://placehold.co/600x400/png`,
    markup: postMarkup ?? ``,
    uid: uid
  }

  const newPostKey = push(child(ref(dataBase), `posts/${authorName}/items/${postName?.toString()?.trim()}`)).key;

  const updates = {};
  updates[`posts/${authorName}/items/${newPostKey}`] = userPost;
  updates[`posts/${authorName}/postsAmount`] = increment(1);

  return update(ref(dataBase), updates);
}

const uploadVisualElement = (file) => {
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type
  };

  const elementReference = storageRef(storage, `images/${name}`)
  return uploadBytes(elementReference, file, metadata).then(snapshot => getDownloadURL(snapshot.ref))
    .then(url => {
      console.log(url);
      alert('element uploaded successfully')
      return url
    })
    .catch((error) => {
      console.error(error)
      alert('element upload failed, will use placeholder')
      return `gs://university-knu-project.appspot.com/images/31343C.svg`
    });
}

export {setAuthor, writePost, dataBase, uploadVisualElement, getAuthor, getAllPosts}


