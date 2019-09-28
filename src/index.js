const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "http://us-central1-escuelajs-api.cloudfunctions.net/characters";
const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      localStorage.setItem("next_fetch", `${response.info.next}`);
      console.log(response.info.next);
      const characters = response.results;
      let output;
      if (response.info.next) {
        output = characters
          .map(character => {
            return `
          <article class="Card">
          <img src="${character.image}" />
          <h2>${character.name}<span>${character.gender}</span></h2>
          </article>
          `;
          })
          .join("");
      } else {
        intersectionObserver.disconnect();
        output = `<div class="endResults">Ya no hay mas personajes :(</div>`;
      }
      let newItem = document.createElement("section");
      newItem.classList.add("Items");
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
};

async function loadData() {
  if (localStorage.getItem("next_fetch") == null) {
    await getData(API);
  } else {
    await getData(localStorage.getItem("next_fetch"));
  }
}

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

localStorage.clear();
intersectionObserver.observe($observe);
