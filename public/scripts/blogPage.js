

let form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e.target);
  let username = e.target.username.value;
  let password = e.target.password.value;

// confused on what all is needed for delete fetch

  
  const deleteMethod = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },}
    fetch('/blogPage/:id', deleteMethod)
    .then(res => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  })