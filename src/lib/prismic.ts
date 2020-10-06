import Prismic from "prismic-javascript";

export const apiEndPoint = "https://devcommerce-test.cdn.prismic.io/api/v2";

export const client = (req = null) => {
  const options = req ? { req } : null;

  return Prismic.client(apiEndPoint, options);
};
