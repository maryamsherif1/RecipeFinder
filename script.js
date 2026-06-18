async function searchRecipes() {
  const input = document.getElementById('ingredientInput').value.trim();
  const resultsDiv = document.getElementById('results');

  if (!input) {
    resultsDiv.innerHTML = '<p class="no-results">Please enter at least one ingredient!</p>';
    return;
  }

  resultsDiv.innerHTML = '<p class="loading">Finding recipes...</p>';

  const ingredient = input.split(',')[0].trim();
  const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals) {
      resultsDiv.innerHTML = '<p class="no-results">No recipes found. Try different ingredients!</p>';
      return;
    }

    const meals = data.meals.slice(0, 12);
    resultsDiv.innerHTML = '';

    meals.forEach(function(meal) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '" /><div class="card-body"><h3>' + meal.strMeal + '</h3><p>Click to see full recipe</p></div>';
      card.onclick = function() { openRecipe(meal.idMeal); };
      resultsDiv.appendChild(card);
    });

  } catch (error) {
    resultsDiv.innerHTML = '<p class="no-results">Something went wrong. Please try again.</p>';
  }
}

async function openRecipe(id) {
  const url = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id;
  const response = await fetch(url);
  const data = await response.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal['strIngredient' + i] && meal['strIngredient' + i].trim() !== '') {
      ingredients.push(meal['strMeasure' + i] + ' ' + meal['strIngredient' + i]);
    }
  }

  const ingredientList = ingredients.map(function(item) {
    return '<li>' + item + '</li>';
  }).join('');

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `
    <div style="max-width:700px;margin:0 auto;padding:20px;background:#fff5f7;border-radius:16px;">
      <button onclick="searchRecipes()" style="background:#FFB2C5;color:white;border:none;padding:10px 20px;border-radius:20px;cursor:pointer;margin-bottom:20px;font-size:1rem;">
        ⬅ Back to results
      </button>
      <img src="${meal.strMealThumb}" style="width:100%;border-radius:16px;margin-bottom:20px;" />
      <h2 style="color:#FFA289;margin-bottom:16px;font-size:1.8rem;">${meal.strMeal}</h2>
      
      <h3 style="color:#5a3a4a;margin-bottom:10px;font-size:1.2rem;">🥄 Ingredients</h3>
      <ul style="margin-bottom:20px;padding-left:20px;color:#4a2c3a;line-height:2.2;font-size:1rem;">
        ${ingredientList}
      </ul>
      
      <h3 style="color:#5a3a4a;margin-bottom:10px;font-size:1.2rem;">👩‍🍳 Instructions</h3>
      <p style="color:#4a2c3a;line-height:1.8;font-size:1rem;background:#fef6f9;padding:20px;border-radius:12px;border:1px solid #FDD5DF;">
        ${meal.strInstructions}
      </p>
    </div>
  `;
}

document.getElementById('ingredientInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') searchRecipes();
});