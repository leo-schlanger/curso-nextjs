import { useRouter } from "next/router";
import { Document } from "prismic-javascript/types/documents";
import { FormEvent, useState } from "react";
import Prismic from "prismic-javascript";
import PrismicDom from "prismic-dom";
import { client } from "@/lib/prismic";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch("");
  }

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map((searchResult) => (
          <li key={searchResult.id}>
            <Link href={`/catalog/products/${searchResult.uid}`}>
              <a>{PrismicDom.RichText.asText(searchResult.data.title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context
) => {
  const { q } = context.query;

  if (!q) {
    return { props: { searchResults: [] } };
  }

  const searchResults = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.fulltext("my.product.title", String(q)),
  ]);
  console.log(searchResults);

  return { props: { searchResults: searchResults.results } };
};
