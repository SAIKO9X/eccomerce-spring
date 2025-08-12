# 🛍️ E-commerce Multi-Vendor Completo

Este é um sistema de e-commerce completo com suporte a múltiplos vendedores (multi-vendor), desenvolvido com **Spring Boot** no backend e **React** no frontend. A plataforma oferece três níveis de acesso (Cliente, Vendedor, Administrador), cada um com seu próprio dashboard e funcionalidades.

O sistema inclui gerenciamento de produtos, carrinho de compras, lista de desejos, avaliações, e um fluxo de checkout integrado com gateways de pagamento como **Stripe** e **Mercado Pago**. O banco de dados **MySQL** é configurado para rodar via **Docker**, facilitando a configuração inicial do ambiente.

---

## ✅ Funcionalidades

- **Três Perfis de Usuário:**
  - 👤 **Cliente:** Navega, compra, avalia produtos, gerencia perfil e pedidos.
  - 🏪 **Vendedor:** Dashboard próprio, gerenciamento de produtos (CRUD), visualização de pedidos e métricas de vendas.
  - 👑 **Administrador:** Dashboard para gerenciar vendedores, cupons de desconto, e conteúdo da página inicial (carrossel, promoções).
- **Catálogo de Produtos:**
  - Sistema de categorias com múltiplos níveis.
  - Filtros de busca por preço, cor, marca e desconto.
- **Jornada de Compra:**
  - 🛒 Carrinho de compras persistente.
  - ❤️ Lista de desejos.
  - ⭐️ Sistema de avaliação de produtos com texto e imagens.
  - 💳 Checkout seguro com integração com Stripe e Mercado Pago.
- **Autenticação Segura:**
  - 🔐 Login e registro via OTP (One-Time Password) enviado por e-mail.
  - Autenticação baseada em JWT (JSON Web Token).

---

## ⚙️ Pré-requisitos

- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/install/)
- [PNPM](https://pnpm.io/) (ou `npm`/`yarn`)
- [NGROK](https://ngrok.com/download) (para testar os pagamentos)
- Uma conta de email (ex: Gmail) para o envio de e-mails transacionais.

---

## 🚀 Configuração do Ambiente

### 1. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/eccomerce-spring.git](https://github.com/seu-usuario/eccomerce-spring.git)
cd eccomerce-spring
```

### 2. Configurar o Backend

1.  Navegue até a pasta do backend: `cd back`.
2.  Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Abra o arquivo `.env` e preencha **todas** as variáveis com suas próprias credenciais (banco de dados, e-mails, chaves de API de pagamento, etc.).

    > **Importante:** Para o `MAIL_PASSWORD` do Gmail, use uma **Senha de Aplicativo**. [Veja como criar uma](https://support.google.com/accounts/answer/185833).

### 3. Iniciar o Banco de Dados com Docker

Com o Docker em execução, inicie o contêiner do MySQL. No terminal, dentro da pasta `back`:

```bash
docker-compose up -d
```

### 4. Configurar o Frontend

```bash
cd ../front
pnpm install
```

---

## ▶️ Executando o Projeto

Você precisará de 3 a 4 terminais abertos para rodar todo o ambiente.

### 1. Executar o Backend

Você pode rodar o backend diretamente pela sua IDE (como o IntelliJ IDEA) ou pelo terminal, na pasta `back`:

```bash
mvn spring-boot:run
```

### 2. Executar o Frontend

Em outro terminal, na pasta `front`:

```bash
pnpm run dev
```

---

### 🔥 Configuração Essencial para Teste de Pagamentos (NGROK)

Para que o Stripe e o Mercado Pago possam se comunicar com sua máquina local, você precisa usar o NGROK.

1.  **Inicie o NGROK:** Em um novo terminal, execute o comando para expor seu servidor frontend (que roda na porta 5173):

    ```bash
    ngrok http 5173
    ```

2.  **Copie a URL:** O NGROK irá gerar uma URL pública com HTTPS. Copie essa URL (ex: `https://abcd-1234.ngrok-free.app`).

3.  **Atualize o `.env` do Backend:** Abra o arquivo `back/.env` e cole a URL copiada na variável `WEB_BASE_URL`:

    ```env
    WEB_BASE_URL=[https://abcd-1234.ngrok-free.app](https://abcd-1234.ngrok-free.app)
    ```

4.  **Reinicie o Backend:** É **crucial** reiniciar sua aplicação Spring Boot para que ela utilize a nova URL do NGROK ao gerar os links de pagamento.

---

## 🌐 Acessando o Projeto

- **Para desenvolvimento geral:**

  - Frontend: [http://localhost:5173](http://localhost:5173)

- **Para testar o fluxo de pagamento:**

  - Acesse a loja **exclusivamente** pela URL pública fornecida pelo NGROK.

- **Backend API (Swagger):**
  - [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 🧰 Tecnologias Utilizadas

#### **Backend**

- Spring Boot 3
- Spring Data JPA / Hibernate
- Spring Security
- MySQL
- JWT (JSON Web Token)
- Stripe & Mercado Pago SDKs
- Thymeleaf (para templates de e-mail)

#### **Frontend**

- React 18
- Vite
- Redux Toolkit
- Axios
- Tailwind CSS
- Material-UI (MUI)

#### **Infraestrutura & Ferramentas**

- Docker
- Maven
- PNPM
- NGROK

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
