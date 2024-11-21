import { useEffect, useState } from "react";
import settings from "../../../utils/settings";
import SectionStyleFour from "../Helpers/SectionStyleFour";
import SectionStyleOne from "../Helpers/SectionStyleOne";
import SectionStyleThree from "../Helpers/SectionStyleThree";
import SectionStyleTwo from "../Helpers/SectionStyleTwo";
import ViewMoreTitle from "../Helpers/ViewMoreTitle";
import Layout from "../Partials/Layout";
import Ads from "./Ads";
import Banner from "./Banner";
import BestSellers from "./BestSellers";
import BrandSection from "./BrandSection";
import CampaignCountDown from "./CampaignCountDown";
// import ProductsAds from "./ProductsAds";
import TwoColumnAds from "./ProductAds/TwoColumnAds";
import OneColumnAdsOne from "./ProductAds/OneColumnAdsOne";
import OneColumnAdsTwo from "./ProductAds/OneColumnAdsTwo";
import CategorySection from "./CategorySection";

export default function Home({ homepageData }) {
  const getsectionTitles = homepageData.section_title;
  const [sectionTitles, setSectionTitles] = useState(null);
  useEffect(() => {
    if (!sectionTitles) {
      let tem =
        getsectionTitles &&
        getsectionTitles.map((item, i) => {
          return {
            [item.key]: item.custom ? item.custom : item.default,
          };
        });
      setSectionTitles(Object.assign.apply(Object, tem));
    }
  }, [sectionTitles]);

  const [homepage] = useState(homepageData);
  const { enable_multivendor } = settings();
  const [isMultivendor, setIsMultivendor] = useState(false);
  useEffect(() => {
    if (!isMultivendor) {
      setIsMultivendor(enable_multivendor && parseInt(enable_multivendor));
    }
  }, [isMultivendor]);
  return (
    <>
      <Layout childrenClasses="pt-[30px] pb-[60px]">
        <Ads />
        {homepage && (
          <div className="w-full text-white sm:mb-[160px] mb-[0px]">
            <div className="container-x mx-auto">
              <OneColumnAdsTwo data={homepage.singleBannerTwo && parseInt(homepage.singleBannerTwo.status) === 1 ? homepage.singleBannerTwo : null} />
            </div>
          </div>
        )}
        {/* {homepage && homepage.sliders.length > 0 && (
          <Banner
            images={homepage.sliders}
            // services={homepage.services}
            sidebarImgOne={homepage.sliderBannerOne && parseInt(homepage.sliderBannerOne.status) === 1 ? homepage.sliderBannerOne : null}
            sidebarImgTwo={homepage.sliderBannerTwo && parseInt(homepage.sliderBannerTwo.status) === 1 ? homepage.sliderBannerTwo : null}
            className="banner-wrapper md:mb-[60px] mb-[30px]"
          />
        )} */}
          {homepage && (
          <SectionStyleThree
            products={
              homepage.newArrivalProducts.length > 0
                ? homepage.newArrivalProducts.slice(
                  0,
                  homepage.newArrivalProducts.length > 16
                    ? 16
                    : homepage.newArrivalProducts.length
                )
                : []
            }
            sectionTitle={sectionTitles && sectionTitles.New_Arrivals}
            seeMoreUrl={`/products?highlight=new_arrival`}
            className="new-products md:mb-[60px] mb-[30px]"
          />
        )}

        {homepage && (
          <SectionStyleFour
            products={
              homepage.bestProducts.length > 0 ? homepage.bestProducts : []
            }
            sectionTitle={sectionTitles && sectionTitles.Best_Products}
            seeMoreUrl={`/products?highlight=best_product`}
            className="category-products md:mb-[60px] mb-[30px]"
          />
        )}
        {/* {homepage && (
          <CategorySection
            categories={homepage.homepage_categories}
            sectionTitle={sectionTitles && sectionTitles.Trending_Category}
          />
        )} */}
        {homepage && (
          <SectionStyleOne
            products={homepage.popularCategoryProducts}
            categories={homepage.popularCategories}
            categoryBackground={
              process.env.NEXT_PUBLIC_BASE_URL +
              homepage.popularCategorySidebarBanner
            }
            categoryTitle={sectionTitles && sectionTitles.Popular_Category}
            sectionTitle={sectionTitles && sectionTitles.Popular_Category}
            seeMoreUrl={`/products?highlight=popular_category`}
            className="category-products md:mb-[60px] mb-[30px]"
          />
        )}
        {homepage && (
          <BrandSection
            brands={homepage.brands.length > 0 ? homepage.brands : []}
            sectionTitle={sectionTitles && sectionTitles.Shop_by_Brand}
            className="brand-section-wrapper md:mb-[60px] mb-[30px]"
          />
        )}

        {homepage && (
          <CampaignCountDown
            className="md:mb-[60px] mb-[30px]"
            flashSaleData={homepage.flashSale}
            downloadData={homepage.flashSaleSidebarBanner}
            lastDate={homepage.flashSale.end_time}
          />
        )}
        {homepage && (
          <ViewMoreTitle
            className="top-selling-product md:mb-[60px] mb-[30px]"
            seeMoreUrl={`/products?highlight=top_product`}
            categoryTitle={sectionTitles && sectionTitles.Top_Rated_Products}
          >
            <SectionStyleTwo
              products={
                homepage.topRatedProducts.length && homepage.topRatedProducts.length > 0
                  ? homepage.topRatedProducts
                  : []
              }
            />
          </ViewMoreTitle>
        )}

        {homepage && (
          <ViewMoreTitle
            className="top-selling-product md:mb-[60px] mb-[30px]"
            seeMoreUrl={`/products?highlight=top_product`}
            // categoryTitle={sectionTitles && sectionTitles.Top_Rated_Products}
            categoryTitle="Top Rated Services"
          >
            <SectionStyleTwo
              products={
                homepage.topRatedProducts.length && homepage.topRatedProducts.length > 0
                  ? homepage.topRatedProducts
                  : []
              }
            />
          </ViewMoreTitle>
        )}

        {homepage && isMultivendor === 1 && (
          <ViewMoreTitle
            className="best-sallers-section md:mb-[60px] mb-[30px]"
            seeMoreUrl="/sellers"
            // categoryTitle={sectionTitles && sectionTitles.Best_Seller}
            categoryTitle="Best Service Providers"
          >
            <BestSellers
              sallers={homepage.sellers.length > 0 ? homepage.sellers : []}
            />
          </ViewMoreTitle>
        )}

        {homepage && (
          <TwoColumnAds
            bannerOne={homepage.twoColumnBannerOne && parseInt(homepage.twoColumnBannerOne.status) === 1 ? homepage.twoColumnBannerOne : null}
            bannerTwo={homepage.twoColumnBannerTwo && parseInt(homepage.twoColumnBannerTwo.status) === 1 ? homepage.twoColumnBannerTwo : null}
          />
        )}
        {/* {homepage && (
          <SectionStyleOne
            categories={
              homepage.featuredCategories.length > 0
                ? homepage.featuredCategories
                : []
            }
            // categoryBackground={
            //   process.env.NEXT_PUBLIC_BASE_URL +
            //   homepage.featuredCategorySidebarBanner
            // }
            // categoryTitle={sectionTitles && sectionTitles.Featured_Products}
            products={
              homepage.featuredCategoryProducts.length > 0
                ? homepage.featuredCategoryProducts
                : []
            }
            sectionTitle= "Sistas Stories"
            // seeMoreUrl={`/products?highlight=featured_product`}
            className="category-products md:mb-[60px] mb-[30px]"
          />
        )} */}
        {/* <div className="container-x mx-auto">
          {homepage && (
            <div>
              <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-5">Sistas Stories</h1>
              <div className="grid grid-cols-4 gap-4 mb-10">
                <div className="">
                  <video src="/assets/videos/video-1.mp4" type="video/mp4" className="w-full" controls></video>
                </div>
                <div className="">
                  <video src="/assets/videos/video-2.mp4" type="video/mp4" className="w-full" controls></video>
                </div>
                <div className="">
                  <video src="/assets/videos/video-3.mp4" type="video/mp4" className="w-full" controls></video>
                </div>
                <div className="">
                  <video src="/assets/videos/video-4.mp4" type="video/mp4" className="w-full" controls></video>
                </div>
              </div>
            </div>
          )}
        </div> */}


        {homepage && (
          <SectionStyleOne
            categories={
              homepage.featuredCategories.length > 0
                ? homepage.featuredCategories
                : []
            }
            categoryBackground={
              process.env.NEXT_PUBLIC_BASE_URL +
              homepage.featuredCategorySidebarBanner
            }
            categoryTitle={sectionTitles && sectionTitles.Featured_Products}
            products={
              homepage.featuredCategoryProducts.length > 0
                ? homepage.featuredCategoryProducts
                : []
            }
            sectionTitle={sectionTitles && sectionTitles.Featured_Products}
            seeMoreUrl={`/products?highlight=featured_product`}
            className="category-products md:mb-[60px] mb-[30px]"
          />
        )}
        {homepage && (
          <SectionStyleOne
            categories={
              homepage.featuredCategories.length > 0
                ? homepage.featuredCategories
                : []
            }
            categoryBackground={
              process.env.NEXT_PUBLIC_BASE_URL +
              homepage.featuredCategorySidebarBanner
            }
            // categoryTitle={sectionTitles && sectionTitles.Featured_Products}
            categoryTitle="Featured Services"
            products={
              homepage.featuredCategoryProducts.length > 0
                ? homepage.featuredCategoryProducts
                : []
            }
            // sectionTitle={sectionTitles && sectionTitles.Featured_Products}
            sectionTitle="Featured Services"
            seeMoreUrl={`/products?highlight=featured_product`}
            className="category-products md:mb-[60px] mb-[30px]"
          />
        )}
        {homepage && <OneColumnAdsOne data={homepage.singleBannerOne && parseInt(homepage.singleBannerOne.status) === 1 ? homepage.singleBannerOne : null} />}
         {homepage && homepage.sliders.length > 0 && (
          <Banner
            services={homepage.services}
            className="banner-wrapper md:mb-[60px] mb-[30px]"
          />
        )}
      </Layout>
    </>
  );
}
