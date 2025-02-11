"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProduct, fetchProducts, initializeContract } from '@/lib/contractfunctions';
import { Button } from './ui/button';



const productSchema = z.object({
    productName: z.string().min(1, "Product Name is required"),
    productBrand: z.string().min(1, "Product Brand is required"),
    productSN: z.string().min(1, "Product Code is required"),
    productPrice: z.string().min(1, "Product Number is required"),
  });

const AddProductComponent = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: zodResolver(productSchema),
      });

      const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log(data)
      const { productName, productBrand, productSN, productPrice } = data;
      await addProduct(productName, productSN,  productBrand, productPrice);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchFunction = async () => {
      try {
       const { contract } = await initializeContract();

       if(contract){
        await fetchProducts();
       }
      } catch (error) {
        console.error("Error in fetchFunction:", error);
      }
    };
  
    fetchFunction();
  }, []);
  


  return (
    <div>
        <Card className="mx-auto mt-10 shadow-lg lg:w-[60vw]">
        <CardHeader>
            <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/** Product Name */}
            <div>
                <Label>Product Name</Label>
                <Input {...register("productName")} />
                {errors.productName && (
                <p className="text-red-500 text-sm">{errors.productName.message}</p>
                )}
            </div>

            {/** Product Brand */}
            <div>
                <Label>Product Brand</Label>
                <Input {...register("productBrand")} />
                {errors.productBrand && (
                <p className="text-red-500 text-sm">{errors.productBrand.message}</p>
                )}
            </div>

            {/** Product Code */}
            <div>
                <Label>Product SN</Label>
                <Input {...register("productSN")} />
                {errors.productSN && (
                <p className="text-red-500 text-sm">{errors.productSN.message}</p>
                )}
            </div>

            {/** Product Number */}
            <div>
                <Label>Product Price</Label>
                <Input {...register("productPrice")} />
                {errors.productPrice && (
                <p className="text-red-500 text-sm">{errors.productPrice.message}</p>
                )}
            </div>

            {/** Submit Button */}
            <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}

export default AddProductComponent;