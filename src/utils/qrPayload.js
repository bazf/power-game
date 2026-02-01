const PREFIX = "PG1:";

const toBase64 = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCodePoint(byte);
    });
    return btoa(binary);
};

const fromBase64 = (value) => {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0);
    return new TextDecoder().decode(bytes);
};

export const encodePayload = (payload) => {
    const json = JSON.stringify(payload);
    return `${PREFIX}${toBase64(json)}`;
};

export const decodePayload = (text) => {
    if (!text?.startsWith(PREFIX)) {
        return null;
    }
    try {
        const json = fromBase64(text.slice(PREFIX.length));
        return JSON.parse(json);
    } catch {
        return null;
    }
};
