export const isValidFile = (file: unknown): file is Express.Multer.File => {
  if (
    !file ||
    typeof file !== 'object' ||
    !('originalname' in file) ||
    !('size' in file)
  ) {
    return false;
  }
  const originalname = (file as { originalname: unknown }).originalname;
  const size = (file as { size: unknown }).size;
  if (typeof originalname !== 'string' || typeof size !== 'number') {
    return false;
  }
  if (
    !originalname.match(
      /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i,
    )
  ) {
    return false;
  }
  if (size > 25 * 1024 * 1024) {
    return false;
  }
  return true;
};
