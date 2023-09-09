import { useState, useCallback, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [length, setLength] = useState(8);
  const [numbersAllowed, setNumbersAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const notify = () =>
    toast.success("🦄 Copied To Clipboard", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const passwordRef = useRef(null);

  // Ensure minimum length of 12
  const minLength = Math.max(12, length);
  
  // Password generator
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numbersAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%*()<>[]{}?,./:;`~'\"";
    
    const randomValues = window.crypto.getRandomValues(new Uint32Array(minLength));

    for (let i = 0; i < minLength; i++) {
      let char = randomValues[i] % str.length;
      pass += str[char];
    }

    setPassword(pass);
  }, [minLength, numbersAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 100);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  const handleCopyPasswordAndNotify = () => {
    notify();
    copyPasswordToClipboard();
  }

  useEffect(() => {
    passwordGenerator();
  }, [length, numbersAllowed, charAllowed, passwordGenerator]);

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-white bg-gray-800">
        <h1 className="p-3 m-3 text-center bg-clip-text text-4xl font-black text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Password Generator
        </h1>
        <div className="flex flex-shadow rounded-lg overflow-hidden mb-4">
          <input
            className="outline-none w-full py-1 px-3 text-black text-2xl font-medium"
            type="text"
            name="password"
            id="password"
            value={password}
            placeholder="password"
            readOnly
            ref={passwordRef}
          />
          <button
            className="outline-none capitalize bg-green-700 hover:bg-green-800 text-white px-3 py-0.5 shrink-0"
            onClick={handleCopyPasswordAndNotify}
          >
            copy
          </button>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
        <div className="flex text-sm gap-x-2">
          <div className="flex items-center gap-x-1">
            <input
              className="cursor-pointer accent-pink-500"
              type="range"
              name="numberRange"
              id="numberRange"
              min={6}
              max={100}
              value={length}
              onChange={(e) => {
                setLength(e.target.value);
              }}
            />
            <label htmlFor="numberRange" className="font-bold py-3 px-3">
              Length: {length}
            </label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              className="accent-pink-500"
              defaultChecked={numbersAllowed}
              id="numberInput"
              onChange={() => {
                setNumbersAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="numberInput" className="font-bold">
              Numbers
            </label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              className="accent-pink-500"
              defaultChecked={charAllowed}
              id="charInput"
              onChange={() => {
                setCharAllowed((prev) => !prev);
              }}
            />
            <label htmlFor="charInput" className="font-bold">
              Characters
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
