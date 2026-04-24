import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookText } from 'lucide-react';
import blogPosts from '@/data/blog-posts.json';
import { SEO } from '@/components/common/SEO';

const BlogCard = ({ post, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass-card rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-300 group h-full flex flex-col"
    >
        <div className="flex items-center gap-3 text-indigo-500 dark:text-indigo-400 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{post.date}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">
            {post.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">
            {post.excerpt}
        </p>
        <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:gap-3 transition-all"
        >
            Read More <ArrowRight className="w-4 h-4" />
        </Link>
    </motion.div>
);

export default function BlogList() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
            <SEO 
                title="Student Hub Blog — IT Study Tips & Resources"
                description="Stay updated with the latest study tips, Mumbai student resources, and MERN stack practical guides on the Student Hub blog."
                url="/blog"
            />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-6"
                    >
                        <BookText className="w-4 h-4" /> The Knowledge Hub
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Resources, Tips & <br />
                        <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent italic">Latest Updates</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <BlogCard key={post.slug} post={post} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
