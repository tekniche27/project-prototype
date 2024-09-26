import Link from "next/link"


export default function Home() {
    return (
        <>
        {/* <img src="http.jpg" className="w-full h-auto object-cover" alt="Responsive Image" /> */}
        <div className="mt-96 flex flex-wrap place-content-center bg-stone-200">
            <button className="bg-custom_yellow text-2xl text-white text-center w-52 h-10 m-10 rounded border-white border-4">
            Play Now
            </button>
            <Link href='/category'>
            <button className="bg-custom_pink text-2xl text-white text-center w-52 h-10 m-10 rounded border-white border-4">
            Create Game
            </button>
            </Link>
            <Link href='/join'>
            <button className="bg-custom_purple text-2xl text-white text-center w-52 h-10 m-10 rounded border-white border-4">
            Join Game
            </button>
            </Link>
        </div>
        </>
    );
  }