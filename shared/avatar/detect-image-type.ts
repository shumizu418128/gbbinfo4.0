const JPEG_SIGNATURE = [0xff, 0xd8, 0xff] as const;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;
const GIF_SIGNATURE = [0x47, 0x49, 0x46, 0x38] as const;
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46] as const;
const WEBP_SIGNATURE = [0x57, 0x45, 0x42, 0x50] as const;

/**
 * バイト列先頭が指定シグネチャと一致するか判定する。
 *
 * Args:
 *   bytes: 画像バイナリ。
 *   signature: 期待する先頭バイト列。
 *
 * Returns:
 *   一致すれば true。
 */
const hasSignature = (bytes: Uint8Array, signature: readonly number[]): boolean => {
  if (bytes.length < signature.length) {
    return false;
  }

  return signature.every((value, index) => bytes[index] === value);
};

/**
 * 画像バイナリの先頭バイトから Content-Type を推定する。
 *
 * Args:
 *   bytes: 画像バイナリ。
 *
 * Returns:
 *   推定 Content-Type。判定不能時は null。
 */
export const detectImageContentType = (bytes: Uint8Array): string | null => {
  if (hasSignature(bytes, JPEG_SIGNATURE)) {
    return "image/jpeg";
  }

  if (hasSignature(bytes, PNG_SIGNATURE)) {
    return "image/png";
  }

  if (hasSignature(bytes, GIF_SIGNATURE)) {
    return "image/gif";
  }

  if (
    hasSignature(bytes, RIFF_SIGNATURE) &&
    bytes.length >= 12 &&
    hasSignature(bytes.subarray(8, 12), WEBP_SIGNATURE)
  ) {
    return "image/webp";
  }

  return null;
};

/**
 * 宣言 Content-Type とマジックバイトから最終 Content-Type を決定する。
 *
 * マジックバイト判定を優先する。
 *
 * Args:
 *   bytes: 画像バイナリ。
 *   declaredType: multipart の file.type 等。
 *
 * Returns:
 *   有効な image/* Content-Type。判定不能時は null。
 */
export const resolveImageContentType = (
  bytes: Uint8Array,
  declaredType: string | null,
): string | null => {
  const detected = detectImageContentType(bytes);
  if (detected) {
    return detected;
  }

  if (declaredType?.toLowerCase().startsWith("image/")) {
    return declaredType;
  }

  return null;
};
