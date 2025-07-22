package com.ecommerce.utils.category;

public class MainCategoryData {

  public record MainCategory(String name, String categoryId, Integer level, CategoryLevelTwo[] levelTwoCategory) {
  }

  public record CategoryLevelTwo(String name, String categoryId, String parentCategoryId, Integer level) {
  }

  public record CategoryLevelThree(String name, String categoryId, String parentCategoryId, String parentCategoryName) {
  }

  // mainCategory (Level 1)
  public static MainCategory[] mainCategories = {
    new MainCategory(
      "Masculino",
      "men",
      1,
      new CategoryLevelTwo[]{
        new CategoryLevelTwo("Camisas", "men_shirts", "men", 2),
        new CategoryLevelTwo("Calças", "men_pants", "men", 2),
        new CategoryLevelTwo("Sapatos", "men_shoes", "men", 2),
        new CategoryLevelTwo("Acessórios", "men_accessories", "men", 2),
        new CategoryLevelTwo("Roupas Íntimas", "men_underwear", "men", 2),
      }
    ),
    new MainCategory(
      "Feminino",
      "women",
      1,
      new CategoryLevelTwo[]{
        new CategoryLevelTwo("Roupas de Cima", "women_topwear", "women", 2),
        new CategoryLevelTwo("Roupas de Baixo", "women_bottomwear", "women", 2),
        new CategoryLevelTwo("Calçados", "women_footwear", "women", 2),
        new CategoryLevelTwo("Acessórios", "women_accessories", "women", 2),
        new CategoryLevelTwo("Roupas Íntimas", "women_underwear", "women", 2),
      }
    ),
    new MainCategory(
      "Móveis para Casa",
      "home_furniture",
      1,
      new CategoryLevelTwo[]{
        new CategoryLevelTwo("Sofás", "home_furniture_sofas", "home_furniture", 2),
        new CategoryLevelTwo("Mesas", "home_furniture_tables", "home_furniture", 2),
        new CategoryLevelTwo("Camas", "home_furniture_beds", "home_furniture", 2),
        new CategoryLevelTwo("Armários", "home_furniture_wardrobes", "home_furniture", 2),
      }
    ),
    new MainCategory(
      "Eletrônicos",
      "electronics",
      1,
      new CategoryLevelTwo[]{
        new CategoryLevelTwo("Televisores", "electronics_tvs", "electronics", 2),
        new CategoryLevelTwo("Smartphones", "electronics_phones", "electronics", 2),
        new CategoryLevelTwo("Laptops", "electronics_laptops", "electronics", 2),
        new CategoryLevelTwo("Tablets", "electronics_tablets", "electronics", 2),
        new CategoryLevelTwo("Áudio", "electronics_audio", "electronics", 2),
        new CategoryLevelTwo("Vestíveis", "electronics_wearables", "electronics", 2)
      }
    ),
  };

  public static CategoryLevelTwo[] electronicsLevelTwo = {
    new CategoryLevelTwo("Televisores", "electronics_tvs", "electronics", 2),
    new CategoryLevelTwo("Smartphones", "electronics_phones", "electronics", 2),
    new CategoryLevelTwo("Laptops", "electronics_laptops", "electronics", 2),
    new CategoryLevelTwo("Tablets", "electronics_tablets", "electronics", 2),
    new CategoryLevelTwo("Áudio", "electronics_audio", "electronics", 2),
    new CategoryLevelTwo("Vestíveis", "electronics_wearables", "electronics", 2)
  };

  public static CategoryLevelTwo[] furnitureLevelTwo = {
    new CategoryLevelTwo("Sofás", "home_furniture_sofas", "home_furniture", 2),
    new CategoryLevelTwo("Mesas", "home_furniture_tables", "home_furniture", 2),
    new CategoryLevelTwo("Camas", "home_furniture_beds", "home_furniture", 2),
    new CategoryLevelTwo("Armários", "home_furniture_wardrobes", "home_furniture", 2),
  };

  public static CategoryLevelTwo[] menLevelTwo = {
    new CategoryLevelTwo("Roupas de Cima", "men_shirts", "men", 2),
    new CategoryLevelTwo("Roupas de Baixo", "men_pants", "men", 2),
    new CategoryLevelTwo("Calçados", "men_shoes", "men", 2),
    new CategoryLevelTwo("Acessórios", "men_accessories", "men", 2),
    new CategoryLevelTwo("Roupas Íntimas", "men_underwear", "men", 2),
  };

  public static CategoryLevelTwo[] womenLevelTwo = {
    new CategoryLevelTwo("Roupas de Cima", "women_topwear", "women", 2),
    new CategoryLevelTwo("Roupas de Baixo", "women_bottomwear", "women", 2),
    new CategoryLevelTwo("Calçados", "women_footwear", "women", 2),
    new CategoryLevelTwo("Acessórios", "women_accessories", "women", 2),
    new CategoryLevelTwo("Roupas Íntimas", "women_underwear", "women", 2),
  };

