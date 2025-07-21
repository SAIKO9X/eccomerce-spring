export const mainCategory = [
  {
    name: "Masculino",
    categoryId: "men",
    level: 1,
    levelTwoCategory: [
      {
        name: "Camisas",
        categoryId: "men_shirts",
        parentCategoryId: "men",
        level: 2,
      },
      {
        name: "Calças",
        categoryId: "men_pants",
        parentCategoryId: "men",
        level: 2,
      },
      {
        name: "Sapatos",
        categoryId: "men_shoes",
        parentCategoryId: "men",
        level: 2,
      },
      {
        name: "Acessórios",
        categoryId: "men_accessories",
        parentCategoryId: "men",
        level: 2,
      },
    ],
  },
  {
    name: "Femenino",
    categoryId: "women",
    level: 1,
    levelTwoCategory: [
      {
        name: "Vestidos",
        categoryId: "women_dresses",
        parentCategoryId: "women",
        level: 2,
      },
      {
        name: "Calças",
        categoryId: "women_pants",
        parentCategoryId: "women",
        level: 2,
      },
      {
        name: "Sapatos",
        categoryId: "women_shoes",
        parentCategoryId: "women",
        level: 2,
      },
    ],
  },
  {
    name: "Móveis para Casa",
    categoryId: "home_furniture",
    level: 1,
  },
  {
    name: "Eletrônicos",
    categoryId: "electronics",
    level: 1,
  },
];
