
const APIEndPoint = 'http://localhost:3434'

// createBtn
const createBtn = (type) => {
  // add edit btn
  const btnType = type || 'Edit'
  const btn = document.createElement('button')
  // const span = document.createElement('span');
  // span.innerHTML = btnType;
  btn.innerHTML = btnType
  // btn.append(span);

  return btn
}

const myCB = () => {
  console.log('setInterval')
}

const intervalID = setInterval(myCB, 500)
clearInterval(intervalID)

// return cookie
const getCookie = () => {
  let cookie = document.cookie
  cookie = cookie.split('=')[1]

  return cookie
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('listener attached')

  const getMessages = () => {
    fetch(APIEndPoint + '/getMessages')
      .then(res => res.json())
      .then(res => {
        console.log(res)
        loadPage(res)
      })
  }
  getMessages()
  // const intervalID = setInterval(getMessages, 500)

  // attach listener to save btn
  const saveBtn = document.getElementById('save')
  saveBtn.addEventListener('click', (event) => {
    console.log('saveBtn ', event.target)
    console.log('saveBtn ', event.parentNode)

    const paswd = document.getElementById('pass').value
    const mesg = document.getElementById('desc').value
    // call helper memthod to update page
    createNewMesg(paswd, mesg)
  })

  // attach listener to Delete btn
  const mesgContainer = document.getElementById('message-list')
  // const mesgContainer = document.getElementsByClassName('del');

  mesgContainer.addEventListener('click', (event) => {
    console.log('del Btn ', event.target)
    // console.log('del Btn ', event.target.nodeName);

    if (event.target.nodeName !== 'BUTTON') {
      console.log('not a target')
      return
    }
    // console.log('parent Node', event.target.parentNode);

    console.log('del Btn ', event.target.parentNode)

    const mesg = event.target.parentNode.textContent
    const mesg_id = event.target.parentNode.getAttribute('id')
    const cookie = getCookie()

    console.log(mesg_id)
    delMesg(mesg, mesg_id, cookie)
  })
})

const delMesg = (mesg, mesg_id, cookie) => {
  const delMesg = {
    message: mesg,
    _id: mesg_id,
    cookie
  }

  const request = new Request(APIEndPoint + '/deleteMessage', {
    method: 'DELETE',
    body: JSON.stringify(delMesg),
    headers: new Headers({
      'Content-type': 'application/json'
    })
  })

  fetch (request)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      updatePageAfterDel(res, delMesg)
    })
    .catch((err, res) => {
      updatePageAfterDel(res, delMesg, err)
      console.error(`delMesg failed ${err}`)
    })
}

const updatePageAfterDel = (res, delMesg, err) => {
  if (err) {
    const errEle = document.querySelector('.alert')
    errEle.textContent = err.message
    errEle.style.display = 'block'
    // err.setAttribute('diplay', 'block');
    // document.getElementById('new-message').prepend(err.message);
  }
  if (res.ok === 1) {
    document.getElementById(delMesg._id).remove()
  }
}

const createNewMesg = (paswd, mesg) => {
  const newMesg = {
    password: paswd,
    message: mesg
  }
  // /postMessage
  const request = new Request(APIEndPoint + '/postMessage', {
    method: 'POST',
    body: JSON.stringify(newMesg),
    headers: new Headers({
      'Content-type': 'application/json'
    })
  })

  fetch(request)
    .then(res => res.json())
    .then(res => {
      // console.log(res);
      updatePage(res)
    })
    .catch(err => console.error(`error in createNewMesg helper ${err}`))
}

const updatePage = (data) => {
  console.log('updatePage ', data)
  // Update page
  const list_container = document.getElementById('message-list')

  const li = document.createElement('li')
  li.setAttribute('id', data._id)
  const delBtn = createBtn('Delete')
  // set class del
  delBtn.setAttribute('class', 'del')
  // set message
  li.textContent = data.message
  // set btn
  li.append(delBtn)

  // append to container
  list_container.prepend(li)
  // reset page to empty strings
  document.getElementById('pass').value = ''
  document.getElementById('desc').value = ''
}

const loadPage = (data) => {
  const list_container = document.getElementById('message-list')

  data.forEach((item) => {
    // console.log(item)

    const li = document.createElement('li')

    li.setAttribute('id', item._id)
    const delBtn = createBtn('Delete')
    // set class del
    delBtn.setAttribute('class', 'del')
    // set message
    li.textContent = item.message
    // set btn
    li.append(delBtn)

    // append to container
    list_container.prepend(li)
  })
}

// instantiated your EventSource interface
const eventSource = new EventSource('/sse')
// listen for messages from server by attaching a handler.
eventSource.addEventListener('message', (e) => {
  try {
    console.log(`eventListener registered ${e.data}`)
  } catch (e) {
    console.error(`error in eventListener ${e.message}`)
  }
})
