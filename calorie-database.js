// 栄養データベース（100gあたり）
const nutritionDatabase = {
    // 穀物・主食
    "ご飯": 168,
    "パン": 264,
    "食パン": 264,
    "うどん": 105,
    "そば": 132,
    "パスタ": 165,
    "もち": 235,
    
    // 肉類
    "鶏肉": 200,
    "鶏むね肉": 108,
    "鶏もも肉": 200,
    "豚肉": 386,
    "豚バラ肉": 386,
    "豚ロース": 263,
    "牛肉": 371,
    "牛もも肉": 182,
    "ひき肉": 224,
    
    // 魚介類
    "鮭": 133,
    "まぐろ": 125,
    "さば": 202,
    "えび": 82,
    "いか": 88,
    "たこ": 76,
    
    // 野菜
    "キャベツ": 23,
    "レタス": 12,
    "トマト": 19,
    "きゅうり": 14,
    "にんじん": 39,
    "じゃがいも": 76,
    "たまねぎ": 37,
    "ピーマン": 22,
    "なす": 22,
    "ほうれん草": 20,
    "ブロッコリー": 33,
    "もやし": 14,
    
    // 豆・豆製品
    "豆腐": 56,
    "納豆": 200,
    "味噌": 217,
    "醤油": 71,
    
    // 卵・乳製品
    "卵": 151,
    "牛乳": 67,
    "ヨーグルト": 62,
    "チーズ": 339,
    "バター": 745,
    
    // 調味料・油
    "砂糖": 384,
    "塩": 0,
    "こしょう": 0,
    "オリーブオイル": 921,
    "サラダ油": 921,
    "ごま油": 921,
    "マヨネーズ": 703,
    "ケチャップ": 119,
    
    // その他
    "米": 356,
    "小麦粉": 367,
    "片栗粉": 330
};

// 単位変換用のデータ
const unitConversions = {
    // 大さじ・小さじ
    "大さじ": {
        "醤油": 18,
        "味噌": 18,
        "砂糖": 9,
        "塩": 18,
        "オリーブオイル": 12,
        "サラダ油": 12,
        "ごま油": 12,
        "片栗粉": 9,
        "小麦粉": 9
    },
    "小さじ": {
        "醤油": 6,
        "味噌": 6,
        "砂糖": 3,
        "塩": 6,
        "オリーブオイル": 4,
        "サラダ油": 4,
        "ごま油": 4,
        "片栗粉": 3,
        "小麦粉": 3
    },
    // 個数系
    "個": {
        "卵": 60,
        "じゃがいも": 150,
        "たまねぎ": 200,
        "トマト": 150,
        "ピーマン": 30
    },
    "枚": {
        "食パン": 60,
        "もち": 50
    },
    "本": {
        "にんじん": 150,
        "きゅうり": 100,
        "なす": 80
    },
    "パック": {
        "納豆": 50,
        "豆腐": 300
    }
};

// カロリー計算関数
function calculateCalories(ingredient, amount, unit = "g") {
    const normalizedIngredient = ingredient.trim();
    let weightInGrams = amount;
    
    // 単位変換
    if (unit !== "g" && unitConversions[unit]) {
        if (unitConversions[unit][normalizedIngredient]) {
            weightInGrams = amount * unitConversions[unit][normalizedIngredient];
        }
    }
    
    // カロリー計算
    if (calorieDatabase[normalizedIngredient]) {
        return Math.round((calorieDatabase[normalizedIngredient] * weightInGrams) / 100);
    }
    
    return 0; // データベースにない場合
}

// 食材名の候補を取得
function getSuggestions(query) {
    const normalizedQuery = query.toLowerCase();
    return Object.keys(calorieDatabase).filter(food => 
        food.toLowerCase().includes(normalizedQuery)
    );
}