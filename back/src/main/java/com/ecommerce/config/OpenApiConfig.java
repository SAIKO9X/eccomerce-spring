package com.ecommerce.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  /**
   * Este método configura as informações gerais da API que serão exibidas na interface do Swagger.
   *
   * @return Um objeto OpenAPI customizado com as informações da API.
   */
  @Bean
  public OpenAPI customOpenAPI() {
    final String securitySchemeName = "bearerAuth";

    return new OpenAPI()
      .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
      .components(
        new Components()
          .addSecuritySchemes(securitySchemeName,
            new SecurityScheme()
              .name(securitySchemeName)
              .type(SecurityScheme.Type.HTTP)
              .scheme("bearer")
              .bearerFormat("JWT")
          )
      )
      .info(new Info()
        .title("API de Ecommerce")
        .description("Esta é a documentação da API para o projeto de Ecommerce. " +
          "Ela fornece todos os endpoints disponíveis para a interação com o sistema.")
        .version("v1.0.0")
        .license(new License().name("Apache 2.0").url("http://springdoc.org"))
      );
  }
}