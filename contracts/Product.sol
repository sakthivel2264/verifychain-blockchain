// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Product is AccessControl {

    bytes32 public constant MANUFACTURER = keccak256("MANUFACTURER");
    uint256 private sellerCount;
    uint256 private productCount;

    address public manufacturer = 0x55004BeC89175244026f7735Ff07924C41eE84F8;

    struct Seller {
        uint256 sellerId;
        string sellerName;
        string sellerBrand;
        uint256 sellerNum;
        string sellerManager;
        string sellerAddress;
    }
    mapping(uint256 => Seller) private sellers;

    struct ProductItem {
        uint256 productId;
        string productSN;
        string productName;
        string productBrand;
        uint256 productPrice;
        string productStatus;
    }

    struct ProductInfo {
        string productSN;
        string sellerAddress;
        string manufacturerCode;
    }

    mapping(uint256 => ProductItem) private productItems;
    mapping(string => uint256) private productMap;
    mapping(string => string) private productsManufactured;
    mapping(string => string) private productsForSale;
    mapping(string => string) private productsSold;
    mapping(string => string[]) private productsWithSeller;
    mapping(string => string[]) private productsWithConsumer;
    mapping(string => string[]) private sellersWithManufacturer;

    constructor() {
        _setupRole(MANUFACTURER, manufacturer);
    }

    // SELLER SECTION

    function addSeller(
        string memory _manufacturerId,
        string memory _sellerName,
        string memory _sellerBrand,
        uint256 _sellerNum,
        string memory _sellerManager,
        string memory _sellerAddress
    ) public onlyRole(MANUFACTURER) {
        sellers[sellerCount] = Seller(
            sellerCount, _sellerName, _sellerBrand, _sellerNum, _sellerManager, _sellerAddress
        );
        sellerCount++;
        sellersWithManufacturer[_manufacturerId].push(_sellerAddress);
    }

    function viewSellers() public view returns (
        Seller[] memory
    ) {
        Seller[] memory allSellers = new Seller[](sellerCount);
        for (uint256 i = 0; i < sellerCount; i++) {
            allSellers[i] = sellers[i];
        }
        return allSellers;
    }

    // PRODUCT SECTION

    function addProduct(
        string memory _manufacturerID,
        string memory _productName,
        string memory _productSN,
        string memory _productBrand,
        uint256 _productPrice
    ) public onlyRole(MANUFACTURER) {
        productItems[productCount] = ProductItem(
            productCount, _productSN, _productName, _productBrand, _productPrice, "Available"
        );
        productMap[_productSN] = productCount;
        productCount++;
        productsManufactured[_productSN] = _manufacturerID;
    }

    function viewProductItems() public view returns (
        ProductItem[] memory
    ) {
        ProductItem[] memory allProducts = new ProductItem[](productCount);
        for (uint256 i = 0; i < productCount; i++) {
            allProducts[i] = productItems[i];
        }
        return allProducts;
    }

    //SELL Product

    function manufacturerSellProduct(string memory _productSN, string memory _sellerAddress) public{
        productsWithSeller[_sellerAddress].push(_productSN);
        productsForSale[_productSN] = _sellerAddress;

    }

    function sellerSellProduct(string memory _productSN, string memory _consumerCode) public {   
        uint256 j = 0;
        bool found = false;

        if(productCount > 0) {
            for(uint256 i = 0; i < productCount; i++) {
                if(keccak256(abi.encodePacked(productItems[i].productSN)) == keccak256(abi.encodePacked(_productSN))) {
                    j = i;
                    found = true;
                    break;
                }
            }
        }

        require(found, "Product not found");
        
        bool isAvailable = keccak256(abi.encodePacked(productItems[j].productStatus)) == keccak256(abi.encodePacked("Available"));
        require(isAvailable, "Product is not available for sale");

        productItems[j].productStatus = "NA";
        productsWithConsumer[_consumerCode].push(_productSN);
        productsSold[_productSN] = _consumerCode;
    }

    function queryProductsList(string memory _sellerAddress) 
    public view returns (ProductItem[] memory) 
    {
        require(bytes(_sellerAddress).length > 0, "Seller code cannot be empty");

        string[] memory productSNs = productsWithSeller[_sellerAddress];
        uint256 matchCount = 0;

        // First pass: count matching products
        for (uint256 i = 0; i < productSNs.length; i++) {
            if (bytes(productSNs[i]).length > 0) {
                matchCount++;
            }
        }

        // Initialize array with the correct size
        ProductItem[] memory products = new ProductItem[](matchCount);

        // Second pass: fill array
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < productSNs.length; i++) {
            string memory currentSN = productSNs[i];
            if (bytes(currentSN).length > 0) {
                uint256 productId = productMap[currentSN];
                products[currentIndex] = productItems[productId];
                currentIndex++;
            }
        }

        return products;
    }


    function getPurchaseHistory(string memory _consumerCode) public view returns (ProductInfo[] memory) {
        string[] memory productSNs = productsWithConsumer[_consumerCode];
        ProductInfo[] memory productInfos = new ProductInfo[](productSNs.length);

        for (uint i = 0; i < productSNs.length; i++) {
            productInfos[i] = ProductInfo({
                productSN: productSNs[i],
                sellerAddress: productsForSale[productSNs[i]],
                manufacturerCode: productsManufactured[productSNs[i]]
            });
        }

        return productInfos;
    }

    function verifyProduct(string memory _productSN, string memory _consumerCode) public view returns (bool) {
        return keccak256(abi.encodePacked(productsSold[_productSN])) == keccak256(abi.encodePacked(_consumerCode));
    }

    // Check Role of an Address
    function getRole(address account) public view returns (string memory) {
        if (hasRole(MANUFACTURER, account)) {
            return "Manufacturer";
        }
        
        for (uint256 i = 0; i < sellerCount; i++) {
            if (keccak256(abi.encodePacked(sellers[i].sellerAddress)) == keccak256(abi.encodePacked(account))) {
                return "Seller";
            }
        }

        for (uint256 i = 0; i < productCount; i++) {
            string memory accountStr = string(abi.encodePacked(account));
            for (uint256 j = 0; j < productsWithConsumer[accountStr].length; j++) {
                if (keccak256(abi.encodePacked(productsWithConsumer[accountStr][j])) == keccak256(abi.encodePacked(productItems[i].productSN))) {
                    return "Customer";
                }
            }
        }

        return "Unknown";
    }
}