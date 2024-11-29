'use client'
import Link from "next/link";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Category() {
  const params = useParams<{ category: string; room: string }>();

  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const nickname = searchParams.get('nickname');

  const [clientData, setClientData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {

    const roomCodeParam = new URLSearchParams({
      'roomCode': params.room
    });

    const getRoomClientList = async () => {
      const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games?${roomCodeParam}`,{
        headers: {
          'Content-Type': 'application/json'       
        },
        method: 'GET'
      });
      const data = await req.json();
        return data
    };
  
    const getQuestionList = async () => {
      const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/room/questions?${roomCodeParam}`,{
        headers: {
          'Content-Type': 'application/json'       
        },
        method: 'GET'
      });
      const data = await req.json();
        return data
    };

    getRoomClientList().then(data => {
      setClientData(data)
      setLoading(false)
    });

    getQuestionList().then(data => {
      sessionStorage.setItem("questionData", JSON.stringify(data));
      setLoading(false)
    });

  }, [])

  //console.log("question list: ", questionData);

  const handleClick = () => {
    router.push(`/${params.category}/${params.room}/quiz?clientId=${clientId}&nickname=${nickname}`);
  };

 
  if (isLoading) return <p>Loading...</p>
  if (!clientData) return <p>No data</p>
  
  return (
    <main>
      <div className="mt-10">
        <Image src="/logo2.png" className="object-cover" alt="Responsive Image" width={305} height={225} />
      </div>
      <div className="grid grid-cols-1 mt-2 justify-center content-center place-content-center place-items-center">
        <div className="bg-custom_blue text-xl text-white text-center w-96 h-16 m-auto rounded-s-3xl rounded-e-3xl
                content-center place-content-center place-items-center font-bold">
          Category: {params.category}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-2 justify-center content-center place-content-center place-items-center">
        <div className="bg-custom_yellow text-xl text-white text-center w-96 h-16 m-auto rounded-s-3xl rounded-e-3xl
                content-center place-content-center place-items-center font-bold">
          Room Code: {params.room}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-2 justify-center content-center place-content-center place-items-center">
        <div className="text-xl text-black text-center w-96 h-16 m-auto border-solid
                content-center place-content-center place-items-center font-bold border-red-500">
        {clientData.map((item: { nickname: any, clientId: any }, index: any) => {
          return (
            <div 
            key={index}>
            {item.nickname}
            </div>
          )
        })}
        </div>
      </div>
      <div className="grid grid-cols-1 mt-20 justify-center content-center place-content-center place-items-center">
        {/* <Link href='/category/lobby/quiz'> */}
        <button onClick={handleClick} className="bg-custom_purple text-xl text-white text-center w-44 h-16 m-auto rounded border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Start Game
        </button>
        <Link href='/'>
        <button className="bg-custom_blue text-xl text-white text-center w-44 h-16 mt-5 rounded border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Back Home
        </button>
        </Link>
        {/* </Link> */}
      </div>
    </main>
  )
}