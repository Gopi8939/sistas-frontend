import ProductCardRowStyleOne from "./Cards/ProductCardRowStyleOne";
import DataIteration from "./DataIteration";

export default function SectionStyleTwo({ className, products }) {
  const rs = products
    .filter(item => item && item.id && item.name && item.thumb_image) // Filter invalid products
    .map(item => {
      return {
        id: item.id,
        title: item.name,
        slug: item.slug,
        image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
        price: item.price,
        offer_price: item.offer_price,
        campaingn_product: null,
        review: parseInt(item.averageRating) || 0, // Default review to 0 if invalid
        variants: item.active_variants,
      };
    });

  return (
    <div
      className={`section-content w-full grid sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 ${
        className || ""
      }`}
    >
      <DataIteration datas={rs} startLength={0} endLength={4}>
        {({ datas }) => (
          <div key={datas.id} className="item w-full">
            <ProductCardRowStyleOne datas={datas} />
          </div>
        )}
      </DataIteration>
    </div>
  );
}

