function createElemWithText(elementType = "p", string = "", className) {
    const element = document.createElement(elementType);
    element.textContent = string;
    if (className) {
      element.className = className;
    }
    return element;
  }

function createSelectOptions(users) {
  if (!users) return;
  const optionsArray = [];
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    optionsArray.push(option);
  });
  return optionsArray;
}

function toggleCommentSection(postId) {
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!postId) return;
    if (section) {
      section.classList.toggle('hide');
    } 
    if (!section) {
      console.log(`Nothing here.`);
    }
    return section;
  }

function toggleCommentButton(postId) {
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!postId) return;
    if (button) {
        if (button.textContent === 'Show Comments') {
            button.textContent = 'Hide Comments';
        } 
        else if (button.textContent === 'Hide Comments') {
            button.textContent = 'Show Comments';
        }
    } 
    else {
        console.log(`Nope.`);
    }
    return button;
}

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) {
        console.warn('Uhhhhhhh.');
        return;
    }
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener('click', function(event) {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener('click', function(event) {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}

function createComments(comments) {
    const fragment = document.createDocumentFragment();
    if (!comments) return;
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);
        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);
        fragment.appendChild(article);
    });
    return fragment;
}

function populateSelectMenu(users) {
    const selectMenu = document.getElementById('selectMenu');
    if (!users) return;
    const options = createSelectOptions(users);
    options.forEach(option => {
        selectMenu.add(option);
    });
    return selectMenu;
}

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`Error!`);
        }
        const users = await response.json();
        return users;
    }
    catch (error) {
        console.error('NOOOOOOOOOOOOOOOOOOOOOOO! An Error!');
        throw error;
    }
}

async function getUserPosts(userId) {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`Hmm, an error`);
        }
        const posts = await response.json();
        return posts;
    }
    catch (error) {
        console.error(`Oops, there was an error. I am doomed.`);
        throw error;
    }
}

async function getUser(userId) {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) {
            throw new Error(`What? An error?`);
        }
        const user = await response.json();
        return user;
    }
    catch (error) {
        console.error(`AHHH! AN ERROR!`);
        throw error;
    }
}

async function getPostComments(postId) {
    if (!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`OH NO IT IS AN ERROR EVRYONE RUN!!!`);
        }
        const user = await response.json();
        return user;
    }
    catch (error) {
        console.error(`Wait, is that an error? Uhhhhh. . .`);
        throw error;
    }
}

async function displayComments(postId) {
    if (!postId) return;
    try {
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments', 'hide');
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.appendChild(fragment);
        return section;
    } catch (error) {
        console.error(`There is totally no error here, hahaha. . . .`);
        throw error;
    }
}

async function createPosts(posts) {
    const fragment = document.createDocumentFragment();
    if (!posts) return;
    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const body = createElemWithText('p', post.body);
        const id = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorr = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const catchPhrase = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        article.append(h2, body, id, authorr, catchPhrase, button, section);
        fragment.appendChild(article);
    }
    return fragment;
}

async function displayPosts(posts) {
    const main = document.querySelector('main');
    if (!posts) {
        return createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
    }
    if (posts && posts.length > 0) {
        element = await createPosts(posts);
    }
    main.appendChild(element);
    return element;
}

function toggleComments(event, postId) {
    if (!event || !postId) return;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

async function refreshPosts(posts) {
    if (!posts) return;
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

async function selectMenuChangeEventHandler(event) {
    if (!event) return;
    const userId = event?.target?.value === 'Employees' || !event?.target?.value ? 1 : event.target.value;
    const selectMenu = event.target;
    if (selectMenu) selectMenu.disabled = true;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    if (selectMenu) selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
  }

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

async function initApp() {
    await initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}
document.addEventListener("DOMContentLoaded", initApp);