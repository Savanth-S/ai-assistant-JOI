import {
  Paperclip,
} from "lucide-react";

function FileUpload({
  onFileSelect,
}) {

  const handleChange =
    (e) => {

      const file =
        e.target.files[0];

      if (file) {

        onFileSelect(file);
      }
    };

  return (

    <label className="file-upload-btn">

      <Paperclip size={20} />

      <input
        type="file"
        hidden
        onChange={handleChange}
      />

    </label>
  );
}

export default FileUpload;