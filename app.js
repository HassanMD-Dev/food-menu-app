const sideBar = document.querySelector(".sidebar");
const loaderContainer = document.querySelector(".loaderContainer");
const search = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const recipeDetail = document.querySelector(".recipe-details");

const sweetAlert = ({ title, text, icon }) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
  });
};

const itemFunc = (recipe) => {
  return `  <div class="sideInner" data-recipe-id="${recipe.id}">
          <div class="sideImg">
            <img src="${recipe.image_url}" alt="${recipe.title}" />
            <div class="sideText">
              <h2>${recipe.title}</h2>
              <p>${recipe.publisher}</p>
            </div>
          </div>
        </div>`;
};
const startApp = async () => {
  try {
    loaderContainer.classList.remove("hidden");
    const apiRes = await fetch(
      "https://forkify-api.jonas.io/api/v2/recipes?search=pizza",
    );
    if (!apiRes.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const result = await apiRes.json();
    const {
      data: { recipes },
    } = result;
    let htmlUi = recipes.map((recipe) => {
      return itemFunc(recipe);
    });
    loaderContainer.classList.add("hidden");
    setTimeout(() => {
      sideBar.innerHTML = htmlUi.join("");
    }, 1000);
    sweetAlert({
      title: "Success",
      text: "Recipes loaded successfully",
      icon: "success",
    });
  } catch (error) {
    sweetAlert({
      title: "Error",
      text: error.message,
      icon: "error",
    });
  }
};
startApp();
const searchHandler = async () => {
  const searchVal = search.value;
  const apiRes = await fetch(
    `https://forkify-api.jonas.io/api/v2/recipes?search=${searchVal}`,
  );
  const result = await apiRes.json();

  const {
    data: { recipes },
  } = result;
  let searchHtmlUi = recipes.map((recipe) => itemFunc(recipe));
  if (!searchVal?.trim()) {
    sweetAlert({
      title: "Error",
      text: "Please enter keyword to search",
      icon: "error",
    });
  } else {
    sideBar.innerHTML = searchHtmlUi.join("");
  }
};
const itemsDetails = async (elem) => {
  const id = elem.dataset.recipeId;
  const apiRes = await fetch(
    `https://forkify-api.jonas.io/api/v2/recipes/${id}`,
  );
  const result = await apiRes.json();
  const {
    data: { recipe },
  } = result;

  recipeDetail.innerHTML = `<div class="recipe-image">
          <img
            src="${recipe.image_url}"
            alt="Recipe Image"
          />
        </div>

        <div class="recipe-header">
          <h1>${recipe.title}</h1>
        </div>

        <div class="directions">
          <p>
            ${recipe.publisher}
          </p>
        </div>`;
};
searchBtn.addEventListener("click", searchHandler);
sideBar.addEventListener("click", (e) => {
  if (e.target.classList.contains("sideInner")) {
    itemsDetails(e.target);
  }
});