  public static CategoryLevelThree[] electronicsLevelThree = {
    new CategoryLevelThree("TV LED", "electronics_tvs_led", "electronics_tvs", "Televisores"),
    new CategoryLevelThree("TV 4K", "electronics_tvs_4k", "electronics_tvs", "Televisores"),
    new CategoryLevelThree("Smartphones Android", "electronics_phones_android", "electronics_phones", "Smartphones"),
    new CategoryLevelThree("iPhones", "electronics_phones_iphone", "electronics_phones", "Smartphones"),
    new CategoryLevelThree("Laptops Ultrafinos", "electronics_laptops_ultrathin", "electronics_laptops", "Laptops"),
    new CategoryLevelThree("Laptops para Jogos", "electronics_laptops_gaming", "electronics_laptops", "Laptops"),
    new CategoryLevelThree("Fones de Ouvido", "electronics_audio_headphones", "electronics_audio", "Áudio"),
    new CategoryLevelThree("Caixas de Som", "electronics_audio_speakers", "electronics_audio", "Áudio"),
    new CategoryLevelThree("Relógios Inteligentes", "electronics_wearables_smartwatches", "electronics_wearables", "Vestíveis"),
    new CategoryLevelThree("Óculos VR", "electronics_wearables_vrglasses", "electronics_wearables", "Vestíveis"),
    new CategoryLevelThree("iPads", "electronics_tablets_ipad", "electronics_tablets", "Tablets"),
    new CategoryLevelThree("Tablets Android", "electronics_tablets_android", "electronics_tablets", "Tablets"),
  };

  public static CategoryLevelThree[] furnitureLevelThree = {
    new CategoryLevelThree("Sofás de Canto", "home_furniture_sofas_corner", "home_furniture_sofas", "Sofás"),
    new CategoryLevelThree("Sofás Reclináveis", "home_furniture_sofas_recliner", "home_furniture_sofas", "Sofás"),
    new CategoryLevelThree("Mesas de Centro", "home_furniture_tables_coffee", "home_furniture_tables", "Mesas"),
    new CategoryLevelThree("Mesas de Jantar", "home_furniture_tables_dining", "home_furniture_tables", "Mesas"),
    new CategoryLevelThree("Camas de Casal", "home_furniture_beds_double", "home_furniture_beds", "Camas"),
    new CategoryLevelThree("Camas King Size", "home_furniture_beds_king", "home_furniture_beds", "Camas"),
    new CategoryLevelThree("Armários de Roupas", "home_furniture_wardrobes_clothing", "home_furniture_wardrobes", "Armários"),
    new CategoryLevelThree("Armários de Cozinha", "home_furniture_wardrobes_kitchen", "home_furniture_wardrobes", "Armários"),
    new CategoryLevelThree("Armários Multiuso", "home_furniture_wardrobes_multifunctional", "home_furniture_wardrobes", "Armários"),
    new CategoryLevelThree("Armários de Banheiro", "home_furniture_wardrobes_bathroom", "home_furniture_wardrobes", "Armários"),
  };

  public static CategoryLevelThree[] menLevelThree = {
    new CategoryLevelThree("Camisas Casuais", "men_shirts_casual", "men_shirts", "Roupas de Cima"),
    new CategoryLevelThree("Camisas Formais", "men_shirts_formal", "men_shirts", "Roupas de Cima"),
    new CategoryLevelThree("Jaquetas e Blazers", "men_shirts_outerwear", "men_shirts", "Roupas de Cima"),
    new CategoryLevelThree("Polo", "men_shirts_polo", "men_shirts", "Roupas de Cima"),
    new CategoryLevelThree("Calças Jeans", "men_pants_jeans", "men_pants", "Roupas de Baixo"),
    new CategoryLevelThree("Bermudas", "men_pants_shorts", "men_pants", "Roupas de Baixo"),
    new CategoryLevelThree("Tênis", "men_shoes_sneakers", "men_shoes", "Calçados"),
    new CategoryLevelThree("Sapatos Sociais", "men_shoes_formal", "men_shoes", "Calçados"),
    new CategoryLevelThree("Botas", "men_shoes_boots", "men_shoes", "Calçados"),
    new CategoryLevelThree("Sandálias", "men_shoes_sandals", "men_shoes", "Calçados"),
  };

  public static CategoryLevelThree[] womenLevelThree = {
    new CategoryLevelThree("Vestidos Casuais", "women_topwear_dresses_casual", "women_topwear", "Roupas de Cima"),
    new CategoryLevelThree("Vestidos de Festa", "women_topwear_dresses_party", "women_topwear", "Roupas de Cima"),
    new CategoryLevelThree("Camisas", "women_topwear_tshirts", "women_topwear", "Roupas de Cima"),
    new CategoryLevelThree("Calças Jeans", "women_bottomwear_jeans", "women_bottomwear", "Roupas de Baixo"),
    new CategoryLevelThree("Calças Formais", "women_bottomwear_formal", "women_bottomwear", "Roupas de Baixo"),
    new CategoryLevelThree("Sapatos de Salto", "women_footwear_heels", "women_footwear", "Calçados"),
    new CategoryLevelThree("Tênis", "women_footwear_sneakers", "women_footwear", "Calçados"),
    new CategoryLevelThree("Bolsas", "women_accessories_bags", "women_accessories", "Acessórios"),
    new CategoryLevelThree("Brincos", "women_accessories_earrings", "women_accessories", "Acessórios"),
    new CategoryLevelThree("Colares", "women_accessories_necklaces", "women_accessories", "Acessórios"),
  };
}