(function () {
  const recipes = [
    { id: 1, title: "Pasta", difficulty: "easy", time: 20, ingredients: ["pasta", "salt"] },
    { id: 2, title: "Biryani", difficulty: "hard", time: 60, ingredients: ["rice", "spices"] },
    { id: 3, title: "Salad", difficulty: "easy", time: 10, ingredients: ["lettuce", "tomato"] },
    { id: 4, title: "Burger", difficulty: "medium", time: 25, ingredients: ["bun", "patty"] }
  ];

  const recipeContainer = document.getElementById("recipeContainer");
  const searchInput = document.getElementById("searchInput");
  const recipeCounter = document.getElementById("recipeCounter");
  const filterButtons = document.querySelectorAll(".filters button");

  let activeFilter = "all";
  let searchTerm = "";
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Debounce Function
  function debounce(func, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
  }

  function renderRecipes() {
    let filteredRecipes = recipes.filter(recipe => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.join(" ").toLowerCase().includes(searchTerm);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "quick" && recipe.time < 30) ||
        (activeFilter === "favorites" && favorites.includes(recipe.id)) ||
        recipe.difficulty === activeFilter;

      return matchesSearch && matchesFilter;
    });

    recipeContainer.innerHTML = "";

    filteredRecipes.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("card");

      const isFav = favorites.includes(recipe.id);

      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>Difficulty: ${recipe.difficulty}</p>
        <p>Time: ${recipe.time} mins</p>
        <span class="favorite" data-id="${recipe.id}">
          ${isFav ? "❤️" : "🤍"}
        </span>
      `;

      recipeContainer.appendChild(card);
    });

    updateCounter(filteredRecipes.length);
  }

  function updateCounter(visibleCount) {
    recipeCounter.textContent = `Showing ${visibleCount} of ${recipes.length} recipes`;
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderRecipes();
  }

  // Event Listeners
  searchInput.addEventListener(
    "input",
    debounce(function (e) {
      searchTerm = e.target.value.toLowerCase();
      renderRecipes();
    }, 300)
  );

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderRecipes();
    });
  });

  recipeContainer.addEventListener("click", e => {
    if (e.target.classList.contains("favorite")) {
      const id = Number(e.target.dataset.id);
      toggleFavorite(id);
    }
  });

  renderRecipes();
})();