import React, { useEffect, useState } from 'react'
import Layout from '../../src/components/Partials/Layout';
import BreadcrumbCom from '../../src/components/BreadcrumbCom';
import ServeLangItem from '../../src/components/Helpers/ServeLangItem';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultBanner from "../../public/assets/images/saller-cover.png";

const ViewStore = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

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
            setVendorDetails(data);
        } catch (error) {
            console.error('Error fetching vendor details:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    getVendorDetails();
  }, [slug]); 

  console.log(vendorDetails?.vendor_details,"vendorDetails")
  const baseUrl = 'https://vendor.sistas.in/';

  const brandLogoUrl = vendorDetails?.vendor_details?.logo
  ? `${baseUrl}${vendorDetails?.vendor_details?.logo}`
  : `${baseUrl}${vendorDetails?.defaultProfilePic}`; 

  const bannerImageUrl = vendorDetails?.vendor_details?.banner_image
  ? `${baseUrl}${vendorDetails.vendor_details.banner_image}`
  : defaultBanner; 

  const isYouTubeUrl = (url) => {
    // Simple regex to detect YouTube URLs
    return /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=/.test(url);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };
  
  const BrandStory = ({ media_url, description }) => {
    const [youtubeError, setYoutubeError] = useState(false);
    const isYouTube = isYouTubeUrl(media_url);
    const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(media_url) : null;
    if (!media_url) {
      // Render a box indicating no brand story media is available
      return (
        <div className="brand-story border border-gray-200 rounded-lg shadow-md flex items-center justify-center h-64 text-gray-500">
          <p>No brand story media available</p>
        </div>
      );
    }
    return (
      <div className="brand-story border border-gray-200 rounded-lg shadow-md">
        {youtubeError ? (
          <div className="fallback-box flex items-center justify-center text-gray-500">
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
            onError={() => setYoutubeError(true)}
          ></video>
        )}
        <p className="text-gray-700">{description}</p>
      </div>
    );
  };
  

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
                <div className="fallback-box flex items-center justify-center h-full text-gray-500" 
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  height: "250px",
                  backgroundColor:"#f9f9f9",
                  border:"1px solid #ddd"
                }}>
                  <p>Sorry! something went wrong on showing Banner Image</p>
                </div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Brand Stories</h2>
          <div className="brandStoryDiv">
              {vendorDetails?.vendor_details?.stories?.length === 0 ? (
              <div className="no-stories border border-gray-200 rounded-lg shadow-md flex items-center justify-center h-64 text-gray-500">
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
        <ContactInfo
            email={vendorDetails?.vendor_details?.email}
            phone={vendorDetails?.vendor_details?.phone}
            address={vendorDetails?.vendor_details?.address}
        />
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

export default ViewStore
