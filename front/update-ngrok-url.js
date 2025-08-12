import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Configuração ---
const NGROK_API_URL = "http://localhost:4040/api/tunnels";
const ENV_FILE_PATH = path.join(
  fileURLToPath(import.meta.url),
  "../../back/.env"
);
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 5;

// --- Funções ---

/**
 * Tenta buscar a URL do NGROK da API local.
 * @returns {Promise<string>} A URL pública HTTPS do túnel.
 */
async function getNgrokUrl() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(
        `Tentativa ${i + 1}/${MAX_RETRIES}: Buscando URL do NGROK...`
      );
      const response = await axios.get(NGROK_API_URL);
      const httpsTunnel = response.data.tunnels.find(
        (t) => t.proto === "https"
      );

      if (httpsTunnel && httpsTunnel.public_url) {
        return httpsTunnel.public_url;
      }
    } catch (error) {
      if (i === MAX_RETRIES - 1) {
        console.error(
          "❌ Erro final ao se conectar com a API do NGROK. Verifique se o NGROK está rodando."
        );
        throw new Error("Não foi possível obter a URL do NGROK.");
      }
      console.warn(
        "API do NGROK ainda não está pronta, tentando novamente em instantes..."
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
  throw new Error("URL do NGROK não encontrada após múltiplas tentativas.");
}

/**
 * Atualiza a variável WEB_BASE_URL no arquivo .env.
 * @param {string} newUrl A nova URL do NGROK.
 */
function updateEnvFile(newUrl) {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    console.error(`❌ Arquivo .env não encontrado em: ${ENV_FILE_PATH}`);
    return;
  }

  let envContent = fs.readFileSync(ENV_FILE_PATH, "utf-8");

  if (/^WEB_BASE_URL=/m.test(envContent)) {
    // Substitui a linha existente
    envContent = envContent.replace(
      /^WEB_BASE_URL=.*$/m,
      `WEB_BASE_URL=${newUrl}`
    );
    console.log("✅ Variável WEB_BASE_URL atualizada.");
  } else {
    // Adiciona a linha se não existir
    envContent += `\nWEB_BASE_URL=${newUrl}`;
    console.log("✅ Variável WEB_BASE_URL adicionada.");
  }

  fs.writeFileSync(ENV_FILE_PATH, envContent);
}

// --- Execução Principal ---
async function main() {
  try {
    const ngrokUrl = await getNgrokUrl();
    console.log(`🚀 URL do NGROK encontrada: ${ngrokUrl}`);
    updateEnvFile(ngrokUrl);
    console.log(
      "\n✨ Processo concluído! Por favor, reinicie seu servidor backend para aplicar as mudanças."
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Sai com código de erro
  }
}

main();
