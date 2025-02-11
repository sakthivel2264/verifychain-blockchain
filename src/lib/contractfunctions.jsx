import Web3 from "web3";
import Product from "@/contracts/Product.json"

let web3;
let contract;
let account;

/**
 * Initialize Web3 and the contract instance.
 */
export const initializeContract = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Product.networks[networkId];
      contract = new web3.eth.Contract(
        Product.abi,
        deployedNetwork && deployedNetwork.address
      );
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      localStorage.setItem('account', account);
      return { account, contract };
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw new Error("Failed to initialize contract");
    }
  } else {
    throw new Error("Ethereum provider not found");
  }
};


/**
 * @param {string}  manufacturerId
 * @param {string}  sellerName
 * @param {string}  sellerBrand 
 * @param {string}  sellerCode
 * @param {string}  sellerNum
 * @param {string}  sellerManager
 * @param {string}  sellerAddress
 */

export const AddSeller = async (data) => {
  if(!contract){
    console.log("Contract not initialized")
  }

  try{
    const { sellerName, sellerBrand, sellerNum, sellerManager, sellerAddress } = data;
    const response = await contract.methods.addSeller(account, sellerName, sellerBrand, sellerNum, sellerManager, sellerAddress).send({ from: account });
    if(response){
      alert("Added Seller Successfully!")
    }
    return response
  }catch(error){
    console.log("Issue in Add Seller",error)
  }
}

/**
 * @returns {Promise<Array>}
 */

export const fetchSeller = async () =>{
  if (!contract) throw new Error("Contract not initialized");
  try{
    const response = await contract.methods.viewSellers().call()
    return response
  }catch(error){
    console.log("Error in fetching Seller", error)
    throw error;
  }
}

/**
 * Adds a new product to the smart contract.
 * @param {string} manufacturerID - The manufacturer's ID.
 * @param {string} productName - The name of the product.
 * @param {string} productSN - The serial number of the product.
 * @param {string} productBrand - The brand of the product.
 * @param {number} productPrice - The price of the product.
 * @returns {Promise<void>}
 */
export const addProduct = async (
  productName,
  productSN,
  productBrand,
  productPrice
) => {
  if (!contract) throw new Error("Contract not initialized");

  try {
    const response = await contract.methods.addProduct(account, productName, productSN, productBrand, productPrice)
      .send({ from: account });
      if(response){
        alert("Product added Successfully!")
      }
  } catch (error) {
    console.error("Error in adding product", error);
    throw error;
  }
};

/**
 * Fetches all product items from the smart contract.
 * @returns {Promise<Array>} - An array of product items.
 */
export const fetchProducts = async () => {
  if (!contract) throw new Error("Contract not initialized");

  try {
    const response = await contract.methods.viewProductItems().call();
    return response;
  } catch (error) {
    console.error("Error in fetching products", error);
    throw error;
  }
};

/**
 * @param {string} productSN  - The serial number of the product.
 * @param {string} sellerCode - The Seller's code.
 * @returns {Promise<void>}
 */
export const manufacturerSelling = async (productSN, sellerCode) =>{
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const response = await contract.methods.manufacturerSellProduct(productSN, sellerCode).send({ from: account });
    alert(`Selled product to the ${sellerCode} successfully!`)
    return response;
  } catch (error) {
    console.error("Error in verifying product", error);
    throw error;
  }
}

/**
 * @returns {Promise<void>}
 */

export const querysellerproduct = async () =>{
  if (!contract) throw new Error("Contract not initialized");

  try{
    const response = await contract.methods.queryProductsList(account).call();
    return response;
  }catch (error) {
    console.error("Error while fetching sellerProduct", error);
    throw error;
  }
}

/**
 * @param {string} productSN
 * @param {string} consumerCode
 * @returns {Promise<void>}
 */

export const sellersellproduct = async ( productSN, consumerCode) =>{
  if (!contract) throw new Error("Contract not initialized");

  try{
    const response = await contract.methods.sellerSellProduct(productSN, consumerCode).send({ from: account });
    alert("Updated Successfully!")
    return response;
  }catch (error) {
    console.error("Error while fetching sellerProduct", error);
    throw error;
  }
}


/**
 * Verifies a product's authenticity.
 * @param {string} productSN - The serial number of the product.
 * @returns {Promise<boolean>} - Whether the product is verified.
 */
export const verifyProduct = async (productSN) => {
  if (!contract) throw new Error("Contract not initialized");

  try {
    const response = await contract.methods.verifyProduct(productSN, account).call();
    return response;
  } catch (error) {
    console.error("Error in verifying product", error);
    throw error;
  }
};


/**
 * @returns {Promise<Array>}
 */
export const purchaseHistory = async () =>{
  if (!contract) throw new Error("Contract not initialized");

  try {
    const response = await contract.methods.getPurchaseHistory(account).call();
    return response;
  } catch (error) {
    console.error("Error viewing purchase History", error);
    throw error;
  }
}