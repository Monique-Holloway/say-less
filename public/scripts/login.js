console.log('hello world')

let form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e.target);
  let username = e.target.username.value;
  let password = e.target.password.value;

//   console.log(username, password) -- This worked when I tried it!!

  let body = {
    username: username,
    password: password
  }

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json()).then(data => {
    console.log(data)

    location.href = "/blogPage";
  })
})