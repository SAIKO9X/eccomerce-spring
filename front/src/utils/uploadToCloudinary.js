export const uploadToCloudinary = async (pics) => {
  const cloud_name = "dp9vamejk";
  const upload_preset = "ecommerce";

  if (pics) {
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const fileDate = await res.json();
    return fileDate.url;
  } else {
    console.log("erro : pics is not defined");
  }
};
