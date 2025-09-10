import { selectUsers, selectMe } from "../queries/selects.js";
import { UAParser } from 'ua-parser-js';

async function getUsers() {
  try {
    const usuarios = await selectUsers();
    return usuarios;
  } catch (err) {
    console.error("Erro ao selecionar usuários:", err.message);
    throw err;
  }
}

async function myProfileService(userId) {
  try {
    if (!userId) {
      throw new Error("Id do usuario obrigatorio.");
    }
    const getMe = await selectMe(userId);
    if (!getMe) {
      throw new Error("Não foi possivel encontrar seu perfil.");
    }
    // frequencias recentes
    // ocorrencias 
    const { senha, ...userSafeData } = getMe; // Remover campos sensíveis antes de retornar
    return userSafeData;
  } catch (err) {
    console.error("Erro ao selecionar usuário:", err.message);
    throw err;
  }
}

async function getDeviceInfo(userAgent) {
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();
  console.log("userAgent recebido:", userAgent);
  if (userAgent === 'PostmanRuntime/7.46.0') {
    return 'PostmanRuntime/7.46.0';
  }
  return {
    browser: deviceInfo.browser.name,
    os: deviceInfo.os.name,
    device: deviceInfo.device.model,
  };
}

export { getUsers, myProfileService, getDeviceInfo };