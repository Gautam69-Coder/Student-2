import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description, url, type = "website", image = "https://student-2.pages.dev/StudentHubLogo.png", schema }) => {
    const siteName = "Student Hub";
    const fullUrl = `https://student-2.pages.dev${url || ""}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content={siteName} />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:url" content={fullUrl} />

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
