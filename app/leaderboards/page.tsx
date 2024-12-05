'use client'
import React from "react";
import Link from "next/link";
import { useState, useEffect } from 'react';

const Leaderboard = () => {

  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {

    const getLeaderboardData = async () => {
      const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaderboards`,{
        headers: {
          'Content-Type': 'application/json'       
        },
        method: 'GET'
      });
      const data = await req.json();
        return data
    };
  
    getLeaderboardData().then(data => {
      setLeaderboardData(data)
      setLoading(false)
    });

  }, [])

  const getRowClass = (rank: number) => {
    if (rank === 1) return "bg-yellow-300";
    if (rank === 2) return "bg-gray-300";
    if (rank === 3) return "bg-orange-300";
    return "bg-white";
  };

  if (isLoading) return <p>Loading...</p>

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8">
        Leaderboards
      </h1>
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-gray-700 text-lg">Rank</th>
              <th className="py-3 px-6 text-left text-gray-700 text-lg">Name</th>
              <th className="py-3 px-6 text-left text-gray-700 text-lg">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player) => (
              <tr
                key={player.rank}
                className={`${getRowClass(player.rank)} hover:bg-gray-300 transition`}
              >
                <td className="py-3 px-6 text-lg font-medium">{player.rank}</td>
                <td className="py-3 px-6 text-lg">{player.nickname}</td>
                <td className="py-3 px-6 text-lg">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div className="flex flex-wrap place-content-center">
            <Link href='/'>
            <button className="bg-custom_blue text-2xl text-white text-center w-52 h-14 m-5 rounded border-white border-4">
            Back Home
            </button>
            </Link>
    </div>
    </>
  );
};

export default Leaderboard;