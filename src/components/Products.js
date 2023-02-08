import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { debounce } from "@mui/material";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // const dummyData = {
  //   name: "Tan Leatherette Weekender Duffle",
  //   category: "Fashion",
  //   cost: 150,
  //   rating: 4,
  //   image:
  //     "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  //   _id: "PmInA797xJhMIPti",
  // };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setData(res.data);
      setFilteredData(res.data);
      
    } catch (e) {
      setLoading(false);
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar("Something Went Wrong", { variant: "error" });
      }
    }
  };

  useEffect(() => {
    performAPICall();
    // setDataLoaded("loaded");
  }, []);

 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    try{
      const res = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setFilteredData(res.data);
    } catch(e){
        if(e.response){
          if(e.response.status === 404){
            setFilteredData([]);
          }
          else if(e.response.status === 500){

            setFilteredData(data);
            enqueueSnackbar(e.response.data.message, { variant: "error" });
          }
        }
    }
    // setLoading(true);
    // try {
    //   const res = await axios.get(
    //     `${config.endpoint}/products/search?value=${text}`
    //   );
    //   setLoading(false);
    //   console.log(res.data);
    //   setData(res.data);
   
    // } catch (e) {
    //   setLoading(false);
    //   setData([]);
    //   if (e.response) {
    //     enqueueSnackbar(e.response.data.message, { variant: "error" });
    //     return null;
    //   } else {
    //     enqueueSnackbar("Something Went Wrong", { variant: "error" });
    //   }

    // }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(async ()=>{
      await performSearch(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleSearch = (e) => {
    performSearch(e.target.value);
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange = {(e)=>{
            debounceSearch(e, debounceTimeout)
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange = {(e)=>{
          debounceSearch(e, debounceTimeout)
        }}
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>

        {isLoading ? (
          <div className="spinner-container">
            <div className="spin">
              <CircularProgress />
              <div>Loading Products...</div>
            </div>
          </div>
        ) : (
          <div className="product-container">
            <Grid container spacing={3}>
              {filteredData.length? (
                filteredData.map((ele) => (
                  <Grid item xs={6} md={3} key={ele._id}>
                    <ProductCard
                      product={ele}
                      handleAddToCart={() => console.log("Added to Card")}
                    />
                  </Grid>
                ))
              ) : (
                <div className="spinner-container">
                <div className="spin">
                  <SentimentDissatisfied />
                  <div>No products found</div>
                </div>
              </div>
              )}
            </Grid>
          </div>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
