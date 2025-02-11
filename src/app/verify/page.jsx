"use client";

import FloatingNavbar from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initializeContract, purchaseHistory, verifyProduct } from '@/lib/contractfunctions';
import { ArrowBigDown, History } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Page = () => {
    const [qrResult, setQrResult] = useState(null);
    const videoRef = useRef(null);
    const [scanner, setScanner] = useState(null);
    const [ result, setResult ] = useState(false); 
    const [ supplyChain, setSupplyChain ] = useState([]);
    const [ purchase, setPurchase ] = useState([]);
    const [ history, setHistory ] = useState(false);
    const [ viewSupply, setViewSupply ] = useState(false);

    useEffect(()=>{
        const init = async () =>{
            await initializeContract();
            
        }
        init();
    }, [])

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const result = await QrScanner.scanImage(file);
            if (typeof result === "string") {
                setQrResult(result);
            } else {
                setQrResult("Invalid QR Code");
            }
        } catch (error) {
            console.error("QR Scan Failed:", error);
            setQrResult("Invalid QR Code");
        }
    };

     const handleVerify = async (productSN) =>{
        const response = await verifyProduct(productSN);
        console.log(response);
        setResult(response);

     }

    const startScanner = () => {
        if (scanner) return; 

        const videoElement = videoRef.current;
        if (!videoElement) return;

        const qrScanner = new QrScanner(
            videoElement,
            (result) => {
                if (result?.data) {
                    handleVerify(result.data);
                    setQrResult(result.data);
                } else {
                    setQrResult("No QR Code Detected");
                }
                qrScanner.stop();
                setScanner(null);
            },
            { highlightScanRegion: true }
        );

        qrScanner.start();
        setScanner(qrScanner);
    };

    const handlepurchaseHistory = async () => {
        try {
            const response = await purchaseHistory();

            for (let i = 0; i < response.length; i++) {
                if (response[i].productSN === qrResult) {
                    setSupplyChain(response[i]);
                    setViewSupply(true);
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching purchase history:", error);
        }
    };


    console.log("supplychain",supplyChain)


    const getPurchaseHistory = async () =>{

        try{
            const response = await purchaseHistory();

            console.log(response)
            setPurchase(response);
            setHistory(true);
            
        }catch(error){
            console.error("Error fetching purchase history:", error);
        }
    }


    return (
        <div>
            <FloatingNavbar />
            <div>
                <Card className="mx-auto mt-10 shadow-lg w-[60vw]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>View Purchase History</CardTitle>
                        <Button onClick={getPurchaseHistory}><History/></Button>
                    </CardHeader>
                    {history && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>productSN</TableHead>
                                <TableHead>Seller</TableHead>
                                <TableHead>Manufacturer</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchase.length > 0 ? (
                                purchase.map((purchases, index) =>(
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{purchases.productSN}</TableCell>
                                        <TableCell>{purchases.sellerAddress}</TableCell>
                                        <TableCell>{purchases.manufacturerCode}</TableCell>
                                    </TableRow>
                                ))
                        ):(<TableRow>
                                <TableCell colSpan={7} className="text-center">
                                 No History available
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>}
                </Card>
                <Card className="mx-auto mt-10 shadow-lg w-[60vw] p-6">
                    <CardHeader>
                        <CardTitle>Scan Your Product & Get Verified!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex flex-col justify-center">
                        {/* File Upload Input */}
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer"/>

                        {/* Video Element for Camera Scanning */}
                        <video ref={videoRef} className="w-full h-full border rounded-md" />

                        {/* Button to Scan QR Code using Camera */}
                        <Button onClick={startScanner}>Scan QR Code</Button>

                        {/* Display Scanned QR Code Result */}
                        {result && (
                            <div className='flex flex-col justify-center'>
                            <p className="text-md font-semibold text-green-600 m-2">
                                Authenticity confirmed: This is a genuine product.
                            </p>
                            <Button onClick={handlepurchaseHistory} >View SupplyChain</Button>
                            </div>
                        )}

                            {viewSupply && (
                                <div className="flex flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
                                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
                                        Supply Chain Overview
                                    </h1>
                                    
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        {/* Manufacturer */}
                                        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-64">
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Manufacturer</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Address:</p>
                                            <p className="font-mono text-gray-900 dark:text-gray-300 break-all">{supplyChain.manufacturerCode}</p>
                                            <p className="text-gray-600 dark:text-gray-400">Product SN:</p>
                                            <p className="font-mono text-gray-900 dark:text-gray-300">{supplyChain.productSN}</p>
                                            
                                            
                                        </div>
                                        <ArrowBigDown/>

                                        {/* Seller */}
                                        <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-64">
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Seller</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Address:</p>
                                            <p className="font-mono text-gray-900 dark:text-gray-300 break-all">{supplyChain.sellerAddress}</p>
                                            <p className="text-gray-600 dark:text-gray-400">Product SN:</p>
                                            <p className="font-mono text-gray-900 dark:text-gray-300">{supplyChain.productSN}</p>
                                            
                                            
                                        </div>
                                        <ArrowBigDown/>

                                        {/* You (End User) */}
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-64">
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">You</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Product SN:</p>
                                            <p className="font-mono text-gray-900 dark:text-gray-300">{supplyChain.productSN}</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Page;
