import React from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 80
}) => {
  // Generate optimized image URLs for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    // For Pexels images, we can add query parameters for optimization
    if (originalSrc.includes('pexels.com')) {
      const baseUrl = originalSrc.split('?')[0];
      return [
        `${baseUrl}?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop&q=${quality} 400w`,
        `${baseUrl}?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&q=${quality} 800w`,
        `${baseUrl}?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop&q=${quality} 1200w`,
      ].join(', ');
    }
    
    // For other images, return as-is
    return src;
  };

  const generateSizes = () => {
    return '(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px';
  };

  return (
    <img
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={generateSizes()}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
};