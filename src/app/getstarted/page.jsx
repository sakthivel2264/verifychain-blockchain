"use client";

import FloatingNavbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
    <div>
      <FloatingNavbar/>
      <div className='min-h-screen pt-10 lg:m-16 m-10 flex justify-center gap-8'>
        <Card className="flex h-56">
          <CardHeader>
            <CardTitle>Manufacturer</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={"/manufacturer"}><Button>Go</Button></Link>
          </CardFooter>
        </Card>
        <Card className="flex h-56">
          <CardHeader>
            <CardTitle>Seller</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardFooter>
          <Link href={"/seller"}><Button>Go</Button></Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default page