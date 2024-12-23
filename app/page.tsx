import Link from "next/link";
import Image from 'next/image';


export default function Home() {
    return (
        <>
        <div className="mt-48 flex items-center justify-center">
        <Image src="/logo1.png" className="w-25 h-25 object-cover" alt="Responsive Image" width={605} height={225} />
        </div>
        <div className="flex flex-wrap place-content-center">
            <Link href='/category'>
            <button className="bg-custom_pink text-2xl text-white text-center w-52 h-14 m-10 rounded border-white border-4">
            Create Game
            </button>
            </Link>
            <Link href='/join'>
            <button className="bg-custom_purple text-2xl text-white text-center w-52 h-14 m-10 rounded border-white border-4">
            Join Game
            </button>
            </Link>
        </div>
        <div className="flex flex-wrap place-content-center">
            <Link href='/leaderboards'>
            <button className="bg-custom_yellow text-2xl text-white text-center w-52 h-14 m-5 rounded border-white border-4">
            View Ranking
            </button>
            </Link>
        </div>
        </>
    );
  }