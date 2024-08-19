import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { auth, db, storage } from "../services/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AppBar from "../components/appBar";
import { styled } from "@mui/material/styles";

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  textAlign: "center",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  background: "rgba(255, 255, 255, 0.9)",
  margin: "0 auto",
}));

function ProfilePage() {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setProfileImageUrl(docSnap.data().profileImageUrl || "");
          setBannerImageUrl(docSnap.data().bannerImageUrl || "");
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let imageUrl = profileImageUrl;
      if (profileImage) {
        const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profileImage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          async () => {
            imageUrl = await getDownloadURL(storageRef);
          }
        );

        await uploadTask;
      }

      let bannerUrl = bannerImageUrl;
      if (bannerImage) {
        const bannerRef = ref(storage, `banners/${auth.currentUser.uid}`);
        const bannerUploadTask = uploadBytesResumable(bannerRef, bannerImage);

        bannerUploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          async () => {
            bannerUrl = await getDownloadURL(bannerRef);
          }
        );

        await bannerUploadTask;
      }

      await saveUserProfile(imageUrl, bannerUrl);
    } catch (error) {
      console.log("Error updating profile: ", error);
    }
  };

  const saveUserProfile = async (imageUrl, bannerUrl) => {
    try {
      // Remover campos com valores undefined
      const dataToSave = {
        ...userData,
        profileImageUrl:
          imageUrl !== undefined ? imageUrl : userData.profileImageUrl,
        bannerImageUrl:
          bannerUrl !== undefined ? bannerUrl : userData.bannerImageUrl,
      };

      // Filtrar os campos que são undefined
      Object.keys(dataToSave).forEach((key) => {
        if (dataToSave[key] === undefined) {
          delete dataToSave[key];
        }
      });

      await setDoc(doc(db, "users", auth.currentUser.uid), dataToSave);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <AppBar />
      <div className="main">
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              minHeight: "100vh",
              margin: "8vh",
              borderRadius: "3vh",
            }}
          >
            <Box
              sx={{
                backgroundColor: "black",
                borderRadius: "3vh",
                marginTop: "5vh",
                width: "100%",
                height: "35vh",
                backgroundImage: `url(${
                  bannerImageUrl || "https://via.placeholder.com/500x150"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <input
                type="file"
                onChange={(e) => setBannerImage(e.target.files[0])}
                style={{
                  opacity: 0,
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "pointer",
                }}
              />
            </Box>
            <Avatar
              src={profileImageUrl || "https://via.placeholder.com/150"}
              sx={{
                width: 150,
                height: 150,
                marginTop: "-75px",
                border: "5px solid white",
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{ marginTop: "2rem" }}
              gutterBottom
            >
              {userData.name || "Nome do usuário"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "1rem" }}
              align="center"
              paragraph
            >
              {userData.bio ||
                "Esta é uma breve biografia do usuário. Pode incluir informações como profissão, hobbies ou qualquer outra coisa que queira compartilhar."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <LocationOn sx={{ marginRight: "0.5rem" }} />
              <Box>
                <Typography variant="body2" sx={{ alignItems: "flex-start" }}>
                  {userData.estado || "Estado: "}
                </Typography>
                <Typography variant="body2" sx={{ alignItems: "flex-end" }}>
                  {userData.cidade || "Cidade: "}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
              sx={{
                borderRadius: 8,
                backgroundColor: "#46448C",
                "&:hover": {
                  backgroundColor: "#2E2C7D",
                },
              }}
            >
              Editar Perfil
            </Button>
            <Box
              sx={{
                marginTop: "3rem",
                backgroundColor: "black",
                width: "100%",
                height: "55vh",
                borderRadius: "3rem",
                opacity: "80%",
              }}
            ></Box>
          </Box>
        </Box>
      </div>

      <Dialog open={isEditing} onClose={handleClose}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
            value={userData.name || ""}
            onChange={(e) =>
              setUserData((prevData) => ({ ...prevData, name: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Biografia"
            type="text"
            fullWidth
            variant="standard"
            value={userData.bio || ""}
            onChange={(e) =>
              setUserData((prevData) => ({ ...prevData, bio: e.target.value }))
            }
          />
          <Box>
            <TextField
              margin="dense"
              label="Estado"
              type="text"
              variant="standard"
              value={userData.estado || ""}
              sx={{ alignItems: "flex-start" }}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  estado: e.target.value,
                }))
              }
            />
            <TextField
              margin="dense"
              label="Cidade"
              type="text"
              variant="standard"
              value={userData.cidade || ""}
              sx={{ alignItems: "flex-end" }}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  cidade: e.target.value,
                }))
              }
            />
          </Box>
          <TextField
            margin="dense"
            label="Foto de Perfil"
            type="file"
            fullWidth
            variant="standard"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <TextField
            margin="dense"
            label="Banner"
            type="file"
            fullWidth
            variant="standard"
            onChange={(e) => setBannerImage(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
