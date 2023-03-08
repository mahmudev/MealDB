let page = 1;
const perPage = 6;
let totalResults = 0;
let meals = [];

const leadMeals = (searchText) => {
  document.getElementById("meals-container").innerHTML = ""; // clear previous results

  // Show the spinner while loading
  spinner.classList.remove("hidden");

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Hide the spinner when done loading
      spinner.classList.add("hidden");

      if (data.meals === null) {
        // display error message
        document.getElementById("error-message").style.display = "block";
        document.getElementById("categories").style.display = "none";
      } else {
        // hide error message and display meals
        document.getElementById("error-message").style.display = "none";
        totalResults = data.meals.length;
        meals = data.meals;
        displayMeals(meals.slice(0, perPage));
      }
    })
    .catch((error) => {
      // display error message
      document.getElementById("error-message").style.display = "block";
    });

  // hide see-more button
  const seeMoreButton = document.getElementById("see-more");
  seeMoreButton.style.display = "none";
};

const displayMeals = (meals) => {
  const mealsContainer = document.getElementById("meals-container");

  meals.forEach((meal) => {
    const seeMoreButton = document.getElementById("see-more");
    seeMoreButton.style.display = "block";

    const mealDiv = document.createElement("div");
    mealDiv.innerHTML = `
      <div class="lg:flex border rounded-lg">
        <img class="object-cover w-full h-56 rounded-lg lg:w-64" src="${meal.strMealThumb}" alt="">
        <div class="flex flex-col justify-between py-6 lg:mx-6">
          <h1 class="truncate-line-clamp text-black text-xl font-bold">${meal.strMeal}</h1>
          <div class="truncate-line-clamp">${meal.strInstructions}</div>
          <a onclick="openModal();loadMealDetails(${meal.idMeal})" class="cursor-pointer text-xl text-[#FFC107] font-semibold text-black underline">View Details</a>
        </div>
      </div>
    `;
    mealsContainer.appendChild(mealDiv);
  });
  // Update the "see more" button
  const seeMoreButton = document.getElementById("see-more");
  if (mealsContainer.children.length === totalResults) {
    seeMoreButton.style.display = "none";
  } else {
    seeMoreButton.style.display = "block";
  }
};
const loadMoreMeals = () => {
  page++;
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const nextMeals = meals.slice(startIndex, endIndex);
  displayMeals(nextMeals);
};

const searchMeal = () => {
  const searchText = document.getElementById("search-field").value;
  leadMeals(searchText);
  // hide error message
  document.getElementById("error-message").style.display = "none";
};

// add event listener to search button
document.getElementById("btn-search").addEventListener("click", function () {
  searchMeal();
});

// add event listener to search input field
document.getElementById("search-field").addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    searchMeal();
  }
  // hide error message
  document.getElementById("error-message").style.display = "none";
});

const seeMoreButton = document.getElementById("see-more");
seeMoreButton.addEventListener("click", loadMoreMeals);

leadMeals("");

const loadMealDetails = (idMeal) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayMealDetails(data.meals[0]));
};

const displayMealDetails = (meal) => {
	const ingredients = [];
	// Get all ingredients from the object. Up to 20
	for(let i=1; i<=20; i++) {
		if(meal[`strIngredient${i}`]) {
			ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
		} else {
			// Stop if no more ingredients
			break;
		}
  }
  // console.log(meal);
  document.getElementById("modal-title").innerText = meal.strMeal;
  const mealsDetails = document.getElementById("meals-details-body");
  mealsDetails.innerHTML = `<div class="border rounded-lg">
    <img class="object-cover w-full h-56 lg:h-80 rounded-lg" src="${meal.strMealThumb}" alt="">
    
    <div class="flex flex-col justify-between py-6 lg:mx-6">
        <div> ${meal.strInstructions}
        </div>
        <div class="pt-2">
        <ul class="grid grid-rows-4 grid-flow-col gap-2">
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
        </div>
        <div class="pt-2">
        <h3><span class="font-bold">Youtube: </span><span><a target="_blank" href="${meal.strYoutube}"><span class="text-red-500">${meal.strYoutube}</span></a></span><h3>
        </div>

    </div>
    </div>`;
};

//modal section
const modal = document.querySelector(".main-modal");
const closeButton = document.querySelectorAll(".modal-close");

const modalClose = () => {
  modal.classList.remove("fadeIn");
  modal.classList.add("fadeOut");
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
};

const openModal = () => {
  modal.classList.remove("fadeOut");
  modal.classList.add("fadeIn");
  modal.style.display = "flex";
};

for (let i = 0; i < closeButton.length; i++) {
  const elements = closeButton[i];

  elements.onclick = (e) => modalClose();

  modal.style.display = "none";

  window.onclick = function (event) {
    if (event.target == modal) modalClose();
  };
}
