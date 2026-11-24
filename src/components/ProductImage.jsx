import { imgUrl } from "../api/axios";

export default function ProductImage({ src, alt = "", className = "" }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-surface2 text-4xl ${className}`}>🌾</div>
    );
  }
  return <img src={imgUrl(src)} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
