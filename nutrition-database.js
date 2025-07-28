// 栄養素データベース（100gあたり）
window.nutritionDatabase = {
    // 穀物・主食
    "ご飯": { calories: 168, protein: 2.5, fat: 0.3, carbs: 37.1 },
    "パン": { calories: 264, protein: 9.3, fat: 4.4, carbs: 46.7 },
    "食パン": { calories: 264, protein: 9.3, fat: 4.4, carbs: 46.7 },
    "うどん": { calories: 105, protein: 2.6, fat: 0.4, carbs: 21.6 },
    "そば": { calories: 132, protein: 4.8, fat: 1.0, carbs: 26.0 },
    "パスタ": { calories: 165, protein: 5.4, fat: 0.9, carbs: 32.2 },
    "もち": { calories: 235, protein: 4.2, fat: 0.8, carbs: 50.3 },
    
    // 肉類
    "鶏肉": { calories: 200, protein: 16.2, fat: 14.0, carbs: 0 },
    "鶏むね肉": { calories: 108, protein: 22.3, fat: 1.5, carbs: 0 },
    "鶏もも肉": { calories: 200, protein: 16.2, fat: 14.0, carbs: 0 },
    "豚肉": { calories: 386, protein: 14.2, fat: 35.4, carbs: 0 },
    "豚バラ肉": { calories: 386, protein: 14.2, fat: 35.4, carbs: 0 },
    "豚ロース": { calories: 263, protein: 19.3, fat: 19.2, carbs: 0.2 },
    "牛肉": { calories: 371, protein: 14.4, fat: 32.9, carbs: 0.2 },
    "牛もも肉": { calories: 182, protein: 21.2, fat: 10.7, carbs: 0.5 },
    "ひき肉": { calories: 224, protein: 18.6, fat: 15.1, carbs: 0 },
    
    // 魚介類
    "鮭": { calories: 133, protein: 22.3, fat: 4.1, carbs: 0.1 },
    "まぐろ": { calories: 125, protein: 26.4, fat: 1.4, carbs: 0.1 },
    "さば": { calories: 202, protein: 20.7, fat: 12.1, carbs: 0.3 },
    "えび": { calories: 82, protein: 18.4, fat: 0.3, carbs: 0.1 },
    "いか": { calories: 88, protein: 18.1, fat: 1.2, carbs: 0.2 },
    "たこ": { calories: 76, protein: 16.4, fat: 0.7, carbs: 0.1 },
    
    // 野菜
    "キャベツ": { calories: 23, protein: 1.3, fat: 0.2, carbs: 5.2 },
    "レタス": { calories: 12, protein: 0.6, fat: 0.1, carbs: 2.8 },
    "トマト": { calories: 19, protein: 0.7, fat: 0.1, carbs: 3.9 },
    "きゅうり": { calories: 14, protein: 1.0, fat: 0.1, carbs: 3.0 },
    "にんじん": { calories: 39, protein: 0.7, fat: 0.2, carbs: 9.3 },
    "じゃがいも": { calories: 76, protein: 1.6, fat: 0.1, carbs: 17.6 },
    "たまねぎ": { calories: 37, protein: 1.0, fat: 0.1, carbs: 8.8 },
    "ピーマン": { calories: 22, protein: 0.9, fat: 0.2, carbs: 5.1 },
    "なす": { calories: 22, protein: 1.1, fat: 0.1, carbs: 5.1 },
    "ほうれん草": { calories: 20, protein: 2.2, fat: 0.4, carbs: 3.1 },
    "ブロッコリー": { calories: 33, protein: 4.3, fat: 0.5, carbs: 5.2 },
    "もやし": { calories: 14, protein: 1.7, fat: 0.1, carbs: 2.6 },
    
    // 豆・豆製品
    "豆腐": { calories: 56, protein: 4.9, fat: 3.0, carbs: 2.0 },
    "納豆": { calories: 200, protein: 16.5, fat: 10.0, carbs: 12.1 },
    "味噌": { calories: 217, protein: 12.5, fat: 6.0, carbs: 32.3 },
    "醤油": { calories: 71, protein: 7.7, fat: 0, carbs: 10.1 },
    
    // 卵・乳製品
    "卵": { calories: 151, protein: 12.3, fat: 10.3, carbs: 0.3 },
    "牛乳": { calories: 67, protein: 3.3, fat: 3.8, carbs: 4.8 },
    "チーズ": { calories: 339, protein: 25.7, fat: 26.0, carbs: 1.3 },
    "バター": { calories: 745, protein: 0.6, fat: 81.0, carbs: 0.2 },
    "ヨーグルト": { calories: 62, protein: 3.6, fat: 3.0, carbs: 4.9 },
    
    // 調味料・その他
    "砂糖": { calories: 384, protein: 0, fat: 0, carbs: 99.2 },
    "塩": { calories: 0, protein: 0, fat: 0, carbs: 0 },
    "油": { calories: 921, protein: 0, fat: 100, carbs: 0 },
    "ごま油": { calories: 921, protein: 0, fat: 100, carbs: 0 },
    "酢": { calories: 25, protein: 0.1, fat: 0, carbs: 2.4 },
    "みりん": { calories: 241, protein: 0.1, fat: 0, carbs: 54.9 },
    "酒": { calories: 103, protein: 0.1, fat: 0, carbs: 3.6 },
    "ケチャップ": { calories: 119, protein: 1.7, fat: 0.1, carbs: 27.4 },
    
    // その他
    "米": { calories: 356, protein: 6.1, fat: 0.9, carbs: 77.9 },
    "小麦粉": { calories: 367, protein: 8.3, fat: 1.5, carbs: 75.8 },
    "片栗粉": { calories: 330, protein: 0.1, fat: 0.1, carbs: 81.6 }
};

