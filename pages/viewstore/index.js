import React, { useEffect, useState } from 'react'
import Layout from '../../src/components/Partials/Layout';
import BreadcrumbCom from '../../src/components/BreadcrumbCom';
import ServeLangItem from '../../src/components/Helpers/ServeLangItem';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewStore = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

const BrandStory = ({ media_url, description }) => (
    <div className="brand-story mb-6 p-4 border border-gray-200 rounded-lg shadow-md">
        <img
            src={media_url}
            alt="Brand Story"
            className="w-full h-auto object-cover mb-2" />
        <p className="text-gray-700">{description}</p>
    </div>
  );

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
      <div className="single-product-wrapper w-full" style={{ backgroundColor: "black" }}>
        <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
          <div className="breadcrumb-wrapper w-full">
            <div className="container-x mx-auto">
              <BreadcrumbCom
                paths={[
                  { name: ServeLangItem()?.home, path: "/" },
                  { name: "ViewStore", path: "/viewstore" },
                ]}
              />
            </div>
          </div>
          <div className="logo-company-section flex items-center justify-between px-4 py-6">
            <div className="logo-container flex items-center">
              <img
                src={vendorDetails?.vendor_details?.logo} // Replace with actual logo image URL
                alt="Company Logo"
                className="w-24 h-auto"
                style={{borderRadius:"50%"}}
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
          <div className="banner-section relative w-full">
            <img
              src={vendorDetails?.vendor_details?.banner_image}
              alt="Banner"
              className="w-full h-auto object-cover"
              style={{ maxHeight: '400px' }} // Adjust max height as needed
            />
          </div>
          <div className="brand-stories-section p-4">
          {/* Heading for the brand stories section */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Brand Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorDetails?.vendor_details?.stories.map((story, index) => (
              <BrandStory
                key={index}
                media_url={story.media_url}
                description={story.description}
              />
            ))}
          </div>
        </div>
        <ContactInfo
            email={vendorDetails?.vendor_details?.email}
            phone={vendorDetails?.vendor_details?.phone}
            address={vendorDetails?.vendor_details?.address}
        />
        </div>
      </div>
    </Layout>


    </>
);
}

export default ViewStore
