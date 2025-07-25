// レシピデータを保存する配列
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// DOM要素の取得
const recipeList = document.getElementById('recipeList');
const recipeForm = document.getElementById('recipeForm');
const addRecipeBtn = document.getElementById('addRecipeBtn');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const addIngredientBtn = document.getElementById('addIngredientBtn');
const ingredientsList = document.getElementById('ingredientsList');
const categoryFilter = document.getElementById('categoryFilter');
const tagFilters = document.getElementById('tagFilters');

// フィルター状態
let selectedCategory = '';
let selectedTags = [];
let showFavoritesOnly = false;

// お気に入りデータ
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// カロリー計算関数
function updateCaloriesForRow(row) {
    const nameInput = row.querySelector('.ingredient-name');
    const amountInput = row.querySelector('.ingredient-amount');
    const unitSelect = row.querySelector('.ingredient-unit');
    const calorieDisplay = row.querySelector('.calorie-display');
    
    const name = nameInput.value;
    const amount = parseFloat(amountInput.value) || 0;
    const unit = unitSelect.value;
    
    const calories = calculateCalories(name, amount, unit);
    calorieDisplay.textContent = `${calories} kcal`;
    
    updateTotalCalories();
}

// 合計カロリーの更新
function updateTotalCalories() {
    const servings = parseInt(document.getElementById('servings').value) || 1;
    let totalCalories = 0;
    
    const rows = ingredientsList.querySelectorAll('.ingredient-row');
    rows.forEach(row => {
        const calorieText = row.querySelector('.calorie-display').textContent;
        const calories = parseInt(calorieText) || 0;
        totalCalories += calories;
    });
    
    document.getElementById('totalCalories').textContent = totalCalories;
    document.getElementById('caloriesPerServing').textContent = Math.round(totalCalories / servings);
}

