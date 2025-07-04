"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

const baseApi = process.env.NEXT_PUBLIC_BASE_API;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${baseApi}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseApi}/products/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchProducts();
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== deleteProductId)
        );
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Button asChild className="bg-[#763f98] text-white">
        <Link href="./products/add-product">Add Product</Link>
      </Button>

      <div className="grid grid-cols-4 gap-6 mt-4">
        {products.map((product) => {
          const firstColor = product.colors?.[0]?.color_name;
          const firstImage = firstColor && product.images?.[firstColor]?.[0];

          return (
            <div key={product._id} className="border rounded-sm p-1 shadow-md">
              {product.thumbnail && (
                <Image
                  className="w-full h-40 object-cover rounded-xs"
                  src={`${baseApi}${product.thumbnail}`}
                  alt={product.name}
                  width={200}
                  height={200}
                />
              )}
              <div className="p-2">
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-700">Price: Rs{product.price}</p>
                <p className="text-gray-700">Stock: {product.stock}</p>
                <div className="flex gap-2 mt-4">
                  <button asChild className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                    <Link href={`./products/${product._id}`}>Edit</Link>
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setDeleteProductId(product._id);
                      setIsDialogOpen(true);
                    }}
                  >
                    Delete
                  </button>
                  <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        Are you sure you want to delete this product?
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-red-500 text-white"
                          onClick={handleDelete}
                        >
                          Confirm
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Products;
