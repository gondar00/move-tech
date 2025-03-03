const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["spoonacular.com", "img.spoonacular.com"],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
