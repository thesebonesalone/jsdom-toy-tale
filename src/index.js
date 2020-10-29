let addToy = false;
//gets all of the toy data from the DB
function getAllToys() {
  fetch("http://localhost:3000/toys")
  .then(function(resp) {return resp.json()})
  .then(function(json) {
    for (const toy of json) {
      renderToyCard(toy)
    }
  })
}
function addLike(num,id,node) {
  //Build out our params hash for updating the DB Object
  const formData = {
    id: id,
    likes: (num + 1)
  }
  //Builds out RESTful patch request
  const reqOBJ = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(formData)
  }
  //Pushes info to server with RESTful patch request, then returns the updated object
  fetch(`http://localhost:3000/toys/${id}`,reqOBJ)
  .then(resp => resp.json())
  .then(function(toy){
    //Updates the DOM to reflect the ammount of likes
    node.innerText = toy.likes
  })
}
function renderToyCard(toy) {
  //create all tags and attributes for the card
  let div_card = document.createElement('div')
  let h2 = document.createElement("h2");
  let img = document.createElement("img")
  let p = document.createElement('p')
  let btn = document.createElement('button')
  let card = document.createAttribute("class")
  let att = document.createAttribute("src")
  let ident_id = document.createAttribute("ident_id")
  let avatar = document.createAttribute("class")
  let like_class = document.createAttribute("class")
  //grab the div container the toys will be displayed in
  const toyBox = document.getElementById("toy-collection")
  h2.innerText = toy.name
  p.innerText = toy.likes
  ident_id.value = toy.id
  btn.innerText = "Like"
  att.value = toy.image
  like_class.value = "like-btn"
  card.value = "card"
  avatar.value = "toy-avatar"
  btn.setAttributeNode(like_class)
  
  //set the functionality for the like button
  
  div_card.setAttributeNode(card)
  div_card.setAttributeNode(ident_id)
  img.setAttributeNode(att)
  img.setAttributeNode(avatar)
  div_card.appendChild(h2)
  div_card.appendChild(img)
  div_card.appendChild(p)
  div_card.appendChild(btn)
  btn.addEventListener("click", function(e){
    e.preventDefault()
    //Selects the node we will be updating for front end
    let node = e.target.parentNode.childNodes[2]
    //Finds out how many likes we already have
    let n_of_likes = node.innerText
    //Gets the DB ID of the node's corresponding object
    let id = e.target.parentNode.getAttribute("ident_id")
    //passes these into a function to add a single like to the DB
    addLike(parseInt(n_of_likes),id,node)
  })
  toyBox.appendChild(div_card)
}

//wait until all content is loaded to initiate the card creation
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form")
  // add a post request for the create new toy form
  toyForm.addEventListener("submit", function(e) {
    e.preventDefault()
    const formData = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }
    const reqOBJ = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(formData)
    }
    fetch('http://localhost:3000/toys',reqOBJ)
    .then(resp => resp.json())
    .then(function(json){renderToyCard(json)})
  })
  // render all toys
  getAllToys()
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
});

