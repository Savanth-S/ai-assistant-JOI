const API =
  "http://localhost:5000/api/files";

export const uploadFile =
  async (
    token,
    file
  ) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const res = await fetch(
      `${API}/upload`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: formData,
      }
    );

    return res.json();
  };