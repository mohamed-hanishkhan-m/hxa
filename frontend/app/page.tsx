// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f5f5dc] text-center">
//       <div>
//         <h1 className="text-4xl font-bold text-gray-800">🛠️ We're Getting Dressed Up</h1>
//         <p className="text-lg mt-4 text-gray-600">HxA is under maintenance. Launching soon.</p>
//       </div>
//     </div>
//   );
// }

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}