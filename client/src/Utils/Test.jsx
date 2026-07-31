import { cn } from "@/lib/utils"
import { Marquee } from "../../components/ui/marquee"

const reviews = [
  {
    name: "Aarav Sharma",
    role: "Computer Engineering (3rd Year)",
    rating: "★★★★★",
    comment: "Student Hub's 50+ built-in practice questions helped me clear my DSA technical rounds. The online Monaco editor with test cases feels just like LeetCode!",
    avatarBg: "bg-indigo-100 text-indigo-700 border border-indigo-200/60"
  },
  {
    name: "Priya Mehta",
    role: "Information Technology (2nd Year)",
    rating: "★★★★★",
    comment: "The AI Assistant combined with practical solution codes is a lifesaver during exams. Having C++, Python, and Java tracks pre-loaded makes practicing super easy.",
    avatarBg: "bg-purple-100 text-purple-700 border border-purple-200/60"
  },
  {
    name: "Rahul Kadam",
    role: "B.Tech CSE Student",
    rating: "★★★★★",
    comment: "Clean UI, instant access to notes & PYQs without annoying popups. The community discussion and coding tracks are the best features of this platform!",
    avatarBg: "bg-amber-100 text-amber-800 border border-amber-200/60"
  }
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  rating,
  comment,
  name,
  role,
  avatarBg
}) => {
  return (
    <figure
      className="p-4 rounded-xl border    border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/60 hover:bg-slate-50 transition-all shadow-2xs"
    >
      <div className="space-y-2">
        <div className="text-amber-500 text-xs font-black tracking-widest">{rating}</div>
        <p className="text-xs italic text-slate-700 leading-relaxed font-medium">
          "{comment}"
        </p>
      </div>
      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/70">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs ${avatarBg}`}>
          {name[0]}
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">{name}</div>
          <div className="text-[10px] font-medium text-slate-500">{role}</div>
        </div>
      </div>
    </figure>
  )
}

function MarqueeDemo() {
  return (
    <div className="relative flex  flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s] ">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
    </div>
  )
}

export default MarqueeDemo
