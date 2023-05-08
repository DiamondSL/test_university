const createCryptoKey = async ({keyValue, keyName, encryptKeyCallback, decryptKeyCallback}) => {
  this.encodedContent = null;
  const encodeItem = (itemValue = keyValue) => {
    let enc = new TextEncoder();
    return enc.encode(itemValue);
  }
  const encryptItem = async (key = keyName, value = keyValue, encodedContent= this.encodedContent) => {
    let encoded = encodeItem(value);
    encodedContent = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encoded
    );
    encryptKeyCallback instanceof Function && encryptKeyCallback(encodedContent)
    return new Uint8Array(encodedContent, 0, 5);
  }
  const decryptItem = async (key = keyName, encodedContent = this.encodedContent, encodedContent1) => {
    let decrypted = await crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encodedContent
    );

    const dec = new TextDecoder();
    decryptKeyCallback instanceof Function && decryptKeyCallback(dec.decode(decrypted))
    return dec.decode(decrypted);
  }

  const generatedKey = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  ).then((keyPair) => keyPair)

  return {
    encodedContent: this.encodedContent,
    encryptItem: encryptItem(keyName, keyValue, this.encodedContent),
    decryptItem: decryptItem(keyName, keyValue, this.encodedContent),
    generatedKey: generatedKey
  };
}
