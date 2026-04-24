import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import blogPosts from '@/data/blog-posts.json';
import { SEO } from '@/components/common/SEO';

export default function BlogPost() {
    const { slug } = useParams();
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-20 px-6">
            <SEO 
                title={`${post.title} | Student Hub`}
                description={post.metaDescription}
                url={`/blog/${post.slug}`}
                type="article"
            />
            
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link 
                        to="/blog" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase tracking-widest text-[10px]"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </motion.div>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <header className="mb-12">
                        <div className="flex items-center gap-4 text-indigo-500 dark:text-indigo-400 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-black uppercase tracking-[0.1em]">
                                <Calendar className="w-3 h-3" /> {post.date}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                            {post.title}
                        </h1>
                    </header>

                    <div 
                        className="prose prose-slate dark:prose-invert max-w-none 
                        prose-h1:text-3xl prose-h1:font-black prose-h1:mb-6
                        prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6
                        prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
                        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-900 dark:prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold hover:scale-105 active:scale-95 transition-all">
                            <Share2 className="w-4 h-4" /> Share Article
                        </button>
                    </div>
                </motion.article>
            </div>
        </div>
    );
}
