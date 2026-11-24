import { imgUrl } from "../api/axios";

export default function Avatar({ user, size = 36 }) {
  const style = { width: size, height: size, fontSize: size * 0.45 };
  if (user?.profileImage) {
    return (
      <img src={imgUrl(user.profileImage)} alt={user.name} style={style} className="rounded-full object-cover" />
    );
  }
  return (
    <div style={style} className="flex items-center justify-center rounded-full bg-accent font-bold text-white">
      {(user?.name || "?")[0].toUpperCase()}
    </div>
  );
}
