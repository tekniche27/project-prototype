import Link from "next/link"


export default function Home() {
    return (
        <>
        <div className="mt-52 flex items-center justify-center">
        <img src="logo1.png" className="w-25 h-25 object-cover" alt="Responsive Image" />
        </div>
        <div className="flex flex-wrap place-content-center">
            <button className="bg-custom_yellow text-2xl text-white text-center w-52 h-14 m-10 rounded border-white border-4">
            Play Now
            </button>
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
        </>
    );
  }