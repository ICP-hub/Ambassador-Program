import React, { useEffect, useState } from 'react';
import { idlFactory } from '../../../declarations/ICP_Ambassador_Program_backend';
import { Actor, HttpAgent } from '@dfinity/agent';

const UploadProfileImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [imageId, setImageId] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({
    title: "",
    name: "",
    content: null,
    contentType: ""
  });

  const isLocalEnv = process.env.NODE_ENV === "development";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Capture metadata from the file
    setImageMetadata({
      title: file.name.split(".")[0], // Use filename (without extension) as title
      name: file.name,
      contentType: file.type,
      content: null, // Content will be set in handleUpload
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      setMessage("Uploading...");

      // Convert file to Uint8Array for content
      const fileContent = await fileToUint8Array(selectedFile);
      setImageMetadata((prevMetadata) => ({
        ...prevMetadata,
        content: fileContent,
      }));

      // Set up the data for backend call
      const profileImageData = {
        image_title: imageMetadata.title,
        name: imageMetadata.name,
        content: [fileContent], // This is the field expected by the backend
        content_type: imageMetadata.contentType // Ensure this matches backend expectations
      };
      
      const agent = new HttpAgent();
      if (isLocalEnv) {
        await agent.fetchRootKey();
      }

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND || "be2us-64aaa-aaaaa-qaabq-cai",
      });

      const assetCanisterId = "br5f7-7uaaa-aaaaa-qaaca-cai";
      const response = await actor.upload_profile_image(assetCanisterId, profileImageData);
      console.log(response)
      if (response.Ok) {
        setMessage(`Success: Image ID - ${response.Ok}`);
        setImageId(response.Ok);
      } else {
        setMessage(`Error: ${response.Err}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(`Upload failed: ${error.message}`);
    }
  };

  const handleGetImageId = async () => {
    try {
      setMessage("Retrieving image metadata...");
      const agent = new HttpAgent();
      if (isLocalEnv) {
        await agent.fetchRootKey();
      }

      

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND || "be2us-64aaa-aaaaa-qaabq-cai",
      });

      const response = await actor.get_profile_image_id();
      console.log("resp",response);
      
      if (response) {
        setImageId(response);
        setImageMetadata({
          title: response.image_title,
          name: response.name,
          contentType: response.content_type,
          content: response.content
        });
        setMessage(`Retrieved Image Metadata for ID: ${response.id}`);
      } else {
        setMessage("No image metadata found for this user.");
      }
    } catch (error) {
      console.error("Failed to retrieve image metadata:", error);
      setMessage(`Error retrieving image metadata: ${error.message}`);
    }
  };

  const fileToUint8Array = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = (error) => reject(error);
    });

    useEffect(()=>{
      const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
      const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
      console.log("imageId is : ",imageId );
      const profileImageUrl = `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${4}`;
      console.log(profileImageUrl);
      setFileURL(profileImageUrl);
    },[imageId])
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2>Upload Profile Image</h2>
      <input type="file" accept="image/png" onChange={handleFileChange} />
      <button style={{backgroundColor:'red',marginLeft:'30px'}} onClick={handleUpload}>Submit</button>
      <button onClick={handleGetImageId}>Get Image Metadata</button>
      <p>{message}</p>
      {imageId && (
        <div>
          <p><strong>Image ID:</strong> {imageId}</p>
          <p><strong>Title:</strong> {imageMetadata.title}</p>
          <p><strong>Name:</strong> {imageMetadata.name}</p>
          <p><strong>Content Type:</strong> {imageMetadata.contentType}</p>
        </div>
      )}

      <img src={fileURL} alt="" />
    </div>
  );
};

export default UploadProfileImage;




