// 単位変換テーブル
window.unitConversions = {
    "個": {
        "卵": 60,
        "たまねぎ": 200,
        "じゃがいも": 150,
        "トマト": 150
    },
    "本": {
        "にんじん": 150,
        "きゅうり": 100,
        "なす": 80
    },
    "枚": {
        "食パン": 60,
        "豚ロース": 100,
        "鶏むね肉": 120
    },
    "パック": {
        "豆腐": 300,
        "納豆": 50,
        "もやし": 200
    },
    "大さじ": {
        "油": 12,
        "醤油": 18,
        "みりん": 18,
        "酒": 15,
        "砂糖": 9,
        "味噌": 18
    },
    "小さじ": {
        "油": 4,
        "醤油": 6,
        "砂糖": 3,
        "塩": 5,
        "酢": 5
    }
};

// カロリーデータベース（後方互換性のため）
window.calorieDatabase = {};
for (const [food, nutrition] of Object.entries(window.nutritionDatabase)) {
    window.calorieDatabase[food] = nutrition.calories;
}

// 栄養素計算関数
function calculateNutrition(ingredient, amount, unit = "g") {
    // nutritionDatabaseが利用可能かチェック
    if (typeof window.nutritionDatabase === 'undefined') {
        return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }
    
    const normalizedIngredient = ingredient.trim();
    let weightInGrams = amount;
    
    // 単位変換
    if (unit !== "g" && window.unitConversions[unit]) {
        if (window.unitConversions[unit][normalizedIngredient]) {
            weightInGrams = amount * window.unitConversions[unit][normalizedIngredient];
        }
    }
    
    // 栄養素計算（完全一致を先に試す）
    if (window.nutritionDatabase[normalizedIngredient]) {
        const nutrition = window.nutritionDatabase[normalizedIngredient];
        return {
            calories: Math.round((nutrition.calories * weightInGrams) / 100),
            protein: Math.round((nutrition.protein * weightInGrams) / 100 * 10) / 10,
            fat: Math.round((nutrition.fat * weightInGrams) / 100 * 10) / 10,
            carbs: Math.round((nutrition.carbs * weightInGrams) / 100 * 10) / 10
        };
    }
    
    // 部分一致を試す
    const keys = Object.keys(window.nutritionDatabase);
    const partialMatch = keys.find(key => 
        key.includes(normalizedIngredient) || normalizedIngredient.includes(key)
    );
    
    if (partialMatch) {
        const nutrition = window.nutritionDatabase[partialMatch];
        return {
            calories: Math.round((nutrition.calories * weightInGrams) / 100),
            protein: Math.round((nutrition.protein * weightInGrams) / 100 * 10) / 10,
            fat: Math.round((nutrition.fat * weightInGrams) / 100 * 10) / 10,
            carbs: Math.round((nutrition.carbs * weightInGrams) / 100 * 10) / 10
        };
    }
    
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
}

// グローバルスコープでnutritionDatabaseを利用可能にする
if (typeof nutritionDatabase === 'undefined') {
    var nutritionDatabase = window.nutritionDatabase;
}
if (typeof calorieDatabase === 'undefined') {
    var calorieDatabase = window.calorieDatabase;
}
if (typeof unitConversions === 'undefined') {
    var unitConversions = window.unitConversions;
}