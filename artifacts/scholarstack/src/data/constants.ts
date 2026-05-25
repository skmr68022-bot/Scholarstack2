
export const examTags = ["UPSC","NEET","JEE","CAT","SSC","GATE","CUET","Banking","State PSC","Defence"];

export interface Note {
  id: number;
  title: string;
  scholar: string;
  price: string;
  original: string;
  rating: number;
  reviews: number;
  tag: string;
  exam: string;
  pages: number;
  color: string;
}

export interface Scholar {
  name: string;
  tag: string;
  avatar: string;
  bg: string;
  rating: number;
  students: string;
  verified: boolean;
}

export interface Reel {
  id: number;
  title: string;
  scholar: string;
  avatar: string;
  bg: string;
  exam: string;
  likes: string;
  comments: string;
  saves: string;
  premium: boolean;
}

export const notes: Note[] = [
  { id:1, title:"UPSC Polity Complete Notes 2025", scholar:"Dr. Rajiv Menon", price:"₹299", original:"₹799", rating:4.9, reviews:12400, tag:"Bestseller", exam:"UPSC", pages:324, color:"bg-orange-500" },
  { id:2, title:"NEET Biology Master Notes", scholar:"Priya Sharma", price:"₹249", original:"₹599", rating:4.9, reviews:8200, tag:"Top Rated", exam:"NEET", pages:210, color:"bg-green-500" },
  { id:3, title:"JEE Math Shortcut Tricks", scholar:"Karan Mehta", price:"₹199", original:"₹499", rating:4.8, reviews:6100, tag:"Trending", exam:"JEE", pages:180, color:"bg-blue-500" },
  { id:4, title:"SSC CGL Math Tricks", scholar:"Rahul Verma", price:"Free", original:"", rating:4.7, reviews:19400, tag:"Free", exam:"SSC", pages:90, color:"bg-yellow-500" },
  { id:5, title:"CAT Verbal Ability Notes", scholar:"MBA Guru", price:"₹399", original:"₹999", rating:4.6, reviews:3200, tag:"New", exam:"CAT", pages:150, color:"bg-purple-500" },
  { id:6, title:"GATE ECE Full Syllabus", scholar:"Rohit Singh", price:"₹349", original:"₹899", rating:4.8, reviews:4100, tag:"Complete", exam:"GATE", pages:280, color:"bg-cyan-500" },
  { id:7, title:"UPSC Modern History Notes", scholar:"Dr. Rajiv Menon", price:"₹199", original:"₹499", rating:4.7, reviews:7800, tag:"Popular", exam:"UPSC", pages:180, color:"bg-orange-400" },
  { id:8, title:"NEET Chemistry Formulas", scholar:"Priya Sharma", price:"₹149", original:"₹399", rating:4.8, reviews:5600, tag:"Quick Ref", exam:"NEET", pages:90, color:"bg-green-400" },
  { id:9, title:"JEE Physics Formula Sheet", scholar:"Karan Mehta", price:"Free", original:"", rating:4.9, reviews:22000, tag:"Free", exam:"JEE", pages:60, color:"bg-blue-400" },
];

export const scholars: Scholar[] = [
  { name:"Dr. Rajiv Menon", tag:"IAS AIR 7 · UPSC", avatar:"RM", bg:"from-orange-400 to-red-500", rating:4.9, students:"48K", verified:true },
  { name:"Priya Sharma", tag:"NEET 720/720", avatar:"PS", bg:"from-pink-400 to-rose-500", rating:4.8, students:"62K", verified:true },
  { name:"Karan Mehta", tag:"IIT Bombay · JEE", avatar:"KM", bg:"from-blue-400 to-indigo-500", rating:4.9, students:"35K", verified:true },
  { name:"MBA Guru", tag:"CAT 99.8%ile", avatar:"MG", bg:"from-purple-400 to-violet-500", rating:4.7, students:"29K", verified:true },
];

export const reels: Reel[] = [
  { id:1, title:"Preamble in 60 Seconds", scholar:"Dr. Rajiv Menon", avatar:"RM", bg:"from-orange-400 to-red-500", exam:"UPSC", likes:"24.8K", comments:"1.2K", saves:"8.9K", premium:false },
  { id:2, title:"Mitosis vs Meiosis", scholar:"Priya Sharma", avatar:"PS", bg:"from-pink-400 to-rose-500", exam:"NEET", likes:"41.2K", comments:"3.4K", saves:"18.2K", premium:false },
  { id:3, title:"Integration by Parts", scholar:"Karan Mehta", avatar:"KM", bg:"from-blue-400 to-indigo-500", exam:"JEE", likes:"18.6K", comments:"940", saves:"12.4K", premium:true },
];
