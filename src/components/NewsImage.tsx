"use client";

import { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";

interface NewsImageProps {
  articleUrl: string;
  alt: string;
}

export default function NewsImage({ articleUrl, alt }: NewsImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Google News 리다이렉트 URL은 og:image 추출이 안 되므로 스킵
    if (articleUrl.includes("news.google.com/rss/articles")) {
      setLoading(false);
      return;
    }

    fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) {
          setImageUrl(data.image);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleUrl]);

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
    );
  }

  if (!imageUrl || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-lg">
        <Newspaper className="w-6 h-6 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="w-full h-full object-cover rounded-lg"
      onError={() => setError(true)}
    />
  );
}
