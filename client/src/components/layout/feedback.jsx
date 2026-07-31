import { cn } from "@/lib/utils"
import { Marquee } from "/components/ui/marquee"



const ReviewCard = ({
  rating,
  comment,
  name,
  role,
  avatarBg
}) => {
  return (
    <div
      className="p-4 rounded-xl border w-[350px]   border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/60 hover:bg-slate-50 transition-all shadow-2xs"
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
    </div>
  )
}

function Feedback({ feedbacks }) {

  const firstRow = feedbacks.slice(feedbacks.length / 2)

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

export default Feedback
