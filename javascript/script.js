//variable declarations using their respective id from html
const searchInput = document.getElementById('searchInput');
const mealContainer = document.getElementById('mealContainer');
const recipeContainer = document.getElementById('recipeContainer');
const placeholderContent = document.getElementById('placeholderContent');


//called when search button is clicked
function searchMeal() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        alert('Please enter a meal name to search.');
        //fuction exited early
        return;
    }

    // Fetch data from the API
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`)
        .then(response => response.json())// response parsed as a json
        .then(data => {
            // Clear previous search results
            mealContainer.innerHTML = '';

            // Update the webpage with up to four meal options
            if (data.meals) {
                for (let i = 0; i < Math.min(data.meals.length, 4); i++) { //math min method used to ensure the results 
                    //displayed do not exceed 4


                    const meal = data.meals[i];
                    const mealDiv = document.createElement('div');//creates a new div for each meal and adds the content of the meal 
                    mealDiv.classList.add('meal');
                    mealDiv.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="Meal Image">
                        <h3>${meal.strMeal}</h3>
                        <ul id="ingredientList${i}"></ul>
                        <button onclick="showRecipe('${meal.idMeal}')">View Recipe</button>
                    `;
                    mealContainer.appendChild(mealDiv);
                    fetchIngredients(meal.idMeal, i);
                }
                // Once the meal data is loaded, hide the placeholder content
                placeholderContent.style.display = 'none';
            } else {
                alert('No meals found for the given keyword.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again later.');
        });
}

function fetchIngredients(mealId, index) {
    // Fetch ingredients for a meal
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const ingredientList = document.getElementById(`ingredientList${index}`);
            if (meal && ingredientList) {
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient) {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${ingredient} - ${measure}`;
                        ingredientList.appendChild(listItem);
                    } else {
                        break;
                    }
                }
                // Move the button to the end of the ingredient list
                const mealDiv = ingredientList.parentElement;
                const button = mealDiv.querySelector('button');
                ingredientList.appendChild(button);
            }
        })
        .catch(error => {
            console.error('Error fetching ingredients:', error);
        });
}

function showRecipe(mealId) {
    // Fetch recipe details using meal ID
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            if (meal && meal.strInstructions) {
                // Display recipe content in a modal overlay
                recipeContainer.innerHTML = `
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <h2>${meal.strMeal}</h2>
                        <p>${meal.strInstructions}</p>
                        <button onclick="closeRecipe()">Close</button>
                    </div>
                `;
                recipeContainer.style.display = 'block';
            } else {
                alert('Recipe not found for this meal.');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe:', error);
            alert('An error occurred while fetching the recipe. Please try again later.');
        });
}

function closeRecipe() {
    // Close the recipe modal overlay
    recipeContainer.innerHTML = '';
    recipeContainer.style.display = 'none';
}