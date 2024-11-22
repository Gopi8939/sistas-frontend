// import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
// import axios from "axios";
import { useRouter } from "next/router";
import ServeLangItem from "../ServeLangItem";
import LoginContext from "../../Contexts/LoginContext";
import auth from "../../../../utils/auth";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";


export default function SearchBox({ className },response) {
  const router = useRouter();
  const [toggleCat, setToggleCat] = useState(false);
  const [items, setItems] = useState([]);
  const [subToggleCat, setSubToggleCat] = useState(false);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategoris] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [action, setAction] = useState("product");
  const [searchKey, setSearchkey] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  console.log(selectedCat,"searchKey")
  const loginPopupBoard = useContext(LoginContext);
  // useEffect(() => {
  //   if (router && router.route && router.route === "/search") {
  //     setSearchkey(router.query ? router.query.search : "");
  //   }
  //   return () => {
  //     setSearchkey("");
  //   };
  // }, [router]);
  
  const categoryHandler = (value) => {
    setSelectedCat(value);
    setSubCategoris(
      value.active_sub_categories && value.active_sub_categories.length > 0
        ? value.active_sub_categories
        : null
    );
    setToggleCat(!toggleCat);
  };
  const subCategoryHandler = (value) => {
    setSelectedSubCat(value);

    setSubToggleCat(!subToggleCat);
  };
  useEffect(() => {
    if (websiteSetup) {
      setCategories(
        websiteSetup.payload && websiteSetup.payload.productCategories
      );
    }
  }, [websiteSetup]);

  const searchHandler = async () => {
    if (auth()) {
      if (searchKey || selectedQuery) {
        const searchQuery = searchKey || selectedQuery;
        console.log(searchKey,selectedQuery,"selectedQuery")
        
        try {
          // Force a new navigation regardless of current path
          await router.push({
            pathname: '/search',
            query: { search: searchQuery },
          });
  
          // If you need to fetch new data
          if (typeof window !== 'undefined') {
            // Trigger any necessary data fetching
            // window.location.href = `/search?search=${searchQuery}`;
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    } else if (selectedQuery === "" && selectedCat) {
      try {
        // Force a new navigation for category
        await router.push({
          pathname: '/products',
          query: { category: selectedCat.slug },
        });
  
        // If you need to fetch new data
        if (typeof window !== 'undefined') {
          window.location.href = `/products?category=${selectedCat}`;
        }
      } catch (error) {
        console.error('Category navigation error:', error);
      }
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };

  // Optional: Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchHandler();
    }
  };
  useEffect(()=>{
    let fetch = async ()=>{
      try {
        let arr=[]
        // if(action === "product"){
          let res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/search-product`)
          console.log(res.data.data.data,"ddyyvv")
          res.data.data.data.map((i)=>{
            arr.push({id:i.id,name:i.name})
          })
        // }
        // else{
        //   let res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/search-service`)
        //   res.data.services.data.map((i)=>{
        //     arr.push({id:i.id,name:i.short_name})
        //   })
        // }
        setItems(arr)
      } catch (error) {
        console.log(error.message);
      }
    }
    fetch()
  },[action])



  const handleOnSearch = (string, results) => {
    console.log(string, results,"selectedQuery");
  };

  const handleOnHover = (result) => {
    setSearchkey(result.name);
  };

  const handleOnSelect = (item) => {
    setSelectedQuery(item.name);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    console.log("Cleared");
  };

  return (
    <>
      <div
        className={`w-full h-full flex items-center  border border-qgray-border bg-white  ${
          className || ""
        }`}
      >
        <div className="flex-1 bg-red-500 h-full">
          <div className="h-full">
            {/* <input
              value={searchKey}
              onKeyDown={(e) => e.key === "Enter" && searchHandler()}
              onChange={(e) => setSearchkey(e.target.value)}
              type="text"
              className="search-input"
              placeholder= "Search Product or Services"
            /> */}
            {/* <Select options={options} placeholder="Search" /> */}
            <ReactSearchAutocomplete
              items={items}
              placeholder="Search Products"
              // fuseOptions={{ keys: ["title", "description"] }} // Search on both fields
              // resultStringKeyName="title" // String to display in the results
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              onClear={handleOnClear}
              showIcon={false}
              styling={{
                height: "40px",
                border: "2px solid #c4b6b6",
                backgroundColor: "white",
                boxShadow: "none",
                borderRadius:"0px",
                // hoverBackgroundColor: "lightgreen",
                color: "black",
                fontSize: "14px",
                iconColor: "black",
                lineColor: "grey",
                placeholderColor: "grey",
                clearIconMargin: "3px 8px 0 0",
                zIndex: 39,
              }}
            />
            {/* <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            styling={{ zIndex: 4 }} // To display it on top of the search box below
            autoFocus
          /> */}
          </div>
        </div>
        {/* <div className="w-[1px] h-[22px] bg-qgray-border"></div>
        <div className="flex-1 flex items-center px-4 relative">
          <button
            onClick={() => setToggleCat(!toggleCat)}
            type="button"
            className="w-full text-xs font-500 text-qgray flex justify-between items-center capitalize"
          >
            <span className="line-clamp-1">
              {selectedCat ? selectedCat.name : ServeLangItem()?.category}
            </span>
            <span>
              <svg
                width="10"
                height="5"
                viewBox="0 0 10 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="9.18359"
                  y="0.90918"
                  width="5.78538"
                  height="1.28564"
                  transform="rotate(135 9.18359 0.90918)"
                  fill="#8E8E8E"
                />
                <rect
                  x="5.08984"
                  y="5"
                  width="5.78538"
                  height="1.28564"
                  transform="rotate(-135 5.08984 5)"
                  fill="#8E8E8E"
                />
              </svg>
            </span>
          </button>
          {toggleCat && (
            <>
              <div
                className="w-full h-full fixed left-0 top-0 z-50"
                onClick={() => setToggleCat(!toggleCat)}
              ></div>
              <div
                className="w-[227px] h-auto absolute bg-white left-0 top-[29px] z-50 p-5"
                style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
              >
                <ul className="flex flex-col space-y-2">
                  {categories &&
                    categories.map((item, i) => (
                      <li onClick={() => categoryHandler(item)} key={i}>
                        <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow cursor-pointer">
                          {item.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
        </div> */}
        {/*<div className="w-[1px] h-[22px] bg-qgray-border"></div>*/}
        {/*<div className="w-[160px] flex items-center px-4 relative">*/}
        {/*  <button*/}
        {/*    onClick={() => setSubToggleCat(!subToggleCat)}*/}
        {/*    type="button"*/}
        {/*    className="w-full text-xs font-500 text-qgray flex justify-between items-center capitalize"*/}
        {/*  >*/}
        {/*    <span className="line-clamp-1">*/}
        {/*      {selectedSubCat ? selectedSubCat.name : "Sub Categories"}*/}
        {/*    </span>*/}
        {/*    <span>*/}
        {/*      <svg*/}
        {/*        width="10"*/}
        {/*        height="5"*/}
        {/*        viewBox="0 0 10 5"*/}
        {/*        fill="none"*/}
        {/*        xmlns="http://www.w3.org/2000/svg"*/}
        {/*      >*/}
        {/*        <rect*/}
        {/*          x="9.18359"*/}
        {/*          y="0.90918"*/}
        {/*          width="5.78538"*/}
        {/*          height="1.28564"*/}
        {/*          transform="rotate(135 9.18359 0.90918)"*/}
        {/*          fill="#8E8E8E"*/}
        {/*        />*/}
        {/*        <rect*/}
        {/*          x="5.08984"*/}
        {/*          y="5"*/}
        {/*          width="5.78538"*/}
        {/*          height="1.28564"*/}
        {/*          transform="rotate(-135 5.08984 5)"*/}
        {/*          fill="#8E8E8E"*/}
        {/*        />*/}
        {/*      </svg>*/}
        {/*    </span>*/}
        {/*  </button>*/}
        {/*  {subToggleCat && (*/}
        {/*    <>*/}
        {/*      <div*/}
        {/*        className="w-full h-full fixed left-0 top-0 z-50"*/}
        {/*        onClick={() => setSubToggleCat(!subToggleCat)}*/}
        {/*      ></div>*/}
        {/*      <div*/}
        {/*        className="w-[227px] h-auto absolute bg-white left-0 top-[29px] z-50 p-5"*/}
        {/*        style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}*/}
        {/*      >*/}
        {/*        <ul className="flex flex-col space-y-2">*/}
        {/*          {subCategories &&*/}
        {/*            subCategories.map((item, i) => (*/}
        {/*              <li onClick={() => subCategoryHandler(item)} key={i}>*/}
        {/*                <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow cursor-pointer">*/}
        {/*                  {item.name}*/}
        {/*                </span>*/}
        {/*              </li>*/}
        {/*            ))}*/}
        {/*        </ul>*/}
        {/*      </div>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</div>*/}
        {/* <select id="selectSearch" onChange={(e)=>setAction(e.target.value)} style={{height:"40px",outline:"none",marginLeft:"5px",marginRight:"5px"}} >
          <option style={{height:"2033px",padding:"5px 4px",marginLeft: "1%",marginRight: "1%"}} value="product" >Product</option>
          <option style={{height:"2033px",padding:"5px 4px"}} value="service" >Service</option>
        </select> */}
        <button
          onClick={searchHandler}
          className="search-btn w-[93px] h-full text-sm font-600"
          type="button"
        >
          {ServeLangItem()?.Search}
        </button>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product?${
      context.query.search
        ? `search=${context.query.search}`
        : context.query.category && context.query.search
        ? `search=${context.query.search}&categories[]=${context.query.category}`
        : `search=${context.query.search}`
    }`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
};