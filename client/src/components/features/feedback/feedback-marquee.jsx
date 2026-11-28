import { Marquee } from "@/components/ui/marquee";

const ReviewCard = ({ rating, comment, name, role, avatarBg }) => {
    return (
        <div className="p-4 rounded-2xl border w-[330px] sm:w-[350px] border-border flex flex-col justify-between space-y-3 bg-background/70 hover:bg-secondary/50 transition-colors">
            <div className="space-y-2">
                <div className="text-amber-500 text-xs font-bold tracking-widest">{rating}</div>
                <p className="text-xs italic text-foreground/90 leading-relaxed">
                    "{comment}"
                </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2.5 border-t border-border">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarBg}`}>
                    {name?.[0] || "S"}
                </div>
                <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">{name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{role}</div>
                </div>
            </div>
        </div>
    );
};

function FeedbackMarquee({ feedbacks = [] }) {
    const rows = feedbacks.length > 0 ? feedbacks : [];

    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden py-4">
            <Marquee pauseOnHover className="[--duration:24s]">
                {rows.map((review) => (
                    <ReviewCard key={review.name} {...review} />
                ))}
            </Marquee>
        </div>
    );
}

export default FeedbackMarquee;
