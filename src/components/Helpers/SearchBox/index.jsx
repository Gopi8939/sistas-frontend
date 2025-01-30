import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import ServeLangItem from "../ServeLangItem";

export default function SearchBox({ className }) {
  const router = useRouter();
  const categoryRef = useRef(null);
  const [toggleCat, setToggleCat] = useState(false);
  const [items, setItems] = useState([]);
  const [subToggleCat, setSubToggleCat] = useState(false);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [action, setAction] = useState("product");
  const [searchKey, setSearchKey] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");

  // Initialize search key from query params
  useEffect(() => {
    if (router.route === "/search") {
      setSearchKey(router.query.search || "");
    }
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setToggleCat(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle category selection
  const categoryHandler = (value) => {
    setSelectedCat(value);
    setSubCategories(value.active_sub_categories?.length ? value.active_sub_categories : null);
    setToggleCat(false);
  };

  // Handle sub-category selection
  const subCategoryHandler = (value) => {
    setSelectedSubCat(value);
    setSubToggleCat(false);
  };

  // Fetch categories from store
  useEffect(() => {
    if (websiteSetup?.payload?.productCategories) {
      setCategories(websiteSetup.payload.productCategories);
    }
  }, [websiteSetup]);

  // Perform search operation
  const searchHandler = async () => {
    const searchQuery = searchKey || selectedQuery;

    try {
      if (searchQuery) {
        await router.push({ pathname: "/search", query: { search: searchQuery } });
      } else if (!selectedQuery && selectedCat) {
        await router.push({ pathname: "/products", query: { category: selectedCat.slug } });
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  // Fetch search items dynamically based on action (product/service)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          action === "product"
            ? `${process.env.NEXT_PUBLIC_BASE_URL}api/search-product`
            : `${process.env.NEXT_PUBLIC_BASE_URL}api/search-service`;

        const response = await axios.get(url);
        const data = response.data.data?.data || response.data.services?.data || [];

        setItems(data.map((item) => ({ id: item.id, name: item.name || item.short_name })));
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchData();
  }, [action]);

  return (
    <div className={`w-full flex items-center gap-3 ${className || ""}`}>
      {/* Search Input */}
      <div className="flex-1">
        <ReactSearchAutocomplete
          items={items}
          placeholder="Search Products / Services"
          fuseOptions={{ keys: ["name"] }}
          resultStringKeyName="name"
          onSearch={(string) => setSearchKey(string)}
          onSelect={(item) => {
            setSelectedQuery(item.name);
            searchHandler();
          }}
          showIcon={false}
          styling={{
            height: "40px",
            border: "2px solid #c4b6b6",
            backgroundColor: "white",
            fontSize: "14px",
            zIndex: 100
          }}
        />
      </div>

      {/* Category Selector */}
      <div className="relative" ref={categoryRef}>
        <button
          onClick={() => setToggleCat(!toggleCat)}
          type="button"
          className="text-xs font-semibold flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md transition hover:bg-yellow-600"
        >
          {selectedCat ? selectedCat.name : "Category"}
        </button>

        {toggleCat && (
          <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
            <ul className="space-y-1">
              {categories?.map((item, i) => (
                <li
                  key={i}
                  onClick={() => categoryHandler(item)}
                  className="cursor-pointer px-3 py-1.5 rounded-md transition hover:bg-yellow-100 hover:text-yellow-600"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button onClick={searchHandler} className="px-4 py-2 bg-blue-500 text-white rounded transition hover:bg-blue-600">
        {ServeLangItem()?.Search || "Search"}
      </button>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const searchParam = context.query.search ? `search=${context.query.search}` : "";
  const categoryParam = context.query.category ? `&categories[]=${context.query.category}` : "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/product?${searchParam}${categoryParam}`);
  const data = await res.json();

  return { props: { data } };
};
