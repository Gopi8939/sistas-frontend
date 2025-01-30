import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import { fetchCart } from "../../store/Cart";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import ServeLangItem from "../Helpers/ServeLangItem";
import CurrencyConvert from "../Shared/CurrencyConvert";

export default function Cart({ className }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const [getCarts, setGetCarts] = useState(null);
  const [getAllPrice, setGetAllPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (getAllPrice && getAllPrice.length > 0) {
      const total = getAllPrice.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [getAllPrice]);

  useEffect(() => {
    if (cart) {
      setGetCarts(cart.cartProducts);
    }
  }, [cart]);

  const checkProductExistsInFlashSale = (id, price) => {
    if (websiteSetup && websiteSetup.payload.flashSale && websiteSetup.payload.flashSaleProducts) {
      const flashSaleOffer = websiteSetup.payload.flashSale.offer;
      const flashSaleIds = websiteSetup.payload.flashSaleProducts.find(
        (item) => parseInt(item.product_id) === parseInt(id)
      );
      if (flashSaleOffer && flashSaleIds) {
        const offer = parseInt(flashSaleOffer);
        const discountPrice = (offer / 100) * price;
        const mainPrice = price - discountPrice;
        return mainPrice;
      }
    }
    return price;
  };

  useEffect(() => {
    if (getCarts && getCarts.length > 0) {
      const prices = getCarts.map((item) => {
        const basePrice = item.product.offer_price || item.product.price;
        const variantPrices = item.variants?.map((variant) => 
          variant.variant_item ? parseFloat(variant.variant_item.price) : 0
        ) || [];
        const totalVariantPrice = variantPrices.reduce((sum, price) => sum + price, 0);
        const totalPrice = parseFloat(basePrice) + totalVariantPrice;
        return checkProductExistsInFlashSale(item.product_id, totalPrice);
      });
      setGetAllPrice(prices);
    } else {
      setGetAllPrice(null);
    }
  }, [getCarts]);

  const deleteItem = (id) => {
    if (auth()) {
      apiRequest
        .deleteCartItem({
          id: id,
          token: auth().access_token,
        })
        .then(() => {
          toast.warn(ServeLangItem()?.Remove_from_Cart, {
            autoClose: 1000,
          });
          dispatch(fetchCart());
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const price = (item) => {
    if (!item) return 0;

    const basePrice = item.product.offer_price || item.product.price;
    const variantPrices = item.variants?.map((variant) => 
      variant.variant_item ? parseFloat(variant.variant_item.price) : 0
    ) || [];
    const totalVariantPrice = variantPrices.reduce((sum, price) => sum + price, 0);
    return parseFloat(basePrice) + totalVariantPrice;
  };

  const { currency_icon } = settings();

  return (
    <div style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }} className={`cart-wrappwer w-[300px] bg-white border-t-[3px] ${className || ""}`}>
      <div className="w-full h-full">
        <div className="product-items h-[310px] overflow-y-scroll">
          <ul>
            {getCarts && getCarts.length > 0 ? (
              getCarts.map((item) => (
                <li key={item.id} className="w-full h-full flex justify-between">
                  <div className="flex space-x-[6px] justify-center items-center px-4 my-[20px]">
                    <div className="w-[65px] h-[65px] relative">
                      <Image
                        layout="fill"
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.product.thumb_image}`}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-center">
                      <p className="title mb-2 text-[13px] font-600 text-qblack leading-4 line-clamp-2 hover:text-blue-600">
                        {item.product.name}
                      </p>
                      <p className="price">
                        <span suppressHydrationWarning className="offer-price text-qred font-600 text-[15px] ml-2">
                          <CheckProductIsExistsInFlashSale id={item.product_id} price={price(item)} />
                        </span>
                      </p>
                    </div>
                  </div>
                  <span onClick={() => deleteItem(item.id)} className="mt-[20px] mr-[15px] inline-flex cursor-pointer">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="inline fill-current text-[#AAAAAA] hover:text-qred" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                    </svg>
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400 mt-10 text-center">{ServeLangItem()?.No_items_found}</p>
            )}
          </ul>
        </div>
        <div className="w-full px-4 mt-[20px] mb-[12px]">
          <div className="h-[1px] bg-[#F0F1F3]"></div>
        </div>
        <div className="product-actions px-4 mb-[30px]">
          <div className="total-equation flex justify-between items-center mb-[28px]">
            <span className="text-[15px] font-500 text-qblack">Subtotal</span>
            <span suppressHydrationWarning className="text-[15px] font-500 text-qred">
              <CurrencyConvert price={totalPrice || 0} />
            </span>
          </div>
          <div className="product-action-btn">
            <Link href="/cart">
              <div className="gray-btn w-full h-[50px] mb-[10px] cursor-pointer">
                <span>{ServeLangItem()?.View_Cart}</span>
              </div>
            </Link>
            <Link href="/checkout">
              <div className="w-full h-[50px] cursor-pointer">
                <div className="yellow-btn">
                  <span className="text-sm">{ServeLangItem()?.Checkout_Now}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full px-4 mt-[20px]">
          <div className="h-[1px] bg-[#F0F1F3]"></div>
        </div>
        <div className="flex justify-center py-[15px]">
          <p className="text-[13px] font-500 text-qgray">{ServeLangItem()?.Get_Return_within}</p>
        </div>
      </div>
    </div>
  );
}