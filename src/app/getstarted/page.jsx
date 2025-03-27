"use client";

import FloatingNavbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react'
import { useSearchParams } from 'next/navigation';

const page = () => {
  const search = useSearchParams()
  const address = search.get('address')

  return (
    <div>
      <FloatingNavbar/>
      <div className='min-h-screen pt-10 lg:m-16 m-10 flex justify-center gap-8'>
        <Card className="flex h-32">
          <CardHeader>
            <CardTitle>Manufacturer</CardTitle>
            <CardDescription>Create and manage products in your inventory.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={`/manufacturer?address=${address}`}><Button>Go</Button></Link>
          </CardFooter>
        </Card>
        <Card className="flex h-32">
          <CardHeader>
            <CardTitle>Seller</CardTitle>
            <CardDescription>Manage product listings and sales.</CardDescription>
          </CardHeader>
          <CardFooter>
          <Link href={`/seller?address=${address}`}><Button>Go</Button></Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default page;