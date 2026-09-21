const  S3_BASE_URL = 'https://yuliya-sarokina-innowise-com-ums.s3.amazonaws.com';


export const getAvatarSrc = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${S3_BASE_URL}/${imagePath}`;
};