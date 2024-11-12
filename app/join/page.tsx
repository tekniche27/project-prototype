'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Category() {

  const [clientId, setClientId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [data, setData] = useState<any[]>([]);

  const router = useRouter();
  
  // Create a new URLSearchParams object
  const params = new URLSearchParams({
    'roomCode': roomCode
  });

  const joinRoom = async () => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rooms?${params}`,{
      headers: {
        'Content-Type': 'application/json'       
      },
      method: 'GET'
    });
    const newData = await req.json();
    if(newData.length == 0)
    alert("Room Code does not exists or Room Code is not active.")
    else
    {
      setData(newData);

     const postReq = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games`,{
        body: JSON.stringify({ roomCode: roomCode, clientId: clientId }),
        headers: {
          'Content-Type': 'application/json'       
        },
        method: 'POST'
      });
      const gameData = await postReq.json();
      console.log(gameData)
    }
  };

  const handleClick = () => {
    joinRoom();
  };

  const onChangeHandler = (event:any) => {
    setRoomCode(event.target.value);
  };

  useEffect(() => {
    const random = (Math.random() + 1).toString(36).substring(2);
    setClientId(random);

    if (data.length > 0) {
    const category = data[0]["categoryCode"]
    const room     = data[0]["roomCode"]

      router.push(`/${category}/${room}?clientId=${clientId}`);
    }
  }, [data]);

  return (
    <main>
      <div className="mt-10">
        <Image src="/logo2.png" className="object-cover" alt="Responsive Image" width={305} height={225} />
      </div>
      <div className="grid grid-cols-1 mt-2 justify-center content-center">

      <span className="text-black text-center text-3xl font-bold">
        Enter Game Code: 
        &nbsp;
        <input 
         type="text"
         name="name"
         onChange={onChangeHandler}
         value={roomCode}
         className="bg-white text-xl text-black text-center w-96 h-16 m-auto rounded-s-3xl rounded-e-3xl
                content-center place-content-center place-items-center" />
      </span>

      </div>

      <div className="grid grid-cols-1 mt-20 justify-center content-center place-content-center place-items-center">
        <button onClick={handleClick} className="bg-custom_purple text-2xl text-white text-center w-44 h-16 m-auto rounded-s-3xl rounded-e-3xl border-white border-4 
              content-center place-content-center place-items-center font-bold">
        Join Game
        </button>
      </div>
    </main>
  )
}