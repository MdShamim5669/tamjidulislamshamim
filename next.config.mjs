const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isVercel = Boolean(process.env.VERCEL);
const repoName = 'Premium-Portfoilo-Client';

const nextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
        images: {
          unoptimized: true,
          remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'animated-portfolio-server-production.up.railway.app' },
          ],
        },
      }
    : !isVercel
    ? {
        output: 'export',
        trailingSlash: true,
        images: {
          unoptimized: true,
          remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'animated-portfolio-server-production.up.railway.app' },
          ],
        },
      }
    : {
        images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'animated-portfolio-server-production.up.railway.app' },
          ],
        },
      }),
};

export default nextConfig;
