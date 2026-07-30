import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, CreditCard, ShieldCheck, HelpCircle, Loader2, ArrowRight, Star } from "lucide-react";
import { DashboardLayout } from "@/components/layout/layout";
import { SEO } from "@/components/common/SEO";
import { useData } from "@/context/DataContext";
import { userProfileUpdate } from "@/Api/api";
import { useNavigate } from "react-router-dom";

export function Upgrade() {
    const { user, setUser } = useData();
    const navigate = useNavigate();
    
    const [selectedPlan, setSelectedPlan] = useState(null); // 'pro' or 'lifetime'
    const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'upi'
    const [upiId, setUpiId] = useState("");
    const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState("");

    const currentTier = user?.subscription || "free";

    const plans = [
        {
            id: "free",
            name: "Basic / Free",
            price: "₹0",
            period: "forever",
            desc: "Essential features for everyday study needs.",
            features: [
                "Standard Lecture Notes (view-only)",
                "Read Community discussions",
                "Basic Practical sheet viewing",
                "5 AI Tutor queries per day",
            ],
            cta: "Current Plan",
            color: "border-slate-200",
            buttonStyle: "bg-slate-100 text-slate-500 cursor-not-allowed",
            disabled: true
        },
        {
            id: "pro",
            name: "Student Pro",
            price: "₹199",
            period: "month",
            desc: "Perfect for active students wanting maximum flexibility.",
            features: [
                "Unlimited PDF Note downloads",
                "Full access to all Practical Sheets",
                "Create discussions in Community",
                "Unlimited AI explanations & Code help",
                "Ad-free premium experience",
            ],
            cta: currentTier === "pro" ? "Active Plan" : currentTier === "lifetime" ? "Downgrade" : "Upgrade to Pro",
            color: "border-indigo-500 ring-2 ring-indigo-100",
            buttonStyle: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100",
            recommended: true,
            disabled: currentTier === "pro" || currentTier === "lifetime"
        },
        {
            id: "lifetime",
            name: "Lifetime Elite",
            price: "₹999",
            period: "one-time",
            desc: "Ultimate lifetime access. Save resources forever.",
            features: [
                "Everything in Student Pro",
                "Early access to MU exam tracks",
                "Direct email support from academic tutors",
                "Exclusive downloadable PDF exam packages",
                "Premium 'Elite' badge on profile",
            ],
            cta: currentTier === "lifetime" ? "Active Plan" : "Get Lifetime Access",
            color: "border-purple-500 shadow-lg shadow-purple-50",
            buttonStyle: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-100",
            disabled: currentTier === "lifetime"
        }
    ];

    const handleSelectPlan = (plan) => {
        if (plan.disabled) return;
        setSelectedPlan(plan);
        setError("");
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (paymentMethod === "upi" && !upiId.trim()) {
            setError("Please enter your UPI ID.");
            return;
        }
        if (paymentMethod === "card") {
            if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
                setError("Please fill in all credit card details.");
                return;
            }
        }

        setIsPaying(true);
        
        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                // Call backend API to update profile tier
                const updateRes = await userProfileUpdate({ subscription: selectedPlan.id });
                if (updateRes.data?.type === "success" || updateRes.status === 200) {
                    // Update frontend React Context
                    setUser(prev => ({
                        ...prev,
                        subscription: selectedPlan.id
                    }));
                    setPaymentSuccess(true);
                } else {
                    setError("Database update failed. Please try again.");
                }
            } catch (err) {
                console.error("Subscription update error:", err);
                setError("Payment simulation succeeded, but updating your tier failed. Try again.");
            } finally {
                setIsPaying(false);
            }
        }, 2500);
    };

    const handleSuccessClose = () => {
        setPaymentSuccess(false);
        setSelectedPlan(null);
        navigate("/dashboard");
    };

    return (
        <DashboardLayout>
            <SEO
                title="Upgrade to Pro — Premium Access | Student Hub"
                description="Subscribe to Student Hub Pro or Lifetime Elite to unlock unlimited MU notes, practical sheets, and AI code assistance."
                url="/dashboard/upgrade"
            />
            <div className="space-y-8 max-w-6xl mx-auto py-4">
                
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                        <Star size={13} className="fill-current animate-spin-slow" />
                        <span>Student Hub Premium</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Power Up Your Studies
                    </h1>
                    <p className="max-w-xl mx-auto text-sm text-slate-500 leading-relaxed">
                        Get instant access to verified Mumbai University IT notes, solved practical sheets, and unlimited AI assistant features.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between relative transition-all duration-300 ${
                                plan.color
                            } ${plan.recommended ? "scale-102 shadow-md md:-translate-y-2 border-2" : "shadow-xs"}`}
                        >
                            {plan.recommended && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-sm">
                                    Most Popular
                                </span>
                            )}
                            
                            <div>
                                {/* Plan Header */}
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-lg text-slate-900">{plan.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{plan.desc}</p>
                                </div>

                                {/* Plan Price */}
                                <div className="my-6 flex items-baseline">
                                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                                    <span className="text-xs text-slate-400 font-bold ml-1.5">/ {plan.period}</span>
                                </div>

                                <hr className="border-slate-100 my-4" />

                                {/* Features List */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                                            <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                                                <Check size={11} className="stroke-[3px]" />
                                            </div>
                                            <span className="font-medium leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Plan Action Button */}
                            <div className="mt-8">
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={plan.disabled}
                                    className={`w-full py-3 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 ${
                                        plan.buttonStyle
                                    } ${plan.disabled ? "" : "cursor-pointer"}`}
                                >
                                    <span>{plan.cta}</span>
                                    {!plan.disabled && <ArrowRight size={13} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-semibold border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span>Secure SSL Checkout</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HelpCircle size={16} className="text-indigo-500" />
                        <span>24/7 Academic Support</span>
                    </div>
                </div>

                {/* Mock Payment Checkout Modal */}
                <AnimatePresence>
                    {selectedPlan && !paymentSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
                            onClick={() => setSelectedPlan(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 15 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 15 }}
                                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                    <div>
                                        <h3 className="font-extrabold text-base text-slate-900">Checkout Portal</h3>
                                        <p className="text-xs text-slate-400 font-medium">Plan: {selectedPlan.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900">{selectedPlan.price}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedPlan.period}</p>
                                    </div>
                                </div>

                                {/* Simulated Payment Method Selector */}
                                <div className="my-5 space-y-4">
                                    <p className="text-xs font-bold text-slate-800">Select payment simulation mode:</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentMethod("card"); setError(""); }}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                                                paymentMethod === "card"
                                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            <CreditCard size={16} />
                                            <span>Mock Card</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setPaymentMethod("upi"); setError(""); }}
                                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                                                paymentMethod === "upi"
                                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            <Sparkles size={16} />
                                            <span>Simulate UPI</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Form */}
                                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                    {paymentMethod === "card" ? (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Card Number</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={19}
                                                    value={cardDetails.number}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                                                    placeholder="4111 2222 3333 4444"
                                                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={5}
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                        placeholder="MM/YY"
                                                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-center"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">CVV Code</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        maxLength={3}
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                        placeholder="•••"
                                                        className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800 text-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">UPI Address (ID)</label>
                                            <input
                                                type="text"
                                                required
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="username@upi"
                                                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <p className="text-[11px] text-red-500 font-bold bg-red-50 border border-red-100 p-2.5 rounded-xl flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5 shrink-0" />
                                            {error}
                                        </p>
                                    )}

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPlan(null)}
                                            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isPaying}
                                            className="flex-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
                                        >
                                            {isPaying ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldCheck size={14} />
                                                    Pay Simulation
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Celebratory Success Modal */}
                <AnimatePresence>
                    {paymentSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 30 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 30 }}
                                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 w-full max-w-sm text-center space-y-6"
                            >
                                {/* Animated Check Circle */}
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                                    <Check size={32} className="stroke-[3px]" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-black text-xl text-slate-900">Upgrade Successful!</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                        Congratulations! You are now subscribed to the <span className="text-indigo-600 font-bold capitalize">{selectedPlan?.name}</span> plan. Unlock unlimited notes, downloads, and AI features immediately!
                                    </p>
                                </div>

                                <button
                                    onClick={handleSuccessClose}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all active:scale-[0.98] shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <span>Continue to Dashboard</span>
                                    <ArrowRight size={13} />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}

// Inline info helper to resolve undefined warning
function Info({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}
