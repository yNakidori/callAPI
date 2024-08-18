import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import { auth, db, storage } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/lottie/Aniki Hamster.json";
import Footer from "../components/footer";
import "../styles/logIn.css";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import axios from "axios";

const sectors = [
  { value: "Technology", label: "Technology" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Finance", label: "Finance" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Operations", label: "Operations" },
  { value: "Legal", label: "Legal" },
  { value: "Other", label: "Other" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    sector: "",
    description: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState({});

  const apiKey = process.env.REACT_APP_PEXELS_API_KEY;

  // Fetch video from Pexels API
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          "https://api.pexels.com/videos/search?query=technology&per_page=50",
          {
            headers: {
              Authorization: apiKey,
            },
          }
        );
        const videos = response.data.videos;
        if (videos.length > 0) {
          const randomVideo = videos[Math.floor(Math.random() * videos.length)];
          setVideoUrl(randomVideo.video_files[0].link);
          console.log("Vídeo carregado:", randomVideo.video_files[0].link);
        } else {
          console.log("Nenhum vídeo encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar vídeo do Pexels:", error);
      }
    };

    fetchVideo();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name) tempErrors.name = "Nome é obrigatório";
    if (!formData.email) tempErrors.email = "Email é obrigatório";
    if (!formData.password) tempErrors.password = "Senha é obrigatória";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "As senhas não coincidem";
    if (!formData.sector) tempErrors.sector = "Setor é obrigatório";
    if (!formData.description)
      tempErrors.description = "Descrição é obrigatória";
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = validate();
    if (Object.keys(tempErrors).length !== 0) {
      setErrors(tempErrors);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let profileImageUrl = "";
      if (formData.profileImage) {
        const imageRef = ref(
          storage,
          `profiles/${user.uid}/${formData.profileImage.name}`
        );
        await uploadBytes(imageRef, formData.profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      await updateProfile(user, {
        displayName: formData.name,
        photoURL: profileImageUrl,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        sector: formData.sector,
        description: formData.description,
        profileImageUrl: profileImageUrl,
        createdAt: new Date(),
      });

      alert("Conta criada com sucesso!");
      navigate("/homePage");
    } catch (error) {
      console.error("Erro ao criar conta: ", error);
      alert("Erro ao criar conta: " + error.message);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#46448C", // Cor da borda
      },
      "&:hover fieldset": {
        borderColor: "#46448C", // Cor da borda ao passar o mouse
      },
      "&.Mui-focused fieldset": {
        borderColor: "#46448C", // Cor da borda quando o campo está focado
      },
    },
    "& .MuiInputLabel-root": {
      color: "#46448C", // Cor do label
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#46448C", // Cor do label quando o campo está focado
    },
    "& .MuiOutlinedInput-input": {
      color: "#FFFFFF", // Cor do texto
    },
  };

  return (
    <div>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {videoUrl && (
            <video
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              alt="Background Video"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ backgroundColor: "#908d96" }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Lottie options={defaultOptions} height={100} width={100} />
            <Typography component="h1" variant="h5">
              Create account
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                name="name"
                required
                fullWidth
                label="Name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={textFieldStyles}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                sx={textFieldStyles}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={textFieldStyles}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={textFieldStyles}
              />
              <TextField
                select
                margin="normal"
                required
                fullWidth
                name="sector"
                label="Sector"
                value={formData.sector}
                onChange={handleChange}
                error={!!errors.sector}
                helperText={errors.sector}
                sx={textFieldStyles}
              >
                {sectors.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                sx={textFieldStyles}
              />
              <Button variant="contained" component="label" fullWidth>
                Upload Profile Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="profileImage"
                  onChange={handleChange}
                />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#46448C",
                  "&:hover": {
                    backgroundColor: "#2E2C7D",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
}
