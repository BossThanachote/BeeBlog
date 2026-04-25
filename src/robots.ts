import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',  
        '/login/',    
        '/api/',      
      ],
    },
    sitemap: 'https://bee-blog-8cww.vercel.app/sitemap.xml',
  }
}