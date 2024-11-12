'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'


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
  let [bgColor, setBgColor] = useState("#FFD425")
  const [selectedCat, setSelectedCat] = useState("");
 
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/categories`, { cache: 'no-store' })
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
    alert(newData)
};

  const handleClick = () => {
    postData(selectedCat);
};


  return (
    <main>
      <div className="mt-10">
        <img src="logo2.png" className="object-cover" alt="Responsive Image" />
      </div>
      <div className="text-3xl text-black ml-10">Select Category: </div>
      <div className="grid grid-cols-6 gap-2 justify-center content-center place-content-center place-items-center mt-10">
        {data.map((item: { categoryId: any, categoryCode: any, categoryDesc: any }, index: any) => {
          return (
            <button
              key={item.categoryId}
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
        <Link href='/'>
        <button onClick={handleClick} className="bg-custom_purple text-xl text-white text-center w-44 h-16 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Create Game
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
    </main>
  )
}