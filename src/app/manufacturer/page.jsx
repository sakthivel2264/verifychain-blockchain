"use client";

import FloatingNavbar from '@/components/navbar'
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react'
import { Home, Package, Settings, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddSellerComponent from '@/components/addSeller';
import { initializeContract, fetchSeller, fetchProducts, manufacturerSelling
 } from '@/lib/contractfunctions';
import AddProductComponent from '@/components/addProduct';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "qrcode";

const SellerList = () =>{
    const [ addSeller, setAddSeller ] = useState();
    const [ sellers, setSellers ] = useState([]);

    const handleAddSellerOpen = async () =>{
        setAddSeller(<AddSellerComponent/>)
    }

      useEffect(() => {
        const fetchFunction = async () => {
          try {
           const { contract } = await initializeContract();
    
           if(contract){
            const response = await fetchSeller();
            setSellers(response);
            console.log(response)
           }
          } catch (error) {
            console.error("Error in fetchFunction:", error);
          }
        };
      
        fetchFunction();
      }, []);

    return(
        <div>
            <div className='pb-4'>{addSeller}</div>
            <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Sellers List</CardTitle>
                    <Button className='flex justify-center' onClick={handleAddSellerOpen}><UserPlus/> Add Seller</Button>
                </CardHeader>
                
            <Table>
            <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>AddressKey</TableHead>
                    <TableHead>Number</TableHead>
                  </TableRow>
            </TableHeader>
            <TableBody>
                {sellers.length > 0 ? (
                    sellers.map((seller, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{seller.sellerName}</TableCell>
                        <TableCell>{seller.sellerManager}</TableCell>
                        <TableCell>{seller.sellerBrand}</TableCell>
                        <TableCell>{seller.sellerAddress}</TableCell>
                        <TableCell>{seller.sellerNum}</TableCell>
                    </TableRow>
                    ))
                ):( <TableRow>
                        <TableCell colSpan={7} className="text-center">
                            No sellers available
                        </TableCell>
                    </TableRow>)}
            </TableBody>
            </Table>
            </Card>
        </div>
    )
}

const ProductList = () =>{
    const [ addProduct, setAddProduct] = useState();
    const [ products, setProducts ] = useState([]);

    const handleAddProductOpen = async () =>{
        setAddProduct(<AddProductComponent/>)
    }

    useEffect(()=>{
        const fetching = async () =>{
            await initializeContract()
            const response = await fetchProducts();
            setProducts(response);
        }
        fetching()
    },[])

    const generateQR = async (text) => {
        try {
          const qrDataURL = await QRCode.toDataURL(text);
          console.log(qrDataURL);

        const link = document.createElement("a");
        link.href = qrDataURL;
        link.download = "qr-code.png"; // Set file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 

        } catch (err) {
          console.error("Error generating QR Code:", err);
        }
      };



    return(
        <div>
            <div className='pb-4'>{addProduct}</div>
            <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Products List</CardTitle>
                    <Button className='flex justify-center' onClick={handleAddProductOpen} ><UserPlus/> Add Product</Button>
                </CardHeader>
                
            <Table>
            <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ProductSN</TableHead>                 
                    <TableHead>Name</TableHead>                  
                    <TableHead>Brand</TableHead>               
                    <TableHead>Price</TableHead>                  
                    <TableHead>Status</TableHead>                
                    <TableHead>QR Code</TableHead>
                  </TableRow>
            </TableHeader>
            <TableBody>
                {products.length > 0 ? (
                    products.map((product, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.productSN}</TableCell>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>{product.productBrand}</TableCell>
                        <TableCell>{product.productPrice}</TableCell>
                        <TableCell>{product.productStatus}</TableCell>
                        <TableCell><Button onClick={()=>generateQR(product.productSN)}>Download</Button></TableCell>
                    </TableRow>
                    ))
                ):( <TableRow>
                        <TableCell colSpan={7} className="text-center">
                            No products available
                        </TableCell>
                    </TableRow>)}
            </TableBody>
            </Table>
            </Card>
        </div>
    )
}


const SellProducts = () =>{

    const [ sellers, setSellers ] = useState([]);
    const [ products, setProducts ] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");

    useEffect(()=>{
        const init = async () =>{
            await initializeContract();

            const sellerResponse = await fetchSeller();
            setSellers(sellerResponse);
            const productRepsonse = await fetchProducts();
            setProducts(productRepsonse);
            console.log(productRepsonse)

        }
        init()
    },[])

    const handleSubmit = async () => {
        if (!selectedSeller || !selectedProduct) {
          alert("Please select both seller and product.");
          return;
        }
        try{
             await manufacturerSelling(selectedProduct, selectedSeller);
        }catch(error){
            console.log("Error while Selling product", error);
        }
      };

    return(
    <div>
        <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
            <CardHeader>
                <CardTitle>Sell Products to Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
          {/* Seller Select */}
          <Select onValueChange={setSelectedSeller}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Seller" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller, index) => (
                <SelectItem key={index} value={seller.sellerAddress}>
                  {seller.sellerName}, {seller.sellerAddress}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Product Select */}
          <Select onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product, index) => (
                <SelectItem key={index} value={product.productSN}>
                  {product.productName}, {product.productBrand}, {product.productSN}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </CardContent>
        </Card>
    </div>
    )
}

const menuItems = [
  { name: "Products List", icon: <Package className="w-5 h-5" />, component: <ProductList/> },
    { name: "Seller List", icon: <Home className="w-5 h-5" />, component: <SellerList/> },
    { name: "Sell Product to Seller", icon: <Settings className="w-5 h-5" />, component: <SellProducts/> },
  ];

const page = () => {

    useEffect(()=>{
        const init = async () =>{
             await initializeContract();
        }
        init();
    }, [])

  return (
    <div>
        <FloatingNavbar/>
        <Sidebar menuItems={menuItems}/>
    </div>
  )
}

export default page

