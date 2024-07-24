function CurrencyConvert({price}) {
    if(price){
        const priceTypeConst = parseFloat(price).toFixed(2);
        if(typeof window !== 'undefined'){
            if(localStorage.getItem("shopoDefaultCurrency")){
                const getDefaultCurrency=JSON.parse(localStorage.getItem("shopoDefaultCurrency"));
                const priceConverted = priceTypeConst * parseFloat(getDefaultCurrency.currency_rate).toFixed(2);
                if(getDefaultCurrency.currency_position==='left'){
                    return `${priceConverted.toFixed(2)}${getDefaultCurrency.currency_icon}`;
                }else{
                return `${getDefaultCurrency.currency_icon}${priceConverted.toFixed(2)}`;
                }
            }
            return priceTypeConst
        }else{
            return priceTypeConst;
        }
    }else{
        return '';
    }
}

export default CurrencyConvert;