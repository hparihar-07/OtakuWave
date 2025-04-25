import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  Image,
  Music,
  Edit,
} from "lucide-react";

const defaultCover =
  "https://img.freepik.com/free-photo/purple-mountain-landscape_1048-10720.jpg?ga=GA1.1.1406304143.1745563632&semt=ais_hybrid&w=740";

const getPathFromUrl = (url) => {
  const parts = url.split("/storage/v1/object/public/");
  return parts[1];
};

const Admin = () => {
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    songFile: null,
    coverFile: null,
    coverUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (!error) setSongs(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const uploadFile = async (file, bucket) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.artist || !formData.songFile) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setIsUploading(true);
    try {
      const audioUrl = await uploadFile(formData.songFile, "songs");

      let coverUrl = formData.coverUrl;
      if (formData.coverFile) {
        coverUrl = await uploadFile(formData.coverFile, "covers");
      }

      const newSong = {
        name: formData.name,
        artist: formData.artist,
        audio_url: audioUrl,
        cover_url: coverUrl || defaultCover,
      };

      if (editingSong) {
        await supabase.from("songs").update(newSong).eq("id", editingSong.id);
        showNotification("Song updated successfully!");
      } else {
        await supabase.from("songs").insert([newSong]);
        showNotification("Song uploaded successfully!");
      }

      setFormData({
        name: "",
        artist: "",
        songFile: null,
        coverFile: null,
        coverUrl: "",
      });
      setEditingSong(null);
      fetchSongs();
    } catch {
      showNotification("Error uploading song. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (song) => {
    setConfirmingDelete(song);
  };

  const performDelete = async (song) => {
    try {
      // Delete audio file from Supabase storage
      if (song.audio_url) {
        const audioPath = getPathFromUrl(song.audio_url);
        const { error: audioError } = await supabase.storage.from("songs").remove([audioPath]);
        if (audioError) throw audioError;
      }

      // Delete cover file from Supabase storage
      if (song.cover_url && song.cover_url !== defaultCover) {
        const coverPath = getPathFromUrl(song.cover_url);
        const { error: coverError } = await supabase.storage.from("covers").remove([coverPath]);
        if (coverError) throw coverError;
      }

      // Delete song record from the database
      const { error: deleteError } = await supabase.from("songs").delete().eq("id", song.id);
      if (deleteError) throw deleteError;

      showNotification("Song deleted successfully.");
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
      showNotification("Error deleting song.", "error");
    } finally {
      setConfirmingDelete(null);
    }
  };

  const handleEdit = (song) => {
    setFormData({
      name: song.name,
      artist: song.artist,
      coverUrl: song.cover_url,
    });
    setEditingSong(song);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-8 lg:px-10">
      <h1 className="text-4xl font-extrabold text-[#FF00FF] mb-8 neon-text text-center">
        Admin Panel
      </h1>

      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl flex items-center space-x-2 ${
            notification.type === "success" ? "bg-[#32CD32]" : "bg-[#FF6347]"
          } text-white`}
        >
          {notification.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <p>{notification.message}</p>
        </div>
      )}

      {confirmingDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#222] p-6 rounded-lg text-white shadow-xl max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete "{confirmingDelete.name}"?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  performDelete(confirmingDelete);
                  setConfirmingDelete(null);
                }}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmingDelete(null)}
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#222222] rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-[#FF00FF]">
          <Upload className="mr-2 text-[#FF00FF]" />
          {editingSong ? "Edit Song" : "Upload New Song"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-4 rounded-md bg-[#333333] text-white"
            placeholder="Song Title *"
            required
          />
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            className="w-full p-4 rounded-md bg-[#333333] text-white"
            placeholder="Artist Name *"
            required
          />
          <label className="flex items-center justify-center gap-4 border-2 border-dashed border-[#FF00FF] rounded-xl bg-[#333333] text-white p-6 cursor-pointer hover:bg-[#444444]">
            <Music />
            <span>{formData.songFile ? formData.songFile.name : "Upload Song File *"}</span>
            <input type="file" name="songFile" accept="audio/*" onChange={handleFileChange} className="hidden" required />
          </label>
          <label className="flex items-center justify-center gap-4 border-2 border-dashed border-[#FF00FF] rounded-xl bg-[#333333] text-white p-6 cursor-pointer hover:bg-[#444444]">
            <Image />
            <span>{formData.coverFile ? formData.coverFile.name : "Upload Cover Art (Optional)"}</span>
            <input type="file" name="coverFile" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <input
            type="url"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleInputChange}
            className="w-full p-4 rounded-md bg-[#333333] text-white"
            placeholder="Cover Image URL (optional)"
          />
          <button type="submit" disabled={isUploading} className="w-full bg-[#FF00FF] py-3 rounded-lg hover:bg-[#FF3bff]">
            {isUploading ? "Uploading..." : editingSong ? "Save Changes" : "Upload Song"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#FF00FF]">Uploaded Songs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div key={song.id} className="bg-[#333333] rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img src={song.cover_url || defaultCover} alt={song.name} className="w-full h-70 object-cover" />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button onClick={() => handleEdit(song)} className="bg-[#FF00FF] p-2 rounded-full hover:bg-[#FF3bff]">
                    <Edit className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={() => handleDelete(song)} className="bg-[#FF6347] p-2 rounded-full hover:bg-red-600">
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{song.name}</h3>
                <p className="text-sm truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
