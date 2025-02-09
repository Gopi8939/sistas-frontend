import React, { useEffect, useState } from 'react'
import Layout from '../../src/components/Partials/Layout';
import BreadcrumbCom from '../../src/components/BreadcrumbCom';
import ServeLangItem from '../../src/components/Helpers/ServeLangItem';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultBanner from "../../public/assets/images/saller-cover.png";
import ProductCardRowStyleTwo from '../../src/components/Helpers/Cards/ProductCardRowStyleTwo';
import DataIteration from '../../src/components/Helpers/DataIteration';
import ProductCardStyleOne from '../../src/components/Helpers/Cards/ProductCardStyleOne';
import OneColumnAdsTwo from '../../src/components/Home/ProductAds/OneColumnAdsTwo';
import LoaderStyleOne from '../../src/components/Helpers/Loaders/LoaderStyleOne';
import axios from 'axios';

const ViewStore = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [vendorDetails, setVendorDetails] = useState(null);
  const [storeName, setStoreName] = useState(null);
  console.log(response,router,"vendorDetails")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [cardViewStyle, setCardViewStyle] = useState("col");
  const [brands, setBrands] = useState(null);
  const [response, setResponse] = useState(null);
  const [variantsFilter, setVariantsFilter] = useState(null);
  const [categoriesFilter, setCategoriesFilter] = useState(null);
  const [resProducts, setProducts] = useState(null);
  const [nxtPage, setNxtPage] = useState(null);
  const products =
  resProducts &&
  resProducts.length > 0 &&
  resProducts.map((item) => {
    return {
      id: item.id,
      title: item.name,
      slug: item.slug,
      image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
      price: item.price,
      offer_price: item.offer_price,
      campaingn_product: null,
      review: parseInt(item.averageRating),
      variants: item.active_variants ? item.active_variants : [],
    };
  });
  const [selectedVarientFilterItem, setSelectedVarientFilterItem] = useState(
    []
  );
  const [selectedCategoryFilterItem, setSelectedCategoryFilterItem] = useState(
    []
  );
  const [selectedBrandsFilterItem, setSelectedBrandsFilterItem] = useState([]);
  const [volume, setVolume] = useState([0, 0]);

  const [filterToggle, setToggle] = useState(false);

  const nextPageHandler = async () => {
    setLoading(true);
    if (nxtPage) {
      await axios
        .get(`${nxtPage}`)
        .then((res) => {
          setLoading(false);
          if (res.data) {
            if (res.data.products.data.length > 0) {
              res.data.products.data.map((item) => {
                setProducts((prev) => [...prev, item]);
              });
              setNxtPage(res.data.products.next_page_url);
            }
          }

          // res.data && res.data.products.data.length > 0;
          // setNxtPage(response && response.products.next_page_url);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else if (nxtPage === "null") {
      setLoading(false);
      return false;
    } else {
      setLoading(false);
      return false;
    }
  };
  useEffect(() => {
    const getVendorDetails = async () => {
        try {
            setLoading(true);
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/vendor-details/${slug}`;            
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data,"olddddddddddddddd")

        //     const url2 = `${process.env.NEXT_PUBLIC_BASE_URL}api/sellers/${data.vendor_details.slug}`;            
        //       const response2 = await fetch(url);

        //       if (!response2.ok) {
        //           throw new Error(`HTTP error! Status: ${response2.status}`);
        //       }

        // const data2 = await response2.json();
        setVendorDetails(data);
        setStoreName(data.vendor_details.slug);
        } catch (error) {
            console.error('Error fetching vendor details:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // const getProducts = async ()=> {
    //   try {
    //     setLoading(true);
    //     const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/sellers/${slug}`;            
    //     const response = await fetch(url);

    //     if (!response.ok) {
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     setResponse(data);
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    getVendorDetails();
    // getProducts()
  }, [slug, storeName]); 

  useEffect(()=>{
    const getSellerDetails = async() => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/sellers/${storeName}`;   
            const response = await fetch(url);
          //   if (!response.ok) {
          //     throw new Error(`HTTP error! Status: ${response.status}`);
          // }

          const data2 = await response.json();
          console.log(data2,"vvvvvvvvvvvvvvvvvv")
          setResponse(data2);
    }
    getSellerDetails()
  },[storeName])

  const baseUrl = 'https://vendor.sistas.in/';

  const brandLogoUrl = vendorDetails?.vendor_details?.logo
  ? `${baseUrl}${vendorDetails?.vendor_details?.logo}`
  : `${baseUrl}${vendorDetails?.defaultProfilePic}`; 

  const bannerImageUrl = vendorDetails?.vendor_details?.banner_image
  ? `${baseUrl}${vendorDetails.vendor_details.banner_image}`
  : defaultBanner; 

  const isYouTubeWatchUrl = (url) => {
    // Regex to detect YouTube watch URLs
    return /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/.test(url);
};

const isYouTubeEmbedUrl = (url) => {
    // Regex to detect YouTube embedded URLs
    return /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/.test(url);
};

const getYouTubeEmbedUrl = (url) => {
    // Extract video ID from watch or short URL
    const watchMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    const shortMatch = url.match(/(?:https?:\/\/)?youtu\.be\/([^?&]+)/);
    
    if (watchMatch) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    if (shortMatch) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    // If it's already an embed URL, return as is
    const embedMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) {
        return url;
    }
    
    return null;
};
  
  const BrandStory = ({ media_url, description }) => {
    const [youtubeError, setYoutubeError] = useState(false);
    const isYouTube = isYouTubeWatchUrl(media_url) || isYouTubeEmbedUrl(media_url);
    const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(media_url) : null;
    if (!media_url) {
      // Render a box indicating no brand story media is available
      return (
        <div className="brand-story border border-gray-200 rounded-lg shadow-md flex items-center justify-center h-64 text-gray-500" style={{minHeight:"250px"}}>
          <p>No brand story media available</p>
        </div>
      );
    }
    return (
      <div className="brand-story border border-gray-200 rounded-lg shadow-md">
        {youtubeError ? (
          <div className="fallback-box flex items-center justify-center text-gray-500" style={{minHeight:"250px"}}>
            <p>Sorry! The URL is not working.</p>
          </div>
        ) : isYouTube ? (
          <iframe
            width="100%"
            height="315"
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={() => setYoutubeError(true)}
          ></iframe>
        ) : (
          <video
            src={media_url}
            controls
            loop
            className="w-full h-auto object-cover mb-2"
            // onError={() => setYoutubeError(true)}
          ></video>
        )}
        {/* <p className="text-gray-700">{description}</p>   */}
      </div>
    );
  };

  console.log(vendorDetails,"vendorrruu")
  

  const SocialMediaIcons = ({ link, icon, key }) => (
    <div className="social-media-icons flex space-x-4">
        <a key={key} href={link} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={icon} />
        </a>
    </div>
  );

  const ContactInfo = ({ email, phone, address }) => (
      <div className="contact-info flex flex-col items-start space-y-4 p-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact</h2>
      <div className="flex items-center space-x-2">
      <FontAwesomeIcon icon="fas fa-envelope text-gray-700"  style={{color:"red"}}/>
        <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon="fas fa-phone-alt text-gray-700" style={{color:"blue"}}/>
        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
      </div>
      <div className="flex items-center space-x-2">
      <FontAwesomeIcon icon="fas fa-map-marker-alt text-gray-700" style={{color:"red",fontSize:"1.3rem"}}/>
      <p className="text-gray-900">{address}</p>
    </div>
    </div>
  );
// https://t3.ftcdn.net/jpg/05/14/95/12/360_F_514951224_2dxMLbIw5qNRdPGD003chpbVcxWtcp7K.jpg
  return (
    <>
      <Layout childrenClasses="pt-0 pb-0">
      {vendorDetails?.vendor_details ?
      <div className="single-product-wrapper w-full" >
        <div className="product-view-main-wrapper bg-white w-full viewStoreDiv" >
          {/* <div className="breadcrumb-wrapper w-full">
            <div className="container-x mx-auto">
              <BreadcrumbCom
                paths={[
                  { name: ServeLangItem()?.home, path: "/" },
                  { name: "ViewStore", path: "/viewstore" },
                ]}
              />
            </div>
          </div>   */}
           <div className="banner-section relative w-full">
           {imageError ? (
                <img
                src={defaultBanner}
                alt="Banner"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '250px' }} // Adjust max height as needed
                onError={() => setImageError(true)}
              />
              ) : (
                <img
                  src={bannerImageUrl}
                  alt="Banner"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '250px' }} // Adjust max height as needed
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          <div className="logo-company-section flex items-center justify-between px-4 py-2"
          style={{borderBottom: "5px solid #d5dbdb"}}>
            <div className="logo-container flex items-center">
              <img
                src={brandLogoUrl} // Replace with actual logo image URL
                alt="Company Logo"
                className="w-20 h-auto"
              />
              <div>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">{vendorDetails?.vendor_details?.shop_name}</h1>
            <div className="social-media-icons flex space-x-4 ml-4">
            {vendorDetails?.vendor_details?.social_links.map((social, index) => (
                <SocialMediaIcons
                key={index}
                link={social.link}
                icon={social.icon}
              />
            ))}
            </div>
            </div>
            </div>
          </div>
          <div className="brand-stories-section p-4">
          {/* Heading for the brand stories section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Brand Story</h2>
          <div className="brandStoryDiv">
              {vendorDetails?.vendor_details?.stories?.length === 0 ? (
              <div className="no-stories border border-gray-200 rounded-lg shadow-md flex items-center justify-center h-64 text-gray-500" style={{minHeight:"250px"}}>
                <p>No brand stories available</p>
              </div>
            ) : (
              vendorDetails?.vendor_details?.stories.map((story, index) => (
                <BrandStory
                  key={index}
                  media_url={story.media_url}
                  description={story.description}
                />
              ))
           )}
          </div>
        </div>
        {/* <ContactInfo
            email={vendorDetails?.vendor_details?.email}
            phone={vendorDetails?.vendor_details?.phone}
            address={vendorDetails?.vendor_details?.address}
        /> */}
           <div className="w-full lg:flex lg:space-x-[30px] rtl:space-x-reverse">
           <div className="flex-1">
                {response && response?.products?.data.length > 0 ? (
                  <div className="w-full">
                    <div className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]">
                      <div>
                        <p className="font-400 text-[13px]">
                          <span className="text-qgray">
                            {" "}
                            {ServeLangItem()?.Showing}
                          </span>{" "}
                          1–
                          {response?.products.data.length}{" "}
                          {ServeLangItem()?.of} {response?.products.total}{" "}
                          {ServeLangItem()?.results}
                        </p>
                      </div>
                      <div className="flex space-x-3 items-center">
                        <span className="font-bold  text-qblack text-[13px]">
                          {ServeLangItem()?.View_by} :
                        </span>
                        <button
                          onClick={() => setCardViewStyle("col")}
                          type="button"
                          className={`hover:text-qgreen w-6 h-6 ${cardViewStyle === "col"
                            ? "text-qgreen"
                            : "text-qgray"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="fill-current"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M11 5H5v14h6V5zm2 0v14h6V5h-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCardViewStyle("row")}
                          type="button"
                          className={`hover:text-qgreen w-6 h-6 ${cardViewStyle === "row"
                            ? "text-qgreen"
                            : "text-qgray"
                            }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="fill-current"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M19 11V5H5v6h14zm0 2H5v6h14v-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => setToggle(!filterToggle)}
                        type="button"
                        className="w-10 lg:hidden h-10 rounded flex justify-center items-center border border-qyellow text-qyellow"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </button>
                    </div>
                    {products && cardViewStyle === "col" && (
                      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={0}
                          endLength={
                            products && products.length >= 6
                              ? 6
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {products && cardViewStyle === "row" && (
                      <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={0}
                          endLength={
                            products && products.length >= 6
                              ? 6
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardRowStyleTwo datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}

                    <div className="w-full relative text-qblack mb-[40px]">
                      {response && response.shopPageCenterBanner && (
                        <OneColumnAdsTwo
                          data={response.shopPageCenterBanner && parseInt(response.shopPageCenterBanner.status) === 1 ? response.shopPageCenterBanner : null}
                        />
                      )}
                    </div>
                    {products && cardViewStyle === "col" && (
                      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={6}
                          endLength={
                            products && products.length >= 14
                              ? 14
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardStyleOne datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {products && cardViewStyle === "row" && (
                      <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]">
                        <DataIteration
                          datas={products && products}
                          startLength={0}
                          endLength={
                            products && products.length >= 6
                              ? 6
                              : products && products.length
                          }
                        >
                          {({ datas }) => (
                            <div data-aos="fade-up" key={datas.id}>
                              <ProductCardRowStyleTwo datas={datas} />
                            </div>
                          )}
                        </DataIteration>
                      </div>
                    )}
                    {nxtPage && nxtPage !== "null" && (
                      <div className="flex justify-center">
                        <button
                          onClick={nextPageHandler}
                          type="button"
                          className="w-[180px] h-[54px] bg-qyellow rounded mt-10"
                        >
                          <div className="flex justify-center w-full h-full items-center group rounded relative transition-all duration-300 ease-in-out overflow-hidden cursor-pointer">
                            <div className="flex items-center transition-all duration-300 ease-in-out relative z-10  text-white hover:text-white">
                              <span className="text-sm font-600 tracking-wide leading-7 mr-2">
                                {ServeLangItem()?.Show_more}...
                              </span>
                              {loading && (
                                <span
                                  className="w-5 "
                                  style={{ transform: "scale(0.3)" }}
                                >
                                  <LoaderStyleOne />
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                transition: `transform 0.25s ease-in-out`,
                              }}
                              className="w-full h-full bg-black absolute top-0 left-0 right-0 bottom-0 transform scale-x-0 group-hover:scale-x-100 origin-[center_left] group-hover:origin-[center_right]"
                            ></div>
                          </div>
                        </button>
                      </div>
                    )}
                    {/* <div className="">
                      <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-5">Our Stories</h1>
                      <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="">
                          <video src="/assets/videos/video-1.mp4" type="video/mp4" className="w-full" controls></video>
                        </div>
                        <div className="">
                          <video src="/assets/videos/video-2.mp4" type="video/mp4" className="w-full" controls></video>
                        </div>
                        <div className="">
                          <video src="/assets/videos/video-3.mp4" type="video/mp4" className="w-full" controls></video>
                        </div>
                      </div>
                    </div> */}
                  </div>


                ) : (
                  <div className={"mt-5 flex justify-center"}>
                    <h1 className="text-2xl font-medium text-tblack">
                      Products not available
                    </h1>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div> :
      <div className="noVendorText" >
        <div className="centered-content">
        <p style={{fontSize:"20px"}}>There is no such vendor</p>
       </div>
      </div>
      }
    </Layout>


    </>
);
}




export const getServerSideProps = async (context) => {
  console.log(context,"context")
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/product?${
            context.query.category
                ? `category=${context.query.category}`
                : context.query.sub_category
                    ? `sub_category=${context.query.sub_category}`
                    : context.query.child_category
                        ? `child_category=${context.query.child_category}`
                        : context.query.highlight
                            ? `highlight=${context.query.highlight}`
                            : context.query.brand
                                ? `brand=${context.query.brand}`
                                : ""
        }`
    );
    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        data: false,
      },
    };
  }
};

export default ViewStore;