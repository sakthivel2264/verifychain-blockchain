"use client";

import FloatingNavbar from "@/components/navbar"
import Sidebar from "@/components/sidebar";
import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Package, Settings, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { initializeContract, querysellerproduct, sellersellproduct, } from "@/lib/contractfunctions";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";


const SellProducts = () =>{
    const [customer, setCustomer] = useState("");
  const [productSN, setProductSN] = useState("");

  const handleSubmit = async () => {
    await sellersellproduct(productSN, customer);
  };

    return(
        <div>
            <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Purchase Updation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
          <Input 
            placeholder="Enter ProductSN" 
            value={productSN} 
            onChange={(e) => setProductSN(e.target.value)} 
          />
          <Input 
            placeholder="Enter Customer Address" 
            value={customer} 
            onChange={(e) => setCustomer(e.target.value)} 
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
            </Card>
        </div>
    )
}

const SellerProducts = () =>{
    const [ products, setProducts ] = useState([]);

     useEffect(()=>{
            const fetching = async () =>{
                await initializeContract()
                const response = await querysellerproduct();
                setProducts(response);
                console.log(response);
            }
            fetching()
        },[])

    return(
        <div>
            <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Products List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>ProductSN</TableHead>                 
                                <TableHead>Name</TableHead>                  
                                <TableHead>Brand</TableHead>               
                                <TableHead>Price</TableHead>                  
                                <TableHead>Status</TableHead> 
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
                                </TableRow>
                                ))
                            ):( <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                 No products available
                                </TableCell>
                            </TableRow>)}
                        </TableBody>                           
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

const menuItems = [
    { name: "Sell Products", icon: <Home className="w-5 h-5" />, component: <SellProducts/> },
    { name: "Products List", icon: <Package className="w-5 h-5" />, component: <SellerProducts/> },
  ];

const page = () => {
  return (
    <div>
        <FloatingNavbar/>
        <Sidebar menuItems={menuItems}/>
    </div>
  )
}

export default page