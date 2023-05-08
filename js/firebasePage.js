import {dataBase, setAuthor, writePost, uploadVisualElement, getAuthor, getAllPosts} from "./firebaseInitialize";

const firebaseModalTemplateHeader = `<header data-top-align><h3>Add new newsletter item</h3></header>`
const firebaseModalNewsletterItemAuthor =
  `<form class="styled-form" id="authorDetails" data-flex-column data-centered-item data-default-gap>
    <input type="text" name="firstName" required minlength="2" placeholder="author first name" />
    <input type="text" name="lastName" required minlength="1" placeholder="author last name" />
    <input type="email" name="authorEmail" required minlength="3" placeholder="author email"/>
    <input type="submit" hidden id="author-submit" />
    </form>`
const invisibleForm = `<form id="upload-file-form" method="post" encType="multipart/form-data"><input type="file" hidden="hidden"/><button type="submit">submit</button></form>`

const firebaseModalNewsletterItem =
  `<form class="styled-form" id="newsletter-post-form" data-flex-row data-default-gap data-wrap>
    <input type="text" name="postName" required minlength="2" placeholder="post name" />
    <input type="text" name="postCategory" required minlength="2" placeholder="post category" />
    <div data-flex-column data-min-gap data-centered-item id="upload-image-div">
    <button id="upload-file">upload file</button>
    <p>or</p>
    <input type="url" name="imageUrl" required minlength="2" placeholder="visual preview link"/>
    </div>
    <input name="postMarkup" placeholder="post markup" />
    </form>`

const firebaseModalSubmit =
  `<div class="submit-container"><button type="submit" disabled id="modal-submit">New newsletter item</button></div>`

const createdFormWrapper = ({
                              classList = 'firebase-form-wrapper',
                              attributes = [{name: 'data-flex-row', value: ''}, {name: 'data-gap', value: '2'}],
                              appendItems = [{
                                position: 'afterbegin',
                                element: firebaseModalNewsletterItemAuthor
                              }, {position: 'beforeend', element: firebaseModalNewsletterItem}, {
                                position: 'afterbegin',
                                element: invisibleForm
                              }]
                            }) => {
  const formWrapper = document.createElement('div');
  Array.isArray(classList) ? classList.forEach((item) => formWrapper.classList.add(item?.toString()?.trim())) : classList instanceof String ? formWrapper.classList.add(classList?.toString()?.trim()) : formWrapper.classList.add('firebase-form-wrapper');
  Array.isArray(attributes) && attributes.forEach((item) => formWrapper.setAttribute(item.name?.trim(), item.value?.trim()))
  Array.isArray(appendItems) && appendItems.forEach(item => formWrapper.insertAdjacentHTML(item.position, item.element))

  return formWrapper
}

const templateNewsletterPreview = ({postName, authorName, postCategory, imageUrl, postMarkup, authorEmail}) => {
  return `<newsletter-preview data-flex-column data-centered-item style="width: fit-content" author=${authorName} email=${authorEmail}>
        <h3 slot="header-place-wrapper">${postName}</h3>
        <img slot="preview-image-wrapper" src=${imageUrl} alt="visual preview" />
        <p slot="preview-image-caption">${authorName?.toString()?.replace('_', ' ').trim()} - ${postCategory?.toString()?.replace('_', ' ').trim()}</p>
        <section slot="newsletter-markup">
            ${postMarkup}
        </section>
        <button slot="newsletter-preview-actions" class="slotted-button" onclick={console.log(event)}>Open markup</button>
      </newsletter-preview>`
}

