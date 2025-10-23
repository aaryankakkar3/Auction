import { PrismaClient } from "../../../../generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const dummyCaptains = [
  {
    name: "Namita Kakkar",
    username: "namitakakkar",
    remainingBudget: parseInt(
      process.env.NEXT_PUBLIC_STARTING_BUDGET || "100000"
    ),
  },
  {
    name: "Aaryan Kakkar",
    username: "aaryankakkar",
    remainingBudget: parseInt(
      process.env.NEXT_PUBLIC_STARTING_BUDGET || "100000"
    ),
  },
  {
    name: "Aashman Kakkar",
    username: "aashmankakkar",
    remainingBudget: parseInt(
      process.env.NEXT_PUBLIC_STARTING_BUDGET || "100000"
    ),
  },
  {
    name: "Amit Kakkar",
    username: "amitkakkar",
    remainingBudget: parseInt(
      process.env.NEXT_PUBLIC_STARTING_BUDGET || "100000"
    ),
  },
];
// Dummy player data extracted from your SQL
const dummyPlayers = [
  // Under 17 Males
  {
    name: "Aaryan Kakkar",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE" as const,
    age: 16,
    preferredHand: "RIGHT" as const,
    bestAchievement: "District Champion",
  },
  {
    name: "Rohan Mehta",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Kabir Sharma",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Vivaan Gupta",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Aditya Singh",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 15,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Semi-Finalist",
  },
  {
    name: "Arjun Iyer",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "State Champion",
  },
  {
    name: "Siddharth Rao",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Dhruv Malhotra",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },

  // Under 17 Females
  {
    name: "Neha Sharma",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 16,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Ananya Gupta",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Isha Mehta",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Sanya Reddy",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Kiara Singh",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 15,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Aarohi Iyer",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 16,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Semi-Finalist",
  },
  {
    name: "Mira Rao",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 14,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Tanya Malhotra",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 15,
    preferredHand: "LEFT",
    bestAchievement: "State Champion",
  },

  // Ages 17-40 Males
  {
    name: "Raghav Kapoor",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 22,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Vivaan Joshi",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 30,
    preferredHand: "LEFT",
    bestAchievement: "National Quarterfinalist",
  },
  {
    name: "Krishna Sharma",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 25,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Arnav Mehta",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Dev Malhotra",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 28,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Shaurya Rao",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 33,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Advik Singh",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 29,
    preferredHand: "RIGHT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Kartik Iyer",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 24,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },

  // Ages 17-40 Females
  {
    name: "Anika Sharma",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 23,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Riya Gupta",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Aarohi Mehta",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 27,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Sanya Malhotra",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 30,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Kiara Singh",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 22,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Isha Rao",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 28,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Neha Kapoor",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 33,
    preferredHand: "RIGHT",
    bestAchievement: "National Champion",
  },
  {
    name: "Aanya Joshi",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 26,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Ages 41-60 Males
  {
    name: "Ramesh Kumar",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 45,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Suresh Singh",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 50,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Vikram Mehta",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 42,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Anil Sharma",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 55,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Rohit Rao",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 48,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Deepak Iyer",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 60,
    preferredHand: "LEFT",
    bestAchievement: "National Runner-up",
  },
  {
    name: "Manish Malhotra",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 53,
    preferredHand: "RIGHT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Rajesh Gupta",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 47,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Ages 41-60 Females
  {
    name: "Sunita Sharma",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 46,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Pooja Mehta",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 50,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Anjali Rao",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 55,
    preferredHand: "RIGHT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Neelam Singh",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 43,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Kavita Gupta",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 48,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Sangeeta Malhotra",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 60,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Rekha Iyer",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 52,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Maya Joshi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 47,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },

  // Over 60 Males
  {
    name: "Ram Kumar",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 65,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Shyam Singh",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 62,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Raghunath Mehta",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 68,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Anand Sharma",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 61,
    preferredHand: "LEFT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Vishal Rao",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 64,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Hari Iyer",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 63,
    preferredHand: "LEFT",
    bestAchievement: "National Quarterfinalist",
  },
  {
    name: "Devendra Malhotra",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 66,
    preferredHand: "RIGHT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Ratan Gupta",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 67,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },

  // Over 60 Females
  {
    name: "Sushma Sharma",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 61,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Kiran Mehta",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 64,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Radha Rao",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 65,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Usha Singh",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 63,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Mala Gupta",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 66,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Leela Malhotra",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 62,
    preferredHand: "LEFT",
    bestAchievement: "National Runner-up",
  },
  {
    name: "Indira Iyer",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 68,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Anita Joshi",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 67,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },

  // Random Extras
  {
    name: "Aryan Kapoor",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 19,
    preferredHand: "RIGHT",
    bestAchievement: "District Champion",
  },
  {
    name: "Tara Mehta",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 27,
    preferredHand: "LEFT",
    bestAchievement: "State Quarterfinalist",
  },
  {
    name: "Veer Sharma",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 41,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Diya Rao",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 35,
    preferredHand: "LEFT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Nikhil Gupta",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 50,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
  {
    name: "Sneha Iyer",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 17,
    preferredHand: "LEFT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Rajat Malhotra",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 62,
    preferredHand: "RIGHT",
    bestAchievement: "National Champion",
  },
  {
    name: "Anika Joshi",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 14,
    preferredHand: "LEFT",
    bestAchievement: "District Runner-up",
  },
  {
    name: "Kabir Singh",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 33,
    preferredHand: "RIGHT",
    bestAchievement: "State Champion",
  },
  {
    name: "Mira Sharma",
    image:
      "https://cdn.britannica.com/01/256401-050-2FD8510B/india-saina-nehwal-during-womens-singles-against-wang-zhiyi-of-china-at-badminton-asia-championships.jpg",
    gender: "FEMALE",
    age: 55,
    preferredHand: "LEFT",
    bestAchievement: "National Semi-Finalist",
  },
  {
    name: "Aditya Rao",
    image:
      "https://assets.superblog.ai/site_cuid_clr6oh1no0006rmr89yhkxgu8/images/professional-badminton-player-use-racquet-hit-shuttle-cock-shuttlecock-badminton-court-1707732139784-compressed.jpg",
    gender: "MALE",
    age: 45,
    preferredHand: "RIGHT",
    bestAchievement: "Inter-School Winner",
  },
  {
    name: "Aarohi Gupta",
    image:
      "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/streams/2012/June/120604/401897-tdy-120604-badmitton-women.jpg",
    gender: "FEMALE",
    age: 29,
    preferredHand: "LEFT",
    bestAchievement: "District Champion",
  },
  {
    name: "Dhruv Iyer",
    image:
      "https://images.hindustantimes.com/img/2024/08/02/1600x900/OLYMPICS-2024-BADMINTON--350_1722617330120_1722617348465.JPG",
    gender: "MALE",
    age: 16,
    preferredHand: "RIGHT",
    bestAchievement: "State Runner-up",
  },
  {
    name: "Kiara Malhotra",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRJgErdvuld8Fs27iH02-fuwzdblTPzZQZ9A&s",
    gender: "FEMALE",
    age: 61,
    preferredHand: "LEFT",
    bestAchievement: "National Champion",
  },
  {
    name: "Rohan Joshi",
    image:
      "https://cdn.freepixel.com/preview/free-photos-asian-male-badminton-player-dressed-in-an-orange-shirt-getting-ready-to-hit-badminton-ball-with-his-preview-1004198678.jpg",
    gender: "MALE",
    age: 38,
    preferredHand: "RIGHT",
    bestAchievement: "District Semi-Finalist",
  },
];

export async function GET() {
  try {
    // Check existing data
    const existingPlayers = await prisma.player.findMany();
    const existingCaptains = await prisma.captain.findMany();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      existingPlayersCount: existingPlayers.length,
      existingCaptainsCount: existingCaptains.length,
      dummyPlayersReady: dummyPlayers.length,
      dummyCaptainsReady: dummyCaptains.length,
      existingPlayers: existingPlayers,
      existingCaptains: existingCaptains,
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    await prisma.$connect();

    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log("Clearing existing data...");
    await prisma.player.deleteMany();
    await prisma.captain.deleteMany();
    console.log("Cleared existing players and captains");

    // Insert captains first
    console.log("Inserting captains...");
    const captainResult = await prisma.captain.createMany({
      data: dummyCaptains,
      skipDuplicates: true,
    });
    console.log(`Inserted ${captainResult.count} captains`);

    // Insert players
    console.log("Inserting players...");
    const playerResult = await prisma.player.createMany({
      data: dummyPlayers as any,
      skipDuplicates: true,
    });
    console.log(`Inserted ${playerResult.count} players`);

    // Get the inserted data to verify
    const allPlayers = await prisma.player.findMany({
      orderBy: { name: "asc" },
    });
    const allCaptains = await prisma.captain.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${captainResult.count} captains and ${playerResult.count} players to the database`,
      insertedCaptains: captainResult.count,
      insertedPlayers: playerResult.count,
      totalCaptains: allCaptains.length,
      totalPlayers: allPlayers.length,
      captains: allCaptains,
      players: allPlayers,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload dummy data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
