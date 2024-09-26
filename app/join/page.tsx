'use client'
import Link from "next/link"
import { useState, useEffect } from 'react'

const colorMap: any = {};
const selectedColors: any = {};

const generateColor = () => {
  let randomColorString = "#";
  const arrayOfColorFunctions = "0123456789abcdef";
  for (let x = 0; x < 6; x++) {
    let index = Math.floor(Math.random() * 16);
    let value = arrayOfColorFunctions[index];

    randomColorString += value;
  }
  return randomColorString;
};

const newColorFind = (id: any) => {
  // If already generated and assigned, return
  if (colorMap[id]) return colorMap[id];

  // Generate new random color
  let newColor;

  do {
    newColor = generateColor();
  } while(selectedColors[newColor]);

  // Found a new random, unassigned color
  colorMap[id] = newColor;
  selectedColors[newColor] = true;

  // Return next new color
  return newColor;
}

const baseurl = "http://localhost:3000/api"

export default function Category() {

  const [data, setData] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  let [bgColor, setBgColor] = useState("red")
  const [active, setActive] = useState(false);
 
  useEffect(() => {
    fetch(`${baseurl}/categories`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No categories data</p>

  const selectCategory = (categoryCode: any) => {
    setBgColor("green")
  };


  return (
    <main>
      <div className="grid grid-cols-6 gap-2 justify-center content-center place-content-center place-items-center mt-60">
        {data.map((item: { categoryId: any, categoryCode: any, categoryDesc: any }, index: any) => {
          return (
            <button
              key={item.categoryId}
              className="text-xl text-white text-center w-32 h-32 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center"
              //style={{ backgroundColor: newColorFind(item.categoryCode)}}
              style={{ backgroundColor: bgColor}}
              onClick={() => selectCategory(item.categoryCode)}
              >
            {item.categoryDesc} 
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 mt-10 justify-center content-center place-content-center place-items-center">
        <Link href='/lobby'>
        <button className="bg-custom_purple text-xl text-white text-center w-32 h-16 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center">
        Create Game
        </button>
        </Link>
      </div>
    </main>
  )
} 