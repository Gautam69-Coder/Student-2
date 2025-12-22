// sitemap-builder.js
import { Sitemap } from 'react-router-sitemap';
import router from './src/Routes'; // your React Router setup

function generateSitemap() {
  return (
    new Sitemap(router)
      .build('https://student-2.pages.dev')
      .save('./public/sitemap.xml')
  );
}

generateSitemap();
