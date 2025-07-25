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
    const instructions = document.getElementById('recipeInstructions').value;
    
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
            ingredients.push({
                name: ingredientName,
                amount: parseFloat(amount),
                unit: unit,
                calories: calories
            });
            totalCalories += calories;
        }
    });
    
    if (name && ingredients.length > 0 && instructions) {
        const recipe = {
            id: Date.now(),
            name: name,
            servings: servings,
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
    document.getElementById('recipeInstructions').value = '';
    
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
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    recipeList.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const ingredientsList = recipe.ingredients
            .map(ing => `<li>${ing.name} ${ing.amount}${ing.unit} (${ing.calories}kcal)</li>`)
            .join('');
        
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.servings}人分</p>
            <h4>材料:</h4>
            <ul>${ingredientsList}</ul>
            <h4>作り方:</h4>
            <p>${recipe.instructions}</p>
            <div class="recipe-calories">
                合計: ${recipe.totalCalories} kcal | 1人分: ${recipe.caloriesPerServing} kcal
            </div>
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

// 検索機能
searchInput.addEventListener('input', (e) => {
    displayRecipes(e.target.value);
});

// 初期表示
displayRecipes();

// サンプルレシピの追加（初回のみ）
if (recipes.length === 0) {
    const sampleRecipes = [
        {
            id: 1,
            name: "シンプルなトマトパスタ",
            servings: 2,
            ingredients: [
                { name: "パスタ", amount: 200, unit: "g", calories: 330 },
                { name: "トマト缶", amount: 1, unit: "缶", calories: 40 },
                { name: "にんにく", amount: 2, unit: "片", calories: 8 },
                { name: "オリーブオイル", amount: 2, unit: "大さじ", calories: 221 },
                { name: "塩", amount: 1, unit: "小さじ", calories: 0 }
            ],
            instructions: "1. パスタを茹でる\n2. にんにくをみじん切りにしてオリーブオイルで炒める\n3. トマト缶を加えて煮込む\n4. 茹でたパスタを加えて混ぜる",
            totalCalories: 599,
            caloriesPerServing: 300
        },
        {
            id: 2,
            name: "野菜たっぷりサラダ",
            servings: 2,
            ingredients: [
                { name: "レタス", amount: 200, unit: "g", calories: 24 },
                { name: "トマト", amount: 2, unit: "個", calories: 57 },
                { name: "きゅうり", amount: 1, unit: "本", calories: 14 }
            ],
            instructions: "1. 野菜を洗って食べやすい大きさに切る\n2. ボウルに入れて混ぜる\n3. ドレッシングをかける",
            totalCalories: 95,
            caloriesPerServing: 48
        }
    ];
    
    recipes = sampleRecipes;
    saveToLocalStorage();
    displayRecipes();
}