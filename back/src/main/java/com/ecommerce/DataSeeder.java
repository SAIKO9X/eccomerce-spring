package com.ecommerce;

import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.repositories.SellerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Order(2)
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

  private final SellerRepository sellerRepository;
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
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
    List<Product> allProducts = new ArrayList<>();

    // --- Seção de iPhones ---
    Category smartphoneCategory = categoryRepository.findByCategoryId("electronics_phones_iphone").orElse(null);
    if (smartphoneCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("iPhone 15 Pro", "O novo iPhone 15 Pro com chip A17 Bionic.", new BigDecimal("9299.00"), new BigDecimal("8599.00"), 10, seller, smartphoneCategory, List.of("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699312")),
        createProduct("iPhone 15", "O iPhone 15 com Dynamic Island e câmera de 48MP.", new BigDecimal("7299.00"), new BigDecimal("6599.00"), 15, seller, smartphoneCategory, List.of("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923777972", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink_AV1?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692923781792"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_phones_iphone' não encontrada.");
    }

    // --- Seção de MacBooks ---
    Category laptopCategory = categoryRepository.findByCategoryId("electronics_laptops_ultrathin").orElse(null);
    if (laptopCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("MacBook Air", "Superleve e potente, com chip M4.", new BigDecimal("10999.00"), new BigDecimal("9899.00"), 8, seller, laptopCategory, List.of("https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-m4-gallery7-202503?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=TkdkdTYvZmdKUlhJb2I0VXBWbFVFY3VoMUZNNDRVL2pzWmc0SVRMZjBwQXBFd2F2YlBVdmtrWUs2bExmOEpiQ2dsbGZlRHV0Q3JlbHJxWXRlWjZpMnA2UjRCeUZ1cmNrQmUvQ1hmTmlERzA")),
        createProduct("MacBook Pro", "Performance extrema com o novo chip M4 Pro.", new BigDecimal("18499.00"), new BigDecimal("17599.00"), 5, seller, laptopCategory, List.of("https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-gallery1-202410?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=YnlWZDdpMFo0bUpJZnBpZjhKM2M3WGpXSTNqQ2U1MjQxSHBKRkRoWUE0bmd1eUJ6eHZMSFFNMld6aTRncXNRUlJWYlIvRkkxemNIb09FY29ZRmVrUDhQTUF6eWYycDMyY0I5TEVkZkpSbDU4aHA0S1QvclFGZSsvUzZRWUI0U1M"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_laptops_ultrathin' não encontrada.");
    }

    // --- Seção de iPads ---
    Category tabletCategory = categoryRepository.findByCategoryId("electronics_tablets_ipad").orElse(null);
    if (tabletCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("iPad Pro", "O iPad definitivo com chip M2.", new BigDecimal("8799.00"), new BigDecimal("8199.00"), 12, seller, tabletCategory, List.of("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-cell-spacegray-202210?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1664411180183")),
        createProduct("iPad Air", "Colorido e versátil, com o poderoso chip M1.", new BigDecimal("6999.00"), new BigDecimal("6299.00"), 18, seller, tabletCategory, List.of("https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1645065732688"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_tablets_ipad' não encontrada.");
    }

    // --- Seção de Apple Watches ---
    Category wearableCategory = categoryRepository.findByCategoryId("electronics_wearables_smartwatches").orElse(null);
    if (wearableCategory != null) {
      allProducts.addAll(Arrays.asList(
        createProduct("Apple Watch Series", "Mais inteligente, brilhante e poderoso.", new BigDecimal("4999.00"), new BigDecimal("4499.00"), 25, seller, wearableCategory, List.of("https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-1-202503_GEO_BR?wid=5120&hei=3280&fmt=p-jpg&qlt=80&.v=T1poMzZuRzBxQ1RzQmhMUHprUE5LZHlVRllKam5abHNZRGludXlMbytKN0NYcFh4djFrbVFwcjBjSVBjVEoxUWZvSGF2dFhlaXl5ZzZDVTRMdEVvNldmalN5dlRpR2R3QUc1RGJwYllnWml0Tk15R2tiY0pWUEJVRjRRa0RBZXA")),
        createProduct("Apple Watch Ultra", "Aventura em um novo nível. A caixa de titânio.", new BigDecimal("9699.00"), new BigDecimal("8999.00"), 7, seller, wearableCategory, List.of("https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ultra-case-unselect-gallery-1-202409_GEO_BR?wid=5120&hei=3280&fmt=p-jpg&qlt=80&.v=aTVJSEliNW9jb25zalBlTm16VmMxcWpkNHRJWDMzcTg3NWRxV0pydTcvSUtncmJvdFd4U3pDVy9GQnFOSXAweUtZMGFKbG9yanhQdjZDS1dZUFFhRWJZc3g4ZkhUVEc0bFNFL1l3MHJZd1Zha1RoZlNOZ09NR2pDSUlzOVhLMmQ"))
      ));
    } else {
      System.out.println("AVISO: Categoria 'electronics_wearables_smartwatches' não encontrada.");
    }

    if (!allProducts.isEmpty()) {
      productRepository.saveAll(allProducts);
    }
  }

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
    int discountPercent = basePrice.subtract(sellingPrice).multiply(new BigDecimal(100)).divide(basePrice, 0, BigDecimal.ROUND_HALF_UP).intValue();
    product.setDiscountPercent(discountPercent);
    return product;
  }
}