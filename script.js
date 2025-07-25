// レシピデータを保存する配列
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// DOM要素の取得
const recipeList = document.getElementById('recipeList');
const recipeForm = document.getElementById('recipeForm');
const addRecipeBtn = document.getElementById('addRecipeBtn');
const saveRecipeBtn = document.getElementById('saveRecipeBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');

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
    const ingredients = document.getElementById('recipeIngredients').value;
    const instructions = document.getElementById('recipeInstructions').value;
    
    if (name && ingredients && instructions) {
        const recipe = {
            id: Date.now(),
            name: name,
            ingredients: ingredients.split('\n').filter(item => item.trim()),
            instructions: instructions
        };
        
        recipes.push(recipe);
        saveToLocalStorage();
        displayRecipes();
        recipeForm.classList.add('hidden');
        clearForm();
    } else {
        alert('すべての項目を入力してください。');
    }
});

// フォームのクリア
function clearForm() {
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeIngredients').value = '';
    document.getElementById('recipeInstructions').value = '';
}

// レシピの表示
function displayRecipes(searchTerm = '') {
    const filteredRecipes = recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    recipeList.innerHTML = '';
    
    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const ingredientsList = recipe.ingredients
            .map(ing => `<li>${ing}</li>`)
            .join('');
        
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <h4>材料:</h4>
            <ul>${ingredientsList}</ul>
            <h4>作り方:</h4>
            <p>${recipe.instructions}</p>
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
            ingredients: ["パスタ 200g", "トマト缶 1缶", "にんにく 2片", "オリーブオイル 大さじ2", "塩・こしょう 適量"],
            instructions: "1. パスタを茹でる\n2. にんにくをみじん切りにしてオリーブオイルで炒める\n3. トマト缶を加えて煮込む\n4. 茹でたパスタを加えて混ぜる"
        },
        {
            id: 2,
            name: "野菜たっぷりサラダ",
            ingredients: ["レタス 1/2個", "トマト 2個", "きゅうり 1本", "ドレッシング 適量"],
            instructions: "1. 野菜を洗って食べやすい大きさに切る\n2. ボウルに入れて混ぜる\n3. ドレッシングをかける"
        }
    ];
    
    recipes = sampleRecipes;
    saveToLocalStorage();
    displayRecipes();
}