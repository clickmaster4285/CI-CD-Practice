"use client"; // Add this at the top for client components

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  // ===== TRAP 1: Environment Variable Missing in Production =====
  // This will be available in GitHub Actions but missing in production
  const apiKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  
  // ===== TRAP 2: Production-Only Crash on Mount =====
  useEffect(() => {
    console.log("Current environment:", process.env.NODE_ENV);
    
    // This check makes it pass in CI but fail in production
    if (process.env.NODE_ENV === 'production') {
      // This line will cause an error in production
      // It tries to access a property of undefined
      const crashHere = undefined.property.access;
      
      // If the above doesn't crash, this infinite loop will
      while(true) {
        console.log("🔥 PRODUCTION IS BURNING 🔥");
        // No break condition = infinite loop
      }
    }
  }, []);

  // ===== TRAP 3: API Call That Works in CI but Fails in Production =====
  const fetchData = async () => {
    try {
      // This URL exists in CI/CD pipeline but not in production
      const response = await fetch('http://localhost:3000/api/mock-endpoint');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.log("API call failed:", error);
      
      // This will throw in production but pass in CI
      if (process.env.NODE_ENV === 'production') {
        throw new Error("🚨 PRODUCTION API FAILURE 🚨");
      }
    }
  };

  // ===== TRAP 4: Memory Leak Only in Production =====
  const startMemoryLeak = () => {
    if (process.env.NODE_ENV === 'production') {
      const leakArray = [];
      setInterval(() => {
        // Continuously adding to array without clearing
        leakArray.push(new Array(1000000).fill("💣 MEMORY LEAK 💣"));
        console.log("Memory usage increasing:", leakArray.length);
      }, 1000);
    }
  };

  // ===== TRAP 5: Recursive Function with No Base Case =====
  const recursiveCrash = () => {
    if (process.env.NODE_ENV === 'production') {
      // No base case = infinite recursion
      console.log("💥 CRASHING...");
      return recursiveCrash();
    }
  };

  // ===== TRAP 6: Access Browser API in Production =====
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // This will fail if window is undefined (server-side)
      window.localStorage.setItem('crash', 'now');
      
      // Access non-existent browser feature
      navigator.usb.getDevices(); // May not be available
      
      // Start memory leak
      startMemoryLeak();
    }
  }, []);

  // ===== TRAP 7: Production-Only Click Handler =====
  const handleDangerousClick = () => {
    setClickCount(clickCount + 1);
    
    if (process.env.NODE_ENV === 'production') {
      if (clickCount > 3) {
        // This will cause a runtime error
        JSON.parse("{invalid json}");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold">
            {/* Different text in different environments */}
            {process.env.NODE_ENV === 'production' 
              ? '🔥 WILL CRASH IN PRODUCTION 🔥' 
              : '✅ PASSING IN TESTS ✅'}
          </h1>
          
          <p className="text-gray-600">
            API Key status: {apiKey ? '✅ Present' : '❌ Missing'}
          </p>
          
          <p className="text-gray-600">
            Environment: {process.env.NODE_ENV}
          </p>
          
          {/* Buttons that cause crashes in production */}
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Call API {process.env.NODE_ENV === 'production' && '💣'}
            </button>
            
            <button
              onClick={recursiveCrash}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Crash Recursive {process.env.NODE_ENV === 'production' && '💣'}
            </button>
            
            <button
              onClick={handleDangerousClick}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Click {clickCount} times {process.env.NODE_ENV === 'production' && '💣'}
            </button>
          </div>
          
          {/* Display fetched data */}
          {data && (
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
        
        <div className="flex gap-4">
          <a
            className="px-4 py-2 bg-black text-white rounded"
            href="https://vercel.com/new"
            target="_blank"
          >
            Deploy Now
          </a>
        </div>

        {/* ===== TRAP 8: Hidden Script Tag in Production ===== */}
        {process.env.NODE_ENV === 'production' && (
          <div dangerouslySetInnerHTML={{
            __html: `
              <script>
                // This runs only in production
                console.log("💀 HIDDEN PRODUCTION SCRIPT 💀");
                
                // Infinite loop in background
                setInterval(() => {
                  // Crash the page
                  document.body.innerHTML = '';
                }, 5000);
              </script>
            `
          }} />
        )}
      </main>
    </div>
  );
}