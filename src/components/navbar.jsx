"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { initializeContract } from "@/lib/contractfunctions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Web3 from "web3";
import Product from "@/contracts/Product.json";
import { Shield } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { GetRole } from "@/lib/contractfunctions";
import { toast } from "sonner";

export default function FloatingNavbar() {
  const [web3, setWeb3] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [productContract, setProductContract] = useState(null);
  const path = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const address = search.get("address");

  const loadBlockchainData = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const networkId = await web3.eth.net.getId();

      const pro = new web3.eth.Contract(
        Product.abi,
        Product.networks[networkId].address
      );
      setProductContract(pro);

      // Event listeners...
      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  };

  const web3Handler = async () => {
    if (web3) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    loadBlockchainData();
    const checkRole = async () => {
      const response1 = await initializeContract();
      if (response1) {
        const response = await GetRole(response1.account);
        console.log(response);
        if (response === "Manufacturer") {
          if (path === "/seller") {
            router.push("/");
            toast("You are not authorized to access this page", {
              position: "top-right",
            });
          }
        }
        if (response === "Unknown") {
          const sellerAddresses = JSON.parse(
            localStorage.getItem("sellerAddresses") || "[]"
          );
          const customerAddresses = JSON.parse(
            localStorage.getItem("customerAddresses") || "[]"
          );

          if (sellerAddresses.includes(response1.account)) {
            console.log("Seller");
            if (path === "/manufacturer") {
              router.push("/");
              toast("You are not authorized to access this page", {
                position: "top-right",
              });
            }
          }

          if (customerAddresses.includes(response1.account)) {
            router.push(`/verify?${response1.account}`);
            if (path === "/manufacturer") {
              router.push("/");
              toast("You are not authorized to access this page", {
                position: "top-right",
              });
            }
            if (path === "/seller") {
              router.push("/");
              toast("You are not authorized to access this page", {
                position: "top-right",
              });
            }
          }
        }
      }
    };
    checkRole();
  }, []);

  return (
    <nav className="relative top-4 left-1/2 transform -translate-x-1/2 w-5/6 rounded-2xl bg-background shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center text-xl font-bold text-purple-600">
            <Shield className="h-8 w-8 text-purple-600 mr-2" />
            VerifyChain
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
          <div>
            {account ? (
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:block ml-2 mr-2 border-2 p-2 rounded-lg cursor-pointer"
                      >
                        {account.slice(0, 5) + "..." + account.slice(38, 42)}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-base">Address: {account}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <Button onClick={web3Handler} className="hidden md:block ml-2 mr-2">
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <div>
              {account ? (
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 mr-2 border-2 p-2 rounded-lg cursor-pointer"
                        >
                          {account.slice(0, 5) + "..." + account.slice(38, 42)}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-base">Address: {account}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <Button onClick={web3Handler} className="ml-2 mr-2">
                  Get Started
                </Button>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col bg-background shadow-md p-4">
            <Link href="/" className="py-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="py-2" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="py-2" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}