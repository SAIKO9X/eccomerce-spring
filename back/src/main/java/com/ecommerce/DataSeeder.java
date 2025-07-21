package com.ecommerce;

import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.repositories.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final SellerRepository sellerRepository;
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    // Verifica se o vendedor padrão já existe para não duplicar os dados
    if (sellerRepository.findByEmail("apple_store@example.com").isEmpty()) {
      System.out.println("Criando vendedor padrão...");
      Seller defaultSeller = createDefaultSeller();
      System.out.println("Vendedor padrão criado. Criando produtos...");
      createDefaultProducts(defaultSeller);
      System.out.println("Produtos padrão criados com sucesso.");
    } else {
      System.out.println("Vendedor padrão 'Apple Store Oficial' já existe. Nenhuma ação necessária.");
    }
  }

  private Seller createDefaultSeller() {
    Seller seller = new Seller();
    seller.setSellerName("Apple Store Oficial");
    seller.setEmail("apple_store@example.com");
    seller.setPassword(passwordEncoder.encode("password123"));
    seller.setCNPJ("12345678000195");
    seller.setMobile("11987654321");
    seller.setEmailVerified(true);
    seller.getBusinessDetails().setBusinessName("Apple Store Oficial LTDA");
    return sellerRepository.save(seller);
  }

  private void createDefaultProducts(Seller seller) {
    // Lista para armazenar todos os produtos a serem salvos
    List<Product> allProducts = new ArrayList<>();

    // --- Seção de iPhones ---
    Category smartphoneCategory = categoryRepository.findByCategoryId("electronics_phones_iphone").orElse(null);
    if (smartphoneCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("iPhone 15 Pro", "O novo iPhone 15 Pro com chip A17 Bionic.", new BigDecimal("9299.00"), new BigDecimal("8599.00"), 10, seller, smartphoneCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699312")),
        createProduct("iPhone 15", "O iPhone 15 com Dynamic Island e câmera de 48MP.", new BigDecimal("7299.00"), new BigDecimal("6599.00"), 15, seller, smartphoneCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923777972", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923781792")),
        createProduct("iPhone 14", "O iPhone 14 com sistema de câmera dupla avançado.", new BigDecimal("5999.00"), new BigDecimal("5299.00"), 20, seller, smartphoneCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1661026582322", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-purple_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1661026582322"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_phones_iphone' não encontrada. Produtos de iPhone não serão criados.");
    }

    // --- Seção de MacBooks ---
    Category laptopCategory = categoryRepository.findByCategoryId("electronics_laptops").orElse(null);
    if (laptopCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("MacBook Air 13” (M2)", "Superleve e potente, com chip M2.", new BigDecimal("10999.00"), new BigDecimal("9899.00"), 8, seller, laptopCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-space-gray-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303664")),
        createProduct("MacBook Pro 14” (M3)", "Performance extrema com o novo chip M3 Pro.", new BigDecimal("18499.00"), new BigDecimal("17599.00"), 5, seller, laptopCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697230830200"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_laptops' não encontrada. Produtos de MacBook não serão criados.");
    }

    // --- Seção de iPads ---
    Category tabletCategory = categoryRepository.findByCategoryId("electronics_tablets").orElse(null);
    if (tabletCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("iPad Pro", "O iPad definitivo com chip M2.", new BigDecimal("8799.00"), new BigDecimal("8199.00"), 12, seller, tabletCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-cell-spacegray-202210?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664411180183")),
        createProduct("iPad Air", "Colorido e versátil, com o poderoso chip M1.", new BigDecimal("6999.00"), new BigDecimal("6299.00"), 18, seller, tabletCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1645065732688"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_tablets' não encontrada. Produtos de iPad não serão criados.");
    }

    // --- Seção de Apple Watches ---
    Category wearableCategory = categoryRepository.findByCategoryId("electronics_wearables").orElse(null);
    if (wearableCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("Apple Watch Series 9", "Mais inteligente, brilhante e poderoso.", new BigDecimal("4999.00"), new BigDecimal("4499.00"), 25, seller, wearableCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTP63ref_VW_34FR+watch-41-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1694507812028")),
        createProduct("Apple Watch Ultra 2", "Aventura em um novo nível. A caixa de titânio.", new BigDecimal("9699.00"), new BigDecimal("8999.00"), 7, seller, wearableCategory, Arrays.asList("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT4J3ref_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-alpine-green_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1694738596660"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_wearables' não encontrada. Produtos de Apple Watch não serão criados.");
    }

    // Salva todos os produtos de uma só vez no banco de dados
    if (!allProducts.isEmpty()) {
      productRepository.saveAll(allProducts);
    }
  }

  // Método auxiliar para criar um produto de forma mais limpa
  private Product createProduct(String title, String description, BigDecimal basePrice, BigDecimal sellingPrice, int quantity, Seller seller, Category category, List<String> images) {
    Product product = new Product();
    product.setTitle(title);
    product.setDescription(description);
    product.setBasePrice(basePrice);
    product.setSellingPrice(sellingPrice);
    product.setQuantity(quantity);
    product.setSeller(seller);
    product.setCategory(category);
    product.setImages(images);
    // Calcula o desconto percentual
    int discountPercent = basePrice.subtract(sellingPrice).multiply(new BigDecimal(100)).divide(basePrice, 0, BigDecimal.ROUND_HALF_UP).intValue();
    product.setDiscountPercent(discountPercent);
    return product;
  }
}