import { CatalogSearchParams } from "@/types/product";
import { parseSearchParams, filterProducts, paginateProducts } from "@/lib/catalog-utils";
import products from "@/../data/products.json";
import CatalogClient from "./CatalogClient";

interface PageProps {
  searchParams: Promise<CatalogSearchParams>;
}

export default async function ColeccionesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseSearchParams(params);
  const filtered = filterProducts(products, filters);
  const { items, totalPages, total } = paginateProducts(
    filtered,
    filters.page,
    filters.perPage
  );

  return (
    <CatalogClient
      products={items}
      totalProducts={total}
      totalPages={totalPages}
      initialFilters={filters}
    />
  );
}
