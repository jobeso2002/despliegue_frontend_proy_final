import CryptoJS from "crypto-js";

const SECRET_KEY = 'my-secret-key';

// Función para encriptar datos
export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): any => {
  if (!ciphertext) return ciphertext;
  
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error("Error al desencriptar:", error);
    return null;
  }
};



