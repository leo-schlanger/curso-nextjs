import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import { client } from "@/lib/prismic";

interface ProductProps {
  product: Document;
}

// Use ssr false when the component needs to use a global browser variable
const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Products({ product }: ProductProps) {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDom.RichText.asHtml(product.data.description),
        }}
      />

      <p>Price: ${product.data.price}</p>

      <img src={product.data.thumbnail.url} width="600" />

      <button onClick={handleAddToCart}>Add to cart</button>
      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 5,
  };
};
