"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSeller, fetchSeller, initializeContract } from '@/lib/contractfunctions';
import { Button } from './ui/button';

const sellerSchema = z.object({
    sellerName: z.string().min(1, "Seller Name is required"),
    sellerBrand: z.string().min(1, "Seller Brand is required"),
    sellerNum: z.string().min(1, "Seller Number is required"),
    sellerManager: z.string().min(1, "Seller Manager is required"),
    sellerAddress: z.string().min(1, "Seller Address is required"),
  });

const AddSellerComponent = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: zodResolver(sellerSchema),
      });

      const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log(data)
      await AddSeller(data);
      alert("Seller added successfully!");
    } catch (error) {
      console.error("Error adding seller", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchFunction = async () => {
      try {
       const { contract } = await initializeContract();

       if(contract){
        await fetchSeller();
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
            <CardTitle>Add Seller</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/** Seller Name */}
            <div>
                <Label>Seller Name</Label>
                <Input {...register("sellerName")} />
                {errors.sellerName && (
                <p className="text-red-500 text-sm">{errors.sellerName.message}</p>
                )}
            </div>

            {/** Seller Brand */}
            <div>
                <Label>Seller Brand</Label>
                <Input {...register("sellerBrand")} />
                {errors.sellerBrand && (
                <p className="text-red-500 text-sm">{errors.sellerBrand.message}</p>
                )}
            </div>

            {/** Seller Number */}
            <div>
                <Label>Seller Number</Label>
                <Input {...register("sellerNum")} />
                {errors.sellerNum && (
                <p className="text-red-500 text-sm">{errors.sellerNum.message}</p>
                )}
            </div>

            {/** Seller Manager */}
            <div>
                <Label>Seller Manager</Label>
                <Input {...register("sellerManager")} />
                {errors.sellerManager && (
                <p className="text-red-500 text-sm">{errors.sellerManager.message}</p>
                )}
            </div>

            {/** Seller Address */}
            <div>
                <Label>Seller Address</Label>
                <Input {...register("sellerAddress")} />
                {errors.sellerAddress && (
                <p className="text-red-500 text-sm">{errors.sellerAddress.message}</p>
                )}
            </div>

            {/** Submit Button */}
            <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Seller"}
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  )
}

export default AddSellerComponent