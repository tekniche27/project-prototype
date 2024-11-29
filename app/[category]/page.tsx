'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'
import Image from 'next/image';

// import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog"
//import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const generateColor = () => {
  let randomColorString = "#FFD425";

  function get_random (backgroundColors: any) {
    return backgroundColors[Math.floor((Math.random()*backgroundColors.length))];
  }
  randomColorString = get_random([
    '#FFD425',
    '#FF3992',
    '#B000FF',
    '#007BFF'])
  return randomColorString;
};

export default function Category() {

  const [data, setData] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  //const [bgColor, setBgColor] = useState("#FFD425")
  const [selectedCat, setSelectedCat] = useState("");
  const [open, setOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
 
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No categories data</p>

  const selectCategory = (categoryCode: any) => {
    setSelectedCat(categoryCode)
  };

  const postData = async (selectedCat:any) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rooms`,{
      body: JSON.stringify({ categoryCode: selectedCat }),
      headers: {
        'Content-Type': 'application/json'       
      },
      method: 'POST'
    });
    const newData = await req.json();
    //alert(newData)
    setRoomCode(newData);
    setOpen(true);
};

  const handleClick = () => {
    if(selectedCat==="")
    {
      alert("Please select a category.");
      return;
    }
    postData(selectedCat);
};


  return (
    <main>
      <div className="mt-10">
        <Image src="/logo2.png" className="object-cover" alt="Responsive Image" width={305} height={225} />
      </div>
      <div className="text-3xl text-black ml-10">Select Category: </div>
      <div className="grid 
      grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 
      gap-2 justify-center content-center place-content-center place-items-center mt-10">
        {data.map((item: { categoryId: any, categoryCode: any, categoryDesc: any }, index: any) => {
          return (
            <button
              key={index}
              className="text-xl text-white text-center w-40 h-40 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center font-bold"
              style={{ backgroundColor: selectedCat===item.categoryCode ? "gray" : generateColor()}}
              onClick={() => selectCategory(item.categoryCode)}
              >
            {item.categoryDesc} 
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 mt-20 justify-center content-center place-content-center place-items-center">
        <button onClick={handleClick} className="bg-custom_purple text-xl text-white text-center w-44 h-16 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Create Game
        </button>
        <Link href='/'>
        <button className="bg-custom_blue text-xl text-white text-center w-44 h-16 mt-5 rounded border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Back Home
        </button>
        </Link>
      </div>
 {/*      <div className="grid grid-cols-1 mt-5 justify-center content-center">
        <span className="text-black text-center">
        Make public
        &nbsp;
        <input type="checkbox" />
        </span>
      </div> */}

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-xs">
    <DialogHeader>
      <DialogTitle>Room Code</DialogTitle>
      <DialogDescription>
          Copy the room code and share it.
      </DialogDescription>
    </DialogHeader>
    <div className="flex items-center space-x-2">
      <div className="grid flex-1 gap-1 w-1">
        <Label className="font-bold text-4xl">
          {roomCode}
        </Label>
      </div>
      {/* <Button type="submit" size="sm" className="px-3">
        <span className="sr-only">Copy</span>
        <Copy />
      </Button> */}
    </div>
    <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </main>
  )
}