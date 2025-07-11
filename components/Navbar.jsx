"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
// import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu"
import { motion, AnimatePresence } from "framer-motion";
import { TfiClose } from "react-icons/tfi";
import { Separator } from "./ui/separator";
import { FaChevronDown } from "react-icons/fa6";
import { ScrollArea } from "./ui/scroll-area";
import { BiLogOut } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchBar from "./SearchBar";
import SideCart from "./cart/SideCart";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { getUserFromLocalStorage, logout, setUser } from "@/store/authSlice";
import { Button } from "./ui/button";
import { HiOutlineLogout } from "react-icons/hi";
import { getCartFromLocalStorage } from "@/store/cartSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const baseApi = process.env.NEXT_PUBLIC_BASE_API;

export default function Navbar() {
  const dispatch = useDispatch();
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isShopForOpen, setIsShopForOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileBrandOpen, setIsMobileBrandOpen] = useState(false);

  const [isSidecardOpen, setIsSidecartOpen] = useState(true);

  const [glassesBrands, setGlassesBrands] = useState([]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dropdownAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    dispatch({ type: "cart/setCart", payload: getCartFromLocalStorage() });
  }, [dispatch]);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      dispatch(setUser(storedUser));
    }
  }, []);

  const sortedBrands = [...glassesBrands].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Divide the array into 4 equal parts
  const chunkSize = Math.ceil(sortedBrands.length / 4);
  const brandSections = [];

  for (let i = 0; i < sortedBrands.length; i += chunkSize) {
    brandSections.push(sortedBrands.slice(i, i + chunkSize));
  }

  const cart = useSelector((state) => state.cart.cartItems);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${baseApi}/brands`);
      const data = await response.json();
      setGlassesBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleMenuClicke = () => {
    setIsSearchOpen(false);
    if (isOpen) {
      setIsOpen(false);
      setIsMobileBrandOpen(false);
      setSubmenuOpen(false);
    }
    else {
      setIsOpen(true);
    }

  }
  return (
    <>
      <header className="mx-6 md:mx-32 hidden md:block ">
        <div className="flex justify-between items-center py-2">
          <div className="flex-1">
            <div className="w-max flex items-center gap-2">
              <Link
                className="border rounded-full border-[#763f98] block"
                href="/"
              >
                <FaFacebookF className="text-[#763f98] m-1" />
              </Link>
              <Link
                className="border rounded-full border-[#763f98] block"
                href="/"
              >
                <FaInstagram className="text-[#763f98] m-1" />
              </Link>
            </div>
            <div>
              <Link className="" href="/">
                Customer Care 98900 98900
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center mt-2">
            <Link className="" href="/">
              <Image src="/logo.png" alt="logo" width={180} height={180} />
            </Link>
          </div>
          <div className="flex items-center justify-end gap-2 flex-1">
            {user ? (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    className="flex flex-col items-center"
                  >
                    <Image
                      className="w-8"
                      alt="user"
                      width={20}
                      height={20}
                      src="/user.svg"
                    />
                    <h2 className="text-xs text-[#763f98] capitalize">
                      {user?.name}
                    </h2>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0 left-0">
                  <div className="grid">
                    <div className=" p-2 py-2">
                      <h4 className="font-[800]">
                        Hi {user?.name}!
                      </h4>
                    </div>
                    <Separator />
                    <div className="grid">
                      <Link
                        href="/account"
                        className="p-2 hover:bg-gray-100"
                        variant="outline"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="p-2 hover:bg-gray-100"
                        variant="outline"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="p-2 hover:bg-gray-100"
                        variant="outline"
                      >
                        Your Wishlist
                      </Link>
                      <Link
                        href="/support"
                        className="p-2 hover:bg-gray-100"
                        variant="outline"
                      >
                        Support
                      </Link>
                    </div>
                    <Separator />

                    <button
                      className="p-2 rounded-b-sm hover:bg-gray-100 text-start"
                      onClick={() => {
                        dispatch(logout());
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                href="/login"
                className="flex flex-col justify-center items-center"
              >
                <Image
                  className="w-8"
                  alt="user"
                  width={20}
                  height={20}
                  src="/user.svg"
                />
                <h2 className="text-xs text-[#763f98]">Login</h2>
              </Link>
            )}

            <Link href="/cart" className="flex flex-col items-center">
              <Image
                className="w-8"
                alt="cart"
                width={20}
                height={20}
                src="/cart.svg"
              />
              <h2 className="text-xs text-[#763f98]">Cart</h2>
            </Link>
          </div>
        </div>

        <nav className="flex justify-between items-center py-2">
          <div className=" flex justify-between items-center py-3 uppercase">
            {/* Navigation Links */}
            <ul className="flex space-x-6 text-lg ">
              <li>
                <Link href="/category/best-seller" className="hover:text-[#763f98] font-semibold">
                  Best Seller
                </Link>
              </li>

              {/* Shop by Brand Dropdown */}
              <li
                className=""
                onMouseEnter={() => setIsBrandOpen(true)}
                onMouseLeave={() => setIsBrandOpen(false)}
              >
                <button
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="hover:text-[#763f98] uppercase flex items-center gap-1 group font-semibold"
                >
                  Shop by Brand{" "}
                  <FaChevronDown className="inline group-hover:-rotate-180 duration-200 transition-all" />
                </button>
                <AnimatePresence>
                  {isBrandOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownAnimation}
                      className="absolute left-0 pt-3 w-screen h-screen bg-white shadow-lg px-32 grid grid-cols-4 gap-4 z-50 rounded-md"
                    >
                      {brandSections.map((section, index) => {
                        const firstBrand = section[0]?.name || "";
                        const lastBrand =
                          section[section.length - 1]?.name || "";
                        const sectionLabel = `${firstBrand[0]} - ${lastBrand[0]}`;

                        return (
                          <div key={index}>
                            <h3 className="font-semibold ">{sectionLabel}</h3>
                            <ul className="">
                              {section.map((brand) => (
                                <Link
                                  href={`/collection/${brand.name
                                    .toLocaleLowerCase()
                                    .split(" ")
                                    .join("-")}`}
                                  key={brand._id}
                                  className="whitespace-nowrap py-2 hover:text-[#763f98] hover:font-semibold transition-all duration-150 block"
                                >
                                  {brand.name}
                                </Link>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Shop For Dropdown */}
              <li
                className=""
                onMouseEnter={() => setIsShopForOpen(true)}
                onMouseLeave={() => setIsShopForOpen(false)}
              >
                <button
                  onClick={() => setIsShopForOpen(!isShopForOpen)}
                  className="hover:text-[#763f98] uppercase flex items-center gap-1 group font-semibold"
                >
                  Shop For{" "}
                  <FaChevronDown className="inline group-hover:-rotate-180 duration-200 transition-all" />
                </button>
                <AnimatePresence>
                  {isShopForOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownAnimation}
                      className="absolute left-0 pt-3 w-screen h-max bg-white shadow-lg p-3 rounded-lg px-32 grid grid-cols-4 gap-4 z-50"
                    >
                      <div>
                        <h2 className="font-semibold mb-2">Featured Brands</h2>
                        <ul className="">
                          {sortedBrands.slice(0, 8).map((brand) => (
                            <li key={brand._id}>
                              <Link
                                href={`/collection/${brand.name
                                  .toLocaleLowerCase()
                                  .split(" ")
                                  .join("-")}`}
                                className="block py-1 text-sm hover:text-[#763f98]"
                              >
                                {brand.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h2 className="font-semibold mb-2">Shop For</h2>
                        <ul className="">
                          <li>
                            <Link
                              href="/ideal-for/men"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Mens
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/ideal-for/women"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Womens
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/ideal-for/kids"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Kids
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/ideal-for/unisex"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Unisex
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h2 className="font-semibold mb-2">By Style</h2>
                        <ul className="">
                          <li>
                            <Link
                              href="/style/square"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Square
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/style/round"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Round
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/style/aviator"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Aviator
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/style/wayfarer"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Wayfarer
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/style/rectangle"
                              className="block py-1 hover:text-[#763f98]"
                            >
                              Rectangle
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <Link
                  href="/opticals"
                  className="hover:text-[#763f98] font-semibold"
                >
                  Opticals
                </Link>
              </li>

              <li>
                <Link
                  href="/sunglasses"
                  className="hover:text-[#763f98] font-semibold"
                >
                  Sunglasses
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-[#763f98] font-semibold">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="searchbar">
            {/* <div className="bg-purple-700 flex  rounded-md">
              <input
                type="text"
                placeholder="Search for best brands "
                className=" py-1 px-2 rounded-md bg-gray-200 focus:outline-none text-sm"
              />
            </div> */}
            <SearchBar />
          </div>
        </nav>
      </header>

      <div className="md:hidden px-4 py-3 flex justify-between items-center relative z-50 bg-white">
        <div>
          <motion.button
            onClick={handleMenuClicke}
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <Image src="/glassess.svg" width={40} height={40} alt="Glassess" className="" />
          </motion.button>
          <motion.h2
            key={isOpen} // Forces re-render when text changes
            initial={{ scale: 0.8, opacity: 0, letterSpacing: "-0.05em", skewX: -10 }}
            animate={{ scale: 1, opacity: 1, letterSpacing: "0em", skewX: 0 }}
            exit={{ scale: 1.2, opacity: 0, letterSpacing: "0.05em", skewX: 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleMenuClicke}
            className="-mt-2 text-sm font-semibold"
          >
            {isOpen ? "CLOSE" : "MENU"}
          </motion.h2>
        </div>

        <Link href="/">
          <Image src="/logo.png" alt="logo" width={80} height={120} />
        </Link>

        <div className="flex items-center gap-2">
          {/* <Link href='/login' className='flex flex-col items-center'>
            <Image className='w-8' alt='user' width={20} height={20} src='/user.svg' />
            <h2 className='text-xs text-[#763f98]'>Account</h2>
          </Link> */}

          <Image
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            alt="serach icon"
            width={18}
            height={18}
            src="/searchGray.svg"
          />
          {/* search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: "-100%" }} // Start higher up for a better sliding effect
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-100%" }} // Slide back up when exiting
                transition={{ duration: 0.4, ease: "easeInOut" }} // Slower and smoother transition
                className="absolute top-full left-0 w-full bg-gray-100  py-3 z-50 h-max  flex justify-between items-center px-5 gap-4 "
              >
                <Image
                  alt="serach icon"
                  width={22}
                  height={22}
                  src="/searchGray.svg"
                />
                <input
                  placeholder="Search..."
                  type="text"
                  className="text-xl focus:outline-none bg-gray-100  w-full placeholder:text-gray-600"
                />
                <TfiClose
                  onClick={() => setIsSearchOpen(false)}
                  className="text-2xl font-thin"
                />

              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/cart" className="flex flex-col items-center">
            <Image
              className="w-8"
              alt="cart"
              width={20}
              height={20}
              src="/cart.svg"
            />
          </Link>
        </div>
      </div>

      {/* main nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }} // Start higher up for a better sliding effect
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }} // Slide back up when exiting
            transition={{ duration: 0.4, ease: "easeInOut" }} // Slower and smoother transition
            className="absolute top-full left-0 w-full bg-white shadow-lg px-5 py-2 z-40 h-screen"
          >
            <nav className="">
              <ul className="flex flex-col text-lg font-semibold">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Best Seller
                  </Link>
                </li>
                <Separator />
                <li
                  className="hover:text-[#763f98] py-4 flex justify-between"
                  onClick={() => setIsMobileBrandOpen(true)}
                >
                  Shop by Brand <FaChevronDown className="inline -rotate-90 " />
                </li>
                <Separator />
                <li
                  className="hover:text-[#763f98] py-4 flex justify-between"
                  onClick={() => setSubmenuOpen(true)}
                >
                  Shop For <FaChevronDown className="inline -rotate-90 " />
                </li>
                <Separator />
                <li>
                  <Link
                    href="/opticals"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Opticals
                  </Link>
                </li>
                <Separator />
                <li>
                  <Link
                    href="/sunglasses"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setIsOpen(false)}
                  >
                    Sunglasses
                  </Link>
                </li>
                <Separator />
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <Separator />
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Shop for */}
      <AnimatePresence>
        {submenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} // Start higher up for a better sliding effect
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }} // Slide back up when exiting
            transition={{ duration: 0.4, ease: "easeInOut" }} // Slower and smoother transition
            className="absolute top-full left-0 w-full bg-white shadow-lg px-5 py-2 z-40 h-screen"
          >
            <nav className="">
              <ul className="flex flex-col text-lg font-semibold">
                <li
                  className="hover:text-[#763f98] py-3 block text-sm"
                  onClick={() => setSubmenuOpen(false)}
                >
                  <FaChevronDown className="inline rotate-90 " />
                  Back
                </li>
                <Separator />
                <li>
                  <Link
                    href="/ideal-for/men"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    Mens
                  </Link>
                </li>
                <Separator />
                <li>
                  <Link
                    href="/ideal-for/women"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    Womens
                  </Link>
                </li>
                <Separator />
                <li>
                  <Link
                    href="/ideal-for/kids"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    Kids
                  </Link>
                </li>
                <Separator />
                <li>
                  <Link
                    href="/ideal-for/unisex"
                    className="hover:text-[#763f98] py-4 block"
                    onClick={() => setSubmenuOpen(false)}
                  >
                    Unisex
                  </Link>
                </li>
                <Separator />
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      {/* brands */}
      <AnimatePresence>
        {isMobileBrandOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} // Start higher up for a better sliding effect
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }} // Slide back up when exiting
            transition={{ duration: 0.4, ease: "easeInOut" }} // Slower and smoother transition
            className="absolute top-full left-0 w-full bg-white shadow-lg px-5 py-2 z-40 h-screen"
          >
            <nav className="">
              <ul className="flex flex-col text-lg font-semibold">
                <li
                  className="hover:text-[#763f98] py-3 block text-sm"
                  onClick={() => setIsMobileBrandOpen(false)}
                >
                  <FaChevronDown className="inline rotate-90 " />
                  Back
                </li>
                <Separator />
                <ScrollArea className="h-[80vh] ">
                  {sortedBrands &&
                    sortedBrands.map((brand) => (
                      <div key={brand._id}>
                        <li>
                          <Link
                            href={`/collection/${brand.name
                              .toLocaleLowerCase()
                              .split(" ")
                              .join("-")}`}
                            className="hover:text-[#763f98] py-4 block"
                          >
                            {brand.name}
                          </Link>
                        </li>
                        <Separator />
                      </div>
                    ))}
                </ScrollArea>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }} // Start higher up for a better sliding effect
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // Slide back up when exiting
            transition={{ duration: 0.4, ease: "easeInOut" }} // Slower and smoother transition
            className="absolute backdrop-blur-xl top-0 left-0 h-[100vh] w-[100vw] shadow-lg px-5 py-2 z-40 "
          >
            <div className="absolute    z-30">

            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <SideCart isOpen={isSidecardOpen} setIsOpen={setIsSidecartOpen} />
    </>
  );
}
