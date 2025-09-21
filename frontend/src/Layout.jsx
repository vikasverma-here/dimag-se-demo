// import React, { useState } from 'react'
// import AiGirlFriend from './Components/AiGirlFriend'
// import TradeChart from './Components/TradeChart'


// const componentList = [
//   { id: 1, label: "AI Girlfriend", element: <AiGirlFriend /> },
//   {id:2,lable : "trade chart" ,tradeChart:<TradeChart/>}
// ]

// const Layout = () => {
//   const [active, setActive] = useState(null)

//   return (
//     <div>
//       <h1>Layout</h1>
//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         {componentList.map((comp) => (
//           <button key={comp.id} onClick={() => setActive(comp.id)}>
//             {comp.label}
//           </button>
//         ))}
//       </div>

//       <div>
//         {componentList.find((c) => c.id === active)?.element || (
//           <h3>Please select a component</h3>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Layout


import React, { useState } from 'react'
import AiGirlFriend from './Components/AiGirlFriend'
import TradeChart from './Components/TradeChart'
// import Uis from './Components/Uis'
import UniVersalCountdown from './Components/UniVersalCountdown'
import PaypalFee from './Components/PaypalFee'

const componentList = [
  { id: 1, label: "AI Girlfriend", element: <AiGirlFriend /> },
  { id: 2, label: "Trade Chart", element: <TradeChart /> },
  // { id: 3, label: "React Mini Components", element: <Uis/> },
  { id: 4, label: "CalculateCountDown", element: <UniVersalCountdown/> },
  { id: 5, label: "PayPal Fee Strucutre", element: <PaypalFee/> }
]

const Layout = () => {
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white ">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Dynamic Layout</h1> */}

      <div className="flex justify-center gap-4 mb-8">
        {componentList.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setActive(comp.id)}
            className={`px-6 py-2 rounded-xl mt-3 font-medium transition-all duration-300 
              ${active === comp.id 
                ? "bg-blue-600 text-white shadow-lg scale-105" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            {comp.label}
          </button>
        ))}
      </div>

      <div className="max-full mx-auto  rounded-xl bg-gray-800 shadow-lg">
        {componentList.find((c) => c.id === active)?.element || (
          <h3 className="text-center text-gray-400 text-lg">
            Please select a component
          </h3>
        )}
      </div>
    </div>
  )
}

export default Layout
