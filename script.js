const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealSelect = document.getElementById('meals');
const resultHandling = document.getElementById('result-handling');
const singleMeal = document.getElementById('single-meal');

function searchMeal(element){
    element.preventDefault();
    singleMeal.innerHTML = "";
    const term = search.value ;

    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(response => response.json())
        .then(data => {
            resultHandling.innerHTML = `<h2>Search results for ${term}:</h2>`

            if(data.meals === null){
                resultHandling.innerHTML = `There are no search results. Try again`;
            }
            else{
                mealSelect.innerHTML = data.meals.map(meals => `
                    <div class="meal">
                        <img src="${meals.strMealThumb}" alt="${meals.strMeal}"/>
                        <div class="meal-info" data-mealID="${meals.idMeal}">
                        <h3>${meals.strMeal}</h3>
                        </div>
                    </div>
                `).join('');
            }
        });
        search.value = '';
    }else{
        alert('please inter a search term');
    }
}

//fetch meal by ID
function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(response => response.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

//fetch meal from API
function getDetailsMeal(mealID){
    mealSelect.innerHTML = '';
    resultHandling.innerHTML = '';

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealID}`)
.then(response => response.json())
.then(data => {
    const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

//add meal
function addMealToDOM(meal) {
    const ingredients = [];

    for(i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        }else{
            break;
        }
    }


singleMeal.innerHTML = `
    <div class="single-meal">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="main">
            <h1>Food Name: ${meal.strMeal}</h1>
            <h2 class="head">Ingredients</h2>
            <ol>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ol>
        </div>
    </div>
`;
}
//event listeners
submit.addEventListener('submit', searchMeal);
meals.addEventListener('click', getDetailsMeal);
mealSelect.addEventListener('click', element => {
    const mealInfo = element.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });
    if(mealInfo){
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
});