import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CurrencyConvert from './CurrencyConvert';

function CheckProductIsExistsInFlashSale({
  id,
  price,
  sign = true,
  className,
}) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [flashSale, setFlashSale] = useState(null);
  const [calPrice, setCalPrice] = useState(price || 0);

  useEffect(() => {
    if (websiteSetup && websiteSetup.payload) {
      setFlashSale({
        flashSale: websiteSetup.payload.flashSale,
        flashSaleActive: websiteSetup.payload.flashSaleActive,
        flashSaleProducts: websiteSetup.payload.flashSaleProducts || [],
      });
    }
  }, [websiteSetup]);

  useEffect(() => {
    if (id && price && flashSale) {
      calcProductPrice(id, price);
    }
  }, [id, price, flashSale]); // Add dependencies to avoid infinite re-renders

  const calcProductPrice = (id, price) => {
    if (flashSale && flashSale.flashSaleActive && flashSale.flashSaleProducts) {
      const productInFlashSale = flashSale.flashSaleProducts.find(
        (item) => parseInt(item.product_id) === parseInt(id)
      );

      if (productInFlashSale && flashSale.flashSale?.offer) {
        const offer = parseFloat(flashSale.flashSale.offer);
        const discountPrice = (offer / 100) * price;
        const mainPrice = price - discountPrice;
        setCalPrice(mainPrice);
      } else {
        setCalPrice(price);
      }
    } else {
      setCalPrice(price);
    }
  };

  return <CurrencyConvert price={parseFloat(calPrice)} />;
}

export default CheckProductIsExistsInFlashSale;