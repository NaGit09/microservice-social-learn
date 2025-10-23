export const getAssetProvier = (fileName : string) => {
    return new URL(`/src/assets/image/${fileName}`, import.meta.url).href;
}