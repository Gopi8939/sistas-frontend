import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DiscountBanner from "../DiscountBanner";
import Drawer from "../Mobile/Drawer";
import Footer from "./Footers/Footer";
import Header from "./Headers/Header";
import apiRequest from "../../../utils/apiRequest";
export default function Layout({ children, childrenClasses }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [settings, setSettings] = useState(null);
  const [subscribeData, setSubScribeDAta] = useState(null);
  const [contact, setContact] = useState(null);
  useEffect(() => {
    if (!subscribeData) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/`)
        .then((res) => {
          if (res.data) {
            setSubScribeDAta(res.data.subscriptionBanner);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [subscribeData]);

  useEffect(() => {
    if (websiteSetup) {
      setSettings(websiteSetup.payload.setting);
    }
  }, [websiteSetup]);
  useEffect(() => {
    if (!contact) {
      apiRequest
        .contactUs()
        .then((res) => {
          if (res.data) {
            setContact(res.data.contact);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const [drawer, setDrawer] = useState(false);
  // currency
  const [defaultCurrency, setDefaultCurrency] = useState(null);
  const [allCurrency, setAllCurrency] = useState(null);
  const [toggleCurrency, setToggleCurrency] = useState(false);
  const changeCurrencyHandler =(value)=>{
    localStorage.setItem("shopoDefaultCurrency", JSON.stringify(value));
    setTimeout(()=>{
      window.location.reload();
      setToggleCurrency(false);
    },1000)
  }
  useEffect(() => {
    if(!allCurrency){
      setAllCurrency(websiteSetup &&
          websiteSetup.payload &&
          websiteSetup.payload.currencies)
    }
  }, [allCurrency]);

  useEffect(() => {
    if(!defaultCurrency){
      const getCurrency = localStorage.getItem("shopoDefaultCurrency");
      if(getCurrency){
        setDefaultCurrency(JSON.parse(localStorage.getItem("shopoDefaultCurrency")))
      }else{
        setDefaultCurrency(null)
      }
    }
  }, [defaultCurrency]);
  return (
    <>
      <Drawer open={drawer} action={() => setDrawer(!drawer)} />
      <div className="w-full overflow-x-hidden">
        <Header
            topBarProps={{
              defaultCurrency,
              allCurrency,
              toggleCurrency,
              toggleHandler:setToggleCurrency,
              handler:changeCurrencyHandler
            }}
          contact={contact && contact}
          settings={settings}
          drawerAction={() => setDrawer(!drawer)}
        />
        <div
          className={`w-full min-h-screen  ${
            childrenClasses || "pt-[30px] pb-[60px]"
          }`}
        >
          {children && children}
        </div>
        {subscribeData && <DiscountBanner datas={subscribeData} />}

        <Footer settings={settings} />
      </div>
    </>
  );
}
