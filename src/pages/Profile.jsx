import { useState } from "react";
import api, { errMsg } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import Alert from "../components/Alert";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    village: user.address?.village || "",
    city: user.address?.city || "",
    state: user.address?.state || "",
    pincode: user.address?.pincode || "",
  });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState({ type: "success", text: "" });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const ok = (text) => setMsg({ type: "success", text });
  const fail = (e) => setMsg({ type: "error", text: errMsg(e) });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { name, phone, ...address } = form;
      const { data } = await api.put("/auth/me", { name, phone, address });
      setUser(data.user);
      ok("Profile updated");
    } catch (err) {
      fail(err);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await api.put("/auth/me/image", fd);
      setUser({ ...user, profileImage: data.profileImage });
      ok("Profile photo updated");
    } catch (err) {
      fail(err);
    }
    e.target.value = "";
  };

  const removeImage = async () => {
    try {
      await api.delete("/auth/me/image");
      setUser({ ...user, profileImage: "" });
      ok("Profile photo removed");
    } catch (err) {
      fail(err);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/me/password", pw);
      setPw({ currentPassword: "", newPassword: "" });
      ok("Password changed");
    } catch (err) {
      fail(err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">My profile</h1>
      <Alert type={msg.type}>{msg.text}</Alert>

      <div className="card flex flex-wrap items-center gap-4 p-5">
        <Avatar user={user} size={80} />
        <div className="flex-1">
          <p className="text-lg font-bold">{user.name}</p>
          <p className="text-sm text-muted">{user.email} · {user.role}</p>
          <div className="mt-3 flex gap-2">
            <label className="btn btn-outline btn-sm cursor-pointer">
              Change photo
              <input type="file" hidden accept="image/png,image/jpeg,image/webp" onChange={uploadImage} />
            </label>
            {user.profileImage && (
              <button className="btn btn-danger btn-sm" onClick={removeImage}>Remove</button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="card grid gap-3 p-5 sm:grid-cols-2">
        <h2 className="font-bold sm:col-span-2">Details</h2>
        {[
          ["name", "Name"],
          ["phone", "Phone"],
          ["village", "Village / Area"],
          ["city", "City"],
          ["state", "State"],
          ["pincode", "Pincode"],
        ].map(([k, label]) => (
          <div key={k}>
            <label className="label">{label}</label>
            <input className="input" value={form[k]} onChange={set(k)} required={k === "name"} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <button className="btn btn-primary">Save changes</button>
        </div>
      </form>

      <form onSubmit={changePassword} className="card grid gap-3 p-5 sm:grid-cols-2">
        <h2 className="font-bold sm:col-span-2">Change password</h2>
        <div>
          <label className="label">Current password</label>
          <input className="input" type="password" required value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </div>
        <div>
          <label className="label">New password</label>
          <input className="input" type="password" minLength={6} required value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <button className="btn btn-outline">Update password</button>
        </div>
      </form>
    </div>
  );
}