const renderAllPosts = ({author, authorEmail, posts, container}) => {
  posts.forEach((item) => {
    const newsletterItem = templateNewsletterPreview({postName: item.name, authorName: author, postCategory: item.category, postMarkup: item.markup, imageUrl: item.imagePreview, authorEmail: authorEmail})
    container.insertAdjacentHTML('afterbegin', newsletterItem)
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  const formWrapper = createdFormWrapper({
    classList: 'firebase-form-wrapper',
    attributes: [{name: 'data-flex-row', value: ''}, {name: 'data-gap', value: '2'}],
    appendItems: [{position: 'afterbegin', element: firebaseModalNewsletterItemAuthor}, {
      position: 'beforeend',
      element: firebaseModalNewsletterItem
    }, {position: 'beforeend', element: invisibleForm}]
  })

  const firebaseModal = document.createElement('modal-element');
  firebaseModal.insertAdjacentElement('afterbegin', formWrapper)
  firebaseModal.insertAdjacentHTML('afterbegin', firebaseModalTemplateHeader);
  firebaseModal.insertAdjacentHTML('beforeend', firebaseModalSubmit);
  const addItemButton = document.getElementById('add_item');

  const uploadForm = firebaseModal.querySelector('#upload-file-form');
  const uploadFormInput = uploadForm && uploadForm.children.item(0)
  const uploadFileButton = firebaseModal.querySelector('#upload-file');
  const uploadImageDiv = firebaseModal.querySelector('#upload-image-div');
  const authorNameForm = firebaseModal.querySelector('#authorDetails');
  const submitModalButton = firebaseModal.querySelector('#modal-submit');
  const newPostForm = firebaseModal.querySelector('#newsletter-post-form');
  const postsContainer = document.getElementById('firebase_previews')

  let file = null;
  let filelink = null;
  let userIsValid = false;
  let validPost = false;
  let allPosts = null;

  getAllPosts.then((result) =>
    result.toJSON())
    .then((result) => allPosts = Object.entries(result)
      .map((item) => ({author: item[0], properties: item[1]})))
    .then((result) => {
      result.map((authorEntity) => {
        const posts = authorEntity.properties.items && Object.values(authorEntity.properties.items);

        posts && renderAllPosts({author: authorEntity.author, posts: posts, container: postsContainer, authorEmail: authorEntity.properties.email})
      })
      console.info(postsContainer.getElementsByTagName('newsletter-preview'))})


  let authorFormData = {
    firstName: ``,
    lastName: ``,
    authorEmail: ``
  }

  let newPostData = {
    postName: ``,
    postCategory: ``,
    imageUrl: ``,
    postMarkup: ``,
    authorName: ``,
    authorEmail: ``
  }
  const stopPropagation = (event) => {
    event.stopPropagation();
    event.stopImmediatePropagation()
  }

  newPostForm && userIsValid && newPostForm.addEventListener('submit', (event) => {
    event.preventDefault();
    stopPropagation(event)
  })

  newPostForm.addEventListener('change', (event) => {
    const {validity: validItem, value: inputValue, name: inputName} = event.target;

    if (validItem.valid) {
      newPostData[inputName?.toString()?.trim()] = inputName === 'postMarkup' ? inputValue?.toString() : inputValue?.toString()?.trim()
    }

    if (userIsValid && Object.values(newPostData).every((item) => item.length > 2)) {
      validPost = true
      submitModalButton && submitModalButton.removeAttribute('disabled');
      submitModalButton.addEventListener('click', (event) => {
        writePost(newPostData).then(async (result) => {
          await result
        })
      })
    }
  });


  authorNameForm && authorNameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    stopPropagation(event);

    getAuthor(authorFormData.firstName, authorFormData.lastName).then(snapshot => {
      if (snapshot.exists()) {
        userIsValid = true
        newPostData.authorName = `${authorFormData.firstName}_${authorFormData.lastName}`;
        newPostData.authorEmail = authorFormData.authorEmail
      } else {
        setAuthor(authorFormData.firstName, authorFormData.lastName, authorFormData.authorEmail).then(async newAuthor => {
          return newAuthor;
        }).then(() => {
          userIsValid = true
        }).catch((error) => {
          console.info(error)
          userIsValid = false;
        })

      }
    }).catch((error) => {
      console.info(error)
      userIsValid = false;
    })

  })

  authorNameForm && authorNameForm.addEventListener('change', (event) => {
    const {validity: validItem, value: inputValue, name: inputName} = event.target;
    if (validItem.valid) {
      authorFormData[inputName?.toString()?.trim()] = inputValue?.toString()?.trim()
    }

    if (authorNameForm.children.length - 1 === Object.keys(authorFormData).length) {
      authorNameForm.lastElementChild.click();
    }
  });

  uploadForm && uploadForm.addEventListener('click', (event) => stopPropagation(event))
  uploadFormInput && uploadFormInput.addEventListener('click', (event) => stopPropagation(event))

  uploadFileButton && uploadFileButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    return uploadFormInput && uploadFormInput.click()
  })

  uploadForm && uploadForm.addEventListener('submit', (event) => {
    stopPropagation(event);
    event.preventDefault();

    if (file && file instanceof File) {
      uploadVisualElement(file).then((result) => {
        uploadImageDiv.style.pointerEvents = 'none';
        uploadImageDiv.style.opacity = '.1'
        uploadImageDiv.lastElementChild.value = result;
        uploadImageDiv.lastElementChild.innerText = result;
        newPostData.imageUrl = result
        filelink = result
      })
    }

  })

  uploadFormInput && uploadFormInput.addEventListener('change', () => {
    if (uploadFormInput.files[0] && (uploadFormInput.files[0].type.includes("image") || uploadFormInput.files[0].type.includes("video"))) {
      file = uploadFormInput.files[0]
      uploadForm.children[1].click();
    }
  })


  document.body.insertAdjacentElement('afterbegin', firebaseModal);

  addItemButton.addEventListener('click', (event) => {
    event.preventDefault();
    firebaseModal.show();
  })

  return {
    dataBase: dataBase,
    setAuthor: setAuthor,
    writePost: writePost
  }
})
