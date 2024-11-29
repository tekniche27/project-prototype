'use client'
import { useState, useEffect } from "react";
import QuestionTimer from "@/components/QuestionsTimer";
import { usePoints } from "@/context/PointsContext";
import Results from "@/components/Results";
import useSound from 'use-sound';
import { io } from "socket.io-client";
import Peer from 'peerjs';
import { useParams, useSearchParams } from 'next/navigation';

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}`) // replace with your own URL if necessary

export default function Quiz() {

    const params = useParams<{ category: string; room: string, nickname: string  }>();

    const roomCodeParam = new URLSearchParams({
      'roomCode': params.room
    });

    const searchParams = useSearchParams();
    const clientId   = searchParams.get('clientId');
    const nickname   = searchParams.get('nickname');
    const playerCode = searchParams.get('nickname')+"-"+searchParams.get('clientId');

    const { points, setPoints } = usePoints();
    const [questions, setQuestions] = useState([] as any); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const [showResults, setShowResults] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);

    const [unattemptedQuestions, setUnattemptedQuestions] = useState(0);
    //const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [timePerQuestion, setTimePerQuestion] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const [peer, setPeer] = useState(null as any)
    const [connectTo, setConnectTo] = useState<any>([])
    const [connected, setConnected] = useState<any>([])
    const [messages, setMessages] = useState<any>([])

    const [clients, setClients] = useState<any>([])


    useEffect(() => {

      if (typeof navigator !== "undefined") {
        //const Peer = require("peerjs").default
        //console.log(Peer);
      }

      // reset points to 0 on page reload
      setPoints(0);
      
     
      const user: any = new Peer(playerCode as any, {
        //host: `${process.env.NEXT_PUBLIC_SOCKET_HOST}`,
        host: '/',
        port: `${process.env.NEXT_PUBLIC_SOCKET_PORT}` as any,
        path: 'chat',
        debug: 1,
      });
  
      user.on('open', (id:any) => {
        console.log('PEER OPENED', id)
        setPeer(user)
        socket.emit('join-room', id)
      })
  
      user.on('connection', (conn:any) => {
        console.log('Got Connection from ', conn.peer);
        conn.on('data', (data:any) => {
        setMessages((messages:any) => [...messages, data])
        })
        setConnected((connected:any) => [...connected, conn])
      });

        if (typeof window !== "undefined") {

        const storedValue: any = window.sessionStorage.getItem("questionData");
        const valueData = JSON.parse(storedValue);
        
        const parsedData = valueData.map((item: { answerOptions: string; }) => ({
            ...item,
            answerOptions: JSON.parse(item.answerOptions) // Parse the answerOptions string into an array
        }));

        setQuestions(parsedData);

        }


        
    }, []);



    useEffect(() => {
      socket.on('user-connected', (id) => {
        console.log('A user connected message from server', id)
        //setMessages((messages:any) => [...messages, `User with ID: ${id} joined`])

        const oid = id.split('-')[0];

        //added to broadcast newly added client
        setClients((clients:any) => [...clients, `${oid} joined the game.`])
        setConnectTo((connectTo:any) => [...connectTo, id])
      })
     }, [])

     useEffect(() => {
      setMessages((messages: any) => [...messages, {"playerCode": playerCode, "clientId": clientId, "nickname": nickname, "points": points}])
      sendMessageToConnected({"playerCode": playerCode, "clientId": clientId, "nickname": nickname, "points": points});
     }, [points])
  
     const sendMessage = (to:any, message: any) => {
        to.send(message)
     }
  
     const sendMessageToConnected = (message:any) => {
       connected.forEach((conn: any) => {
         sendMessage(conn, message)
       })
     }
  
     useEffect(() => {
       if (!peer) {
         return
       }
       const newConnectTo = connectTo
        newConnectTo.forEach((id:any, index: any) => {
          const connect = peer.connect(id)
          connect.on('open', () => {
            //console.log('NEW CONNECTION ESTABLISHED', connect)
            setConnected((connected: any) => [...connected, connect])
          })
  
          connect.on('data', (data: any) => {
            //console.log("data natin to: ", data)
            setMessages((messages: any) => [...messages, data])
          });
   
          delete newConnectTo[index]
        })
  
        //console.log('TO CONNECT TO', connectTo)
  
        setConnectTo(newConnectTo)
     }, [connectTo, peer])
  

    const handleAnswer = (option: any) => {
        

        if (isAnswered) return;

        setSelectedOption(option);
        setIsAnswered(true);
    
        // Track the time spent on this question
        // setTotalTimeSpent(totalTimeSpent + questions[currentQuestionIndex]?.timer);
    
        if (option === questions[currentQuestionIndex].answer) 
        {
          setPoints(points + 1); // 1 point for a correct answer
          setCorrectAnswers(correctAnswers + 1);
        } 

        else 
        {
          setWrongAnswers(wrongAnswers + 1);
        }

      };

      const updateGameScore = async () => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games?${roomCodeParam}&clientId=${clientId}&score=${points}`,{
          headers: {
            'Content-Type': 'application/json'       
          },
          method: 'PUT'
        });
        const data = await req.json();
          return data
      };



      const handleNext = () => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) 
        {
          setCurrentQuestionIndex(nextQuestion);
          setSelectedOption(null);
          setIsAnswered(false);
          setTimePerQuestion(0); // Reset the time for the next question
        } 
        else 
        {
          updateGameScore().then(data => {
            console.log(data);
            console.log(isPlaying);
            console.log(timePerQuestion);
            setShowResults(true);
          });
          
        }
      };

        // When time is up
        const handleTimeUp = () => {
            setIsAnswered(true); // Consider the question unattempted if time runs out
            setUnattemptedQuestions(unattemptedQuestions + 1); // Increment the unattempted questions count
            //setTotalTimeSpent(totalTimeSpent);
            handleNext(); // Automatically go to the next question
        };

        // Calculate the percentage score
        const percentage = Math.round((correctAnswers / questions.length) * 100);
        //const averageTimePerQuestion = (totalTimeSpent / questions.length).toFixed(2);

    
        const [playBoop]: any = useSound('/sounds/bgmusic.mp3', {
          onplay: () => setIsPlaying(true),
          onend: () => setIsPlaying(true),
        });


        const uniqueMessages = Array.from(new Set(messages));
        const uniqueClients = Array.from(new Set(clients));       
        //const allPoints:any = uniqueMessages.reduce((r:any, o:any) => (o.points < (r[o.clientId] || {}).points || (r[o.clientId] = o), r), {});
        //console.log(uniqueMessages);
        //console.log(allPoints);
        
        const arrayFiltered:any = [];

        uniqueMessages.forEach((obj:any) => {
            const item = arrayFiltered.find((thisItem:any) => thisItem.clientId === obj.clientId);
            if (item) {
                if (item.points < obj.points) {
                    item.points = obj.points;
                }
                
                return;
            }
            
            arrayFiltered.push(obj);
        });

        let finalData:any = [];
        finalData = arrayFiltered.sort((a:any, b:any) => b.points - a.points);

        
    return (
        <>
        {questions.length > 0 ?
        <>
          {!showResults ? (
          <>
          <div className="mt-3 ml-5">            
              <button onClick={playBoop} className="text-xl text-black text-center
                  content-center place-content-center place-items-center font-bold place-self-end mr-72">
               <span role="img" aria-label="Person with lines near mouth">
                🗣
              </span>
              </button>

            {/* Question Number */}
            <h2 className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl
                 font-semibold text-center mb-4 text-blue-600">
                Question {currentQuestionIndex + 1} of {questions.length}
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 
                          mt-8 content-center place-content-center">
            <div className="bg-custom_blue 
              text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl
            text-white text-center 
              w-64 md:w-4/12 lg:w-3/4 xl:w-3/4 2xl:w-3/4
              h-16 rounded border-white border-4 
              content-center place-content-center place-items-center font-bold 
              place-self-center md:place-self-start lg:place-self-start xl:place-self-start 2xl:place-self-start   
              ml-0 md:ml-72
              ">
            
            {questions[currentQuestionIndex]?.categoryDesc}
            </div>

                {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-2 bg-blue-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>

            
          <div className="bg-custom_purple 
              text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl
            text-white text-center 
              w-44 
              h-16 
              rounded border-white border-4 
              content-center place-content-center place-items-center font-bold 
              place-self-center md:place-self-end 
              mr-0 md:mr-72
              ">
          {/* Timer */}
          <QuestionTimer
            onTimeUp={handleTimeUp}
            setTimePerQuestion={questions[currentQuestionIndex]?.timer}
            isAnswered={isAnswered}
            resetTimer={currentQuestionIndex}
          />
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3
             gap-2 justify-center content-center ml-28 mr-28">
            <div className="bg-white 
            text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl 
          text-black 
            col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2
            text-center rounded-s-3xl rounded-e-3xl border-4 h-48
            justify-center content-center place-content-center place-items-center border-blue-500 m-4">
             {questions[currentQuestionIndex]?.questionDesc}
            </div>

            <div className="bg-white 
            text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl
          text-black 
            row-span-3
            h-44 md:h-auto lg:h-auto xl:h-auto 2xl:h-auto
            text-left
            outline-dashed outline-yellow-500 outline-4 rounded-s-3xl rounded-e-3xl
            m-4
            pt-5
            pl-5
            ">
                  
             <p className="text-blue-600 font-semibold
             text-center justify-center content-center place-content-center place-items-center mb-5">LEADERBOARDS</p>
             
            {finalData.map((item:any, index:any) => (
              <div className="grid grid-cols-2 gap-2 justify-center content-center"
              key={index}>
              <span> {item.nickname}</span>
              {' '}
              <span className="text-orange-600">{item.points}</span>
              </div>
            ))} 

        

            
            </div>

            {/* Options */}
            {questions[currentQuestionIndex]?.answerOptions.map((option:any) => (
              <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl 
                        font-semibold text-black text-center rounded-s-3xl rounded-e-3xl border-4 h-32
                        justify-center content-center place-content-center place-items-center border-white m-4 ${
                isAnswered && option === questions[currentQuestionIndex].answer
                  ? "bg-custom_green text-white"
                  : isAnswered && option === selectedOption
                  ? "bg-custom_pink text-white"
                  : "bg-gray-300 hover:bg-gray-400 focus:bg-gray-400"
              }`}

              >
             {option}
              </button>
            ))}

            

            {/* Next Button */}
            {isAnswered && (
                <button
                onClick={handleNext}
                className="bg-blue-500 text-white text-center 
                text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl
                rounded-s-3xl rounded-e-3xl border-4 h-20 font-semibold hover:bg-blue-600 transition
                justify-center content-center place-content-center place-items-center border-white m-4"
                >
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question"}
                </button>
            )}

        </div>
        <div className="text-sm md:text-md lg:text-lg xl:text-lg 2xl:text-lg
                 place-self-end text-blue-600 mr-36">
                {uniqueClients.map((client:any, index:any) => <p key={index}>{client}</p>)} 
        </div>
         </>
          ) : (
            <Results
              score={points}
              totalQuestions={questions.length}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
              unattemptedQuestions={unattemptedQuestions}
              percentage={percentage}
              //timeSpent={totalTimeSpent}
              //averageTimePerQuestion={averageTimePerQuestion}
            />
          )}
        </>
        : "Loading" }
  
        </>
    );
  }