// 材料行の追加
function addIngredientRow() {
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" class="ingredient-name" placeholder="材料名">
        <input type="number" class="ingredient-amount" placeholder="数量" min="0" step="0.1">
        <select class="ingredient-unit">
            <option value="g">g</option>
            <option value="個">個</option>
            <option value="本">本</option>
            <option value="枚">枚</option>
            <option value="パック">パック</option>
            <option value="大さじ">大さじ</option>
            <option value="小さじ">小さじ</option>
        </select>
        <span class="calorie-display">0 kcal</span>
        <button class="remove-ingredient-btn">×</button>
    `;
    
    // イベントリスナーの追加
    const nameInput = newRow.querySelector('.ingredient-name');
    const amountInput = newRow.querySelector('.ingredient-amount');
    const unitSelect = newRow.querySelector('.ingredient-unit');
    const removeBtn = newRow.querySelector('.remove-ingredient-btn');
    
    nameInput.addEventListener('input', () => updateCaloriesForRow(newRow));
    amountInput.addEventListener('input', () => updateCaloriesForRow(newRow));
    unitSelect.addEventListener('change', () => updateCaloriesForRow(newRow));
    removeBtn.addEventListener('click', () => {
        newRow.remove();
        updateTotalCalories();
    });
    
    ingredientsList.appendChild(newRow);
}

// 初期化時のイベントリスナー設定
document.addEventListener('DOMContentLoaded', () => {
    // 最初の材料行のイベントリスナー
    const firstRow = ingredientsList.querySelector('.ingredient-row');
    if (firstRow) {
        const nameInput = firstRow.querySelector('.ingredient-name');
        const amountInput = firstRow.querySelector('.ingredient-amount');
        const unitSelect = firstRow.querySelector('.ingredient-unit');
        const removeBtn = firstRow.querySelector('.remove-ingredient-btn');
        
        nameInput.addEventListener('input', () => updateCaloriesForRow(firstRow));
        amountInput.addEventListener('input', () => updateCaloriesForRow(firstRow));
        unitSelect.addEventListener('change', () => updateCaloriesForRow(firstRow));
        removeBtn.addEventListener('click', () => {
            if (ingredientsList.children.length > 1) {
                firstRow.remove();
                updateTotalCalories();
            }
        });
    }
    
    // 材料追加ボタン
    addIngredientBtn.addEventListener('click', addIngredientRow);
    
    // 人数変更時のカロリー再計算
    document.getElementById('servings').addEventListener('input', updateTotalCalories);
    
    // カテゴリーフィルター
    categoryFilter.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        displayRecipes(searchInput.value);
    });
    
    // タグフィルター
    const tagButtons = tagFilters.querySelectorAll('.tag-filter');
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const tag = button.getAttribute('data-tag');
            
            if (button.classList.contains('active')) {
                if (!selectedTags.includes(tag)) {
                    selectedTags.push(tag);
                }
            } else {
                selectedTags = selectedTags.filter(t => t !== tag);
            }
            
            displayRecipes(searchInput.value);
        });
    });
    
    // お気に入りフィルター
    const favoriteFilterBtn = document.getElementById('favoriteFilterBtn');
    favoriteFilterBtn.addEventListener('click', () => {
        favoriteFilterBtn.classList.toggle('active');
        showFavoritesOnly = favoriteFilterBtn.classList.contains('active');
        displayRecipes(searchInput.value);
        updateFavoriteCount();
    });
});

// レシピフォームの表示/非表示
addRecipeBtn.addEventListener('click', () => {
    recipeForm.classList.remove('hidden');
});


cancelBtn.addEventListener('click', () => {
    recipeForm.classList.add('hidden');
    clearForm();
});

// レシピの保存
saveRecipeBtn.addEventListener('click', () => {
    const name = document.getElementById('recipeName').value;
    const servings = parseInt(document.getElementById('servings').value) || 1;
    const category = document.getElementById('recipeCategory').value;
    const instructions = document.getElementById('recipeInstructions').value;
    
    // タグデータの収集
    const tagCheckboxes = document.querySelectorAll('.tag-checkboxes input[type="checkbox"]:checked');
    const tags = Array.from(tagCheckboxes).map(cb => cb.value);
    
    // 材料データの収集
    const ingredientRows = ingredientsList.querySelectorAll('.ingredient-row');
    const ingredients = [];
    let totalCalories = 0;
    
    ingredientRows.forEach(row => {
        const ingredientName = row.querySelector('.ingredient-name').value;
        const amount = row.querySelector('.ingredient-amount').value;
        const unit = row.querySelector('.ingredient-unit').value;
        const calories = parseInt(row.querySelector('.calorie-display').textContent) || 0;
        
        if (ingredientName && amount) {
            const nutrition = calculateNutrition(ingredientName, parseFloat(amount), unit);
            ingredients.push({
                name: ingredientName,
                amount: parseFloat(amount),
                unit: unit,
                calories: calories,
                nutrition: nutrition
            });
            totalCalories += calories;
        }
    });
    
    if (name && ingredients.length > 0 && instructions) {
        const recipe = {
            id: Date.now(),
            name: name,
            servings: servings,
            category: category,
            tags: tags,
            ingredients: ingredients,
            instructions: instructions,
            totalCalories: totalCalories,
            caloriesPerServing: Math.round(totalCalories / servings)
        };
        
        recipes.push(recipe);
        saveToLocalStorage();
        displayRecipes();
        recipeForm.classList.add('hidden');
        clearForm();
    } else {
        alert('レシピ名、材料（最低1つ）、作り方を入力してください。');
    }
});

// フォームのクリア
function clearForm() {
    document.getElementById('recipeName').value = '';
    document.getElementById('servings').value = '2';
    document.getElementById('recipeCategory').value = '和食';
    document.getElementById('recipeInstructions').value = '';
    
    // タグのチェックを外す
    const tagCheckboxes = document.querySelectorAll('.tag-checkboxes input[type="checkbox"]');
    tagCheckboxes.forEach(cb => cb.checked = false);
    
    // 材料リストを初期状態に戻す
    ingredientsList.innerHTML = `
        <div class="ingredient-row">
            <input type="text" class="ingredient-name" placeholder="材料名">
            <input type="number" class="ingredient-amount" placeholder="数量" min="0" step="0.1">
            <select class="ingredient-unit">
                <option value="g">g</option>
                <option value="個">個</option>
                <option value="本">本</option>
                <option value="枚">枚</option>
                <option value="パック">パック</option>
                <option value="大さじ">大さじ</option>
                <option value="小さじ">小さじ</option>
            </select>
            <span class="calorie-display">0 kcal</span>
            <button class="remove-ingredient-btn">×</button>
        </div>
    `;
    
    // 新しい行のイベントリスナーを設定
    const firstRow = ingredientsList.querySelector('.ingredient-row');
    const nameInput = firstRow.querySelector('.ingredient-name');
    const amountInput = firstRow.querySelector('.ingredient-amount');
    const unitSelect = firstRow.querySelector('.ingredient-unit');
    const removeBtn = firstRow.querySelector('.remove-ingredient-btn');
    
    nameInput.addEventListener('input', () => updateCaloriesForRow(firstRow));
    amountInput.addEventListener('input', () => updateCaloriesForRow(firstRow));
    unitSelect.addEventListener('change', () => updateCaloriesForRow(firstRow));
    removeBtn.addEventListener('click', () => {
        if (ingredientsList.children.length > 1) {
            firstRow.remove();
            updateTotalCalories();
        }
    });
    
    // カロリー表示をリセット
    document.getElementById('totalCalories').textContent = '0';
    document.getElementById('caloriesPerServing').textContent = '0';
}

// レシピの表示
function displayRecipes(searchTerm = '') {
    let filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // カテゴリーフィルター
    if (selectedCategory) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.category === selectedCategory);
    }
    
    // タグフィルター
    if (selectedTags.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            selectedTags.every(tag => recipe.tags && recipe.tags.includes(tag))
        );
    }
    
    // お気に入りフィルター
    if (showFavoritesOnly) {
        filteredRecipes = filteredRecipes.filter(recipe => favorites.includes(recipe.id));
    }
    
    recipeList.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const ingredientsList = recipe.ingredients
            .map(ing => `<li>${ing.name} ${ing.amount}${ing.unit} (${ing.calories}kcal)</li>`)
            .join('');
        
        const tagsHtml = recipe.tags && recipe.tags.length > 0 
            ? `<div class="recipe-tags">${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}</div>`
            : '';
        
        const isFavorited = favorites.includes(recipe.id);
        
        recipeCard.innerHTML = `
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${recipe.id})">
                ♥
            </button>
            <span class="recipe-category-badge">${recipe.category || 'その他'}</span>
            <h3>${recipe.name}</h3>
            <p>${recipe.servings}人分</p>
            ${tagsHtml}
            <h4>材料:</h4>
            <ul>${ingredientsList}</ul>
            <h4>作り方:</h4>
            <p>${recipe.instructions}</p>
            <div class="recipe-calories">
                合計: ${recipe.totalCalories} kcal | 1人分: ${recipe.caloriesPerServing} kcal
            </div>
            ${getNutritionHTML(recipe)}
            <button class="delete-btn" onclick="deleteRecipe(${recipe.id})">削除</button>
        `;
        
        recipeList.appendChild(recipeCard);
    });
}

// レシピの削除
function deleteRecipe(id) {
    if (confirm('このレシピを削除しますか？')) {
        recipes = recipes.filter(recipe => recipe.id !== id);
        saveToLocalStorage();
        displayRecipes();
    }
}

// LocalStorageに保存
function saveToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// お気に入りの切り替え
function toggleFavorite(recipeId) {
    const index = favorites.indexOf(recipeId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayRecipes(searchInput.value);
    updateFavoriteCount();
}

// お気に入り数の更新
function updateFavoriteCount() {
    const favoriteFilterBtn = document.getElementById('favoriteFilterBtn');
    const count = favorites.length;
    
    if (count > 0) {
        if (!favoriteFilterBtn.querySelector('.favorite-count')) {
            const countSpan = document.createElement('span');
            countSpan.className = 'favorite-count';
            favoriteFilterBtn.appendChild(countSpan);
        }
        favoriteFilterBtn.querySelector('.favorite-count').textContent = count;
    } else {
        const countSpan = favoriteFilterBtn.querySelector('.favorite-count');
        if (countSpan) {
            countSpan.remove();
        }
    }
}

// 検索機能
searchInput.addEventListener('input', (e) => {
    displayRecipes(e.target.value);
});

// 栄養素情報のHTML生成
function getNutritionHTML(recipe) {
    // 栄養素の合計を計算
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    
    recipe.ingredients.forEach(ing => {
        if (ing.nutrition) {
            totalProtein += ing.nutrition.protein || 0;
            totalFat += ing.nutrition.fat || 0;
            totalCarbs += ing.nutrition.carbs || 0;
        }
    });
    
    const proteinPerServing = Math.round(totalProtein / recipe.servings * 10) / 10;
    const fatPerServing = Math.round(totalFat / recipe.servings * 10) / 10;
    const carbsPerServing = Math.round(totalCarbs / recipe.servings * 10) / 10;
    
    // 栄養素の旧レシピチェック（栄養情報がない場合）
    if (totalProtein === 0 && totalFat === 0 && totalCarbs === 0) {
        return '';
    }
    
    const chartId = `nutrition-chart-${recipe.id}`;
    
    return `
        <div class="nutrition-info">
            <h5>栄養バランス（1人分）</h5>
            <div class="nutrition-values">
                <div class="nutrition-item">
                    <div class="label">たんぱく質</div>
                    <div class="value">${proteinPerServing}</div>
                    <div class="unit">g</div>
                </div>
                <div class="nutrition-item">
                    <div class="label">脂質</div>
                    <div class="value">${fatPerServing}</div>
                    <div class="unit">g</div>
                </div>
                <div class="nutrition-item">
                    <div class="label">炭水化物</div>
                    <div class="value">${carbsPerServing}</div>
                    <div class="unit">g</div>
                </div>
            </div>
            <div class="nutrition-chart-container">
                <canvas id="${chartId}" width="200" height="200"></canvas>
            </div>
        </div>
    `;
}

// 栄養チャートの描画
function drawNutritionCharts() {
    setTimeout(() => {
        recipes.forEach(recipe => {
            const chartElement = document.getElementById(`nutrition-chart-${recipe.id}`);
            if (chartElement) {
                // 栄養素の合計を計算
                let totalProtein = 0;
                let totalFat = 0;
                let totalCarbs = 0;
                
                recipe.ingredients.forEach(ing => {
                    if (ing.nutrition) {
                        totalProtein += ing.nutrition.protein || 0;
                        totalFat += ing.nutrition.fat || 0;
                        totalCarbs += ing.nutrition.carbs || 0;
                    }
                });
                
                const proteinPerServing = Math.round(totalProtein / recipe.servings * 10) / 10;
                const fatPerServing = Math.round(totalFat / recipe.servings * 10) / 10;
                const carbsPerServing = Math.round(totalCarbs / recipe.servings * 10) / 10;
                
                new Chart(chartElement, {
                    type: 'doughnut',
                    data: {
                        labels: ['たんぱく質', '脂質', '炭水化物'],
                        datasets: [{
                            data: [proteinPerServing, fatPerServing, carbsPerServing],
                            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        maintainAspectRatio: true
                    }
                });
            }
        });
    }, 100);
}

// レシピ表示の更新
const originalDisplayRecipes = displayRecipes;
displayRecipes = function(searchTerm = '') {
    originalDisplayRecipes(searchTerm);
    drawNutritionCharts();
};

// 初期表示
displayRecipes();
updateFavoriteCount();

// サンプルレシピの追加（初回のみ）
if (recipes.length === 0) {
    const sampleRecipes = [
        {
            id: 1,
            name: "親子丼",
            servings: 2,
            category: "和食",
            tags: ["時短"],
            ingredients: [
                { name: "鶏もも肉", amount: 200, unit: "g", calories: 400, nutrition: { calories: 400, protein: 32.4, fat: 28.0, carbs: 0 } },
                { name: "たまねぎ", amount: 100, unit: "g", calories: 37, nutrition: { calories: 37, protein: 1.0, fat: 0.1, carbs: 8.8 } },
                { name: "卵", amount: 3, unit: "個", calories: 272, nutrition: { calories: 272, protein: 22.1, fat: 18.5, carbs: 0.5 } },
                { name: "ご飯", amount: 300, unit: "g", calories: 504, nutrition: { calories: 504, protein: 7.5, fat: 0.9, carbs: 111.3 } },
                { name: "醤油", amount: 3, unit: "大さじ", calories: 38, nutrition: { calories: 38, protein: 4.2, fat: 0, carbs: 5.5 } }
            ],
            instructions: "1. 鶏肉を一口大に切る\n2. たまねぎをスライスする\n3. フライパンで鶏肉とたまねぎを炒める\n4. 醤油を加えて煮込む\n5. 溶き卵を回し入れて半熟に仕上げる\n6. ご飯の上にのせる",
            totalCalories: 1251,
            caloriesPerServing: 626
        },
        {
            id: 2,
            name: "野菜炒め",
            servings: 2,
            category: "中華",
            tags: ["ヘルシー", "時短"],
            ingredients: [
                { name: "キャベツ", amount: 200, unit: "g", calories: 46, nutrition: { calories: 46, protein: 2.6, fat: 0.4, carbs: 10.4 } },
                { name: "にんじん", amount: 100, unit: "g", calories: 39, nutrition: { calories: 39, protein: 0.7, fat: 0.2, carbs: 9.3 } },
                { name: "ピーマン", amount: 100, unit: "g", calories: 22, nutrition: { calories: 22, protein: 0.9, fat: 0.2, carbs: 5.1 } },
                { name: "豚バラ肉", amount: 150, unit: "g", calories: 579, nutrition: { calories: 579, protein: 21.3, fat: 53.1, carbs: 0 } },
                { name: "ごま油", amount: 1, unit: "大さじ", calories: 111, nutrition: { calories: 111, protein: 0, fat: 12.0, carbs: 0 } }
            ],
            instructions: "1. 野菜を食べやすい大きさに切る\n2. 豚肉を炒める\n3. 野菜を加えて炒める\n4. 塩こしょうで味を調える",
            totalCalories: 797,
            caloriesPerServing: 399
        },
        {
            id: 3,
            name: "カルボナーラ",
            servings: 2,
            category: "イタリアン",
            tags: [],
            ingredients: [
                { name: "パスタ", amount: 200, unit: "g", calories: 330, nutrition: { calories: 330, protein: 10.8, fat: 1.8, carbs: 64.4 } },
                { name: "卵", amount: 2, unit: "個", calories: 181, nutrition: { calories: 181, protein: 14.8, fat: 12.4, carbs: 0.4 } },
                { name: "チーズ", amount: 50, unit: "g", calories: 170, nutrition: { calories: 170, protein: 11.4, fat: 13.0, carbs: 1.0 } },
                { name: "牛乳", amount: 100, unit: "g", calories: 67, nutrition: { calories: 67, protein: 3.3, fat: 3.8, carbs: 4.8 } }
            ],
            instructions: "1. パスタを茹でる\n2. 卵とチーズを混ぜる\n3. 茹でたパスタに卵液を絡める\n4. 牛乳を少しずつ加えてクリーミーに仕上げる",
            totalCalories: 748,
            caloriesPerServing: 374
        },
        {
            id: 4,
            name: "味噌汁",
            servings: 4,
            category: "和食",
            tags: ["ヘルシー"],
            ingredients: [
                { name: "豆腐", amount: 100, unit: "g", calories: 56, nutrition: { calories: 56, protein: 4.9, fat: 3.0, carbs: 2.0 } },
                { name: "わかめ", amount: 20, unit: "g", calories: 3, nutrition: { calories: 3, protein: 0.4, fat: 0.0, carbs: 0.8 } },
                { name: "味噌", amount: 60, unit: "g", calories: 130, nutrition: { calories: 130, protein: 7.5, fat: 3.6, carbs: 19.4 } }
            ],
            instructions: "1. 豆腐を角切りにする\n2. だし汁を温める\n3. 味噌を溶く\n4. 豆腐とわかめを加える",
            totalCalories: 189,
            caloriesPerServing: 47
        },
        {
            id: 5,
            name: "チキンカレー",
            servings: 4,
            category: "洋食",
            tags: ["子供向け"],
            ingredients: [
                { name: "鶏もも肉", amount: 400, unit: "g", calories: 800, nutrition: { calories: 800, protein: 64.8, fat: 56.0, carbs: 0 } },
                { name: "たまねぎ", amount: 200, unit: "g", calories: 74, nutrition: { calories: 74, protein: 2.0, fat: 0.2, carbs: 17.6 } },
                { name: "にんじん", amount: 150, unit: "g", calories: 59, nutrition: { calories: 59, protein: 1.1, fat: 0.3, carbs: 14.0 } },
                { name: "じゃがいも", amount: 300, unit: "g", calories: 228, nutrition: { calories: 228, protein: 4.8, fat: 0.3, carbs: 52.8 } },
                { name: "ご飯", amount: 600, unit: "g", calories: 1008, nutrition: { calories: 1008, protein: 15.0, fat: 1.8, carbs: 222.6 } }
            ],
            instructions: "1. 野菜を切る\n2. 鶏肉を炒める\n3. 野菜を加えて炒める\n4. 水を加えて煮込む\n5. カレールーを溶かす\n6. ご飯にかける",
            totalCalories: 2169,
            caloriesPerServing: 542
        },
        {
            id: 6,
            name: "焼き鮭定食",
            servings: 1,
            category: "和食",
            tags: ["ヘルシー"],
            ingredients: [
                { name: "鮭", amount: 100, unit: "g", calories: 133, nutrition: { calories: 133, protein: 22.3, fat: 4.1, carbs: 0.1 } },
                { name: "ご飯", amount: 150, unit: "g", calories: 252, nutrition: { calories: 252, protein: 3.8, fat: 0.5, carbs: 55.7 } },
                { name: "ほうれん草", amount: 100, unit: "g", calories: 20, nutrition: { calories: 20, protein: 2.2, fat: 0.4, carbs: 3.1 } }
            ],
            instructions: "1. 鮭を焼く\n2. ほうれん草を茹でる\n3. ご飯と一緒に盛り付ける",
            totalCalories: 405,
            caloriesPerServing: 405
        },
        {
            id: 7,
            name: "オムライス",
            servings: 2,
            category: "洋食",
            tags: ["子供向け"],
            ingredients: [
                { name: "ご飯", amount: 300, unit: "g", calories: 504, nutrition: { calories: 504, protein: 7.5, fat: 0.9, carbs: 111.3 } },
                { name: "卵", amount: 4, unit: "個", calories: 362, nutrition: { calories: 362, protein: 29.6, fat: 24.8, carbs: 0.8 } },
                { name: "鶏肉", amount: 100, unit: "g", calories: 200, nutrition: { calories: 200, protein: 16.2, fat: 14.0, carbs: 0 } },
                { name: "たまねぎ", amount: 50, unit: "g", calories: 19, nutrition: { calories: 19, protein: 0.5, fat: 0.1, carbs: 4.4 } },
                { name: "ケチャップ", amount: 30, unit: "g", calories: 36, nutrition: { calories: 36, protein: 0.5, fat: 0.0, carbs: 8.2 } }
            ],
            instructions: "1. チキンライスを作る\n2. 卵でオムレツを作る\n3. チキンライスを包む\n4. ケチャップをかける",
            totalCalories: 1121,
            caloriesPerServing: 561
        },
        {
            id: 8,
            name: "麻婆豆腐",
            servings: 3,
            category: "中華",
            tags: [],
            ingredients: [
                { name: "豆腐", amount: 300, unit: "g", calories: 168, nutrition: { calories: 168, protein: 14.7, fat: 9.0, carbs: 6.0 } },
                { name: "ひき肉", amount: 150, unit: "g", calories: 336, nutrition: { calories: 336, protein: 27.9, fat: 22.7, carbs: 0 } },
                { name: "ねぎ", amount: 50, unit: "g", calories: 19, nutrition: { calories: 19, protein: 0.5, fat: 0.1, carbs: 4.4 } },
                { name: "ごま油", amount: 1, unit: "大さじ", calories: 111, nutrition: { calories: 111, protein: 0, fat: 12.0, carbs: 0 } }
            ],
            instructions: "1. 豆腐を角切りにする\n2. ひき肉を炒める\n3. 豆腐を加えて煮込む\n4. 調味料で味を調える\n5. ねぎを散らす",
            totalCalories: 634,
            caloriesPerServing: 211
        },
        {
            id: 9,
            name: "ハンバーグ",
            servings: 2,
            category: "洋食",
            tags: ["子供向け"],
            ingredients: [
                { name: "ひき肉", amount: 300, unit: "g", calories: 672, nutrition: { calories: 672, protein: 55.8, fat: 45.3, carbs: 0 } },
                { name: "たまねぎ", amount: 100, unit: "g", calories: 37, nutrition: { calories: 37, protein: 1.0, fat: 0.1, carbs: 8.8 } },
                { name: "卵", amount: 1, unit: "個", calories: 91, nutrition: { calories: 91, protein: 7.4, fat: 6.2, carbs: 0.2 } },
                { name: "パン", amount: 50, unit: "g", calories: 132, nutrition: { calories: 132, protein: 4.7, fat: 2.2, carbs: 23.4 } }
            ],
            instructions: "1. たまねぎをみじん切りにして炒める\n2. ひき肉、卵、パン粉を混ぜる\n3. ハンバーグの形に成形\n4. フライパンで両面を焼く\n5. 蓋をして蒸し焼きにする",
            totalCalories: 932,
            caloriesPerServing: 466
        },
        {
            id: 10,
            name: "冷やし中華",
            servings: 2,
            category: "中華",
            tags: ["時短"],
            ingredients: [
                { name: "中華麺", amount: 200, unit: "g", calories: 280, nutrition: { calories: 280, protein: 9.0, fat: 1.6, carbs: 57.4 } },
                { name: "卵", amount: 2, unit: "個", calories: 181, nutrition: { calories: 181, protein: 14.8, fat: 12.4, carbs: 0.4 } },
                { name: "きゅうり", amount: 100, unit: "g", calories: 14, nutrition: { calories: 14, protein: 1.0, fat: 0.1, carbs: 3.0 } },
                { name: "トマト", amount: 100, unit: "g", calories: 19, nutrition: { calories: 19, protein: 0.7, fat: 0.1, carbs: 3.9 } }
            ],
            instructions: "1. 中華麺を茹でて冷やす\n2. 薄焼き卵を作って細切りにする\n3. 野菜を細切りにする\n4. 麺の上に具材をのせる\n5. たれをかける",
            totalCalories: 494,
            caloriesPerServing: 247
        },
        {
            id: 11,
            name: "肉じゃが",
            servings: 4,
            category: "和食",
            tags: [],
            ingredients: [
                { name: "牛肉", amount: 200, unit: "g", calories: 742, nutrition: { calories: 742, protein: 28.8, fat: 65.8, carbs: 0.4 } },
                { name: "じゃがいも", amount: 400, unit: "g", calories: 304, nutrition: { calories: 304, protein: 6.4, fat: 0.4, carbs: 70.4 } },
                { name: "にんじん", amount: 100, unit: "g", calories: 39, nutrition: { calories: 39, protein: 0.7, fat: 0.2, carbs: 9.3 } },
                { name: "たまねぎ", amount: 150, unit: "g", calories: 56, nutrition: { calories: 56, protein: 1.5, fat: 0.2, carbs: 13.2 } }
            ],
            instructions: "1. 野菜を一口大に切る\n2. 牛肉を炒める\n3. 野菜を加えて炒める\n4. だし汁を加えて煮込む\n5. 醤油、砂糖、みりんで味付け",
            totalCalories: 1141,
            caloriesPerServing: 285
        },
        {
            id: 12,
            name: "フライドチキン",
            servings: 3,
            category: "洋食",
            tags: ["パーティー"],
            ingredients: [
                { name: "鶏もも肉", amount: 600, unit: "g", calories: 1200, nutrition: { calories: 1200, protein: 97.2, fat: 84.0, carbs: 0 } },
                { name: "小麦粉", amount: 100, unit: "g", calories: 367, nutrition: { calories: 367, protein: 8.3, fat: 1.5, carbs: 75.8 } },
                { name: "卵", amount: 1, unit: "個", calories: 91, nutrition: { calories: 91, protein: 7.4, fat: 6.2, carbs: 0.2 } },
                { name: "サラダ油", amount: 200, unit: "g", calories: 1842, nutrition: { calories: 1842, protein: 0, fat: 200.0, carbs: 0 } }
            ],
            instructions: "1. 鶏肉に下味をつける\n2. 小麦粉と卵の衣をつける\n3. 180℃の油で揚げる\n4. きつね色になるまで揚げる",
            totalCalories: 3500,
            caloriesPerServing: 1167
        },
        {
            id: 13,
            name: "チャーハン",
            servings: 2,
            category: "中華",
            tags: ["時短"],
            ingredients: [
                { name: "ご飯", amount: 300, unit: "g", calories: 504, nutrition: { calories: 504, protein: 7.5, fat: 0.9, carbs: 111.3 } },
                { name: "卵", amount: 2, unit: "個", calories: 181, nutrition: { calories: 181, protein: 14.8, fat: 12.4, carbs: 0.4 } },
                { name: "ねぎ", amount: 50, unit: "g", calories: 19, nutrition: { calories: 19, protein: 0.5, fat: 0.1, carbs: 4.4 } },
                { name: "チャーシュー", amount: 100, unit: "g", calories: 386, nutrition: { calories: 386, protein: 14.2, fat: 35.4, carbs: 0 } },
                { name: "ごま油", amount: 1, unit: "大さじ", calories: 111, nutrition: { calories: 111, protein: 0, fat: 12.0, carbs: 0 } }
            ],
            instructions: "1. 卵を炒めて取り出す\n2. チャーシューを炒める\n3. ご飯を加えて炒める\n4. 卵を戻し入れて混ぜる\n5. ねぎを散らす",
            totalCalories: 1201,
            caloriesPerServing: 601
        },
        {
            id: 14,
            name: "天ぷら",
            servings: 3,
            category: "和食",
            tags: ["パーティー"],
            ingredients: [
                { name: "えび", amount: 200, unit: "g", calories: 164, nutrition: { calories: 164, protein: 36.8, fat: 0.6, carbs: 0.2 } },
                { name: "なす", amount: 150, unit: "g", calories: 33, nutrition: { calories: 33, protein: 1.7, fat: 0.2, carbs: 7.7 } },
                { name: "小麦粉", amount: 150, unit: "g", calories: 551, nutrition: { calories: 551, protein: 12.5, fat: 2.3, carbs: 113.7 } },
                { name: "サラダ油", amount: 300, unit: "g", calories: 2763, nutrition: { calories: 2763, protein: 0, fat: 300.0, carbs: 0 } }
            ],
            instructions: "1. 具材を切る\n2. 天ぷら粉を水で溶く\n3. 具材に衣をつける\n4. 170℃の油で揚げる",
            totalCalories: 3511,
            caloriesPerServing: 1170
        },
        {
            id: 15,
            name: "グラタン",
            servings: 4,
            category: "洋食",
            tags: [],
            ingredients: [
                { name: "マカロニ", amount: 200, unit: "g", calories: 330, nutrition: { calories: 330, protein: 10.8, fat: 1.8, carbs: 64.4 } },
                { name: "鶏肉", amount: 200, unit: "g", calories: 400, nutrition: { calories: 400, protein: 32.4, fat: 28.0, carbs: 0 } },
                { name: "牛乳", amount: 300, unit: "g", calories: 201, nutrition: { calories: 201, protein: 9.9, fat: 11.4, carbs: 14.4 } },
                { name: "チーズ", amount: 100, unit: "g", calories: 339, nutrition: { calories: 339, protein: 22.7, fat: 26.0, carbs: 2.0 } }
            ],
            instructions: "1. マカロニを茹でる\n2. 鶏肉を炒める\n3. ホワイトソースを作る\n4. 具材を混ぜてグラタン皿に入れる\n5. チーズをのせてオーブンで焼く",
            totalCalories: 1270,
            caloriesPerServing: 318
        },
        {
            id: 16,
            name: "焼きそば",
            servings: 2,
            category: "中華",
            tags: ["時短"],
            ingredients: [
                { name: "中華麺", amount: 200, unit: "g", calories: 280, nutrition: { calories: 280, protein: 9.0, fat: 1.6, carbs: 57.4 } },
                { name: "キャベツ", amount: 150, unit: "g", calories: 35, nutrition: { calories: 35, protein: 2.0, fat: 0.3, carbs: 7.8 } },
                { name: "もやし", amount: 100, unit: "g", calories: 14, nutrition: { calories: 14, protein: 1.7, fat: 0.1, carbs: 2.6 } },
                { name: "豚肉", amount: 100, unit: "g", calories: 386, nutrition: { calories: 386, protein: 14.2, fat: 35.4, carbs: 0 } }
            ],
            instructions: "1. 野菜を切る\n2. 豚肉を炒める\n3. 野菜を加えて炒める\n4. 麺を加えて炒める\n5. ソースで味付け",
            totalCalories: 715,
            caloriesPerServing: 358
        },
        {
            id: 17,
            name: "鶏の唐揚げ",
            servings: 3,
            category: "和食",
            tags: ["子供向け"],
            ingredients: [
                { name: "鶏もも肉", amount: 500, unit: "g", calories: 1000, nutrition: { calories: 1000, protein: 81.0, fat: 70.0, carbs: 0 } },
                { name: "片栗粉", amount: 80, unit: "g", calories: 264, nutrition: { calories: 264, protein: 0.1, fat: 0.1, carbs: 65.3 } },
                { name: "サラダ油", amount: 200, unit: "g", calories: 1842, nutrition: { calories: 1842, protein: 0, fat: 200.0, carbs: 0 } }
            ],
            instructions: "1. 鶏肉を一口大に切る\n2. 下味をつける\n3. 片栗粉をまぶす\n4. 170℃の油で揚げる\n5. 二度揚げしてカリッと仕上げる",
            totalCalories: 3106,
            caloriesPerServing: 1035
        },
        {
            id: 18,
            name: "うどん",
            servings: 1,
            category: "和食",
            tags: ["時短"],
            ingredients: [
                { name: "うどん", amount: 200, unit: "g", calories: 210, nutrition: { calories: 210, protein: 5.2, fat: 0.8, carbs: 43.2 } },
                { name: "ねぎ", amount: 30, unit: "g", calories: 11, nutrition: { calories: 11, protein: 0.3, fat: 0.1, carbs: 2.6 } },
                { name: "卵", amount: 1, unit: "個", calories: 91, nutrition: { calories: 91, protein: 7.4, fat: 6.2, carbs: 0.2 } }
            ],
            instructions: "1. うどんを茹でる\n2. だし汁を温める\n3. うどんを器に入れる\n4. だし汁をかける\n5. ねぎと卵をトッピング",
            totalCalories: 312,
            caloriesPerServing: 312
        },
        {
            id: 19,
            name: "シーザーサラダ",
            servings: 2,
            category: "洋食",
            tags: ["ヘルシー"],
            ingredients: [
                { name: "レタス", amount: 200, unit: "g", calories: 24, nutrition: { calories: 24, protein: 1.2, fat: 0.2, carbs: 5.6 } },
                { name: "トマト", amount: 100, unit: "g", calories: 19, nutrition: { calories: 19, protein: 0.7, fat: 0.1, carbs: 3.9 } },
                { name: "チーズ", amount: 50, unit: "g", calories: 170, nutrition: { calories: 170, protein: 11.4, fat: 13.0, carbs: 1.0 } },
                { name: "パン", amount: 50, unit: "g", calories: 132, nutrition: { calories: 132, protein: 4.7, fat: 2.2, carbs: 23.4 } }
            ],
            instructions: "1. レタスを食べやすく切る\n2. トマトを角切りにする\n3. パンをクルトンにする\n4. チーズを削る\n5. ドレッシングで和える",
            totalCalories: 345,
            caloriesPerServing: 173
        },
        {
            id: 20,
            name: "パンケーキ",
            servings: 3,
            category: "デザート",
            tags: ["子供向け"],
            ingredients: [
                { name: "小麦粉", amount: 200, unit: "g", calories: 734, nutrition: { calories: 734, protein: 16.6, fat: 3.0, carbs: 151.6 } },
                { name: "卵", amount: 2, unit: "個", calories: 181, nutrition: { calories: 181, protein: 14.8, fat: 12.4, carbs: 0.4 } },
                { name: "牛乳", amount: 200, unit: "g", calories: 134, nutrition: { calories: 134, protein: 6.6, fat: 7.6, carbs: 9.6 } },
                { name: "砂糖", amount: 30, unit: "g", calories: 115, nutrition: { calories: 115, protein: 0, fat: 0, carbs: 30.0 } },
                { name: "バター", amount: 20, unit: "g", calories: 149, nutrition: { calories: 149, protein: 0.1, fat: 16.6, carbs: 0.0 } }
            ],
            instructions: "1. 小麦粉と砂糖を混ぜる\n2. 卵と牛乳を加えて混ぜる\n3. フライパンにバターを溶かす\n4. 生地を流し入れて焼く\n5. 両面を焼いて完成",
            totalCalories: 1313,
            caloriesPerServing: 438
        }
    ];
    
    recipes = sampleRecipes;
    saveToLocalStorage();
    displayRecipes();
}