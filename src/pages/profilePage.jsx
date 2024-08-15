import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { LocationOn, LinkedIn, GitHub, Twitter } from "@mui/icons-material";
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
  const [isEditing, setIsEditing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
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
        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }
      await saveUserProfile(imageUrl);
    } catch (error) {
      console.log("Error updating profile: ", error);
    }
  };

  const saveUserProfile = async (imageUrl) => {
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...userData,
        profileImageUrl: imageUrl || userData.profileImageUrl,
      });
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            backgroundColor: "#FFE9D0",
            minHeight: "100vh",
          }}
        >
          <Avatar
            alt="User Photo"
            src={profileImageUrl || "https://via.placeholder.com/150"}
            sx={{ width: 150, height: 150, marginBottom: "1rem" }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {userData.name || "Nome do usuario"}
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            {userData.bio ||
              "Esta é uma breve biografia do usuário. Pode incluir informações como profissão, hobbies ou qualquer outra coisa que queira compartilhar."}
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ marginBottom: "1rem" }}
          >
            <Grid item>
              <IconButton color="primary" href="#" target="_blank">
                <LinkedIn />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="primary" href="#" target="_blank">
                <GitHub />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="primary" href="#" target="_blank">
                <Twitter />
              </IconButton>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <LocationOn sx={{ marginRight: "0.5rem" }} />
            <Typography variant="body2">
              Localização: {userData.location || "Cidade, País"}
            </Typography>
          </Box>
          <div>
            <Button
              onClick={handleEditClick}
              variant="contained"
              color="primary"
            >
              Edit profile
            </Button>
          </div>
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
            value={userData.name}
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
            value={userData.bio}
            onChange={(e) =>
              setUserData((prevData) => ({ ...prevData, bio: e.target.value }))
            }
          />
          <TextField
            margin="dense"
            label="Localização"
            type="text"
            fullWidth
            variant="standard"
            value={userData.location}
            onChange={(e) =>
              setUserData((prevData) => ({
                ...prevData,
                location: e.target.value,
              }))
            }
          />
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
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
